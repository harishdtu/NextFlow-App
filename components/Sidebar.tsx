"use client";

import { useClerk, useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const { signOut } = useClerk();
  const { user } = useUser();

  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("nodeType", type);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodeItems = [
    { type: "textNode", icon: "📝", label: "Text Node" },
    { type: "llmNode", icon: "🤖", label: "AI Node" },
    { type: "imageNode", icon: "🖼️", label: "Upload Image" },
    { type: "videoNode", icon: "🎥", label: "Upload Video" },
    { type: "cropNode", icon: "✂️", label: "Crop Image" },
    { type: "frameNode", icon: "🎞", label: "Extract Frame" },
  ];

  return (
    <div className="w-56 flex flex-col border-r border-[#222] bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#222]">
        <h1 className="text-lg font-bold">NextFlow 🚀</h1>
        {user && (
          <p className="text-xs text-gray-400 mt-1 truncate">{user.emailAddresses[0]?.emailAddress}</p>
        )}
      </div>

      {/* Nodes */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Quick Access</p>
        {nodeItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg cursor-grab hover:bg-[#252525] active:cursor-grabbing transition-colors border border-[#2a2a2a] hover:border-[#444] text-sm"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-[#222]">
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="w-full py-2 px-3 bg-[#1a1a1a] hover:bg-red-900/30 hover:border-red-800 border border-[#2a2a2a] rounded-lg text-sm text-gray-400 hover:text-red-400 transition-colors text-left flex items-center gap-2"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}