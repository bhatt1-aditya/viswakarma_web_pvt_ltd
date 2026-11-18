import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import toast from "react-hot-toast";

const initialPurchaseOrders = [
  { poNumber: "PO-2024-101", supplier: "Hindalco Industrial Metals", items: "Aluminum Sheets (500 kg)", amount: 345000, status: "Received" },
  { poNumber: "PO-2024-102", supplier: "Schneider Electricals", items: "Circuit Breakers (x80)", amount: 180000, status: "In Transit" },
  { poNumber: "PO-2024-103", supplier: "Supreme Polymers Ltd", items: "Injection Molding Granules", amount: 260000, status: "Approved" },
];

const initialStockItems = [
  { sku: "SKU-901", name: "High-Tensile Fasteners (Grade 8)", qty: 4500, reorderPoint: 1000, unitPrice: 24 },
  { sku: "SKU-902", name: "Copper Bushings 25mm", qty: 320, reorderPoint: 500, unitPrice: 160 },
  { sku: "SKU-903", name: "Hydraulic Seals (Viton)", qty: 850, reorderPoint: 200, unitPrice: 85 },
];

const DemoERP = () => {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "inventory" | "procurement"
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [stockItems, setStockItems] = useState(initialStockItems);
  const [newSupplier, setNewSupplier] = useState("");
  const [newPoAmount, setNewPoAmount] = useState("");
  const [newPoItems, setNewPoItems] = useState("");

  const handleReset = () => {
    setActiveTab("overview");
    setPurchaseOrders(initialPurchaseOrders);
    setStockItems(initialStockItems);
    toast.success("ERP system demo reset to baseline!");
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    if (!newSupplier || !newPoAmount) return;
    const poNumber = "PO-2024-" + Math.floor(100 + Math.random() * 900);
    const newPO = {
      poNumber,
      supplier: newSupplier,
      items: newPoItems || "Industrial Raw Supplies",
      amount: parseInt(newPoAmount),
      status: "Approved",
    };
    setPurchaseOrders([newPO, ...purchaseOrders]);
    setNewSupplier("");
    setNewPoAmount("");
    setNewPoItems("");
    toast.success(`Purchase Order ${poNumber} created and dispatched!`);
  };

  return (
    <DemoLayout
      demoNumber={5}
      title="Enterprise ERP Software Demo"
      category="Custom Software & Enterprise Solutions"
      description="Resource planning suite showing inventory tracking, procurement orders, sales ledgers, and executive insights."
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* TOP TAB CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex gap-2">
            {[
              { id: "overview", label: "Executive Dashboard" },
              { id: "procurement", label: "Procurement & POs" },
              { id: "inventory", label: "Warehouse Inventory" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0756A5] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-500 font-medium">
            Fiscal Period: <span className="font-bold text-[#082B59]">Q4 FY2026-27</span>
          </span>
        </div>

        {/* OVERVIEW / DASHBOARD TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-400 font-medium">Monthly Sales Run-Rate</span>
                <p className="text-2xl font-black text-[#0756A5] mt-1">₹48.2 Lakhs</p>
                <span className="text-[11px] text-emerald-600 font-semibold">+14.2% vs target</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-400 font-medium">Procurement Spend</span>
                <p className="text-2xl font-black text-[#FF6900] mt-1">
                  ₹{(purchaseOrders.reduce((a, b) => a + b.amount, 0) / 100000).toFixed(1)} Lakhs
                </p>
                <span className="text-[11px] text-gray-400 font-medium">{purchaseOrders.length} active orders</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-400 font-medium">Warehouse Items Tracked</span>
                <p className="text-2xl font-black text-purple-600 mt-1">
                  {stockItems.reduce((a, b) => a + b.qty, 0).toLocaleString()} Units
                </p>
                <span className="text-[11px] text-gray-400 font-medium">Across 3 regional hubs</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-400 font-medium">Order Fulfillment Rate</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">98.4%</p>
                <span className="text-[11px] text-emerald-600 font-semibold">On-time in-full (OTIF)</span>
              </div>
            </div>

            {/* Recent Procurement Orders Summary */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#082B59]">Recent Purchase Orders</h3>
                <button
                  onClick={() => setActiveTab("procurement")}
                  className="text-xs font-bold text-[#0756A5] hover:underline"
                >
                  Manage Procurement →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">PO Number</th>
                      <th className="p-3">Supplier</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {purchaseOrders.map((po) => (
                      <tr key={po.poNumber} className="hover:bg-gray-50/70">
                        <td className="p-3 font-mono font-bold text-[#0756A5]">{po.poNumber}</td>
                        <td className="p-3 font-semibold text-gray-800">{po.supplier}</td>
                        <td className="p-3 text-gray-600">{po.items}</td>
                        <td className="p-3 font-bold text-gray-900">
                          ₹{po.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              po.status === "Received"
                                ? "bg-emerald-100 text-emerald-700"
                                : po.status === "In Transit"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROCUREMENT TAB */}
        {activeTab === "procurement" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#082B59]">Generate Purchase Order</h3>
              <form onSubmit={handleCreatePO} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Vendor / Supplier</label>
                  <input
                    type="text"
                    required
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    placeholder="e.g. Tata Steel BSL Ltd"
                    className="mt-1 w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Line Items Description</label>
                  <input
                    type="text"
                    required
                    value={newPoItems}
                    onChange={(e) => setNewPoItems(e.target.value)}
                    placeholder="e.g. Cold Rolled Coils (10 MT)"
                    className="mt-1 w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">PO Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPoAmount}
                    onChange={(e) => setNewPoAmount(e.target.value)}
                    placeholder="e.g. 485000"
                    className="mt-1 w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0756A5] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors"
                >
                  Authorize Purchase Order
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-[#082B59]">Active Purchase Order Registry</h3>
              <div className="space-y-2">
                {purchaseOrders.map((po) => (
                  <div key={po.poNumber} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#0756A5]">{po.poNumber}</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{po.supplier}</p>
                      <p className="text-[11px] text-gray-500">{po.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{po.amount.toLocaleString("en-IN")}</p>
                      <span className="text-[10px] font-bold text-emerald-600">{po.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#082B59]">Warehouse Stock Levels & Reorder Triggers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3">Reorder Point</th>
                    <th className="p-3">Unit Valuation</th>
                    <th className="p-3">Inventory Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stockItems.map((item) => {
                    const isLow = item.qty <= item.reorderPoint;
                    return (
                      <tr key={item.sku} className="hover:bg-gray-50/70">
                        <td className="p-3 font-mono font-bold text-gray-700">{item.sku}</td>
                        <td className="p-3 font-semibold text-gray-900">{item.name}</td>
                        <td className="p-3 font-bold text-gray-900">{item.qty} units</td>
                        <td className="p-3 text-gray-500">{item.reorderPoint} units</td>
                        <td className="p-3 font-semibold text-gray-700">₹{item.unitPrice}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isLow
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {isLow ? "Low Stock (Trigger Reorder)" : "Optimal Stock"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default DemoERP;
