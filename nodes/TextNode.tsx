"use client";

import { Handle, Position, useReactFlow } from "reactflow";
<<<<<<< HEAD
import BaseNode from "@/components/BaseNode";
=======
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4

export default function TextNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  return (
<<<<<<< HEAD
    <BaseNode title="Text" icon="📝" loading={data.loading} glowColor="rgba(59,130,246,0.6)">
=======
    <div
  className={`bg-[#1a1a1a] p-3 rounded-xl w-60 border border-gray-700 transition-all duration-300 ${
    data.loading
      ? "shadow-[0_0_20px_4px_rgba(59,130,246,0.8)] animate-pulse"
      : ""
  }`}
>
      <div className="mb-2 font-semibold">📝 Text Node</div>

>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
      <textarea
        value={data.text || ""}
        onChange={(e) => {
          const value = e.target.value;
<<<<<<< HEAD
          setNodes((nds) =>
            nds.map((n) =>
              n.id === id ? { ...n, data: { ...n.data, text: value } } : n
=======

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
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
            )
          );
        }}
        placeholder="Type something..."
<<<<<<< HEAD
        rows={3}
        className="nodrag w-full bg-[#17171c] text-[#ccc] text-[11px] p-2 rounded-lg border border-[#2a2a33] focus:outline-none focus:border-[#3a3a48] resize-none placeholder-[#444] leading-relaxed"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#3b82f6", width: 8, height: 8, border: "2px solid #1e3a5f" }}
      />
    </BaseNode>
=======
        className="w-full bg-black text-black p-2 rounded text-sm outline-none"
      />

      <Handle type="source" position={Position.Right} />
    </div>
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
  );
}