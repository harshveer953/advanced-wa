import React from "react";
import Badge from "../common/Badge";

export default function MatchedItemsPreview({ items = [] }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-ink-900 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <div className="text-sm font-semibold">Matched Items</div>
        <div className="text-xs text-zinc-500 mt-1">
          priceSnapshot = 0 wale items “Unmatched” hain — Products me keywords add kar ke match fix kar.
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-zinc-400">
            <tr className="bg-ink-850">
              <th className="text-left px-5 py-3 font-medium">Item</th>
              <th className="text-left px-5 py-3 font-medium">Qty</th>
              <th className="text-left px-5 py-3 font-medium">Price</th>
              <th className="text-left px-5 py-3 font-medium">Total</th>
              <th className="text-left px-5 py-3 font-medium">Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {items.map((it, idx) => {
              const unmatched = Number(it.priceSnapshot) === 0;
              const total = Number(it.priceSnapshot || 0) * Number(it.qty || 0);
              return (
                <tr key={idx} className="hover:bg-ink-850/40 transition">
                  <td className="px-5 py-3 text-zinc-100">{it.nameSnapshot}</td>
                  <td className="px-5 py-3 text-zinc-200">{it.qty}</td>
                  <td className="px-5 py-3 text-zinc-200">₹{Number(it.priceSnapshot || 0)}</td>
                  <td className="px-5 py-3 text-zinc-100 font-medium">₹{total}</td>
                  <td className="px-5 py-3">
                    {unmatched ? <Badge tone="warn">Unmatched</Badge> : <Badge tone="ok">Matched</Badge>}
                  </td>
                </tr>
              );
            })}
            {!items.length ? (
              <tr><td className="px-5 py-6 text-zinc-500" colSpan={5}>No items</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
