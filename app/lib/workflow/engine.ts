export async function executeWorkflow(nodes, edges) {
  const dependencies = buildDependencyMap(nodes, edges);

  const results = {};
  const completed = new Set();

  while (completed.size < nodes.length) {
    const readyNodes = getReadyNodes(nodes, dependencies, completed);

    if (readyNodes.length === 0) {
      throw new Error("Cycle detected");
    }

    await Promise.all(
      readyNodes.map(async (node) => {
        const inputs = dependencies[node.id].map(
          (depId) => results[depId]
        );

        const output = await runNode(node, inputs);

        results[node.id] = output;
        completed.add(node.id);
      })
    );
  }

  return results;
}