import React, { useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import PasteOrderBox from "../components/orders/PasteOrderBox";
import MatchedItemsPreview from "../components/orders/MatchedItemsPreview";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Loader from "../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearCreatedOrder, createOrderFromText, updateOrderStatus } from "../features/orders/orderSlice";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function PasteOrder() {
  const dispatch = useDispatch();
  const { createdOrder, loading, error } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(clearCreatedOrder()); }, [dispatch]);

  const submit = (payload) => dispatch(createOrderFromText(payload));

  const markDelivered = () => {
    if (!createdOrder?._id) return;
    dispatch(updateOrderStatus({ id: createdOrder._id, status: "DELIVERED" }));
  };

  const hasUnmatched = (createdOrder?.items || []).some((i) => Number(i.priceSnapshot) === 0);

  return (
    <AppLayout>
      <div>
        <div className="text-xl font-semibold">Paste Order</div>
        <div className="text-sm text-zinc-400 mt-1">WhatsApp message → clean order → track status.</div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft p-5">
          <div className="text-sm font-semibold">Create from WhatsApp text</div>
          <div className="text-xs text-zinc-500 mt-1">Customer phone required. Name optional.</div>
          <div className="mt-5">
            <PasteOrderBox loading={loading} onSubmit={submit} />
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          ) : null}
          {loading ? <div className="mt-4"><Loader label="Creating order..." /></div> : null}
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Result</div>
                <div className="text-xs text-zinc-500 mt-1">Order create hone ke baad yaha preview dikhega.</div>
              </div>
              {createdOrder ? <Badge tone="ok">Order Created</Badge> : <Badge tone="neutral">Waiting</Badge>}
            </div>

            {createdOrder ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-zinc-800 bg-ink-850 p-4">
                  <div className="text-sm font-medium text-zinc-100">
                    {createdOrder.customerId?.name || "Customer"} <span className="text-zinc-500 font-normal">• {createdOrder.customerId?.phone || ""}</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Total: <span className="text-zinc-200 font-medium">{formatINR(createdOrder.totalAmount)}</span>
                    {hasUnmatched ? (
                      <span className="ml-2 text-amber-300">• Unmatched items present</span>
                    ) : (
                      <span className="ml-2 text-whatsapp-500">• Fully matched</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={markDelivered} disabled={createdOrder.status === "DELIVERED" || loading}>Mark Delivered</Button>
                  {createdOrder.status === "DELIVERED" ? <Badge tone="ok">Delivered</Badge> : <Badge tone="warn">Pending</Badge>}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-zinc-500">Paste and create an order to see preview.</div>
            )}
          </div>

          <MatchedItemsPreview items={createdOrder?.items || []} />
        </div>
      </div>
    </AppLayout>
  );
}
