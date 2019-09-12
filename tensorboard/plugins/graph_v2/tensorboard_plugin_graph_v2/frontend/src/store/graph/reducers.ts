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

import { createReducer, on } from '@ngrx/store';
import { setGraphAndHierarchy, setGraphName } from './actions';
import { GraphAndHierarchy } from './legacy/loader';
import { GraphUIState, INITIAL_GRAPH_UI_STATE } from './types';

export const graphReducer = createReducer(
  INITIAL_GRAPH_UI_STATE,
  on(setGraphName, (state, { graphName }) =>
    applySetGraphName(state, graphName)
  ),
  on(setGraphAndHierarchy, (state, { graphAndHierarchy }) =>
    applySetGraphAndHierarchy(state, graphAndHierarchy)
  )
);

export function applySetGraphName(
  state: GraphUIState,
  graphName: string
): GraphUIState {
  return { ...state, graphName };
}

export function applySetGraphAndHierarchy(
  state: GraphUIState,
  graphAndHierarchy: GraphAndHierarchy
): GraphUIState {
  return { ...state, graphAndHierarchy };
}
