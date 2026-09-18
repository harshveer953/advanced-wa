import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "../features/products/productSlice";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import Badge from "../components/common/Badge";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function Products() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.products);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => { dispatch(fetchProducts("")); }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      const n = (p.name || "").toLowerCase();
      const k = (p.keywords || []).join(" ").toLowerCase();
      return n.includes(q) || k.includes(q);
    });
  }, [list, search]);

  const openAdd = () => {
    setEditing(null);
    setName(""); setPrice(""); setKeywords("");
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setName(p.name || "");
    setPrice(String(p.price ?? ""));
    setKeywords((p.keywords || []).join(", "));
    setOpen(true);
  };

  const submit = async () => {
    const payload = {
      name: name.trim(),
      price: Number(price),
      keywords: keywords.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean)
    };
    if (!payload.name || Number.isNaN(payload.price)) return;

    if (editing?._id) await dispatch(updateProduct({ id: editing._id, payload }));
    else await dispatch(createProduct(payload));
    setOpen(false);
  };

  const remove = (id) => {
    if (!confirm("Delete this product?")) return;
    dispatch(deleteProduct(id));
  };

  const refresh = () => dispatch(fetchProducts(search.trim()));

  return (
    <AppLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Products</div>
          <div className="text-sm text-zinc-400 mt-1">Add products + keywords so WhatsApp matching becomes accurate.</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={refresh}>Refresh</Button>
          <Button onClick={openAdd}>Add Product</Button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-800 bg-ink-900 shadow-soft p-5">
        <Input label="Search (name / keywords)" placeholder="tshirt, jeans..." value={search} onChange={(e) => setSearch(e.target.value)} />

        {loading ? <div className="mt-4"><Loader label="Loading products..." /></div> : null}
        {error ? <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {!loading && filtered.length === 0 ? <div className="text-sm text-zinc-500">No products yet. Add your first product.</div> : null}

          {filtered.map((p) => (
            <div key={p._id} className="rounded-3xl border border-zinc-800 bg-ink-850 p-4 hover:bg-ink-800/35 transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Price: <span className="text-zinc-100 font-medium">{formatINR(p.price)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
                  <Button variant="danger" onClick={() => remove(p._id)}>Delete</Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(p.keywords || []).slice(0, 8).map((k, idx) => <Badge key={idx} tone="neutral">{k}</Badge>)}
                {(p.keywords || []).length > 8 ? <Badge tone="neutral">+{(p.keywords || []).length - 8}</Badge> : null}
                {(p.keywords || []).length === 0 ? <Badge tone="warn">No keywords</Badge> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        title={editing ? "Edit Product" : "Add Product"}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>{editing ? "Save" : "Create"}</Button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Black T-Shirt" />
          <Input label="Price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="499" />
          <Input
            label="Keywords (comma separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="black tshirt, tshirt, tee, black"
            hint="Matching is based on these keywords. Add multiple variants."
          />
        </div>
      </Modal>
    </AppLayout>
  );
}
