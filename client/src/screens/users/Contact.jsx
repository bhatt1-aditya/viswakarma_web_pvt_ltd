import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Award,
  Lock,
  Activity,
  BarChart3,
  Terminal,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import categoriesData from "../../data/categoriesData.json";
import API_BASE_URL from "../../utils/apiConfig";
import { INDIAN_STATES } from "../../utils/indianStates";

const contactHeadlinePhrases = [
  "Senior Software Architects.",
  "Full-Stack Engineering Leadership.",
  "Cloud & DevOps Specialists.",
  "AI & Automation Engineers.",
  "Enterprise Solutions Consultants.",
];

const consultationSteps = [
  {
    step: "01",
    title: "Initial Architecture Review",
    desc: "We discuss your technical challenges, business objectives, and system expectations over a discovery call.",
  },
  {
    step: "02",
    title: "Scope & Schema Mapping",
    desc: "Our architects map out tech stacks, database schemas, third-party APIs, and security requirements.",
  },
  {
    step: "03",
    title: "Fixed Milestone Proposal",
    desc: "You receive a transparent Statement of Work with broken-down deliverables, timelines, and payment gates.",
  },
  {
    step: "04",
    title: "Sprint Kickoff",
    desc: "Dedicated senior engineers begin bi-weekly sprint development with live demos and direct Slack/Teams sync.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "Delhi (NCR)",
    companyName: "",
    serviceRequired: "Website Design & Development",
    projectBudget: "₹1,00,000 – ₹3,00,000",
    projectTimeline: "1-2 Months",
    projectDescription: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = contactHeadlinePhrases[phraseIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % contactHeadlinePhrases.length);
        }
      }, 35);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        if (displayText.length === currentPhrase.length) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      }, 70);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

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
      toast.success("Inquiry submitted! A confirmation has been sent to your WhatsApp.");
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
    <div className="bg-[#F5F8FC] min-h-screen">
      {/* =========================================================================
          1. HERO SECTION WITH ANIMATED TYPEWRITER & FLOATING TERMINAL
         ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#071426] via-[#082B59] to-[#071426] text-white pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0756A5]/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0756A5]/25 rounded-full blur-[100px] pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#FF6900]/20 rounded-full blur-[100px] pointer-events-none animate-pulse-soft" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF8A00] tracking-wide backdrop-blur-md">
                <Sparkles size={14} className="text-[#FF6900]" />
                <span>Direct Commercial & Technical Engagement</span>
              </div>

              {/* Animated Typewriter Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white min-h-[3.6em] sm:min-h-[2.4em] flex flex-col justify-center">
                <span>Connect Directly With Our</span>{" "}
                <span className="block mt-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6900] via-[#FF8A00] to-amber-300">
                    {displayText}
                  </span>
                  <span className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-[#FF6900] ml-1.5 animate-pulse align-middle" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Have a project in mind, need an architectural consultation, or want to modernize existing enterprise software? Connect directly with Vishwakarma Web Private Limited. We review technical specifications within 24 hours.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#contact-form"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm tracking-wide hover:shadow-glowOrange transition-all shadow-lg shadow-orange-900/40 flex items-center gap-2"
                  >
                    <Send size={16} />
                    <span>Send Project Inquiry</span>
                  </a>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="https://wa.me/917008156600"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
                  >
                    <span>Instant WhatsApp Chat</span>
                    <ArrowRight size={16} />
                  </a>
                </motion.div>
              </div>

              {/* Credibility Metric Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-white">24H</p>
                  <p className="text-xs text-gray-400">Response SLA</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-[#FF8A00]">100%</p>
                  <p className="text-xs text-gray-400">NDA Protected</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-blue-400">Direct</p>
                  <p className="text-xs text-gray-400">Architect Access</p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Floating 3D Animated Consultation Terminal */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-md lg:max-w-none"
              >
                {/* Main Card */}
                <div className="rounded-2xl bg-gradient-to-br from-white/15 to-white/5 p-1 border border-white/20 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-xl bg-[#082B59]/90 p-5 space-y-4">
                    {/* Window Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider">
                          CONSULTANTS ONLINE
                        </span>
                      </div>
                    </div>

                    {/* Consultation Code Box */}
                    <div className="bg-[#071426] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2 border border-white/5 shadow-inner">
                      <p className="text-blue-400">{"// Direct Technical Channels"}</p>
                      <p>
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-amber-300">consultationChannel</span> = {`{`}
                      </p>
                      <p className="pl-4">
                        responseWindow: <span className="text-emerald-400">"&lt; 24 Business Hours"</span>,
                      </p>
                      <p className="pl-4">
                        ndaStandard: <span className="text-[#FF8A00]">"Mutual NDA Provided"</span>,
                      </p>
                      <p className="pl-4">
                        leadArchitect: <span className="text-cyan-400">"Assigned on Discovery"</span>,
                      </p>
                      <p className="pl-4">
                        ipPolicy: <span className="text-emerald-400">"100% Client Ownership"</span>
                      </p>
                      <p>{`};`}</p>
                    </div>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          <Terminal size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Consultation</p>
                          <p className="text-xs font-bold text-white">Full-Stack Scope</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#FF8A00] flex items-center justify-center font-bold">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Turnaround</p>
                          <p className="text-xs font-bold text-white">24-Hour Scope</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1 (Top Right) */}
                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-4 bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white p-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-white/20"
                >
                  <Award size={16} />
                  <span>Noida HQ • Global Delivery</span>
                </motion.div>

                {/* Floating Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 bg-[#0756A5] text-white p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs font-bold"
                >
                  <Lock size={16} className="text-cyan-300" />
                  <span>Strict Confidentiality</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CONTACT INFORMATION & PROJECT INQUIRY FORM
         ========================================================================= */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Corporate Information Card (4 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-4 bg-gradient-to-br from-[#082B59] to-[#071426] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6900]/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-[11px] font-bold text-[#FF8A00] uppercase tracking-wider block">
                    Corporate Headquarters
                  </span>
                  <h3 className="text-xl font-bold mt-1">Vishwakarma Web Private Limited</h3>
                </div>

                <div className="space-y-4 text-xs text-gray-300">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#FF6900] shrink-0 mt-0.5" />
                    <span>Odisha Balangir Bandabahal Main Road Bus Station Pande Computer, 767022</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#0756A5] shrink-0" />
                    <a href="tel:+917008156600" className="hover:text-white transition-colors font-medium">
                      +91  +91 7684931759, 7008156600
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-[#0756A5] shrink-0" />
                    <a href="mailto:vishwakarmawebprivatelimited@gmail.com" className="hover:text-white transition-colors">
                      vishwakarmawebprivatelimited@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-gray-400 shrink-0" />
                    <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Direct WhatsApp Support:
                  </span>
                  <a
                    href="https://wa.me/917008156600"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Chat on WhatsApp</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2 text-xs text-gray-300 relative z-10">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#FF8A00]" />
                  <span>Mutual NDA & IP Agreement Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Detailed Scope & Estimate in 24 Hours</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Project Inquiry Form (8 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8 bg-white p-8 lg:p-10 rounded-3xl border border-gray-200/80 shadow-sm space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-[#082B59]">
                  Send Your Project Specifications
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Our software architects will review your parameters and prepare a technical roadmap with preliminary estimation.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3"
                >
                  <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
                  <h4 className="text-lg font-bold text-emerald-900">
                    Inquiry Received Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Vishwakarma Web Private Limited. A confirmation message has been sent to your WhatsApp number, and a senior consultant will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-[#0756A5] hover:underline"
                  >
                    Send Another Specification
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">State / Region (India) *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs bg-white font-medium"
                        required
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Company / Organization</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Acme Innovations Pvt Ltd"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Service Category</label>
                      <select
                        name="serviceRequired"
                        value={formData.serviceRequired}
                        onChange={handleChange}
                        className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs bg-white"
                      >
                        {categoriesData.map((cat) => (
                          <option key={cat.slug} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Target Budget Bracket</label>
                      <select
                        name="projectBudget"
                        value={formData.projectBudget}
                        onChange={handleChange}
                        className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs bg-white"
                      >
                        <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                        <option value="₹1,00,000 – ₹3,00,000">₹1,00,000 – ₹3,00,000</option>
                        <option value="₹3,00,000 – ₹7,00,000">₹3,00,000 – ₹7,00,000</option>
                        <option value="₹7,00,000+ (Enterprise)">₹7,00,000+ (Enterprise)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Timeline Expectation</label>
                      <select
                        name="projectTimeline"
                        value={formData.projectTimeline}
                        onChange={handleChange}
                        className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs bg-white"
                      >
                        <option value="Immediate (Under 1 Month)">Immediate (Under 1 Month)</option>
                        <option value="1-2 Months">1-2 Months</option>
                        <option value="3-4 Months">3-4 Months</option>
                        <option value="Long-Term Retainer">Long-Term Retainer</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Project Overview & Scope Details *</label>
                    <textarea
                      name="projectDescription"
                      rows={4}
                      value={formData.projectDescription}
                      onChange={handleChange}
                      placeholder="Describe your current platform, expected features, target users, and key architectural requirements..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-xs transition-colors"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    <span>{submitting ? "Submitting Inquiry..." : "Submit Technical Project Inquiry"}</span>
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. OUR 4-STAGE CONSULTATION & SCOPING LIFECYCLE
         ========================================================================= */}
      <section className="py-20 bg-[#F5F8FC] border-t border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
              <span>Predictable Onboarding</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Our Consultation & Scoping Process
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              From initial technical inquiry to sprint kickoff, here is what to expect in our transparent engagement model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultationSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 space-y-3 relative hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-blue-200 block font-mono">
                    {step.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0756A5] flex items-center justify-center font-bold">
                    <Calendar size={16} />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#082B59]">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. COMMERCIAL COMMITMENT & SLA SPOTLIGHT BANNER
         ========================================================================= */}
      <section className="py-20 bg-[#071426] text-white relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#0756A5]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#FF6900]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-[#082B59]/95 via-[#0756A5]/80 to-[#071426] border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6900]/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF8A00] text-xs font-bold uppercase tracking-wider">
                  <BarChart3 size={14} />
                  <span>The Vishwakarma Commercial Guarantee</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Transparent Partnerships Rooted in Engineering Accountability
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  When you partner with Vishwakarma Web Private Limited, you retain 100% intellectual property ownership, direct access to dedicated senior developers, and milestone deliverables verified against pre-agreed acceptance criteria.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/quote"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-md"
                  >
                    Request Project Scope & Estimate
                  </Link>

                  <a
                    href="tel:+917008156600"
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md"
                  >
                    Call Technical Support: +91  +91 7684931759, 7008156600
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Activity size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">99.99%</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Architecture SLA</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Continuous monitoring, automated backups, and incident response.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">2 Weeks</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Sprint Cadence</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Predictable agile deliveries with working code shipped regularly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Award size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">100% IP</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Total Asset Transfer</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    You hold all rights to code, Figma design files, and database schemas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Lock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">Zero-Trust</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Enterprise Security</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    RBAC, encrypted data in transit & at rest, and OWASP audits.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;