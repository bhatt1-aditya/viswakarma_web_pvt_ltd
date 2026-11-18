import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Store,
  Users,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const initialVendorProducts = [
  { id: 1, name: "Industrial Wireless Barcode Scanner", vendor: "TechLogix India", price: 8500, sales: 42, stock: 15 },
  { id: 2, name: "Thermal Receipt Printer High-Speed", vendor: "TechLogix India", price: 4200, sales: 88, stock: 24 },
  { id: 3, name: "Magnetic Smart Card Reader USB", vendor: "TechLogix India", price: 1800, sales: 115, stock: 60 },
];

const initialVendorOrders = [
  { id: "ORD-9801", buyer: "Apollo Health Clinic", item: "Barcode Scanner (x2)", amount: 17000, status: "Pending" },
  { id: "ORD-9802", buyer: "Sunrise Supermarket", item: "Thermal Printer (x1)", amount: 4200, status: "Dispatched" },
  { id: "ORD-9803", buyer: "Metro Logistics Hub", item: "Card Reader (x5)", amount: 9000, status: "Delivered" },
];

const DemoMarketplace = () => {
  const [role, setRole] = useState("vendor"); // "customer" | "vendor"
  const [products, setProducts] = useState(initialVendorProducts);
  const [orders, setOrders] = useState(initialVendorOrders);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");

  const handleReset = () => {
    setRole("vendor");
    setProducts(initialVendorProducts);
    setOrders(initialVendorOrders);
    setNewProdName("");
    setNewProdPrice("");
    toast.success("Marketplace demo reset!");
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const newProd = {
      id: Date.now(),
      name: newProdName,
      vendor: "TechLogix India",
      price: parseInt(newProdPrice),
      sales: 0,
      stock: 10,
    };
    setProducts([newProd, ...products]);
    setNewProdName("");
    setNewProdPrice("");
    toast.success("New product published to marketplace catalog!");
  };

  const toggleOrderStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nextStatus =
            ord.status === "Pending"
              ? "Dispatched"
              : ord.status === "Dispatched"
                ? "Delivered"
                : "Pending";
          return { ...ord, status: nextStatus };
        }
        return ord;
      })
    );
    toast.success(`Order ${orderId} status updated!`);
  };

  const totalSalesVolume = products.reduce((acc, p) => acc + p.price * p.sales, 0);

  return (
    <DemoLayout
      demoNumber={3}
      title="Multi-Vendor Marketplace Demo"
      category="E-Commerce Solutions"
      description="Dual-sided marketplace allowing testing of both buyer marketplace storefront and vendor merchant portal."
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* ROLE SWITCHER */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase">Simulated Role:</span>
            <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200">
              <button
                onClick={() => setRole("vendor")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${role === "vendor"
                    ? "bg-[#0756A5] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Store size={14} />
                <span>Vendor Merchant Portal</span>
              </button>
              <button
                onClick={() => setRole("customer")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${role === "customer"
                    ? "bg-[#0756A5] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Users size={14} />
                <span>Buyer Marketplace View</span>
              </button>
            </div>
          </div>

          <span className="text-xs font-semibold text-gray-400">
            Active Vendor: <span className="text-[#082B59] font-bold">TechLogix India (Verified)</span>
          </span>
        </div>

        {/* VENDOR DASHBOARD VIEW */}
        {role === "vendor" ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium">Gross Merchandise Value</span>
                <p className="text-2xl font-black text-[#0756A5] mt-1">
                  ₹{totalSalesVolume.toLocaleString("en-IN")}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold">Live revenue to date</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium">Active Catalog Listings</span>
                <p className="text-2xl font-black text-[#FF6900] mt-1">{products.length}</p>
                <span className="text-[11px] text-gray-400 font-medium">Across electronics & hardware</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-medium">Pending Fulfillment</span>
                <p className="text-2xl font-black text-amber-500 mt-1">
                  {orders.filter((o) => o.status === "Pending").length} Orders
                </p>
                <span className="text-[11px] text-gray-400 font-medium">Awaiting courier dispatch</span>
              </div>
            </div>

            {/* Product Add & Management */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#082B59]">Add New Vendor Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Wireless Handheld POS Terminal"
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-[#0756A5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 5999"
                      className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-[#0756A5] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#0756A5] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
                  >
                    Publish to Marketplace
                  </button>
                </form>
              </div>

              {/* Order Fulfillment Status Board */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#082B59]">Recent Buyer Orders & Dispatch</h3>
                <div className="space-y-2.5">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0756A5]">{ord.id}</span>
                          <span className="text-gray-700 font-semibold">{ord.buyer}</span>
                        </div>
                        <p className="text-gray-500 text-[11px] mt-0.5">{ord.item}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#FF6900]">
                          ₹{ord.amount.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => toggleOrderStatus(ord.id)}
                          className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase transition-colors ${ord.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : ord.status === "Dispatched"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {ord.status} (Click to Advance)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* BUYER STOREFRONT VIEW */
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#082B59]">Public Marketplace Catalog</h3>
                <p className="text-xs text-gray-500">Products sold by verified commercial vendors.</p>
              </div>
              <span className="text-xs font-bold text-[#FF6900] bg-orange-50 px-3 py-1 rounded-full">
                B2B Wholesale Portal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-gray-200 bg-[#F5F8FC] space-y-3">
                  <div className="h-28 rounded-lg bg-white flex items-center justify-center text-[#0756A5]">
                    <Package size={36} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                      Vendor: {p.vendor}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 mt-0.5">{p.name}</h4>
                    <p className="text-sm font-black text-[#0756A5] mt-1">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    onClick={() => toast.success(`Simulated order placed for ${p.name}!`)}
                    className="w-full py-2 rounded-lg bg-[#FF6900] text-white font-bold text-xs hover:bg-orange-600 transition-colors"
                  >
                    Instant B2B Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default DemoMarketplace;
