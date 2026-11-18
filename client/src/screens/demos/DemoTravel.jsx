import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Compass,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const initialPackages = [
  { id: 1, name: "Kashmir Paradise Valley Expedition", duration: "6 Days / 5 Nights", pricePerPerson: 28500, locations: "Srinagar • Gulmarg • Pahalgam", rating: 4.9 },
  { id: 2, name: "Kerala Backwaters & Tea Hills Retreat", duration: "5 Days / 4 Nights", pricePerPerson: 22000, locations: "Munnar • Alleppey • Kochi", rating: 4.8 },
  { id: 3, name: "Royal Rajasthan Heritage Circuit", duration: "7 Days / 6 Nights", pricePerPerson: 34000, locations: "Jaipur • Jodhpur • Udaipur", rating: 4.9 },
];

const DemoTravel = () => {
  const packages = initialPackages;
  const [selectedPkg, setSelectedPkg] = useState(initialPackages[0]);
  const [travelers, setTravelers] = useState(2);
  const [travelDate, setTravelDate] = useState("2026-12-15");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleReset = () => {
    setSelectedPkg(initialPackages[0]);
    setTravelers(2);
    setTravelDate("2026-12-15");
    setBookingConfirmed(false);
    toast.success("Travel booking demo reset!");
  };

  const totalCost = selectedPkg.pricePerPerson * travelers;

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
    toast.success("Simulated reservation registered!");
  };

  return (
    <DemoLayout
      demoNumber={11}
      title="Travel & Tour Booking Engine Demo"
      category="Website Design & Development"
      description="Holiday booking engine showcasing destination cards, itinerary breakdown, passenger count pricing, and booking summary."
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PACKAGES CATALOG (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-[#082B59]">Curated Tour Packages</h3>
          <div className="space-y-3">
            {packages.map((pkg) => {
              const isSelected = selectedPkg.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPkg(pkg);
                    setBookingConfirmed(false);
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#0756A5] bg-blue-50/60 shadow-md ring-2 ring-[#0756A5]/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF6900] bg-orange-50 px-2.5 py-0.5 rounded-full">
                      {pkg.duration}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      ₹{pkg.pricePerPerson.toLocaleString("en-IN")} / person
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#082B59] mt-2">{pkg.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <MapPin size={13} className="text-[#0756A5]" />
                    <span>{pkg.locations}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOOKING SUMMARY & CALCULATOR (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Compass size={20} className="text-[#0756A5]" />
            <h3 className="text-base font-bold text-[#082B59]">Reservation Calculator</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700">Selected Package</label>
              <p className="text-gray-900 font-semibold mt-0.5">{selectedPkg.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700">Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700">Passenger Count</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="mt-1 w-full p-2 border rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} Travelers</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Base Fare (x{travelers})</span>
                <span className="font-bold text-gray-900">₹{totalCost.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{Math.round(totalCost * 0.05).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#082B59] pt-2 border-t">
                <span>Total Package Price</span>
                <span className="text-[#FF6900]">
                  ₹{Math.round(totalCost * 1.05).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {bookingConfirmed ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 size={24} className="mx-auto text-emerald-600" />
                <p className="text-xs font-bold text-emerald-800">Reservation Confirmed!</p>
                <p className="text-[11px] text-emerald-600">
                  Voucher sent to registered passenger email.
                </p>
              </div>
            ) : (
              <button
                onClick={handleConfirmBooking}
                className="w-full mt-2 py-3 rounded-xl bg-[#0756A5] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors"
              >
                Confirm Booking & Download Voucher
              </button>
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoTravel;
