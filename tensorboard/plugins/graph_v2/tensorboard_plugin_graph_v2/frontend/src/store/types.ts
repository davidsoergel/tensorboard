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

import {GraphUIState, INITIAL_GRAPH_UI_STATE} from './graph/types';

/**
 * Top level state of the application.
 */
export interface GraphV2PluginState {
  // The current graph.
  graph: GraphUIState;
}

export const INITIAL_GRAPH_V2_PLUGIN_STATE: GraphV2PluginState = {
  graph: INITIAL_GRAPH_UI_STATE,
};
