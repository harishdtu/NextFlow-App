"use client";

import React, { useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  Edge,
  Node,
  Connection,
} from "reactflow";
type NodeData = {
  text?: string;
  output?: any;
  imageUrl?: string;
  videoUrl?: string;
  model?: string;
  loading?: boolean;
};
import "reactflow/dist/style.css";

import TextNode from "@/nodes/TextNode";
import LLMNode from "@/nodes/LLMNode";
import ImageNode from "@/nodes/ImageNode";
import VideoNode from "@/nodes/VideoNode";
import CropNode from "@/nodes/CropNode";
import FrameNode from "@/nodes/FrameNode";

const getId = () => crypto.randomUUID();

const nodeTypes = {
  textNode: TextNode,
  llmNode: LLMNode,
  imageNode: ImageNode,
  videoNode: VideoNode,
  cropNode: CropNode,
  frameNode: FrameNode,
};

// Type-safe connection rules
// key = target node type, value = allowed source node types per handle
const CONNECTION_RULES: Record<string, Record<string, string[]>> = {
  llmNode: {
    system: ["textNode"],
    user:   ["textNode", "llmNode"],
    image:  ["imageNode", "cropNode", "frameNode"],
    // default (no handle id): allow text
    default: ["textNode", "llmNode", "imageNode", "cropNode", "frameNode"],
  },
  cropNode: {
    default: ["imageNode", "cropNode"],
  },
  frameNode: {
    default: ["videoNode"],
  },
  textNode: {
    default: ["textNode"],
  },
};

type HistoryEntry = { nodes: Node<NodeData>[]; edges: Edge[] };

function FlowCanvasInner() {
const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { screenToFlowPosition, getNodes, getEdges } = useReactFlow();
  const wrapper = useRef<HTMLDivElement>(null);

  const past = useRef<HistoryEntry[]>([]);
  const future = useRef<HistoryEntry[]>([]);
  const isUndoRedo = useRef(false);

  const saveSnapshot = useCallback(() => {
    if (isUndoRedo.current) return;
    past.current.push({ nodes: getNodes(), edges: getEdges() });
    if (past.current.length > 50) past.current.shift();
    future.current = [];
  }, [getNodes, getEdges]);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    isUndoRedo.current = true;
    future.current.push({ nodes: getNodes(), edges: getEdges() });
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setTimeout(() => { isUndoRedo.current = false; }, 0);
  }, [getNodes, getEdges, setNodes, setEdges]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    isUndoRedo.current = true;
    past.current.push({ nodes: getNodes(), edges: getEdges() });
    setNodes(next.nodes);
    setEdges(next.edges);
    setTimeout(() => { isUndoRedo.current = false; }, 0);
  }, [getNodes, getEdges, setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = document.activeElement;
        if (active?.tagName === "TEXTAREA" || active?.tagName === "INPUT") return;
        saveSnapshot();
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, saveSnapshot, setNodes, setEdges]);

  // ✅ Type-safe connection validator
  const isValidConnection = useCallback(
    (connection: Connection) => {
      const allNodes = getNodes();
      const sourceNode = allNodes.find((n) => n.id === connection.source);
      const targetNode = allNodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return false;

      const rules = CONNECTION_RULES[targetNode.type!];
      if (!rules) return true; // no rules = allow all

      const handleRules = rules[connection.targetHandle || "default"] || rules["default"];
      if (!handleRules) return true;

      const allowed = handleRules.includes(sourceNode.type!);
      if (!allowed) {
        console.warn(`❌ Cannot connect ${sourceNode.type} → ${targetNode.type} (handle: ${connection.targetHandle})`);
      }
      return allowed;
    },
    [getNodes]
  );

  const onConnect = useCallback(
    (params: any) => {
      saveSnapshot();
      setEdges((eds) =>
        addEdge(
          { ...params, type: "smoothstep", animated: true, style: { stroke: "#a855f7" } },
          eds
        )
      );
    },
    [setEdges, saveSnapshot]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("nodeType");
    if (!type) return;
    saveSnapshot();
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes((nds) => [
  ...nds,
  {
    id: getId(),
    type,
    position,
    data: {
      text: "",
      output: "",
      loading: false,
    } as NodeData,
  },
]);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const deleteSelectedNodes = () => {
    saveSnapshot();
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  };

  // ✅ Export workflow as JSON
  const exportWorkflow = () => {
    const data = { nodes: getNodes(), edges: getEdges() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Import workflow from JSON
  const importWorkflow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.nodes && data.edges) {
          saveSnapshot();
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      } catch {
        alert("Invalid workflow JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset input
  };

  const toBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const setNodeLoading = (nodeId: string, loading: boolean) => {
  setNodes((nds) =>
    nds.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            data: { ...n.data, loading },
          }
        : n
    )
  );
};

  const executeWorkflow = async () => {
    const start = Date.now();
    const allEdges = getEdges();
   const nodeList = getNodes() as Node<NodeData>[];
    const completed = new Map<string, any>();
    const nodeDetails: any[] = [];

    const process = async (node: Node<NodeData>): Promise<any> => {
      if (completed.has(node.id)) return completed.get(node.id);

      const incoming = allEdges.filter((e) => e.target === node.id);
      for (const edge of incoming) {
        const source = nodeList.find((n) => n.id === edge.source);
        if (source && !completed.has(source.id)) await process(source);
      }

      setNodeLoading(node.id, true);
      const nodeStart = Date.now();

      try {
        if (node.type === "llmNode") {
          let userMessage = "";
          let images: string[] = [];
          const model = node.data?.model || "gemini-2.0-flash";

          for (const edge of incoming) {
            const source = nodeList.find((n) => n.id === edge.source);
            if (!source) continue;
            const sourceOutput = completed.get(source.id);

            if (["cropNode", "imageNode", "frameNode"].includes(source.type!)) {
              const img = sourceOutput?.output || source.data?.imageUrl || source.data?.output;
              if (img) images.push(img);
            }
            if (source.type === "textNode") {
              if (source.data?.text) userMessage += source.data.text + "\n";
            }
            if (source.type === "llmNode") {
              const txt = sourceOutput?.output || source.data?.output;
              if (txt) userMessage += txt + "\n";
            }
          }

          const res = await fetch("/api/llm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMessage, images, model }),
          });
          const data = await res.json();
          const result = { output: data.output };

          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id
                ? { ...n, data: { ...n.data, output: data.output, loading: false } }
                : n
            )
          );

          nodeDetails.push({ nodeId: node.id, nodeType: "LLM Node", status: "success", duration: Date.now() - nodeStart, output: data.output?.slice(0, 100) });
          completed.set(node.id, result);
          return result;
        }

        if (node.type === "cropNode") {
          const source = nodeList.find((n) => n.id === incoming[0]?.source);
          if (!source) { setNodeLoading(node.id, false); completed.set(node.id, {}); return {}; }

          let image = completed.get(source.id)?.output || source.data?.imageUrl || source.data?.output;
          if (!image) { setNodeLoading(node.id, false); completed.set(node.id, {}); return {}; }
          if (image.startsWith("blob:")) image = await toBase64(image);

          const res = await fetch("/api/crop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: image }),
          });
          const data = await res.json();
          const result = { output: data.output };

          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id
                ? { ...n, data: { ...n.data, imageUrl: data.output, output: data.output, loading: false } }
                : n
            )
          );

          nodeDetails.push({ nodeId: node.id, nodeType: "Crop Node", status: "success", duration: Date.now() - nodeStart, output: "Cropped image" });
          completed.set(node.id, result);
          return result;
        }

        if (node.type === "frameNode") {
          const source = nodeList.find((n) => n.id === incoming[0]?.source);
          if (!source) { setNodeLoading(node.id, false); completed.set(node.id, {}); return {}; }

          let video = completed.get(source.id)?.videoUrl || source.data?.videoUrl || source.data?.output;
          if (!video) { setNodeLoading(node.id, false); completed.set(node.id, {}); return {}; }
          if (video.startsWith("blob:")) video = await toBase64(video);

          const res = await fetch("/api/frame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ video }),
          });
          const data = await res.json();
          const result = { output: data.output };

          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id
                ? { ...n, data: { ...n.data, output: data.output, loading: false } }
                : n
            )
          );

          nodeDetails.push({ nodeId: node.id, nodeType: "Frame Node", status: "success", duration: Date.now() - nodeStart, output: "Extracted frame" });
          completed.set(node.id, result);
          return result;
        }

        setNodeLoading(node.id, false);
        nodeDetails.push({ nodeId: node.id, nodeType: node.type || "Node", status: "success", duration: Date.now() - nodeStart });
        completed.set(node.id, node.data);
        return node.data;

      } catch (err) {
        console.error(`Error in node ${node.id}:`, err);
        setNodeLoading(node.id, false);
        nodeDetails.push({ nodeId: node.id, nodeType: node.type || "Node", status: "failed", duration: Date.now() - nodeStart });
        completed.set(node.id, {});
        return {};
      }
    };

    try {
      await Promise.all(nodeList.map((node) => process(node)));

      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "success", duration: Date.now() - start, nodeDetails }),
      });

      window.dispatchEvent(new Event("historyUpdated"));
    } catch (err) {
      console.error("WORKFLOW ERROR:", err);
    }
  };

  return (
    <div className="w-full h-screen relative" ref={wrapper}>
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center flex-wrap justify-center">
        <button onClick={executeWorkflow} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
          ▶ Run Workflow
        </button>
        <button onClick={undo} title="Undo (Ctrl+Z)" className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-white rounded-lg hover:bg-[#252525] transition text-sm">↩</button>
        <button onClick={redo} title="Redo (Ctrl+Y)" className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-white rounded-lg hover:bg-[#252525] transition text-sm">↪</button>
        <button onClick={deleteSelectedNodes} title="Delete selected" className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-gray-400 rounded-lg hover:bg-red-900/30 hover:text-red-400 hover:border-red-800 transition text-sm">🗑</button>
        <button onClick={exportWorkflow} title="Export workflow" className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-gray-400 rounded-lg hover:bg-[#252525] hover:text-white transition text-sm">
          ⬇ Export
        </button>
        <label className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-gray-400 rounded-lg hover:bg-[#252525] hover:text-white transition text-sm cursor-pointer">
          ⬆ Import
          <input type="file" accept=".json" onChange={importWorkflow} className="hidden" />
        </label>
        <button
          onClick={() => { if (confirm("Clear entire workflow?")) { saveSnapshot(); setNodes([]); setEdges([]); } }}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
        >
          Clear
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        isValidConnection={isValidConnection}
        fitView
        deleteKeyCode={null}
      >
        <Background />
        <Controls />
        <MiniMap style={{ background: "#1a1a1a" }} maskColor="rgba(0,0,0,0.5)" />
      </ReactFlow>
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}