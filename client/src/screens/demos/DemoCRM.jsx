import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Plus,
  Phone,
  Clock,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const initialLeads = [
  { id: 1, name: "Dr. Arvind Patel", company: "Metro Heart Institute", email: "arvind@metroheart.in", phone: "+91 98765 12345", stage: "Qualified", value: 450000, nextFollowUp: "Tomorrow, 10:00 AM" },
  { id: 2, name: "Sneha Kapur", company: "Zenith Retail Chains", email: "sneha@zenithretail.com", phone: "+91 98111 22334", stage: "Proposal", value: 850000, nextFollowUp: "18 Nov, 2:30 PM" },
  { id: 3, name: "Rajesh Singhania", company: "Singhania Logistics", email: "rajesh@singhanialogistics.com", phone: "+91 99222 33445", stage: "Won", value: 1200000, nextFollowUp: "Project Kickoff Done" },
  { id: 4, name: "Kunal Verma", company: "FinSmart Advisors", email: "kunal@finsmart.in", phone: "+91 97333 44556", stage: "New", value: 250000, nextFollowUp: "Today, 4:00 PM" },
];

const stages = ["New", "Qualified", "Proposal", "Won"];

const DemoCRM = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    value: "",
    stage: "New",
  });

  const handleReset = () => {
    setLeads(initialLeads);
    setShowAddModal(false);
    toast.success("CRM pipeline reset!");
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;
    const newLead = {
      id: Date.now(),
      name: formData.name,
      company: formData.company,
      email: formData.email || "lead@client.com",
      phone: formData.phone || "+91 90000 00000",
      value: parseInt(formData.value) || 300000,
      stage: formData.stage,
      nextFollowUp: "Scheduled Soon",
    };
    setLeads([newLead, ...leads]);
    setShowAddModal(false);
    setFormData({ name: "", company: "", email: "", phone: "", value: "", stage: "New" });
    toast.success("New lead added to sales pipeline!");
  };

  const advanceStage = (id) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const currentIndex = stages.indexOf(l.stage);
          const nextStage = stages[(currentIndex + 1) % stages.length];
          return { ...l, stage: nextStage };
        }
        return l;
      })
    );
    toast.success("Lead moved to next pipeline stage!");
  };

  const totalPipelineValue = leads.reduce((acc, l) => acc + l.value, 0);

  return (
    <DemoLayout
      demoNumber={4}
      title="CRM & Lead Pipeline System Demo"
      category="Custom Software & Enterprise Solutions"
      description="Interactive customer relationship pipeline with lead stages, contact editing, and follow-up logging."
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* TOP CONTROLS & STATS */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-gray-400 font-medium">Total Pipeline Value</span>
              <p className="text-2xl font-black text-[#0756A5]">
                ₹{totalPipelineValue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="border-l pl-6">
              <span className="text-xs text-gray-400 font-medium">Active Leads</span>
              <p className="text-2xl font-black text-[#FF6900]">{leads.length}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0756A5] text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors"
          >
            <Plus size={15} />
            <span>Add New Contact / Lead</span>
          </button>
        </div>

        {/* KANBAN PIPELINE STAGES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {stages.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            const stageTotal = stageLeads.reduce((a, b) => a + b.value, 0);

            return (
              <div
                key={stage}
                className="bg-gray-50/70 rounded-2xl border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        stage === "Won"
                          ? "bg-emerald-500"
                          : stage === "Proposal"
                          ? "bg-blue-500"
                          : stage === "Qualified"
                          ? "bg-amber-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      {stage}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400">
                    ({stageLeads.length})
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-gray-500">
                  ₹{stageTotal.toLocaleString("en-IN")}
                </p>

                {/* Cards in this stage */}
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-[#082B59]">{lead.name}</h5>
                        <p className="text-[11px] text-gray-500 font-medium">{lead.company}</p>
                      </div>

                      <div className="text-[11px] text-gray-600 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Phone size={11} className="text-[#0756A5]" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} className="text-amber-500" />
                          <span>{lead.nextFollowUp}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#FF6900]">
                          ₹{lead.value.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => advanceStage(lead.id)}
                          className="text-[10px] font-bold text-[#0756A5] hover:text-[#FF6900] flex items-center gap-1"
                          title="Move to next pipeline stage"
                        >
                          <span>Move</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ADD LEAD MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-[#082B59]">Add Prospective Customer</h3>
              <form onSubmit={handleAddLead} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-xs"
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-xs"
                    placeholder="e.g. Apex Industrial Corp"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Deal Value (₹)</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full mt-1 p-2 border rounded-lg text-xs"
                      placeholder="e.g. 500000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Stage</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full mt-1 p-2 border rounded-lg text-xs"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0756A5] rounded-lg"
                  >
                    Save to Pipeline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default DemoCRM;
