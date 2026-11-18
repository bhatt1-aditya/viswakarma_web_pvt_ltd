import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Plus,
  Trash2,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";

const initialLineItems = [
  { id: 1, desc: "Enterprise Cloud Application Architecture", qty: 1, rate: 85000 },
  { id: 2, name: "API Security Audit & Penetration Hardening", desc: "API Security Audit & Penetration Hardening", qty: 1, rate: 35000 },
  { id: 3, name: "UI/UX Design System Component Library", desc: "UI/UX Design System Component Library", qty: 1, rate: 45000 },
];

const DemoInvoiceBilling = () => {
  const [clientName, setClientName] = useState("Nexus Global Technologies");
  const [invoiceNo, setInvoiceNo] = useState("INV-2026-089");
  const [taxRate, setTaxRate] = useState(18); // 18% GST
  const [items, setItems] = useState(initialLineItems);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemRate, setNewItemRate] = useState("");

  const handleReset = () => {
    setClientName("Nexus Global Technologies");
    setInvoiceNo("INV-2026-089");
    setTaxRate(18);
    setItems(initialLineItems);
    toast.success("Invoice builder reset!");
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemDesc || !newItemRate) return;
    const newItem = {
      id: Date.now(),
      desc: newItemDesc,
      qty: 1,
      rate: parseInt(newItemRate),
    };
    setItems([...items, newItem]);
    setNewItemDesc("");
    setNewItemRate("");
    toast.success("Line item added!");
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.rate * item.qty, 0);
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + taxAmount;

  return (
    <DemoLayout
      demoNumber={15}
      title="Invoice & Billing Generator Demo"
      category="Custom Software & Enterprise Solutions"
      description="Commercial invoice builder with dynamic line item addition, automated tax/GST calculations, and print output."
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INVOICE EDITOR (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-bold text-[#082B59]">Invoice Parameters</h3>
            <span className="text-xs font-mono font-bold text-[#0756A5]">{invoiceNo}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700">Client / Billed Entity</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1 w-full p-2 border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700">GST / Tax Slab (%)</label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(parseInt(e.target.value))}
                className="mt-1 w-full p-2 border rounded-lg text-xs"
              >
                <option value={0}>0% (Tax Exempt)</option>
                <option value={5}>5% (Basic Goods)</option>
                <option value={12}>12% (Standard)</option>
                <option value={18}>18% (Standard IT Services GST)</option>
                <option value={28}>28% (Luxury)</option>
              </select>
            </div>
          </div>

          {/* Add Item Row */}
          <form onSubmit={addItem} className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-gray-700 block">Add Billable Line Item:</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                required
                placeholder="Item / Deliverable description"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="sm:col-span-8 p-2 border rounded-lg"
              />
              <input
                type="number"
                required
                placeholder="Rate (₹)"
                value={newItemRate}
                onChange={(e) => setNewItemRate(e.target.value)}
                className="sm:col-span-3 p-2 border rounded-lg"
              />
              <button
                type="submit"
                className="sm:col-span-1 p-2 bg-[#0756A5] text-white rounded-lg flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>
          </form>

          {/* Current Items List */}
          <div className="space-y-2 text-xs">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white"
              >
                <span className="font-medium text-gray-800">{item.desc}</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">
                    ₹{item.rate.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRINTABLE PREVIEW (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Tax Invoice Preview
            </span>
            <button
              onClick={() => {
                window.print();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
          </div>

          <div className="text-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-[#082B59] text-sm">Vishwakarma Web Pvt Ltd</h4>
                <p className="text-[10px] text-gray-500">GSTIN: 09AAACV1234F1Z5</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-[#0756A5]">{invoiceNo}</p>
                <p className="text-[10px] text-gray-400">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Billed To:</span>
              <p className="font-bold text-gray-800">{clientName}</p>
            </div>

            <div className="divide-y divide-gray-100 border-y py-2 space-y-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 text-[11px]">
                  <span className="text-gray-600 line-clamp-1 max-w-[200px]">{item.desc}</span>
                  <span className="font-mono font-bold text-gray-900">
                    ₹{item.rate.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST ({taxRate}%)</span>
                <span>₹{taxAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#082B59] pt-2 border-t">
                <span>Total Due</span>
                <span className="text-[#FF6900]">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoInvoiceBilling;
