"use client";

import { useReactFlow } from "reactflow";
import BaseNode from "@/components/BaseNode";

export default function ImageNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, imageUrl: url } }
          : n
      )
    );
  };

  return (
    <BaseNode title="🖼️ Upload Image" data={data}>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="nodrag text-xs text-gray-400 w-full"
      />
      {data.imageUrl && (
        <img
          src={data.imageUrl}
          className="mt-2 rounded w-full h-32 object-cover"
        />
      )}
    </BaseNode>
  );
}