"use client";

<<<<<<< HEAD
import { Handle, Position, useReactFlow } from "reactflow";
import BaseNode from "@/components/BaseNode";

export default function FrameNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  return (
    <BaseNode title="Extract Frame" icon="🎞" loading={data.loading} glowColor="rgba(16,185,129,0.5)">
      {data.output ? (
        <img
          src={data.output}
          className="w-full h-[110px] object-cover rounded-lg mb-2"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div className="h-[60px] border border-dashed border-[#2a2a33] rounded-lg flex items-center justify-center mb-2">
          <span className="text-[10px] text-[#555]">
            {data.loading ? "Extracting..." : "Connect a video"}
          </span>
        </div>
      )}

      <div>
        <div className="flex justify-between text-[9px] text-[#1a1212] mb-0.5">
          <span>Timestamp</span>
          <span>{data.timestamp || "1s"}</span>
        </div>
        <input
          type="text"
          value={data.timestamp ?? "1"}
          onChange={(e) =>
            setNodes((nds) =>
              nds.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, timestamp: e.target.value } } : n
              )
            )
          }
          placeholder="1 or 50%"
          className="nodrag w-full bg-[#17171c] border border-[#2a2a33] text-[#ccc] text-[10px] rounded px-2 py-1 focus:outline-none focus:border-[#3a3a48]"
        />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#10b981", width: 8, height: 8, border: "2px solid #064e3b" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#10b981", width: 8, height: 8, border: "2px solid #064e3b" }}
      />
    </BaseNode>
=======
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
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
  );
}