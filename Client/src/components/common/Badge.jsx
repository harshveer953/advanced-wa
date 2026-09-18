import React from "react";

const styles = {
  ok: "bg-whatsapp-500/15 text-whatsapp-500 border border-whatsapp-500/20",
  warn: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  neutral: "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20",
  danger: "bg-red-500/15 text-red-300 border border-red-500/20"
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", styles[tone] || styles.neutral, className].join(" ")}>
      {children}
    </span>
  );
}
