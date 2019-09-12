/* Copyright 2015 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

// tslint:disable-next-line: no-reference
///<reference path="./graphlib.d.ts" />
import * as graphlib from 'graphlib';
import { NodeStats, ProgressTracker } from './common';
import {
  createGraph,
  createMetaedge,
  createMetanode,
  createSeriesNode,
  FUNCTION_LIBRARY_NODE_PREFIX,
  getHierarchicalPath,
  getSeriesNodeName,
  GraphType,
  GroupNode,
  Metaedge,
  MetaedgeImpl,
  Metanode,
  Node,
  NodeType,
  OpNode,
  ROOT_NAME,
  SeriesGroupingType,
  SeriesNode,
  SlimGraph,
} from './graph';
import * as proto from './proto';
import * as template from './template';
import * as util from './util';

/**
 * Parses a native js value, which can be either a string, boolean or number.
 *
 * @param value The value to be parsed.
 */
function parseValue(value: string): string | number | boolean {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  const firstChar = value[0];
  if (firstChar === '"') {
    return value.substring(1, value.length - 1);
  }
  const num = Number.parseFloat(value);
  return isNaN(num) ? value : num;
}

/**
 * Fetches a text file and returns a promise of the result.
 */
export function fetchPbTxt(filepath: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    fetch(filepath).then(res => {
      // Fetch does not reject for 400+.
      if (res.ok) {
        res.arrayBuffer().then(resolve, reject);
      } else {
        res.text().then(reject, reject);
      }
    });
  });
}

/**
 * Fetches the metadata file, parses it and returns a promise of the result.
 */
export function fetchAndParseMetadata(path: string, tracker: ProgressTracker) {
  return util
    .runTask(
      'Reading metadata pbtxt',
      40,
      () => {
        if (path == null) {
          return Promise.resolve(null);
        }
        return fetchPbTxt(path);
      },
      tracker
    )
    .then((arrayBuffer: ArrayBuffer) => {
      return util.runAsyncPromiseTask(
        'Parsing metadata.pbtxt',
        60,
        () => {
          return arrayBuffer != null
            ? parseStatsPbTxt(arrayBuffer)
            : Promise.resolve(null);
        },
        tracker
      );
    });
}

/**
 * Fetches the graph file, parses it and returns a promise of the result. The
 * result will be undefined if the graph is empty.
 */
export function fetchAndParseGraphData(
  path: string,
  pbTxtFile: Blob,
  tracker: ProgressTracker
) {
  return util
    .runAsyncPromiseTask(
      'Reading graph pbtxt',
      40,
      () => {
        if (pbTxtFile) {
          return new Promise<ArrayBuffer>((resolve, reject) => {
            const fileReader = new FileReader();
            // TODO(soergel): don't cast
            fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
            fileReader.onerror = () => reject(fileReader.error);
            fileReader.readAsArrayBuffer(pbTxtFile);
          });
        } else {
          return fetchPbTxt(path);
        }
      },
      tracker
    )
    .then((arrayBuffer: ArrayBuffer) => {
      return util.runAsyncPromiseTask(
        'Parsing graph.pbtxt',
        60,
        () => {
          return parseGraphPbTxt(arrayBuffer);
        },
        tracker
      );
    });
}

/**
 * Parse a file object in a streaming fashion line by line (or custom delim).
 * Can handle very large files.
 * @param input The file object as an array buffer.
 * @param callback The callback called on each line
 * @param chunkSize The size of each read chunk. (optional)
 * @param delim The delimiter used to split a line. (optional)
 * @returns Promise that resolves with true when it is finished.
 */
export function streamParse(
  arrayBuffer: ArrayBuffer,
  callback: (part: string) => void,
  chunkSize = 1000000,
  delim = '\n'
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    function readChunk(oldData: string, newData: string, offset: number) {
      const doneReading = offset >= arrayBuffer.byteLength;
      const parts = newData.split(delim);
      parts[0] = oldData + parts[0];

      // The last part may be part of a longer string that got cut off
      // due to the chunking.
      const remainder = doneReading ? '' : parts.pop();

      for (const part of parts) {
        try {
          callback(part);
        } catch (e) {
          reject(e);
          return;
        }
      }

      if (doneReading) {
        resolve(true);
        return;
      }

      const nextChunk = new Blob([
        arrayBuffer.slice(offset, offset + chunkSize),
      ]);
      const file = new FileReader();
      // tslint:disable-next-line: no-any
      file.onload = (e: any) => {
        readChunk(remainder, e.target.result, offset + chunkSize);
      };
      file.readAsText(nextChunk);
    }

    readChunk('', '', 0);
  });
}

/**
 * Since proto-txt doesn't explicitly say whether an attribute is repeated
 * (an array) or not, we keep a hard-coded list of attributes that are known
 * to be repeated. This list is used in parsing time to convert repeated
 * attributes into arrays even when the attribute only shows up once in the
 * object.
 * Repeated fields have to be in sync with graph.proto and all of its
 * dependencies.
 * See https://github.com/tensorflow/tensorflow/blob/master/tensorflow/core/framework/graph.proto
 */
const GRAPH_REPEATED_FIELDS: { [attrPath: string]: boolean } = {
  'library.function': true,
  'library.function.node_def': true,
  'library.function.node_def.input': true,
  'library.function.node_def.attr': true,
  'library.function.node_def.attr.value.list.b': true,
  'library.function.node_def.attr.value.list.f': true,
  'library.function.node_def.attr.value.list.func': true,
  'library.function.node_def.attr.value.list.i': true,
  'library.function.node_def.attr.value.list.s': true,
  'library.function.node_def.attr.value.list.shape': true,
  'library.function.node_def.attr.value.list.shape.dim': true,
  'library.function.node_def.attr.value.list.tensor': true,
  'library.function.node_def.attr.value.list.type': true,
  'library.function.node_def.attr.value.shape.dim': true,
  'library.function.node_def.attr.value.tensor.string_val': true,
  'library.function.node_def.attr.value.tensor.tensor_shape.dim': true,
  'library.function.signature.input_arg': true,
  'library.function.signature.output_arg': true,
  'library.versions': true,
  node: true,
  'node.input': true,
  'node.attr': true,
  'node.attr.value.list.b': true,
  'node.attr.value.list.f': true,
  'node.attr.value.list.func': true,
  'node.attr.value.list.i': true,
  'node.attr.value.list.s': true,
  'node.attr.value.list.shape': true,
  'node.attr.value.list.shape.dim': true,
  'node.attr.value.list.tensor': true,
  'node.attr.value.list.type': true,
  'node.attr.value.shape.dim': true,
  'node.attr.value.tensor.string_val': true,
  'node.attr.value.tensor.tensor_shape.dim': true,
};

const METADATA_REPEATED_FIELDS: { [attrPath: string]: boolean } = {
  'step_stats.dev_stats': true,
  'step_stats.dev_stats.node_stats': true,
  'step_stats.dev_stats.node_stats.output': true,
  'step_stats.dev_stats.node_stats.memory': true,
  'step_stats.dev_stats.node_stats.output.tensor_description.shape.dim': true,
};

/**
 * Parses an ArrayBuffer of a proto txt file into a raw Graph object.
 */
export function parseGraphPbTxt(input: ArrayBuffer): Promise<proto.GraphDef> {
  return parsePbtxtFile(input, GRAPH_REPEATED_FIELDS);
}

/**
 * Parses an ArrayBuffer of a proto txt file into a StepStats object.
 */
export function parseStatsPbTxt(input: ArrayBuffer): Promise<proto.StepStats> {
  return parsePbtxtFile(input, METADATA_REPEATED_FIELDS).then(
    obj => obj.step_stats
  );
}

type PlainJSValue = PlainJSObject | string | number | boolean;
interface PlainJSObject { [name: string]: PlainJSValue | PlainJSValue[] }

/**
 * Parses a ArrayBuffer of a proto txt file into javascript object.
 *
 * @param input The ArrayBuffer or file object implementing slice.
 * @param repeatedFields Map (Set) of all the repeated fields, since you can't
 *   tell directly from the pbtxt if a field is repeated or not.
 * @returns The parsed object.
 */
function parsePbtxtFile(
  input: ArrayBuffer,
  repeatedFields: { [attrPath: string]: boolean }
  // tslint:disable-next-line: no-any
): Promise<any> {
  // tslint:disable-next-line: no-any
  const output: PlainJSObject = {};
  const stack: PlainJSObject[] = [];
  const path: string[] = [];
  // tslint:disable-next-line: no-any
  let current: PlainJSObject = output;

  function splitNameAndValueInAttribute(line: string) {
    const colonIndex = line.indexOf(':');
    const name = line.substring(0, colonIndex).trim();
    const value = parseValue(line.substring(colonIndex + 2).trim());
    return {
      name,
      value,
    };
  }

  /**
   * Adds a value, given the attribute name and the host object. If the
   * attribute already exists, but is not an array, it will convert it to an
   * array of values.
   *
   * @param obj The host object that holds the attribute.
   * @param name The attribute name (key).
   * @param value The attribute value.
   * @param path A path that identifies the attribute. Used to check if
   *     an attribute is an array or not.
   */
  function addAttribute(
    obj: PlainJSObject,
    name: string,
    value: PlainJSValue,
    path: string[]
  ): void {
    // We treat 'node' specially since it is done so often.
    const existingValue = obj[name];
    if (existingValue == null) {
      obj[name] = path.join('.') in repeatedFields ? [value] : value;
    } else if (Array.isArray(existingValue)) {
      existingValue.push(value);
    } else {
      obj[name] = [existingValue, value];
    }
  }

  // Run through the file a line at a time.
  return streamParse(input, (line: string) => {
    if (!line) {
      return;
    }
    line = line.trim();

    switch (line[line.length - 1]) {
      case '{': // create new object
        const name = line.substring(0, line.length - 2).trim();
        const newValue: PlainJSObject = {};
        stack.push(current);
        path.push(name);
        addAttribute(current, name, newValue, path);
        current = newValue;
        break;
      case '}':
        current = stack.pop();
        path.pop();
        break;
      default:
        const x = splitNameAndValueInAttribute(line);
        addAttribute(current, x.name, x.value, path.concat(x.name));
        break;
    }
  }).then(() => {
    return output;
  });
}
