import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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
            <span className="text-xs font-bold text-[#FF6900] uppercase">Contractual Terms</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59]">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-400">
              Vishwakarma Web Private Limited
            </p>
          </div>

          <p>
            Welcome to Vishwakarma Web Private Limited. By engaging our software development, design, cloud infrastructure, or consulting services, you agree to comply with and be bound by the following terms.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">1. Scope of Work & Deliverables</h3>
          <p>
            All custom software projects are governed by a mutually agreed Statement of Work (SOW) detailing technical specifications, milestones, deliverables, and acceptance criteria.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">2. Intellectual Property Rights</h3>
          <p>
            Upon settlement of milestone invoices, 100% of all custom software source code, database architectures, graphics, and associated intellectual property are assigned and transferred completely to the client.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">3. Warranty & Defect Liability</h3>
          <p>
            We provide a 30 to 90-day complimentary post-launch warranty period for all custom builds, during which any technical defects or bugs within the agreed scope are remediated at zero additional cost.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
