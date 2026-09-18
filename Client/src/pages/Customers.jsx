import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerByPhone, fetchCustomers, clearSelectedCustomer } from "../features/customers/customerSlice";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Badge from "../components/common/Badge";

export default function Customers() {
  const dispatch = useDispatch();
  const { list, selected, loading, error } = useSelector((s) => s.customers);

  const [search, setSearch] = useState("");
  const [phoneLookup, setPhoneLookup] = useState("");

  useEffect(() => {
    dispatch(fetchCustomers(""));
    dispatch(clearSelectedCustomer());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => {
      const n = (c.name || "").toLowerCase();
      const p = (c.phone || "").toLowerCase();
      return n.includes(q) || p.includes(q);
    });
  }, [list, search]);

  const lookup = () => {
    if (!phoneLookup.trim()) return;
    dispatch(fetchCustomerByPhone(phoneLookup.trim()));
  };

  return (
    <AppLayout>
      <div className="text-xl font-semibold">Customers</div>
      <div className="text-sm text-zinc-400 mt-1">Search customers and lookup by phone.</div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft p-5">
          <Input
            label="Search (name / phone)"
            placeholder="Rahul or 9999..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? <div className="mt-4"><Loader label="Loading customers..." /></div> : null}
          {error ? <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {!loading && filtered.length === 0 ? <div className="text-sm text-zinc-500">No customers found.</div> : null}

            {filtered.map((c) => (
              <div key={c._id} className="rounded-3xl border border-zinc-800 bg-ink-850 p-4 hover:bg-ink-800/35 transition">
                <div className="text-sm font-semibold">{c.name || "Customer"}</div>
                <div className="mt-1 text-xs text-zinc-500">Phone: <span className="text-zinc-200">{c.phone}</span></div>
                {c.address ? <div className="mt-1 text-xs text-zinc-500">Address: <span className="text-zinc-200">{c.address}</span></div> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft p-5">
          <div className="text-sm font-semibold">Lookup by Phone</div>
          <div className="text-xs text-zinc-500 mt-1">Direct search: /customers/phone/:phone</div>

          <div className="mt-4 grid gap-3">
            <Input label="Phone" placeholder="9999999999" value={phoneLookup} onChange={(e) => setPhoneLookup(e.target.value)} />
            <Button onClick={lookup} disabled={loading}>Lookup</Button>
          </div>

          <div className="mt-4">
            {selected ? (
              <div className="rounded-3xl border border-zinc-800 bg-ink-850 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{selected.name || "Customer"}</div>
                  <Badge tone="ok">Found</Badge>
                </div>
                <div className="mt-2 text-xs text-zinc-500">Phone: <span className="text-zinc-200">{selected.phone}</span></div>
                {selected.address ? (
                  <div className="mt-1 text-xs text-zinc-500">Address: <span className="text-zinc-200">{selected.address}</span></div>
                ) : (
                  <div className="mt-1 text-xs text-zinc-500">Address: <span className="text-zinc-400">—</span></div>
                )}
              </div>
            ) : (
              <div className="text-sm text-zinc-500">No customer selected.</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
