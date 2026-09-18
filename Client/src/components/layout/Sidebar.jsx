import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ClipboardPaste, ShoppingBag, Package, Users } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/paste-order", label: "Paste Order", icon: ClipboardPaste },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/products", label: "Products", icon: Package },
  { to: "/customers", label: "Customers", icon: Users }
];

export default function Sidebar({ onNavigate }) {
  return (
    <div className="h-full w-72 border-r border-zinc-800 bg-ink-900">
      <div className="px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-whatsapp-500/15 border border-whatsapp-500/20 flex items-center justify-center">
            <span className="text-whatsapp-500 font-bold">W</span>
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Smart WhatsApp</div>
            <div className="text-xs text-zinc-500">Order Manager</div>
          </div>
        </div>
      </div>

      <nav className="px-3 pb-5">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-whatsapp-500/10 border border-whatsapp-500/15 text-zinc-50"
                    : "text-zinc-300 hover:bg-ink-800 hover:text-zinc-50 border border-transparent"
                ].join(" ")
              }
            >
              <Icon size={18} className="text-zinc-400 group-hover:text-zinc-200" />
              <span>{l.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-5 pb-6">
        <div className="rounded-3xl border border-zinc-800 bg-ink-850 p-4">
          <div className="text-xs text-zinc-400">Tip</div>
          <div className="mt-1 text-sm text-zinc-200">
            Keywords add karoge to WhatsApp paste matching aur accurate ho jayegi.
          </div>
        </div>
      </div>
    </div>
  );
}
