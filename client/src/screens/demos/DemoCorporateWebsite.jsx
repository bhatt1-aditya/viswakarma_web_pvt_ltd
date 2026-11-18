import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const initialServices = [
  { id: 1, title: "Enterprise Cloud Platforms", desc: "Decoupled cloud applications engineered with microservices." },
  { id: 2, title: "Modern Web Systems", desc: "Sub-second React & Next.js corporate portals with 99+ Core Web Vitals." },
  { id: 3, title: "AI Operations & Data", desc: "Automated business workflows and real-time predictive analytics." },
];

const DemoCorporateWebsite = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleReset = () => {
    setActiveTab("overview");
    setInquirySent(false);
    setFormData({ name: "", email: "", message: "" });
    toast.success("Corporate website demo reset!");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
    toast.success("Simulated corporate inquiry sent successfully!");
  };

  return (
    <DemoLayout
      demoNumber={1}
      title="Corporate Website Demo"
      category="Website Design & Development"
      description="Modern responsive business website with dynamic sections, service showcase, and inquiry workflows."
      onReset={handleReset}
    >
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        {/* Mock Browser Header */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            <span className="text-xs font-mono text-gray-500 ml-2">
              https://demo.corporation.vishwakarmaweb.com
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            {["overview", "services", "contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-3 py-1 rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-[#0756A5] text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Corporate Website Content */}
        {activeTab === "overview" && (
          <div className="p-8 md:p-12 space-y-10">
            {/* Hero */}
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6900] bg-orange-50 px-3 py-1 rounded-full">
                Apex Enterprises Group
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59] leading-tight">
                Architecting Next-Generation Digital Infrastructure for Global Scale.
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Empowering Fortune 500 enterprises and hyper-growth scale-ups with dependable cloud solutions, custom web portals, and 24/7 technical assurance.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("services")}
                  className="px-5 py-2.5 rounded-xl bg-[#0756A5] text-white text-xs font-bold hover:bg-blue-700"
                >
                  Our Divisions
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
                >
                  Request Consultation
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-black text-[#0756A5]">99.99%</p>
                <p className="text-xs text-gray-500 font-medium">Uptime Guarantee</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-black text-[#FF6900]">15+ Yrs</p>
                <p className="text-xs text-gray-500 font-medium">Industry Legacy</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-black text-emerald-600">ISO 27001</p>
                <p className="text-xs text-gray-500 font-medium">Certified Security</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-black text-purple-600">24 / 7</p>
                <p className="text-xs text-gray-500 font-medium">Global NOC Support</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="p-8 md:p-12 space-y-6">
            <h3 className="text-2xl font-bold text-[#082B59]">Corporate Divisions & Capabilities</h3>
            <p className="text-xs text-gray-500">Select any division to view operational scope.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {initialServices.map((srv) => (
                <div key={srv.id} className="p-6 rounded-xl border border-gray-200 bg-[#F5F8FC] space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0756A5] text-white flex items-center justify-center font-bold">
                    0{srv.id}
                  </div>
                  <h4 className="text-base font-bold text-[#082B59]">{srv.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{srv.desc}</p>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="text-xs font-bold text-[#0756A5] hover:text-[#FF6900] flex items-center gap-1 pt-2"
                  >
                    <span>Inquire this capability</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="p-8 md:p-12 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-[#082B59] text-center">Corporate Inquiry Desk</h3>
            <p className="text-xs text-gray-500 text-center">
              Submit your corporate advisory requirement.
            </p>

            {inquirySent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
                <h4 className="text-base font-bold text-emerald-800">Inquiry Transmitted Successfully</h4>
                <p className="text-xs text-emerald-700">
                  A representative will follow up via email within 2 hours.
                </p>
                <button
                  onClick={() => setInquirySent(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Executive Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#0756A5] focus:outline-none"
                    placeholder="e.g. Vikramaditya Singh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#0756A5] focus:outline-none"
                    placeholder="vikram@enterprise.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Strategic Requirement</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#0756A5] focus:outline-none"
                    placeholder="Describe your technical or organizational need..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0756A5] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default DemoCorporateWebsite;
