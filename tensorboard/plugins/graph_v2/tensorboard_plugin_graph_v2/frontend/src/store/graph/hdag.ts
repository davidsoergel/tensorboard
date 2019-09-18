import { isArrayPrefix, flatten } from 'src/utils/utils';

/**
 * "Hdag" means "Hierarchical Dag", i.e., a DAG where the nodes may be
 * hierarchically grouped.
 *
 * Here we maintain two parallel trees: 1) the complete Hdag, and 2) the subset
 * that is currently visible (i.e., excluding any children of collapsed nodes).
 *
 * When a node is collapsed, then the visualization should show any links to
 * and from its descendants as originating or impinging on the group node\
 * instead.
 *
 * We accomplish this in the `visibleEdges()` function by the following method.
 *
 *  * We iterate over all visible nodes.
 *  * For each one, we determine the set of
 * outbound edges.  Edges directly emitted are always included.  Edges emitted
 * by children are included only if the children are invisible, and only if they
 * do not target another descendant (i.e., edges must exit the group as a whole).
 *  * Then, for each
 * edge, we find the deepest visible node associated with the target, by walking
 * down the visible-nodes tree from the root.
 *
 * The result is a set of edges linking visible nodes to other visible nodes,
 * including implicit edges that actually originate from and/or terminate in
 * descendants of the visible nodes.
 */

export type HdagPath = string[];

export interface HdagEdge {
  source: HdagPath;
  target: HdagPath;
}

export interface HdagNode {
  path: HdagPath; // must match the path via child links
  children: { [pathElement: string]: HdagNode };

  // One could argue that only leaves can have outbound edges, but here, for
  // greater generality/simplicity, we allow intermediate nodes to have outbound
  // edges that do not originate from a descendant.
  outboundEdges: HdagPath[];
}

export interface HdagRoot extends HdagNode {
  path: [];
}

export function findNode(root: HdagRoot, path: HdagPath): HdagNode {
  let trav: HdagNode = root;
  for (const pathElement of path) {
    if (trav.children != null) {
      trav = trav.children[pathElement];
    } else {
      return null;
    }
  }
  return trav;
}

export interface HdagVisibleNode {
  // If this node is collapsed, then its children object is {} here
  children: { [pathElement: string]: HdagVisibleNode };
  // memoize the actual node matching this path
  hdagNode: HdagNode;
}

export interface HdagVisibleRoot extends HdagVisibleNode {
  hdagNode: HdagRoot;
}

export function hasVisibleChildren(node: HdagVisibleNode): boolean {
  return Object.entries(node.children).length !== 0;
}

// TODO(soergel): can we update only the changed edges instead of all of them?
export function visibleEdges(visibleRoot: HdagVisibleRoot): HdagEdge[] {
  const result: HdagEdge[] = [];
  console.log('finding visible edges');
  if (visibleRoot == null) {
    return [];
  }
  const visibleTargetFinder = getVisibleTargetFinder(visibleRoot);
  for (const source of getVisibleNodes(visibleRoot)) {
    const visibleEdges = hasVisibleChildren(source)
      ? explicitOutboundEdges(source.hdagNode)
      : explicitAndDeepOutboundEdges(source.hdagNode);
    console.log(visibleEdges);
    result.push(...visibleEdges.map(visibleTargetFinder));
  }
  return result;
}

export function findVisibleNode(
  visibleRoot: HdagVisibleRoot,
  path: HdagPath
): HdagVisibleNode {
  let trav: HdagVisibleNode = visibleRoot;
  for (const pathElement of path) {
    if (hasVisibleChildren(trav)) {
      trav = trav.children[pathElement];
    } else {
      return null;
    }
  }
  return trav;
}

export function applyUpdateVisibleNode(
  visibleRoot: HdagVisibleRoot,
  visibleNode: HdagVisibleNode
): HdagVisibleRoot {
  const path = visibleNode.hdagNode.path;
  let trav: HdagVisibleNode = visibleRoot;
  const ancestors: HdagVisibleNode[] = [visibleRoot];
  for (const pathElement of path) {
    trav = trav.children[pathElement]; // TODO(soergel) handle error if absent
    ancestors.push(trav);
  }
  let updated = visibleNode;
  ancestors.pop(); // throw away the old leaf
  for (const pathElement of path.reverse()) {
    const toUpdate = ancestors.pop();
    const updatedChildren = { ...toUpdate.children };
    updatedChildren[pathElement] = updated;
    updated = { ...toUpdate, children: updatedChildren };
  }

  return updated as HdagVisibleRoot;
}

function getVisibleTargetFinder(
  visibleRoot: HdagVisibleRoot
): (raw: HdagEdge) => HdagEdge {
  return (raw: HdagEdge): HdagEdge => {
    let visibleTarget: HdagVisibleNode = visibleRoot;
    for (const pathElement of raw.target) {
      if (hasVisibleChildren(visibleTarget)) {
        visibleTarget = visibleTarget.children[pathElement];
      } else {
        return { source: raw.source, target: visibleTarget.hdagNode.path };
      }
    }
    return { source: raw.source, target: visibleTarget.hdagNode.path };
  };
}

function getVisibleNodes(focal: HdagVisibleNode): HdagVisibleNode[] {
  const fromChildren = flatten(
    Object.values(focal.children).map(child => getVisibleNodes(child))
  );
  return [focal, ...fromChildren];
}

/** Render node.outboundEdges as a list of HdagEdge. */
function explicitOutboundEdges(source: HdagNode): HdagEdge[] {
  return source.outboundEdges.map((target: HdagPath) => ({
    source: source.path,
    target,
  }));
}

/**
 * Outbound edges from descendants of the focal node, *not* including edges
 * originating from the focal node directly.
 */
function deepOutboundEdges(source: HdagNode): HdagEdge[] {
  const childOutboundEdges = flatten(
    Object.values(source.children).map(child =>
      explicitAndDeepOutboundEdges(child)
    )
  );
  return childOutboundEdges
    .filter(edge => isOutboundFrom(source, edge))
    .map(edge => ({ source: source.path, target: edge.target }));
}

/**
 * Outbound edges from descendants of the focal node, including edges
 * originating from the focal node directly.
 */
function explicitAndDeepOutboundEdges(source: HdagNode): HdagEdge[] {
  return explicitOutboundEdges(source).concat(deepOutboundEdges(source));
}

function isOutboundFrom(source: HdagNode, edge: HdagEdge) {
  return !isArrayPrefix(source.path, edge.target);
}
