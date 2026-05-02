<<<<<<< HEAD
"use client";

import { ReactNode } from "react";

interface BaseNodeProps {
  title: string;
  icon: string;
  loading?: boolean;
  glowColor?: string;
  children: ReactNode;
}

export default function BaseNode({
  title,
  icon,
  loading,
  glowColor = "rgba(168,85,247,0.6)",
  children,
}: BaseNodeProps) {
  return (
    <div
      className={`bg-[#0e0e10] border rounded-xl w-[220px] overflow-hidden transition-all duration-300 ${
        loading
          ? "animate-pulse"
          : "border-[#1e1e24] hover:border-[#2e2e38]"
      }`}
      style={
        loading
          ? { boxShadow: `0 0 18px 3px ${glowColor}`, borderColor: "transparent" }
          : {}
      }
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[#1e1e24] bg-[#0a0a0c]">
        <span className="text-[11px]">{icon}</span>
        <span className="text-[11px] font-medium text-[#888]">{title}</span>
        {loading && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">{children}</div>
=======
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
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
    </div>
  );
}