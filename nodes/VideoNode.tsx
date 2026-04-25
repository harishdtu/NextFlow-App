"use client";

import { useReactFlow, Handle, Position } from "reactflow";

export default function VideoNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                videoUrl: url,
                output: url,
              },
            }
          : n
      )
    );
  };

  return (
    <div
  className={`bg-[#1a1a1a] p-3 rounded-xl w-60 border border-gray-700 transition-all duration-300 ${
    data.loading
      ? "shadow-[0_0_20px_4px_rgba(16,185,129,0.8)] animate-pulse"
      : ""
  }`}
>
      <div className="mb-2 font-semibold">🎥 Upload Video</div>

      <input type="file" accept="video/*" onChange={handleUpload} />

      {data.videoUrl && (
        <video controls className="mt-2 rounded">
          <source src={data.videoUrl} />
        </video>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}