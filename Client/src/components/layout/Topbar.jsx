import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, LogOut, UserCircle2 } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import Button from "../common/Button";

export default function Topbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => {
    const n = user?.name || "User";
    return n.split(" ").slice(0, 2).map((x) => x[0]?.toUpperCase()).join("");
  }, [user]);

  const doLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-800 bg-ink-950/70 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={onMenuClick} className="md:hidden rounded-2xl p-2 hover:bg-ink-800 transition" aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div className="text-sm text-zinc-300">
            <span className="text-zinc-100 font-medium">WhatsApp Orders</span> <span className="text-zinc-500">•</span>{" "}
            <span className="text-zinc-400">clean, trackable, fast</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-ink-900 px-3 py-2 hover:bg-ink-800 transition"
          >
            <div className="h-8 w-8 rounded-2xl bg-whatsapp-500/15 border border-whatsapp-500/20 flex items-center justify-center text-xs font-semibold text-whatsapp-500">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm leading-tight">{user?.name || "Account"}</div>
              <div className="text-xs text-zinc-500 leading-tight">{user?.email || ""}</div>
            </div>
          </button>

          {open ? (
            <div className="absolute right-0 mt-2 w-56 rounded-3xl border border-zinc-800 bg-ink-900 shadow-lift overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <UserCircle2 size={18} className="text-zinc-400" />
                  <span className="font-medium">{user?.role || "admin"}</span>
                </div>
                <div className="mt-1 text-xs text-zinc-500">JWT secured session</div>
              </div>
              <div className="p-3">
                <Button variant="ghost" className="w-full justify-start" onClick={doLogout}>
                  <LogOut size={16} /> Logout
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
