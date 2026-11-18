import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";

const initialTables = [
  { tableNo: 1, capacity: 4, status: "Occupied", activeOrder: ["Paneer Tikka (x2)", "Butter Naan (x4)"] },
  { tableNo: 2, capacity: 2, status: "Available", activeOrder: [] },
  { tableNo: 3, capacity: 6, status: "Occupied", activeOrder: ["Biryani Handi (x2)", "Gulab Jamun (x3)"] },
  { tableNo: 4, capacity: 4, status: "Available", activeOrder: [] },
];

const menuItems = [
  { id: 1, name: "Paneer Butter Masala", price: 340, category: "Main Course" },
  { id: 2, name: "Hyderabadi Dum Biryani", price: 380, category: "Rice & Biryani" },
  { id: 3, name: "Garlic Naan Basket", price: 120, category: "Breads" },
  { id: 4, name: "Tandoori Soya Chaap", price: 280, category: "Starters" },
];

const DemoRestaurant = () => {
  const [tables, setTables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState(1);
  const [currentOrder, setCurrentOrder] = useState([
    { name: "Paneer Butter Masala", price: 340, qty: 1 },
    { name: "Garlic Naan Basket", price: 120, qty: 2 },
  ]);

  const handleReset = () => {
    setTables(initialTables);
    setSelectedTable(1);
    setCurrentOrder([
      { name: "Paneer Butter Masala", price: 340, qty: 1 },
      { name: "Garlic Naan Basket", price: 120, qty: 2 },
    ]);
    toast.success("Restaurant POS demo reset!");
  };

  const addItemToOrder = (item) => {
    setCurrentOrder((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
    toast.success(`Added ${item.name} to Table ${selectedTable} order!`);
  };

  const subtotal = currentOrder.reduce((acc, i) => acc + i.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.05); // 5% restaurant GST
  const grandTotal = subtotal + gst;

  return (
    <DemoLayout
      demoNumber={9}
      title="Restaurant POS & Kitchen System Demo"
      category="Custom Software & Enterprise Solutions"
      description="Interactive restaurant suite with visual table layout, digital touch menu, live Kitchen Order Ticket (KOT) board, and bill generator."
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TABLE MAP & TOUCH MENU (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Table Map */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
              Dining Table Layout & Floor Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {tables.map((t) => (
                <div
                  key={t.tableNo}
                  onClick={() => setSelectedTable(t.tableNo)}
                  className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedTable === t.tableNo
                      ? "border-[#0756A5] bg-blue-50/80 shadow-md ring-2 ring-[#0756A5]/20"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <p className="font-bold text-sm text-gray-900">Table {t.tableNo}</p>
                  <p className="text-[10px] text-gray-500">{t.capacity} Guests</p>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      t.status === "Occupied"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Menu */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
              Touch Menu — Click to Add to Table {selectedTable}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuItems.map((m) => (
                <div
                  key={m.id}
                  onClick={() => addItemToOrder(m)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-[#FF6900] bg-[#F5F8FC] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{m.name}</h4>
                    <span className="text-[10px] text-gray-400">{m.category}</span>
                  </div>
                  <span className="text-xs font-black text-[#FF6900]">₹{m.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE BILL & KOT SUMMARY (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-[#082B59]">Table {selectedTable} KOT Bill</h3>
              <p className="text-[11px] text-gray-400">Kitchen Order Ticket</p>
            </div>
            <Receipt size={20} className="text-[#0756A5]" />
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {currentOrder.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                <span className="text-gray-800 font-medium">
                  {item.name} x {item.qty}
                </span>
                <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-3 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Restaurant GST (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#082B59] pt-2 border-t">
              <span>Total Payable</span>
              <span className="text-[#FF6900]">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => {
              toast.success(`KOT printed for Kitchen & Receipt generated for Table ${selectedTable}!`);
              setCurrentOrder([]);
            }}
            className="w-full py-2.5 rounded-xl bg-[#0756A5] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors"
          >
            Dispatch KOT & Settle Bill
          </button>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoRestaurant;
