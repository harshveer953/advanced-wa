import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-ink-900 shadow-lift">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div className="text-base font-semibold text-zinc-100">{title}</div>
            <button onClick={onClose} className="rounded-xl p-2 hover:bg-ink-800 transition" aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
          {footer ? <div className="px-5 py-4 border-t border-zinc-800">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
