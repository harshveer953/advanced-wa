import React from "react";

const variants = {
  primary:
    "bg-whatsapp-600 hover:bg-whatsapp-500 text-ink-950 shadow-soft hover:shadow-lift",
  ghost:
    "bg-transparent hover:bg-ink-800 text-zinc-100 border border-zinc-800 hover:border-zinc-700",
  danger:
    "bg-red-600 hover:bg-red-500 text-white shadow-soft hover:shadow-lift",
  subtle:
    "bg-ink-800 hover:bg-ink-700 text-zinc-100 border border-zinc-800"
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all",
        "focus:outline-none focus:ring-2 focus:ring-whatsapp-500/40 focus:ring-offset-0",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        className
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
