"use client";

import { Handle, Position } from "reactflow";

export default function CropNode({ data }: any) {
  return (
    <div
  key={data.loading ? "loading" : "idle"}
  className={`bg-[#1a1a1a] p-3 rounded-xl w-60 border border-gray-700 transition-all duration-300 ${
    data.loading
      ? "shadow-lg shadow-red-500/80 animate-pulse"
      : ""
  }`}
>
      <Handle type="target" position={Position.Left} />

      <div className="text-sm font-bold mb-2">✂️ Crop Image</div>

      <div className="text-xs">Cropping image...</div>

      {(data.imageUrl || data.output) && (
  <img src={data.imageUrl || data.output} className="mt-2 rounded" />
)}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}