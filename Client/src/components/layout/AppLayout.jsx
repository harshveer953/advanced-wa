import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="flex">
        <div className="hidden md:block md:sticky md:top-0 md:h-screen">
          <Sidebar />
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-80 shadow-lift">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex-1">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="px-4 py-6 md:px-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
