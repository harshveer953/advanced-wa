import React from "react";

export default function Input({ label, hint, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label ? <div className="mb-1 text-sm text-zinc-200">{label}</div> : null}
      <input
        className={[
          "w-full rounded-2xl bg-ink-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100",
          "placeholder:text-zinc-500",
          "focus:outline-none focus:ring-2 focus:ring-whatsapp-500/35 focus:border-zinc-700",
          error ? "border-red-500/60 focus:ring-red-500/25" : "",
          className
        ].join(" ")}
        {...props}
      />
      {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
      {error ? <div className="mt-1 text-xs text-red-400">{error}</div> : null}
    </div>
  );
}
