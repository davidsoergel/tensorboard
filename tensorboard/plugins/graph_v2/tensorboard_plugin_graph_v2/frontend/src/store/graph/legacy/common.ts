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

/**
 * @fileoverview Common interfaces for the tensorflow graph visualizer.
 */

/**
 * Tracks task progress. Each task being passed a progress tracker needs
 * to call the below-defined methods to notify the caller about the gradual
 * progress of the task.
 */
export interface ProgressTracker {
  updateProgress(incrementValue: number): void;
  setMessage(msg: string): void;
  reportError(msg: string, err: Error): void;
}

// Note that tf-graph-control depends on the value of the enum.
// Polymer does not let one use JS variable as a prop.
export enum SelectionType {
  OP_GRAPH = 'op_graph',
  CONCEPTUAL_GRAPH = 'conceptual_graph',
  PROFILE = 'profile',
}


/**
 * Execution stats for the node.
 */
export class NodeStats {
  constructor(outputSize: number[][]) {
    this.outputSize = outputSize;
  }

  /**
   * Add the start and end time for a particular kernel execution of this op.
   * Ops can have multiple kernel executions within the same session run.
   */
  addExecutionTime(startTime: number, endTime: number) {
    if (this.startTime != null) {
      this.startTime = Math.min(this.startTime, startTime);
    } else {
      this.startTime = startTime;
    }
    if (this.endTime != null) {
      this.endTime = Math.max(this.endTime, endTime);
    } else {
      this.endTime = endTime;
    }
  }

  /**
   * Add the bytes allocated for a particular kernel execution of this op.
   * Ops can have multiple kernel executions within the same session run.
   */
  addBytesAllocation(totalBytes: number) {
    if (this.totalBytes != null) {
      this.totalBytes = Math.max(this.totalBytes, totalBytes);
    } else {
      this.totalBytes = totalBytes;
    }
  }

  /**
   * Absolute start time for the very first kernel execution of this op.
   */
  startTime: number;
  /**
   * Absolute end time for the very last kernel execution of this op.
   */
  endTime: number;
  /**
   * Total number of bytes used for the node. Sum of all children
   * if it is a Group node.
   */
  totalBytes = 0;

  /**
   * The shape of each output tensors, if there are any.
   * Empty if it is a Group node.
   */
  outputSize: number[][];

  /**
   * Combines the specified stats with the current stats.
   * Modifies the current object. This method is used to
   * compute aggregate stats for group nodes.
   */
  combine(stats: NodeStats): void {
    if (stats.totalBytes != null) {
      this.totalBytes += stats.totalBytes;
    }
    if (stats.getTotalMicros() != null) {
      this.addExecutionTime(stats.startTime, stats.endTime);
    }
  }

  /**
   * Total number of compute time in microseconds used for the node.
   * Sum of all children if it is a Group node. Null if it is unknown.
   * This method can not be scaffolded under a getter attribute because
   * ECMAScript 5 does not support getter attributes.
   */
  getTotalMicros(): number {
    if (this.startTime == null || this.endTime == null) {
      return null;
    }
    return this.endTime - this.startTime;
  }
}
