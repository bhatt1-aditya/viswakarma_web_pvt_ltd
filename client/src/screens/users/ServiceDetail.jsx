import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  FileCheck,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import allServicesData from "../../data/all108Services.json";
import demosData from "../../data/demosData.json";

const ServiceDetail = () => {
  const { categorySlug, serviceSlug } = useParams();
  const [openFaq, setOpenFaq] = useState(0);

  // Find service by serviceSlug or matching slug
  const service = useMemo(() => {
    return allServicesData.find(
      (s) => s.slug === serviceSlug || s.slug === categorySlug
    );
  }, [categorySlug, serviceSlug]);

  // Find mapped demo
  const mappedDemo = useMemo(() => {
    if (!service?.demoSlug) return null;
    return demosData.find((d) => d.demoId === service.demoSlug);
  }, [service]);

  // Find 3 related services in the same category
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return allServicesData
      .filter((s) => s.categorySlug === service.categorySlug && s.idNumber !== service.idNumber)
      .slice(0, 3);
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] py-20 text-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <AlertCircle size={40} className="mx-auto text-[#FF6900]" />
          <h2 className="text-xl font-bold text-[#082B59]">Service Not Found</h2>
          <p className="text-sm text-gray-500">
            The requested service could not be located in our catalog.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0756A5] text-white text-xs font-bold"
          >
            <ArrowLeft size={14} />
            <span>Return to Services Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F8FC] min-h-screen pb-20">
      {/* =========================================================================
          BREADCRUMBS & HERO
         ========================================================================= */}
      <section className="bg-gradient-to-b from-[#071426] via-[#082B59] to-[#071426] text-white pt-10 pb-16 border-b border-white/10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span>/</span>
            <Link
              to={`/services?category=${service.categorySlug}`}
              className="hover:text-white transition-colors"
            >
              {service.categoryName}
            </Link>
            <span>/</span>
            <span className="text-white font-medium line-clamp-1">{service.title}</span>
          </nav>

          {/* Service Title & Badges */}
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-[#FF6900] text-white">
                Service #{String(service.idNumber).padStart(3, "0")}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-md bg-white/10 text-blue-200">
                {service.categoryName}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl">
              {service.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to={`/quote?service=${encodeURIComponent(service.title)}`}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-md"
              >
                Request Consultation & Quote
              </Link>

              {service.demoSlug && (
                <Link
                  to={`/live-demos/${service.demoSlug}`}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-[#FF8A00]" />
                  <span>Launch Live Demo</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN CONTENT CONTAINER (TWO COLUMNS)
         ========================================================================= */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: CORE SERVICE DETAILS (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          {/* 1. COMPREHENSIVE OVERVIEW */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#082B59] border-l-4 border-[#0756A5] pl-3">
              Service Architectural Overview
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {service.overview}
            </p>
          </div>

          {/* 2. BUSINESS PROBLEMS WE SOLVE */}
          {service.businessProblemsSolved?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-[#082B59] border-l-4 border-[#FF6900] pl-3">
                Business Challenges We Solve
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {service.businessProblemsSolved.map((prob, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-red-50/60 border border-red-100 flex items-start gap-3.5"
                  >
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
                      {prob}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FEATURES & CAPABILITIES */}
          {service.features?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-[#082B59] border-l-4 border-[#0756A5] pl-3">
                Core Features & Technical Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F5F8FC] border border-gray-100 flex items-start gap-3"
                  >
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                      {feat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. DEVELOPMENT METHODOLOGY / APPROACH */}
          {service.developmentApproach?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-[#082B59] border-l-4 border-[#0756A5] pl-3">
                Development & Execution Approach
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.developmentApproach.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2"
                  >
                    <span className="text-xs font-mono font-extrabold text-[#0756A5] uppercase">
                      Stage {idx + 1}
                    </span>
                    <p className="text-xs font-medium text-gray-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. EXPECTED PRODUCTION DELIVERABLES */}
          {service.deliverables?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-[#082B59] border-l-4 border-emerald-500 pl-3">
                Expected Deliverables & Handover
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.deliverables.map((del, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100"
                  >
                    <FileCheck size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-gray-800">{del}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. INTERACTIVE LIVE DEMO BANNER */}
          {mappedDemo && (
            <div className="rounded-2xl bg-gradient-to-r from-[#0756A5] to-[#082B59] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF8A00] uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Mapped Demonstration Available</span>
                </div>
                <h3 className="text-2xl font-bold">{mappedDemo.title}</h3>
                <p className="text-xs text-gray-200 max-w-lg leading-relaxed">
                  {mappedDemo.description}
                </p>
              </div>

              <Link
                to={mappedDemo.route}
                className="px-6 py-3.5 rounded-xl bg-[#FF6900] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                <span>Launch Interactive Demo</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          )}

          {/* 7. FREQUENTLY ASKED QUESTIONS */}
          {service.faqs?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-[#082B59] border-l-4 border-[#0756A5] pl-3">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="w-full text-left p-4 bg-gray-50/70 hover:bg-gray-100/70 font-semibold text-xs sm:text-sm text-[#082B59] flex items-center justify-between transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Inquiry Box */}
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-[#082B59]">
                Start Your Project Consultation
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed">
                Connect directly with Vishwakarma Web Private Limited to review architecture, timelines, and tailored pricing.
              </p>

              <div className="space-y-3 pt-1">
                <Link
                  to={`/quote?service=${encodeURIComponent(service.title)}`}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider text-center block shadow-md hover:shadow-glowOrange transition-all"
                >
                  Request Detailed Estimate
                </Link>

                <a
                  href="https://wa.me/917008156600"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider text-center block shadow-md hover:bg-emerald-600 transition-all"
                >
                  Quick WhatsApp Consultation
                </a>
              </div>

              <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#0756A5]" />
                  <span>NDA & 100% IP Transfer Signed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#0756A5]" />
                  <span>24-Hour Consultation Turnaround</span>
                </div>
              </div>
            </div>

            {/* Tech Stack Box */}
            {service.techStack?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Recommended Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-[#0756A5] font-semibold text-xs border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Services in Category */}
            {relatedServices.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Related Services in {service.categoryName}
                </h4>
                <div className="space-y-3">
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.idNumber}
                      to={`/services/${rel.categorySlug}/${rel.slug}`}
                      className="block p-3 rounded-xl bg-gray-50 hover:bg-blue-50/70 border border-gray-100 transition-colors group"
                    >
                      <span className="text-[10px] font-mono font-bold text-gray-400">
                        #{String(rel.idNumber).padStart(3, "0")}
                      </span>
                      <p className="text-xs font-bold text-gray-800 group-hover:text-[#0756A5] transition-colors line-clamp-1 mt-0.5">
                        {rel.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
