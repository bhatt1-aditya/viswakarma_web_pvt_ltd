import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Calculator,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";

const tiers = [
  {
    name: "Starter Solutions",
    badge: "For Startups & SMBs",
    highlight: false,
    tagline: "High-impact MVP development to validate business concepts rapidly.",
    features: [
      "Custom responsive web application or mobile MVP",
      "Modern React.js / Node.js architecture",
      "Essential REST APIs & database schema",
      "Payment gateway integration (UPI / Razorpay / Stripe)",
      "Basic admin management dashboard",
      "30-day post-launch warranty & bug fixes",
      "100% source code & IP transfer",
    ],
    cta: "Request Starter Consultation",
  },
  {
    name: "Business Solutions",
    badge: "Most Popular For Mid-Market",
    highlight: true,
    tagline: "Scalable digital infrastructure engineered for heavy daily transaction volumes.",
    features: [
      "Full-stack web platform + cross-platform mobile app",
      "Tailored CRM / ERP modules & departmental workflows",
      "Automated WhatsApp & Email customer notification triggers",
      "Multi-role user permission hierarchies (RBAC)",
      "High-availability database optimization & indexing",
      "60-day post-launch warranty & SLA support",
      "Complete CI/CD deployment pipeline on AWS/GCP",
    ],
    cta: "Request Business Tier Quote",
  },
  {
    name: "Enterprise Solutions",
    badge: "For Corporations & Scale-ups",
    highlight: false,
    tagline: "Mission-critical architectures engineered for strict compliance, high concurrency, and zero downtime.",
    features: [
      "Multi-tenant SaaS product engineering or corporate ERP",
      "AI & machine learning autonomous workflow pipelines",
      "Microservices architecture with Redis & message queues",
      "ISO 27001 / SOC-2 security compliance architecture",
      "Biometric attendance, multi-warehouse & GST engine",
      "Dedicated senior engineering pod & architect lead",
      "24/7 technical monitoring & quarterly security audits",
    ],
    cta: "Consult Enterprise Architects",
  },
];

const Pricing = () => {
  // Project Estimator Calculator State
  const [projectType, setProjectType] = useState("web");
  const [scale, setScale] = useState("medium");
  const [needAI, setNeedAI] = useState(false);
  const [needMobile, setNeedMobile] = useState(false);
  const [needERP, setNeedERP] = useState(false);

  // Estimator Form
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Estimated range calculation logic
  const calculateEstimate = () => {
    let baseMin = 45000;
    let baseMax = 95000;

    if (projectType === "mobile") {
      baseMin += 40000;
      baseMax += 85000;
    } else if (projectType === "enterprise") {
      baseMin += 120000;
      baseMax += 250000;
    }

    if (scale === "large") {
      baseMin *= 1.8;
      baseMax *= 2.2;
    } else if (scale === "enterprise") {
      baseMin *= 3;
      baseMax *= 3.5;
    }

    if (needAI) {
      baseMin += 35000;
      baseMax += 75000;
    }
    if (needMobile) {
      baseMin += 45000;
      baseMax += 90000;
    }
    if (needERP) {
      baseMin += 60000;
      baseMax += 120000;
    }

    return `₹${Math.round(baseMin).toLocaleString("en-IN")} – ₹${Math.round(baseMax).toLocaleString("en-IN")}`;
  };

  const estimatedRange = calculateEstimate();

  const handleEstimateSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/quotes/submit`, {
        fullName: clientName,
        email: clientEmail,
        phone: clientPhone,
        serviceCategory: projectType.toUpperCase(),
        projectBudget: estimatedRange,
        timeline: scale === "large" ? "8-12 Weeks" : "4-6 Weeks",
        projectDescription: `Interactive Estimator Submission. Project Type: ${projectType}, Scale: ${scale}, Add-ons: [${needAI ? "AI " : ""}${needMobile ? "Mobile " : ""}${needERP ? "ERP" : ""}]. Estimated range: ${estimatedRange}`,
        estimatedPriceRange: estimatedRange,
      });

      toast.success("Quote request submitted! An architect will reach out with the detailed breakdown.");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    } catch (err) {
      toast.error("Failed to submit quote. Please contact directly via WhatsApp or phone.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
            <span>Transparent Commercial Models</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#082B59] leading-tight">
            Tailored Engagement Tiers
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Every software solution engineered by Vishwakarma Web Private Limited is scoped precisely to your business objectives. We do not impose rigid cookie-cutter packages.
          </p>
        </div>

        {/* 3 TIERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${tier.highlight
                  ? "bg-gradient-to-b from-[#082B59] to-[#071426] text-white shadow-2xl ring-2 ring-[#FF6900] relative scale-[1.02]"
                  : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-cardHover"
                }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  Recommended For Growth
                </span>
              )}

              <div className="space-y-5">
                <div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${tier.highlight ? "text-[#FF8A00]" : "text-[#0756A5]"
                      }`}
                  >
                    {tier.badge}
                  </span>
                  <h3 className="text-2xl font-black mt-1">{tier.name}</h3>
                  <p
                    className={`text-xs mt-2 leading-relaxed ${tier.highlight ? "text-gray-300" : "text-gray-600"
                      }`}
                  >
                    {tier.tagline}
                  </p>
                </div>

                <div className="pt-2 pb-4 border-b border-gray-200/20">
                  <span className="text-xs text-gray-400 font-medium">Pricing Model</span>
                  <p className="text-lg font-black mt-0.5">Custom Milestone Scope</p>
                </div>

                <div className="space-y-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider block ${tier.highlight ? "text-gray-300" : "text-gray-500"
                      }`}
                  >
                    What's Included:
                  </span>
                  {tier.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2
                        size={15}
                        className={`shrink-0 mt-0.5 ${tier.highlight ? "text-[#FF8A00]" : "text-emerald-500"
                          }`}
                      />
                      <span className={tier.highlight ? "text-gray-200" : "text-gray-700"}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-200/20">
                <Link
                  to={`/quote?service=${encodeURIComponent(tier.name)}`}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-md ${tier.highlight
                      ? "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange"
                      : "bg-[#0756A5] text-white hover:bg-blue-800"
                    }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE PROJECT ESTIMATION CALCULATOR */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6900] uppercase tracking-wider">
                <Calculator size={15} />
                <span>Interactive Cost Estimator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082B59]">
                Estimate Your Custom Project Budget
              </h2>
            </div>
            <span className="text-xs font-medium text-gray-500">
              Select parameters to calculate an indicative development range.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Parameters Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Parameter 1: Platform Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  1. Platform Scope
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "web", label: "Web Portal / PWA" },
                    { id: "mobile", label: "Mobile App (iOS/Android)" },
                    { id: "enterprise", label: "Full Enterprise Suite" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProjectType(p.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${projectType === p.id
                          ? "border-[#0756A5] bg-blue-50 text-[#0756A5] ring-2 ring-[#0756A5]/20 shadow-xs"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 2: Scale */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  2. Architectural Complexity & Scale
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "medium", label: "Standard Business" },
                    { id: "large", label: "High-Traffic Scale" },
                    { id: "enterprise", label: "Multi-Region Enterprise" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setScale(s.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${scale === s.id
                          ? "border-[#0756A5] bg-blue-50 text-[#0756A5] ring-2 ring-[#0756A5]/20 shadow-xs"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 3: Add-on Capabilities */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  3. Key Add-on Modules
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={needAI}
                      onChange={(e) => setNeedAI(e.target.checked)}
                      className="rounded text-[#0756A5]"
                    />
                    <span>AI Assistant & Bots</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={needMobile}
                      onChange={(e) => setNeedMobile(e.target.checked)}
                      className="rounded text-[#0756A5]"
                    />
                    <span>Native Mobile App</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={needERP}
                      onChange={(e) => setNeedERP(e.target.checked)}
                      className="rounded text-[#0756A5]"
                    />
                    <span>ERP / Inventory Sync</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Instant Estimate & Lead Capture (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#082B59] to-[#071426] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8A00] block">
                  Indicative Project Range:
                </span>
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {estimatedRange}
                </p>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Includes full UI/UX design, custom frontend/backend development, testing, cloud deployment, and 100% IP ownership.
                </p>
              </div>

              {/* Quick Submit Form */}
              <form onSubmit={handleEstimateSubmit} className="space-y-3 pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-gray-200 block">
                  Lock in this estimate & receive technical proposal:
                </span>

                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 text-xs border border-white/20 focus:outline-none focus:border-[#FF6900]"
                />

                <input
                  type="email"
                  required
                  placeholder="Corporate Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 text-xs border border-white/20 focus:outline-none focus:border-[#FF6900]"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone Number (e.g. +91 98765 00000)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 text-xs border border-white/20 focus:outline-none focus:border-[#FF6900]"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all disabled:opacity-50"
                >
                  {submitting ? "Sending Request..." : "Request Architectural Proposal"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
