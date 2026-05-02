"use client";

import { Handle, Position, useReactFlow } from "reactflow";
<<<<<<< HEAD
import BaseNode from "@/components/BaseNode";
=======
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4

const MODELS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
<<<<<<< HEAD
  { value: "gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
  { value: "gemini-3.1-flash-lite-preview", label: "Gemini 3.1 Flash Lite Preview" },
=======
    { value: "gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
    { value: "gemini-3.1-flash-lite-preview", label: "Gemini 3.1 Flash Lite Preview" },
    { value: "gemini-2.5-flash-preview-tts", label: "Gemini 2.5 Flash Preview TTS" }
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
];

export default function LLMNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const update = (key: string, value: string) => {
    setNodes((nds) =>
<<<<<<< HEAD
      nds.map((n) => n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n)
=======
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n
      )
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
    );
  };

  return (
<<<<<<< HEAD
    <div className="relative">
      <BaseNode title="LLM" icon="🤖" loading={data.loading} glowColor="rgba(168,85,247,0.6)">
        <select
          value={data.model || "gemini-2.0-flash"}
          onChange={(e) => update("model", e.target.value)}
          className="nodrag w-full text-[11px] rounded-lg px-2 py-1.5 mb-2 focus:outline-none border border-[#2a2a33] focus:border-[#3a3a48]"
          style={{ background: "#0e0e10", color: "#aaa" }}
        >
          {MODELS.map((m) => (
            <option key={m.value} value={m.value} style={{ background: "#0e0e10", color: "#aaa" }}>
              {m.label}
            </option>
          ))}
        </select>

        <textarea
          value={data.text || ""}
          onChange={(e) => update("text", e.target.value)}
          placeholder="System prompt (optional)..."
          rows={2}
          className="nodrag w-full bg-[#17171c] text-[#ccc] text-[11px] p-2 rounded-lg border border-[#2a2a33] focus:outline-none focus:border-[#3a3a48] resize-none placeholder-[#444] mb-2"
        />

        {data.output && (
          <div className="bg-[#17171c] border border-[#2a2a33] rounded-lg p-2 max-h-28 overflow-y-auto">
            <p className="text-[10px] text-[#999] leading-relaxed whitespace-pre-wrap break-words">
              {data.output}
            </p>
          </div>
        )}
      </BaseNode>

      <Handle type="target" position={Position.Left} id="system"
        style={{ top: 48, background: "#6366f1", width: 8, height: 8, border: "2px solid #312e81" }} />
      <Handle type="target" position={Position.Left} id="user"
        style={{ top: 72, background: "#8b5cf6", width: 8, height: 8, border: "2px solid #4c1d95" }} />
      <Handle type="target" position={Position.Left} id="image"
        style={{ top: 96, background: "#a855f7", width: 8, height: 8, border: "2px solid #581c87" }} />
      <Handle type="source" position={Position.Right}
        style={{ background: "#a855f7", width: 8, height: 8, border: "2px solid #581c87" }} />
=======
    <div className={`bg-[#2d1b69] text-white p-3 rounded-xl w-[260px] border border-purple-600 transition-all duration-300 ${
      data.loading ? "shadow-[0_0_20px_4px_rgba(168,85,247,0.8)] animate-pulse" : ""
    }`}>
      <Handle type="target" position={Position.Left} id="system" style={{ top: 28 }} />
      <Handle type="target" position={Position.Left} id="user" style={{ top: 56 }} />
      <Handle type="target" position={Position.Left} id="image" style={{ top: 84 }} />

      <div className="text-xs font-bold text-purple-300 mb-2">🤖 LLM Node</div>

      {/* Model */}
      <select
  value={data.model || "gemini-2.0-flash"}
  onChange={(e) => update("model", e.target.value)}
  className="nodrag w-full p-1.5 rounded text-xs border border-purple-700 mb-2 focus:outline-none"
  style={{ background: "#1a0f3a", color: "white" }}
>
  {MODELS.map((m) => (
    <option key={m.value} value={m.value} style={{ background: "#1a0f3a", color: "white" }}>
      {m.label}
    </option>
  ))}
</select>
      {/* Prompt */}
      <textarea
        value={data.text || ""}
        onChange={(e) => update("text", e.target.value)}
        placeholder="Type prompt..."
        rows={2}
        className="nodrag w-full text-white bg-[#1a0f3a] p-1.5 rounded text-xs border border-purple-700 mb-2 focus:outline-none resize-none placeholder-purple-400"
      />

      <button
        onClick={data.onRun}
        disabled={data.loading}
        className="w-full py-1.5 rounded bg-purple-600 hover:bg-purple-500 transition text-xs font-medium disabled:opacity-50"
      >
        {data.loading ? "Running..." : "Run"}
      </button>

      {data.output && (
        <div className="mt-2 text-xs whitespace-pre-wrap bg-[#1a0f3a] rounded p-2 max-h-32 overflow-y-auto break-words text-purple-100">
          {data.output}
        </div>
      )}

      <Handle type="source" position={Position.Right} />
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
    </div>
  );
}