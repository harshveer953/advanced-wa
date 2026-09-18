import React, { useEffect, useMemo } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/orderSlice";
import OrderStatusPill from "../components/orders/OrderStatusPill";
import Badge from "../components/common/Badge";
import Loader from "../components/common/Loader";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchOrders("")); }, [dispatch]);

  const metrics = useMemo(() => {
    const todayOrders = list.filter((o) => isToday(o.createdAt));
    const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const pending = list.filter((o) => o.status === "PENDING").length;
    const delivered = list.filter((o) => o.status === "DELIVERED").length;
    const recent = [...list].slice(0, 5);
    return { todayOrders: todayOrders.length, pending, delivered, todayRevenue, recent };
  }, [list]);

  return (
    <AppLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Dashboard</div>
          <div className="text-sm text-zinc-400 mt-1">Aaj ka snapshot — orders, delivery, revenue.</div>
        </div>
        <Link
          to="/paste-order"
          className="hidden sm:inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-whatsapp-600 hover:bg-whatsapp-500 text-ink-950 font-medium transition shadow-soft hover:shadow-lift"
        >
          Paste New Order <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <KpiCard title="Today Orders" value={metrics.todayOrders} tone="ok" />
        <KpiCard title="Pending" value={metrics.pending} tone="warn" />
        <KpiCard title="Delivered" value={metrics.delivered} tone="ok" />
        <KpiCard title="Today Revenue" value={formatINR(metrics.todayRevenue)} tone="neutral" />
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Recent Orders</div>
            <div className="text-xs text-zinc-500 mt-1">Latest 5 orders</div>
          </div>
          <Link to="/orders" className="text-sm text-whatsapp-500 hover:text-whatsapp-400 transition">View all</Link>
        </div>

        <div className="p-5">
          {loading ? <Loader label="Loading orders..." /> : null}
          {!loading && metrics.recent.length === 0 ? (
            <div className="text-sm text-zinc-500">No orders yet. Paste your first WhatsApp message.</div>
          ) : null}

          <div className="grid gap-3">
            {metrics.recent.map((o) => (
              <div key={o._id} className="rounded-2xl border border-zinc-800 bg-ink-850 p-4 hover:bg-ink-800/40 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">
                      {o.customerId?.name || "Customer"} <span className="text-zinc-500 font-normal">• {o.customerId?.phone || ""}</span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Items: <span className="text-zinc-300">{o.items?.length || 0}</span>
                      <span className="mx-2 text-zinc-700">|</span>
                      Total: <span className="text-zinc-200 font-medium">{formatINR(o.totalAmount)}</span>
                    </div>
                  </div>
                  <OrderStatusPill status={o.status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(o.items || []).slice(0, 3).map((it, idx) => (
                    <Badge key={idx} tone={Number(it.priceSnapshot) === 0 ? "warn" : "neutral"}>
                      {it.nameSnapshot} × {it.qty}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function KpiCard({ title, value, tone }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft p-5 hover:shadow-lift transition">
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100">{value}</div>
      <div className="mt-3"><Badge tone={tone}>{tone === "warn" ? "Needs attention" : "Healthy"}</Badge></div>
    </div>
  );
}
