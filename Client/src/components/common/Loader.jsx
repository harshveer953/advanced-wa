import React from "react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-300">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-whatsapp-500" />
      <span>{label}</span>
    </div>
  );
}
