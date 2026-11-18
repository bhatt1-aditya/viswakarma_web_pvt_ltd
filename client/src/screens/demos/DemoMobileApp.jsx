import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Home,
  Grid,
  ShoppingCart,
  User,
  Plus,
  Battery,
  Wifi,
  Signal,
} from "lucide-react";
import toast from "react-hot-toast";

const appProducts = [
  { id: 1, name: "Noise Pro ANC Earbuds", price: 2999, category: "Audio" },
  { id: 2, name: "Smart Health Ring V2", price: 6499, category: "Fitness" },
  { id: 3, name: "Fast Wireless Charging Pad", price: 1299, category: "Power" },
];

const DemoMobileApp = () => {
  const [activeTab, setActiveTab] = useState("home"); // "home" | "catalog" | "cart" | "profile"
  const [mobileCart, setMobileCart] = useState([{ ...appProducts[0], qty: 1 }]);

  const handleReset = () => {
    setActiveTab("home");
    setMobileCart([{ ...appProducts[0], qty: 1 }]);
    toast.success("Mobile simulator reset!");
  };

  const addAppItem = (prod) => {
    setMobileCart((prev) => [...prev, { ...prod, qty: 1 }]);
    toast.success(`Added ${prod.name} to mobile cart!`);
  };

  return (
    <DemoLayout
      demoNumber={17}
      title="Mobile Application Demo"
      category="Mobile Application Development"
      description="Realistic smartphone mockup frame with bottom tab navigation, catalog, interactive cart, and user profile screen."
      onReset={handleReset}
    >
      <div className="flex justify-center items-center py-6">
        {/* REALISTIC SMARTPHONE DEVICE CONTAINER */}
        <div className="w-[340px] h-[660px] bg-gray-900 rounded-[48px] p-3 shadow-2xl border-4 border-gray-800 relative">
          {/* Top Speaker / Dynamic Island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-900/60 ml-auto mr-2" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="w-full h-full bg-[#F5F8FC] rounded-[38px] overflow-hidden flex flex-col relative">
            {/* Status Bar */}
            <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[10px] text-gray-800 font-bold bg-white">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-gray-700">
                <Signal size={11} />
                <Wifi size={11} />
                <Battery size={13} />
              </div>
            </div>

            {/* SCREEN BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Screen: Home */}
              {activeTab === "home" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#FF8A00]">
                      Special Flash Deal
                    </span>
                    <h4 className="text-base font-extrabold leading-tight">
                      Next-Gen Sound Experience
                    </h4>
                    <p className="text-[11px] text-blue-200">Get 20% off with coupon VISHWA20</p>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-[#082B59] mb-2">Featured Products</h5>
                    <div className="space-y-2">
                      {appProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between shadow-xs"
                        >
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">{p.category}</span>
                            <h6 className="text-xs font-bold text-gray-900">{p.name}</h6>
                            <p className="text-xs font-bold text-[#FF6900]">₹{p.price}</p>
                          </div>
                          <button
                            onClick={() => addAppItem(p)}
                            className="p-1.5 bg-[#0756A5] text-white rounded-lg"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Screen: Catalog */}
              {activeTab === "catalog" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#082B59]">All Mobile Catalog</h4>
                  {appProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-white rounded-xl border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold">{p.name}</span>
                        <span className="text-xs font-bold text-[#0756A5]">₹{p.price}</span>
                      </div>
                      <button
                        onClick={() => addAppItem(p)}
                        className="w-full py-1.5 bg-[#0756A5] text-white text-[11px] font-bold rounded-lg"
                      >
                        Add to Mobile Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Screen: Cart */}
              {activeTab === "cart" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#082B59]">Your Mobile Cart</h4>
                  {mobileCart.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">Cart is empty.</p>
                  ) : (
                    <div className="space-y-2">
                      {mobileCart.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border flex justify-between text-xs">
                          <span className="font-semibold text-gray-800">{item.name}</span>
                          <span className="font-bold text-[#FF6900]">₹{item.price}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t flex justify-between font-bold text-xs">
                        <span>Total:</span>
                        <span>₹{mobileCart.reduce((a, b) => a + b.price, 0)}</span>
                      </div>
                      <button
                        onClick={() => {
                          toast.success("Mobile order simulated via UPI!");
                          setMobileCart([]);
                        }}
                        className="w-full py-2 bg-[#FF6900] text-white text-xs font-bold rounded-xl"
                      >
                        Pay via UPI (GPay/PhonePe)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Screen: Profile */}
              {activeTab === "profile" && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0756A5] text-white flex items-center justify-center mx-auto text-xl font-bold">
                    AS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Ananya Sharma</h4>
                    <p className="text-[10px] text-gray-400">ananya.s@gmail.com</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border text-left text-xs space-y-2">
                    <p className="text-[11px] font-bold text-gray-700">Order History (4 Orders)</p>
                    <p className="text-[11px] font-bold text-gray-700">Saved Shipping Addresses (2)</p>
                    <p className="text-[11px] font-bold text-gray-700">UPI Payment Cards</p>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM NAVIGATION TABS */}
            <div className="bg-white border-t border-gray-100 py-2.5 px-6 flex justify-between items-center text-gray-400">
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center gap-0.5 ${activeTab === "home" ? "text-[#0756A5] font-bold" : ""}`}
              >
                <Home size={16} />
                <span className="text-[9px]">Home</span>
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`flex flex-col items-center gap-0.5 ${activeTab === "catalog" ? "text-[#0756A5] font-bold" : ""}`}
              >
                <Grid size={16} />
                <span className="text-[9px]">Catalog</span>
              </button>
              <button
                onClick={() => setActiveTab("cart")}
                className={`flex flex-col items-center gap-0.5 relative ${activeTab === "cart" ? "text-[#0756A5] font-bold" : ""}`}
              >
                <ShoppingCart size={16} />
                <span className="text-[9px]">Cart</span>
                {mobileCart.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#FF6900] text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                    {mobileCart.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center gap-0.5 ${activeTab === "profile" ? "text-[#0756A5] font-bold" : ""}`}
              >
                <User size={16} />
                <span className="text-[9px]">Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoMobileApp;
