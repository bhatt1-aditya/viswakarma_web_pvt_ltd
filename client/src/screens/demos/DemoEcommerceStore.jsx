import React, { useState, useMemo } from "react";
import DemoLayout from "./DemoLayout";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle2,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const defaultProducts = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", category: "Electronics", price: 14999, stock: 12, rating: 4.8 },
  { id: 2, name: "Minimalist Ergonomic Workspace Chair", category: "Furniture", price: 18499, stock: 8, rating: 4.9 },
  { id: 3, name: "Smart Fitness Tracker Band Pro", category: "Wearables", price: 3499, stock: 25, rating: 4.5 },
  { id: 4, name: "Ultra-Fast 65W GaN Laptop Charger", category: "Electronics", price: 2199, stock: 40, rating: 4.7 },
  { id: 5, name: "Full-Grain Leather Executive Briefcase", category: "Accessories", price: 6999, stock: 15, rating: 4.6 },
  { id: 6, name: "Mechanical RGB Gaming Keyboard", category: "Electronics", price: 4799, stock: 19, rating: 4.8 },
];

const DemoEcommerceStore = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [cart, setCart] = useState([
    { ...defaultProducts[0], qty: 1 },
    { ...defaultProducts[2], qty: 2 },
  ]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const handleReset = () => {
    setProducts(defaultProducts);
    setCart([
      { ...defaultProducts[0], qty: 1 },
      { ...defaultProducts[2], qty: 2 },
    ]);
    setSearch("");
    setSelectedCat("all");
    setCheckingOut(false);
    setOrderComplete(null);
    toast.success("E-Commerce demo reset to initial catalog!");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.error("Item removed from cart");
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cart]);

  const tax = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal > 0 ? subtotal + tax : 0;

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setOrderComplete({
        orderId,
        items: [...cart],
        amount: grandTotal,
        date: new Date().toLocaleString(),
      });
      setCart([]);
      toast.success("Order Placed Successfully!");
    }, 1500);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCat === "all" || p.category === selectedCat;
      const matchSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, search]);

  return (
    <DemoLayout
      demoNumber={2}
      title="E-Commerce Store & Checkout Demo"
      category="E-Commerce Solutions"
      description="Full retail shopping experience with live product filtering, add-to-cart, cart totals, and simulated checkout."
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PRODUCTS CATALOG COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#0756A5] focus:outline-none"
              />
            </div>

            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["all", "Electronics", "Furniture", "Wearables", "Accessories"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                    selectedCat === cat
                      ? "bg-[#0756A5] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="h-32 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                    <Package size={48} className="text-[#0756A5]/40" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    {prod.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#082B59] line-clamp-2">{prod.name}</h4>
                  <p className="text-sm font-black text-[#FF6900]">₹{prod.price.toLocaleString("en-IN")}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-medium">In stock: {prod.stock}</span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="p-2 rounded-lg bg-[#0756A5] hover:bg-[#082B59] text-white transition-colors"
                    title="Add to Cart"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHOPPING CART & CHECKOUT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-[#0756A5]" />
                <h3 className="text-base font-bold text-[#082B59]">Shopping Cart</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0756A5]">
                {cart.reduce((a, b) => a + b.qty, 0)} items
              </span>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <ShoppingCart size={32} className="mx-auto text-gray-300" />
                <p className="text-xs">Your shopping cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                  >
                    <div className="space-y-0.5 max-w-[150px]">
                      <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-[#FF6900] font-semibold">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="p-1 text-gray-500 hover:text-gray-800"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 font-bold text-xs">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="p-1 text-gray-500 hover:text-gray-800"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price Breakdown */}
            {cart.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-gray-800">₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">Free Delivery</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#082B59] pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-[#FF6900]">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-glowOrange transition-all disabled:opacity-50"
                >
                  {checkingOut ? "Processing Payment..." : "Simulate Instant Checkout"}
                </button>
              </div>
            )}

            {/* Order Confirmation Screen */}
            {orderComplete && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Simulated Order Placed!</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Order ID: <span className="font-mono font-bold">{orderComplete.orderId}</span>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Total Paid: <span className="font-bold">₹{orderComplete.amount.toLocaleString("en-IN")}</span>
                </p>
                <button
                  onClick={() => setOrderComplete(null)}
                  className="text-[10px] font-bold text-emerald-800 underline block pt-1"
                >
                  Dismiss Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoEcommerceStore;
