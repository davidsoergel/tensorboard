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

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { GraphUIState } from './types';
import { GraphAndHierarchy } from './legacy/loader';

export const selectGraphState: MemoizedSelector<
  object,
  GraphUIState
> = createFeatureSelector<GraphUIState>('graph');

export const selectGraphName: MemoizedSelector<object, string> = createSelector(
  selectGraphState,
  (graph: GraphUIState) => graph.graphName
);

export const selectGraphAndHierarchy: MemoizedSelector<object, GraphAndHierarchy> = createSelector(
  selectGraphState,
  (graph: GraphUIState) => graph.graphAndHierarchy
);
