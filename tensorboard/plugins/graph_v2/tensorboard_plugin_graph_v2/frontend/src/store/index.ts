/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {GraphV2PluginState, GraphV2PluginStateDef} from './types';
import {GraphUIState} from './graph/types';
import {graphReducer} from './graph/reducers';
import {ActionReducerMap, Action} from '@ngrx/store';

// NgRx doesn't allow a root-level reducers.
// Most everything goes in the 'graph' feature reducer for now.
// Maybe there will be a future need for user prefs etc. as a separate subtree.

export const graphV2PluginReducer: ActionReducerMap<
  GraphV2PluginStateDef,
  Action
> = {
  graph: graphReducer,
};

export const initialState = initializeApplicationState();

export function initializeApplicationState(): GraphV2PluginState {
  const state = new GraphV2PluginState();
  console.log('Initialized state: ', state);
  return state;
}
