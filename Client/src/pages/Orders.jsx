import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../features/orders/orderSlice";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import OrderStatusPill from "../components/orders/OrderStatusPill";
import Badge from "../components/common/Badge";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const statusOptions = ["ALL", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

export default function Orders() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.orders);

  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { dispatch(fetchOrders(status === "ALL" ? "" : status)); }, [dispatch, status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((o) => {
      const name = (o.customerId?.name || "").toLowerCase();
      const phone = (o.customerId?.phone || "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [list, search]);

  const openDetails = (order) => { setSelected(order); setOpen(true); };
  const changeStatus = (orderId, next) => dispatch(updateOrderStatus({ id: orderId, status: next }));

  return (
    <AppLayout>
      <div>
        <div className="text-xl font-semibold">Orders</div>
        <div className="text-sm text-zinc-400 mt-1">Filter, search, and update delivery status.</div>
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="mb-1 text-sm text-zinc-200">Status</div>
            <select
              className="w-full rounded-2xl bg-ink-900 border border-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-500/35"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === "ALL" ? "All" : s}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input label="Search (customer name / phone)" placeholder="Rahul or 9999..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? <div className="mt-4"><Loader label="Loading orders..." /></div> : null}
        {error ? <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

        <div className="mt-5 grid gap-3">
          {!loading && filtered.length === 0 ? <div className="text-sm text-zinc-500">No orders found.</div> : null}

          {filtered.map((o) => (
            <div key={o._id} className="rounded-3xl border border-zinc-800 bg-ink-850 p-4 hover:bg-ink-800/35 transition">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm font-semibold">
                    {o.customerId?.name || "Customer"} <span className="text-zinc-500 font-normal">• {o.customerId?.phone || ""}</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {fmtDate(o.createdAt)} <span className="mx-2 text-zinc-700">|</span>
                    Items: <span className="text-zinc-200">{o.items?.length || 0}</span>{" "}
                    <span className="mx-2 text-zinc-700">|</span>
                    Total: <span className="text-zinc-100 font-medium">{formatINR(o.totalAmount)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(o.items || []).slice(0, 3).map((it, idx) => (
                      <Badge key={idx} tone={Number(it.priceSnapshot) === 0 ? "warn" : "neutral"}>
                        {it.nameSnapshot} × {it.qty}
                      </Badge>
                    ))}
                    {(o.items || []).length > 3 ? <Badge tone="neutral">+{(o.items || []).length - 3} more</Badge> : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 md:flex-col md:items-end">
                  <OrderStatusPill status={o.status} />
                  <div className="flex items-center gap-2">
                    <select
                      className="rounded-2xl bg-ink-900 border border-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-500/35"
                      value={o.status}
                      onChange={(e) => changeStatus(o._id, e.target.value)}
                    >
                      {statusOptions.filter((s) => s !== "ALL").map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Button variant="ghost" onClick={() => openDetails(o)}>View</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        title="Order Details"
        onClose={() => setOpen(false)}
        footer={
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">{selected ? `Order ID: ${selected._id}` : ""}</div>
            <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
          </div>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-ink-850 p-4">
              <div className="text-sm font-semibold">
                {selected.customerId?.name || "Customer"} <span className="text-zinc-500 font-normal">• {selected.customerId?.phone || ""}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Created: <span className="text-zinc-200">{fmtDate(selected.createdAt)}</span>{" "}
                <span className="mx-2 text-zinc-700">|</span>
                Total: <span className="text-zinc-100 font-medium">{formatINR(selected.totalAmount)}</span>
              </div>
              <div className="mt-3"><OrderStatusPill status={selected.status} /></div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-ink-850 p-4">
              <div className="text-sm font-semibold">Items</div>
              <div className="mt-3 grid gap-2">
                {(selected.items || []).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="text-zinc-200">
                      {it.nameSnapshot} <span className="text-zinc-500">× {it.qty}</span>{" "}
                      {Number(it.priceSnapshot) === 0 ? <Badge tone="warn" className="ml-2">Unmatched</Badge> : null}
                    </div>
                    <div className="text-zinc-100 font-medium">₹{Number(it.priceSnapshot || 0) * Number(it.qty || 0)}</div>
                  </div>
                ))}
              </div>
            </div>

            {selected.note ? (
              <div className="rounded-2xl border border-zinc-800 bg-ink-850 p-4">
                <div className="text-sm font-semibold">Raw WhatsApp Text</div>
                <pre className="mt-2 whitespace-pre-wrap text-xs text-zinc-300">{selected.note}</pre>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </AppLayout>
  );
}
