"use client";

import { Handle, Position, useReactFlow } from "reactflow";

export default function TextNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  return (
    <div
  className={`bg-[#1a1a1a] p-3 rounded-xl w-60 border border-gray-700 transition-all duration-300 ${
    data.loading
      ? "shadow-[0_0_20px_4px_rgba(59,130,246,0.8)] animate-pulse"
      : ""
  }`}
>
      <div className="mb-2 font-semibold">📝 Text Node</div>

      <textarea
        value={data.text || ""}
        onChange={(e) => {
          const value = e.target.value;

          console.log("DIRECT UPDATE:", value);

          setNodes((nds) =>
            nds.map((n) =>
              n.id === id
                ? {
                    ...n,
                    data: {
                      ...n.data,
                      text: value,
                    },
                  }
                : n
            )
          );
        }}
        placeholder="Type something..."
        className="w-full bg-black text-black p-2 rounded text-sm outline-none"
      />

      <Handle type="source" position={Position.Right} />
    </div>
  );
}