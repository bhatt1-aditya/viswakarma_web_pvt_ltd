import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Plus,
  Minus,
  AlertTriangle,
  History,
} from "lucide-react";
import toast from "react-hot-toast";

const initialInventory = [
  { sku: "INV-101", name: "Premium HDMI 2.1 Optical Cable (3m)", qty: 45, minThreshold: 20, location: "Bay A-1" },
  { sku: "INV-102", name: "Type-C Multiport Hub 7-in-1", qty: 8, minThreshold: 15, location: "Bay B-4" },
  { sku: "INV-103", name: "Wireless Silent Optical Mouse", qty: 62, minThreshold: 25, location: "Bay A-3" },
  { sku: "INV-104", name: "Cat6 Gigabit Ethernet Patch Cable (10m)", qty: 5, minThreshold: 10, location: "Bay C-2" },
];

const initialLogs = [
  { id: 1, action: "Stock Dispatched (-5 units)", sku: "INV-101", time: "10 mins ago" },
  { id: 2, action: "Vendor Delivery (+20 units)", sku: "INV-103", time: "1 hour ago" },
];

const DemoInventory = () => {
  const [items, setItems] = useState(initialInventory);
  const [logs, setLogs] = useState(initialLogs);

  const handleReset = () => {
    setItems(initialInventory);
    setLogs(initialLogs);
    toast.success("Inventory demo reset to initial state!");
  };

  const adjustStock = (sku, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );

    const logEntry = {
      id: Date.now(),
      action: `Adjusted (${delta > 0 ? "+" : ""}${delta} units)`,
      sku,
      time: "Just now",
    };
    setLogs([logEntry, ...logs.slice(0, 5)]);
    toast.success(`Updated stock for ${sku}!`);
  };

  return (
    <DemoLayout
      demoNumber={14}
      title="Inventory & Warehouse Control Demo"
      category="Custom Software & Enterprise Solutions"
      description="Smart inventory manager with live SKU stock adjustment, automatic low-stock alerts, and warehouse audit logs."
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INVENTORY ITEMS TABLE (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-bold text-[#082B59]">Warehouse Stock Ledger</h3>
            <span className="text-xs font-bold text-gray-400">
              {items.filter((i) => i.qty <= i.minThreshold).length} Low Stock Alerts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3 text-center">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => {
                  const isLow = item.qty <= item.minThreshold;
                  return (
                    <tr key={item.sku} className="hover:bg-gray-50/70">
                      <td className="p-3 font-mono font-bold text-[#0756A5]">{item.sku}</td>
                      <td className="p-3 font-semibold text-gray-900">
                        {item.name}
                        {isLow && (
                          <span className="ml-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <AlertTriangle size={10} /> Low
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-500 font-mono">{item.location}</td>
                      <td className="p-3 font-black text-sm text-gray-900">{item.qty}</td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => adjustStock(item.sku, -1)}
                            className="p-1 hover:bg-gray-100 text-gray-600"
                            title="Decrement 1"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 font-mono font-bold">{item.qty}</span>
                          <button
                            onClick={() => adjustStock(item.sku, 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600"
                            title="Increment 1"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AUDIT LOG (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <History size={18} className="text-[#FF6900]" />
            <h3 className="text-base font-bold text-[#082B59]">Movement Audit Trail</h3>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-0.5">
                <span className="font-mono font-bold text-[#0756A5]">{log.sku}</span>
                <p className="text-gray-800 font-medium">{log.action}</p>
                <span className="text-[10px] text-gray-400 block">{log.time}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => toast.success("Automated supplier reorder triggered for all items below safety threshold!")}
            className="w-full py-2.5 rounded-xl bg-[#0756A5] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors"
          >
            Auto-Trigger Supplier Reorders
          </button>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoInventory;
