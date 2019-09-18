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
import {GraphUIState} from './graph/types';

/**
 * Definition of the structure of the plugin state.
 */
export interface GraphV2PluginStateDef {
  // The current graph.
  graph: GraphUIState;
}

const INITIAL_GRAPH_V2_PLUGIN_STATE: GraphV2PluginStateDef = {
  graph: new GraphUIState(),
};

/**
 * Top level state of the application.
 */
export class GraphV2PluginState extends Record(INITIAL_GRAPH_V2_PLUGIN_STATE) {}
