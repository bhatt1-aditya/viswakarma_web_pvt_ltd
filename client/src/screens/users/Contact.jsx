import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import categoriesData from "../../data/categoriesData.json";
import API_BASE_URL from "../../utils/apiConfig";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    serviceRequired: "Website Design & Development",
    projectBudget: "₹1,00,000 – ₹3,00,000",
    projectTimeline: "1-2 Months",
    projectDescription: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.projectDescription) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/inquiries/submit`, formData);
      setSubmitted(true);
      toast.success("Inquiry submitted successfully! A senior consultant will reach out.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        serviceRequired: "Website Design & Development",
        projectBudget: "₹1,00,000 – ₹3,00,000",
        projectTimeline: "1-2 Months",
        projectDescription: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit inquiry. Please reach out via WhatsApp.");
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
            <span>Direct Commercial Engagement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#082B59] leading-tight">
            Contact Our Engineering Team
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Have a project in mind, need an architectural review, or want to consult on custom software? Submit your specifications below or connect directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CONTACT INFO CARD (4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#082B59] to-[#071426] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#FF8A00] uppercase tracking-wider block">
                  Corporate Headquarters
                </span>
                <h3 className="text-xl font-bold mt-1">Vishwakarma Web Private Limited</h3>
              </div>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#FF6900] shrink-0 mt-0.5" />
                  <span>Tech Hub Tower, Sector 62, Noida, Uttar Pradesh 201301, India</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#0756A5] shrink-0" />
                  <a href="tel:+917077560648" className="hover:text-white transition-colors font-medium">
                    +91 70775 60648
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#0756A5] shrink-0" />
                  <a href="mailto:contact@vishwakarmaweb.com" className="hover:text-white transition-colors">
                    contact@vishwakarmaweb.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-400 shrink-0" />
                  <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <a
                  href="https://wa.me/917077560648"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle size={16} />
                  <span>Instant WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#FF8A00] font-bold">
                <ShieldCheck size={16} />
                <span>NDA & Confidentiality</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                All client project details and intellectual properties are safeguarded by strict confidentiality agreements prior to technical review.
              </p>
            </div>
          </div>

          {/* CONTACT FORM (8 cols) */}
          <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#082B59]">Project Scope & Specification Form</h3>
              <p className="text-xs text-gray-500 mt-1">
                Fields marked with * are required. Responses delivered within 24 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
                <h4 className="text-lg font-bold text-emerald-900">Inquiry Received</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for contacting Vishwakarma Web Private Limited. Our solutions architecture group has logged your lead and will follow up shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Submit Another Project Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase">Corporate Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@company.com"
                      className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Global Logistics"
                      className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase">Service Domain</label>
                    <select
                      name="serviceRequired"
                      value={formData.serviceRequired}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none"
                    >
                      {categoriesData.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase">Estimated Budget</label>
                    <select
                      name="projectBudget"
                      value={formData.projectBudget}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none"
                    >
                      <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                      <option value="₹1,00,000 – ₹3,00,000">₹1,00,000 – ₹3,00,000</option>
                      <option value="₹3,00,000 – ₹8,00,000">₹3,00,000 – ₹8,00,000</option>
                      <option value="₹8,00,000 – ₹20,00,000">₹8,00,000 – ₹20,00,000</option>
                      <option value="₹20,00,000+ (Enterprise)">₹20,00,000+ (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase">Target Timeline</label>
                    <select
                      name="projectTimeline"
                      value={formData.projectTimeline}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none"
                    >
                      <option value="Immediate (Under 1 Month)">Immediate (&lt; 1 Month)</option>
                      <option value="1-2 Months">1-2 Months</option>
                      <option value="2-4 Months">2-4 Months</option>
                      <option value="Long Term / Flexible">Long Term / Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase">Project Description *</label>
                  <textarea
                    name="projectDescription"
                    rows={4}
                    required
                    value={formData.projectDescription}
                    onChange={handleChange}
                    placeholder="Tell us about your core operational challenges, target users, desired integrations, or technical constraints..."
                    className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  <span>{submitting ? "Transmitting Specification..." : "Submit Project Specification"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
