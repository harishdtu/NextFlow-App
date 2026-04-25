import Sidebar from "@/components/Sidebar";
import HistoryPanel from "@/components/HistoryPanel";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex h-screen w-screen bg-[#0f0f0f] text-white">
      
      {/* LEFT */}
      <Sidebar />

      {/* CENTER */}
      <div className="flex-1 h-full flex flex-col">
        {children}
      </div>

      {/* RIGHT */}
      <HistoryPanel />
    </div>
  );
}