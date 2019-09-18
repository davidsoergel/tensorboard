/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {Record} from 'immutable';

interface GraphWithLayoutDef {
  // TODO(soergel): this is a stub
  modelName: string;
}

/** Default values for the CanvasWithLayout. */
const INITIAL_GRAPH_UI_STATE: GraphWithLayoutDef = {
  modelName: 'Untitled',
};

/**
 * The immutable canvas state, implementing @see CanvasWithLayout.
 */
export class GraphWithLayout extends Record(INITIAL_GRAPH_UI_STATE) {}

/**
 * Definition of the structure of the plugin state.
 */
export interface GraphV2PluginStateDef {
  // The current graph.
  graph: GraphWithLayout;
}

const INITIAL_GRAPH_V2_PLUGIN_STATE: GraphV2PluginStateDef = {
  graph: new GraphWithLayout(),
};

/**
 * Top level state of the application.
 */
export class GraphV2PluginState extends Record(INITIAL_GRAPH_V2_PLUGIN_STATE) {}
