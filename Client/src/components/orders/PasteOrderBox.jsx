import React, { useMemo, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

export default function PasteOrderBox({ loading, onSubmit }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const canSubmit = useMemo(
    () => phone.trim().length >= 8 && text.trim().length >= 3,
    [phone, text]
  );

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    onSubmit?.({ phone: phone.trim(), name: name.trim(), text });
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label="Customer Phone"
          placeholder="9999999999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint="Phone se customer auto-create/find hoga"
        />
        <Input
          label="Customer Name (optional)"
          placeholder="Rahul"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <div className="mb-1 text-sm text-zinc-200">Paste WhatsApp message here</div>
        <textarea
          className="w-full min-h-[170px] rounded-3xl bg-ink-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-whatsapp-500/35 focus:border-zinc-700"
          placeholder={`Example:\n2 black tshirt, 1 blue jeans\nor\nblack tshirt x2\nblue jeans 1`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-2 text-xs text-zinc-500">
          Tip: Products me keywords add kar ke matching strong banao.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!canSubmit || loading}>
          {loading ? "Creating..." : "Create Order"}
        </Button>
        <Button type="button" variant="subtle" onClick={() => setText("")} disabled={loading}>
          Clear
        </Button>
      </div>
    </form>
  );
}
