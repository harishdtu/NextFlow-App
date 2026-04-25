import { Handle, Position } from "reactflow";

export default function BaseNode({ title, children, data, hasInput = false }: any) {
  return (
    <div
      className={`bg-[#1a1a1a] p-3 rounded-xl w-60 border border-gray-700 transition-all duration-300 ${
        data?.loading
          ? "shadow-[0_0_20px_4px_rgba(234,179,8,0.8)] animate-pulse"
          : ""
      }`}
    >
      {hasInput && <Handle type="target" position={Position.Left} />}
      <div className="mb-2 font-semibold text-white text-sm">{title}</div>
      {children}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}