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

export type hdagNodePath = string[];

export interface HdagEdge {
  source: hdagNodePath;
  target: hdagNodePath;
}

export interface HdagNode {
  path: hdagNodePath; // must match the path via child links
  children: { [pathElement: string]: HdagNode };

  // One could argue that only leaves can have outbound edges, but here, for
  // greater generality/simplicity, we allow intermediate nodes to have outbound
  // edges that do not originate from a descendant.
  outboundEdges: hdagNodePath[];
}

export interface HdagVisibleNode {
  // If this node is collapsed, then its children object is {} here
  children: { [pathElement: string]: HdagVisibleNode };
  // memoize the actual node matching this path
  hdagNode: HdagNode;
}

function hasVisibleChildren(node: HdagVisibleNode): boolean {
  return Object.entries(node.children).length === 0;
}

function visibleEdges(visibleRoot: HdagVisibleNode): HdagEdge[] {
  const result: HdagEdge[] = [];
  const visibleTargetFinder = getVisibleTargetFinder(visibleRoot);
  for (const source of getVisibleNodes(visibleRoot)) {
    const visibleEdges = hasVisibleChildren(source)
      ? explicitOutboundEdges(source.hdagNode)
      : explicitAndDeepOutboundEdges(source.hdagNode);

    result.push(...visibleEdges.map(visibleTargetFinder));
  }
  return result;
}

function getVisibleTargetFinder(
  visibleRoot: HdagVisibleNode
): (raw: HdagEdge) => HdagEdge {
  return (raw: HdagEdge): HdagEdge => {
    let visibleTarget = visibleRoot;
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
  return source.outboundEdges.map((target: hdagNodePath) => ({
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
  return childOutboundEdges.filter(edge => isOutboundFrom(source, edge));
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
