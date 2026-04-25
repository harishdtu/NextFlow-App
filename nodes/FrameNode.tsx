"use client";

import { Handle, Position } from "reactflow";

export default function FrameNode({ data }: any) {
  return (
    <div
  className={`bg-[#1a1a1a] p-3 rounded-xl w-60 border border-gray-700 transition-all duration-300 ${
    data.loading
      ? "shadow-lg shadow-green-500/80 animate-pulse"
      : ""
  }`}
>
      <Handle type="target" position={Position.Left} />

      <div className="text-sm font-bold mb-2">🎞 Extract Frame</div>

      {data.output ? (
        <img src={data.output} className="mt-2 rounded w-full h-40 object-cover" />
      ) : (
        <div className="text-xs text-green-300 mt-2">No frame extracted yet</div>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}