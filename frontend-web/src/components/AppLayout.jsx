import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 ml-[20px]">
      {/* =====================================================
          Fixed Sidebar
          ===================================================== */}
      <div className="fixed left-0 top-0 z-50 h-screen w-[225px]">
        <Sidebar />
      </div>

      {/* =====================================================
          Main Application Area
          ===================================================== */}
      <div className="ml-[225px] min-h-screen">
        {/* Fixed Topbar */}
        <Topbar />

        {/* =================================================
            Page Content

            Topbar height = 72px
            Therefore content begins at 72px.
            ================================================= */}
        <main className="min-h-screen pt-[72px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;