import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  Globe,
  ShoppingCart,
  Smartphone,
  Database,
  Bot,
  Cloud,
  Palette,
  Cpu,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";
import { INDIAN_STATES } from "../../utils/indianStates";

const PROJECT_TYPES = [
  {
    id: "web",
    title: "Web Application / SaaS",
    category: "Website Design & Development",
    icon: Globe,
    desc: "Custom portals, React/Next.js dashboards & platforms",
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Marketplace",
    category: "E-Commerce Solutions",
    icon: ShoppingCart,
    desc: "Multi-vendor marketplaces, payment gateways, catalogs",
  },
  {
    id: "mobile",
    title: "Mobile App (iOS & Android)",
    category: "Mobile App Development",
    icon: Smartphone,
    desc: "Flutter, React Native & Native mobile systems",
  },
  {
    id: "erp",
    title: "Enterprise CRM & ERP",
    category: "Enterprise Software & ERP",
    icon: Database,
    desc: "Internal tooling, inventory, HRMS, billing & workflows",
  },
  {
    id: "ai",
    title: "AI Chatbot & Automation",
    category: "AI, ML & Automation",
    icon: Bot,
    desc: "LLMs, predictive models, WhatsApp bots & process RPA",
  },
  {
    id: "cloud",
    title: "Cloud & DevOps Architecture",
    category: "Cloud, Hosting & DevOps",
    icon: Cloud,
    desc: "AWS/GCP infrastructure, Kubernetes, CI/CD pipelines",
  },
  {
    id: "uiux",
    title: "UI/UX Design & Prototyping",
    category: "UI/UX & Product Design",
    icon: Palette,
    desc: "Figma design systems, wireframes, user testing",
  },
  {
    id: "api",
    title: "API & Backend Integration",
    category: "API & Backend Engineering",
    icon: Cpu,
    desc: "Microservices, REST/GraphQL gateways & secure databases",
  },
  {
    id: "custom",
    title: "Custom Enterprise Solution",
    category: "Digital Transformation & Consulting",
    icon: Layers,
    desc: "Tailored multi-system digital transformation",
  },
];

const RequestQuote = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get("service") || searchParams.get("project") || "";

  const [selectedProjectType, setSelectedProjectType] = useState(
    prefilledService ? "custom" : "web"
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "Delhi (NCR)",
    companyName: "",
    serviceCategory: "Website Design & Development",
    serviceName: prefilledService || "Web Application / SaaS",
    projectBudget: "₹1,00,000 – ₹3,00,000",
    timeline: "1-2 Months",
    projectDescription: prefilledService
      ? `Inquiring about ${prefilledService}. Please prepare an architectural proposal.`
      : "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectProjectType = (proj) => {
    setSelectedProjectType(proj.id);
    setFormData((prev) => ({
      ...prev,
      serviceCategory: proj.category,
      serviceName: proj.title,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.projectDescription) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/quotes/submit`, formData);
      setSubmitted(true);
      toast.success("Project inquiry received! A confirmation has been sent to your WhatsApp.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit project inquiry. Please contact directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/70 text-[#0756A5] border border-blue-200">
            <Sparkles size={13} className="text-[#FF6900]" />
            <span>Step 1 of 2: Select Which Project & Enter Requirements</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#082B59] tracking-tight">
            Apply For Your Next Software Project
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the project domain you wish to build, provide your state location, and specify your technical parameters. Our senior engineering team will evaluate scope and deliver a milestone proposal within 24 hours.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-14 rounded-3xl border border-gray-200 shadow-xl text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">
                Project Inquiry Successfully Logged!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-gray-900">{formData.fullName}</strong>. Your requirement for{" "}
                <strong className="text-[#0756A5]">{formData.serviceName}</strong> (Location:{" "}
                <strong className="text-[#FF6900]">{formData.state}</strong>) has been routed to our regional solutions architect.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl max-w-lg mx-auto text-xs text-gray-600 text-left space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-400">Selected Project:</span>
                <span className="font-bold text-gray-800">{formData.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Assigned Region:</span>
                <span className="font-bold text-[#FF6900]">{formData.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Indicative Budget:</span>
                <span className="font-bold text-emerald-600">{formData.projectBudget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Step:</span>
                <span className="font-medium text-gray-700">Detailed Scope Call & Proposal Delivery</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/"
                className="px-6 py-3 rounded-2xl bg-[#0756A5] hover:bg-[#064a8f] text-white text-xs font-bold shadow-md transition-all"
              >
                Return to Public Website
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-2xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all"
              >
                Submit Another Project
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── PART 1: WHICH PROJECT ARE YOU BUILDING? ── */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#FF6900] uppercase tracking-wider block">
                  Project Domain Selector
                </span>
                <h3 className="text-lg font-bold text-[#082B59] mt-0.5">
                  Which project would you like to build?
                </h3>
                <p className="text-xs text-gray-500">
                  Select the closest match for your application to help us align the right engineering leads.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {PROJECT_TYPES.map((proj) => {
                  const Icon = proj.icon;
                  const active = selectedProjectType === proj.id;

                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProjectType(proj)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative select-none ${active
                          ? "bg-blue-50/70 border-[#0756A5] shadow-xs ring-2 ring-blue-100"
                          : "bg-gray-50/50 hover:bg-gray-50 border-gray-200/80 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${active
                              ? "bg-[#0756A5] text-white shadow-xs"
                              : "bg-white text-gray-600 border border-gray-200"
                            }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-bold leading-tight ${active ? "text-[#0756A5]" : "text-gray-900"
                              }`}
                          >
                            {proj.title}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                            {proj.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PART 2: CONTACT DETAILS & STATE SELECTION ── */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#FF6900] uppercase tracking-wider block">
                  Location & Contact Details
                </span>
                <h3 className="text-lg font-bold text-[#082B59] mt-0.5">
                  Your Project Location & Point of Contact
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Anand Mahindra"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. anand@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none transition-colors"
                  />
                </div>

                {/* STATE DROPDOWN (MANDATORY) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#FF6900]" />
                    <span>State / Region in India *</span>
                  </label>
                  <select
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none font-semibold text-gray-800 bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-gray-700 block">
                    Company / Organization Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Enterprise Technologies Pvt Ltd"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* ── PART 3: BUDGET, TIMELINE & SCOPE ── */}
              <div className="pt-4 border-t border-gray-100 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 block">Target Budget Range</label>
                    <select
                      value={formData.projectBudget}
                      onChange={(e) => setFormData({ ...formData, projectBudget: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none bg-white font-medium"
                    >
                      <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000 (MVP / Pilot)</option>
                      <option value="₹1,00,000 – ₹3,00,000">₹1,00,000 – ₹3,00,000 (Production App)</option>
                      <option value="₹3,00,000 – ₹7,00,000">₹3,00,000 – ₹7,00,000 (Complex Architecture)</option>
                      <option value="₹7,00,000+ (Enterprise)">₹7,00,000+ (Enterprise Scale)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 block">Target Delivery Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none bg-white font-medium"
                    >
                      <option value="Immediate (Under 1 Month)">Immediate (Under 1 Month)</option>
                      <option value="1-2 Months">1-2 Months (Standard)</option>
                      <option value="3-4 Months">3-4 Months (Multi-Sprint)</option>
                      <option value="Long-Term Dedicated Team">Long-Term Dedicated Team</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Project Requirements / Feature Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="Describe what you want to build (e.g. We need a multi-vendor marketplace with vendor dashboards, Razorpay integration, customer iOS/Android apps, and real-time inventory tracking)..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-[#FF6900]" />
                  <span>Mutual NDA, IP Protection & 24-Hour Scope Delivery</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0756A5] to-[#082B59] hover:from-[#064a8f] hover:to-[#072449] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send size={14} />
                  <span>{submitting ? "Submitting Application..." : "Submit Project Application"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestQuote;
