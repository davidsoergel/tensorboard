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
import {
  setLegacyGraphAndHierarchy,
  setGraphName,
  expandNode,
  setGraph,
  collapseNode,
  toggleNode,
} from './actions';
import { GraphAndHierarchy } from './legacy/loader';
import { GraphUIState, INITIAL_GRAPH_UI_STATE } from './types';
import {
  HdagPath,
  HdagVisibleNode,
  HdagNode,
  findVisibleNode,
  findNode,
  hasVisibleChildren,
  applyUpdateVisibleNode,
  HdagVisibleRoot,
  HdagRoot,
} from './hdag';
import { mapValues } from 'src/utils/utils';

export const graphReducer = createReducer(
  INITIAL_GRAPH_UI_STATE,
  on(setGraphName, (state, { graphName }) =>
    applySetGraphName(state, graphName)
  ),
  on(setLegacyGraphAndHierarchy, (state, { legacyGraphAndHierarchy }) =>
    applySetLegacyGraphAndHierarchy(state, legacyGraphAndHierarchy)
  ),

  on(setGraph, (state, { graph }) => applySetGraph(state, graph)),
  on(expandNode, (state, { path }) => applyExpandNode(state, path)),
  on(collapseNode, (state, { path }) => applyCollapseNode(state, path)),
  on(toggleNode, (state, { path }) => applyToggleNode(state, path))
);

function applySetGraphName(
  state: GraphUIState,
  graphName: string
): GraphUIState {
  return { ...state, graphName };
}

function applySetGraph(state: GraphUIState, graph: HdagRoot): GraphUIState {
  const visibleChildren = mapValues(graph.children, (child: HdagNode) => ({
    hdagNode: child,
    children: {},
  }));
  const visibleGraph: HdagVisibleRoot = {
    hdagNode: graph,
    children: visibleChildren,
  };
  return { ...state, graph, visibleGraph };
}

function applySetLegacyGraphAndHierarchy(
  state: GraphUIState,
  legacyGraphAndHierarchy: GraphAndHierarchy
): GraphUIState {
  return { ...state, legacyGraphAndHierarchy };
}

function applyExpandNode(state: GraphUIState, path: HdagPath): GraphUIState {
  const node = findNode(state.graph, path);
  const visibleNode = findVisibleNode(state.visibleGraph, path);
  if (hasVisibleChildren(visibleNode)) {
    return state;
  }
  const expandedNode: HdagVisibleNode = {
    ...visibleNode,
    children: mapValues(node.children, (child: HdagNode) => ({
      hdagNode: child,
      children: {},
    })),
  };
  const visibleGraph: HdagVisibleRoot = applyUpdateVisibleNode(
    state.visibleGraph,
    expandedNode
  );
  return { ...state, visibleGraph };
}

function applyCollapseNode(state: GraphUIState, path: HdagPath): GraphUIState {
  const visibleNode = findVisibleNode(state.visibleGraph, path);
  if (!hasVisibleChildren(visibleNode)) {
    return state;
  }
  const collapsedNode: HdagVisibleNode = { ...visibleNode, children: {} };
  const visibleGraph: HdagVisibleRoot = applyUpdateVisibleNode(
    state.visibleGraph,
    collapsedNode
  );
  return { ...state, visibleGraph };
}

function applyToggleNode(state: GraphUIState, path: HdagPath): GraphUIState {
  const visibleNode = findVisibleNode(state.visibleGraph, path);
  if (hasVisibleChildren(visibleNode)) {
    return applyCollapseNode(state, path);
  } else {
    return applyExpandNode(state, path);
  }
}
