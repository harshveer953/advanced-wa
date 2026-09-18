import React from "react";
import Badge from "../common/Badge";

const map = {
  PENDING: { tone: "warn", label: "Pending" },
  CONFIRMED: { tone: "ok", label: "Confirmed" },
  DELIVERED: { tone: "ok", label: "Delivered" },
  CANCELLED: { tone: "danger", label: "Cancelled" }
};

export default function OrderStatusPill({ status }) {
  const s = map[status] || { tone: "neutral", label: status || "Unknown" };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
