export function buildDependencyMap(nodes, edges) {
  const map = {};

  nodes.forEach((node) => {
    map[node.id] = [];
  });

  edges.forEach((edge) => {
    map[edge.target].push(edge.source);
  });

  return map;
}

export function getReadyNodes(nodes, dependencies, completed) {
  return nodes.filter((node) => {
    const deps = dependencies[node.id];
    return deps.every((d) => completed.has(d)) && !completed.has(node.id);
  });
}