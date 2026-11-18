import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#0756A5] font-bold hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Return Home</span>
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-gray-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b pb-4 space-y-1">
            <span className="text-xs font-bold text-[#FF6900] uppercase">Legal & Compliance</span>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#0756A5]" size={32} />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59]">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xs text-gray-400">
              Effective Date: November 2026 • Vishwakarma Web Private Limited
            </p>
          </div>

          <p>
            At Vishwakarma Web Private Limited, accessible from https://vishwakarmaweb.com, the privacy of our visitors and clients is of utmost priority. This Privacy Policy document outlines the types of information collected and how we use, safeguard, and disclose it.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">1. Information We Collect</h3>
          <p>
            When you submit an inquiry, quotation request, or project specification through our website, we may collect your personal and business details including your name, business email address, phone number, company name, and project requirements.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">2. How We Use Your Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>To evaluate your technical requirements and formulate architectural proposals.</li>
            <li>To communicate project milestones, updates, and deliverables.</li>
            <li>To provide ongoing SLA maintenance and technical support.</li>
            <li>To comply with statutory legal and tax obligations.</li>
          </ul>

          <h3 className="text-base font-bold text-[#082B59] pt-2">3. Non-Disclosure & IP Protection</h3>
          <p>
            We strictly enforce mutual Non-Disclosure Agreements (NDAs). Your proprietary algorithms, database schemas, customer data, and source code are treated with the highest degree of confidentiality and are never shared with third parties.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">4. Contact Information</h3>
          <p>
            If you have questions regarding this Privacy Policy, please contact our Data Governance Officer at <a href="mailto:contact@vishwakarmaweb.com" className="text-[#0756A5] font-bold">contact@vishwakarmaweb.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
