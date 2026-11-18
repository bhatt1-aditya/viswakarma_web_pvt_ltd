import React, { useState, useMemo } from "react";
import DemoLayout from "./DemoLayout";
import {
  Building,
  MapPin,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const initialProperties = [
  { id: 1, title: "The Grand Vista Luxury Penthouse", location: "Sector 150, Noida", price: 28500000, bhk: "4 BHK", area: "3,850 sq.ft", baths: 4, type: "Apartment" },
  { id: 2, name: "EcoGreen Smart Residency", title: "EcoGreen Smart Residency", location: "Golf Course Ext., Gurugram", price: 16500000, bhk: "3 BHK", area: "2,100 sq.ft", baths: 3, type: "Apartment" },
  { id: 3, name: "Regent Waterfront Villa", title: "Regent Waterfront Villa", location: "North Goa, Coastal Hub", price: 45000000, bhk: "5 BHK", area: "5,200 sq.ft", baths: 5, type: "Villa" },
  { id: 4, name: "Urban Square Commercial Suite", title: "Urban Square Commercial Suite", location: "Whitefield, Bengaluru", price: 12000000, bhk: "Office", area: "1,450 sq.ft", baths: 2, type: "Commercial" },
];

const DemoRealEstate = () => {
  const [properties, setProperties] = useState(initialProperties);
  const [bhkFilter, setBhkFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [tourName, setTourName] = useState("");
  const [tourPhone, setTourPhone] = useState("");

  const handleReset = () => {
    setProperties(initialProperties);
    setBhkFilter("all");
    setSelectedProperty(null);
    setTourName("");
    setTourPhone("");
    toast.success("Real Estate demo reset!");
  };

  const handleBookVisit = (e) => {
    e.preventDefault();
    toast.success(`Site visit requested for ${selectedProperty?.title}! Broker notified.`);
    setSelectedProperty(null);
  };

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      return bhkFilter === "all" || p.bhk === bhkFilter;
    });
  }, [properties, bhkFilter]);

  return (
    <DemoLayout
      demoNumber={10}
      title="Real Estate & Property Portal Demo"
      category="Custom Software & Enterprise Solutions"
      description="Interactive property marketplace with interactive filters, floor plan previews, instant viewing booking, and agent inquiries."
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* FILTERS BAR */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Unit Configuration:</span>
            <div className="flex gap-1.5">
              {["all", "3 BHK", "4 BHK", "5 BHK", "Office"].map((bhk) => (
                <button
                  key={bhk}
                  onClick={() => setBhkFilter(bhk)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    bhkFilter === bhk
                      ? "bg-[#0756A5] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {bhk}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-[#082B59]">{filtered.length} Prime Properties</span>
          </span>
        </div>

        {/* PROPERTIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-cardHover hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-40 rounded-xl bg-gradient-to-br from-[#082B59] to-[#0756A5] flex items-center justify-center text-white/50 relative">
                  <Building size={48} />
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#082B59]">
                    {prop.type}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-black text-[#FF6900]">
                    ₹{(prop.price / 10000000).toFixed(2)} Cr
                  </span>
                  <h4 className="text-sm font-bold text-[#082B59] line-clamp-1 mt-0.5">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={11} className="text-[#0756A5]" />
                    <span>{prop.location}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-[11px] text-gray-600 text-center">
                  <div>
                    <span className="font-bold text-gray-900 block">{prop.bhk}</span>
                    <span className="text-[9px] text-gray-400">Layout</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{prop.baths}</span>
                    <span className="text-[9px] text-gray-400">Baths</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{prop.area}</span>
                    <span className="text-[9px] text-gray-400">Super Area</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3">
                <button
                  onClick={() => setSelectedProperty(prop)}
                  className="w-full py-2 rounded-xl bg-[#0756A5] hover:bg-[#082B59] text-white text-xs font-bold transition-colors"
                >
                  Schedule Site Visit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PROPERTY DETAILS & BOOKING MODAL */}
        {selectedProperty && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-[#082B59]">{selectedProperty.title}</h3>
                <button onClick={() => setSelectedProperty(null)} className="text-gray-400 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <p className="text-xs text-gray-600">
                Location: <span className="font-bold text-gray-800">{selectedProperty.location}</span> • Valuation: <span className="font-bold text-[#FF6900]">₹{(selectedProperty.price / 10000000).toFixed(2)} Cr</span>
              </p>

              <form onSubmit={handleBookVisit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    placeholder="e.g. Alok Singhal"
                    className="mt-1 w-full p-2.5 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={tourPhone}
                    onChange={(e) => setTourPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="mt-1 w-full p-2.5 border rounded-lg text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF6900] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-orange-600"
                >
                  Confirm Physical Site Walkthrough
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default DemoRealEstate;
