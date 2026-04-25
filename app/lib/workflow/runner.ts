export async function runNode(node, inputs) {
  if (node.type === "text") {
    return node.data.value;
  }

  if (node.type === "llm") {
    const res = await fetch("/api/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userMessage: inputs.join(" ")
      })
    });

    const data = await res.json();
    return data.output;
  }

  return null;
}