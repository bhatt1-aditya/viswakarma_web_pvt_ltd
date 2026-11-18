import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Send,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import categoriesData from "../../data/categoriesData.json";
import API_BASE_URL from "../../utils/apiConfig";

const RequestQuote = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get("service") || searchParams.get("project") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    serviceName: prefilledService || "Custom Business Solution",
    serviceCategory: "Website Design & Development",
    projectBudget: "₹1,00,000 – ₹3,00,000",
    timeline: "1-2 Months",
    projectDescription: prefilledService
      ? `Inquiring about ${prefilledService}. Please prepare an architectural proposal.`
      : "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.projectDescription) {
      toast.error("Please fill in required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/quotes/submit`, formData);
      setSubmitted(true);
      toast.success("Quote request submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quote. Please contact directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-20">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
            Request an Architectural Project Quotation
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Provide your specifications and business requirements. Our senior technical architects will evaluate your scope and deliver an indicative milestone quotation.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl space-y-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-900">Quotation Request Logged</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you! Our technical estimators are reviewing your parameters and will dispatch a preliminary project roadmap to your email.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="px-6 py-2.5 rounded-xl bg-[#0756A5] text-white text-xs font-bold inline-block"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="mt-1 w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@enterprise.com"
                    className="mt-1 w-full p-3 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Global Logistics"
                    className="mt-1 w-full p-3 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase">Target Domain</label>
                  <select
                    value={formData.serviceCategory}
                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                    className="mt-1 w-full p-3 border rounded-xl"
                  >
                    {categoriesData.map((c) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase">Project Budget</label>
                  <select
                    value={formData.projectBudget}
                    onChange={(e) => setFormData({ ...formData, projectBudget: e.target.value })}
                    className="mt-1 w-full p-3 border rounded-xl"
                  >
                    <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                    <option value="₹1,00,000 – ₹3,00,000">₹1,00,000 – ₹3,00,000</option>
                    <option value="₹3,00,000 – ₹8,00,000">₹3,00,000 – ₹8,00,000</option>
                    <option value="₹8,00,000 – ₹20,00,000">₹8,00,000 – ₹20,00,000</option>
                    <option value="₹20,00,000+ (Enterprise)">₹20,00,000+ (Enterprise)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase">Delivery Window</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="mt-1 w-full p-3 border rounded-xl"
                  >
                    <option value="Immediate (< 1 Month)">Immediate (&lt; 1 Month)</option>
                    <option value="1-2 Months">1-2 Months</option>
                    <option value="2-4 Months">2-4 Months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase">Scope & Requirements *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="Detail your operational goals, user workflows, integrations, or specific services needed..."
                  className="mt-1 w-full p-3 border rounded-xl leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>{submitting ? "Submitting Request..." : "Request Formal Project Quotation"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestQuote;
