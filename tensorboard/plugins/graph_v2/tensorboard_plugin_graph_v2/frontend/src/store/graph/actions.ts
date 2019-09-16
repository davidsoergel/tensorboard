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

import { createAction } from '@ngrx/store';
import { GraphAndHierarchy } from './legacy/loader';
import { GraphUIState } from './types';
import { hdagNodePath, HdagNode } from './hdag';

/** Represents the intent to clear the graph. */
export const clearGraph = createAction('[Graph] Clear Graph');

/** Represents the intent to reset the graph to the provided value. */
export const setGraphUIState = createAction(
  '[Graph] Set GraphUIState',
  (graph: GraphUIState) => ({
    graph,
  })
);

export const setLegacyGraphAndHierarchy = createAction(
  '[Graph] Set LegacyGraphAndHierarchy',
  (legacyGraphAndHierarchy: GraphAndHierarchy) => ({
    legacyGraphAndHierarchy,
  })
);

export const setGraph = createAction(
  '[Graph] Set Graph',
  (graph: HdagNode) => ({
    graph,
  })
);

/** Represents the intent to set the name of the model. */
export const setGraphName = createAction(
  '[Graph] SetGraphName',
  (graphName: string) => ({ graphName })
);

/**
 * A signal that loading of a graph has been requested.  (I.e., this does
 * not trigger the load; rather it reports that loading was triggered and the
 * async handler has begun).
 */
export const loadGraphRequest = createAction(
  '[Graph] LoadGraphRequest',
  (graphUrl: string) => ({ graphUrl })
);

export const loadTestGraphRequest = createAction(
  '[Graph] LoadTestGraphRequest'
);

/** A signal that loading a graph has succeeded. */
export const loadGraphSuccess = createAction('[Graph] LoadGraphSuccess');

/** A signal that loading a graph has failed. */
export const loadGraphFailure = createAction(
  '[Graph] LoadGraphFailure',
  (exception: Error) => ({ exception })
);

export const layoutGraph = createAction('[Graph] Layout Graph');

export const expandNode = createAction(
  '[Graph] Expand Node',
  (path: hdagNodePath) => ({
    path,
  })
);

export const collapseNode = createAction(
  '[Graph] Collapse Node',
  (path: hdagNodePath) => ({
    path,
  })
);
