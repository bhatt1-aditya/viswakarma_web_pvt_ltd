import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RefundPolicy = () => {
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
            <span className="text-xs font-bold text-[#FF6900] uppercase">Commercial Policy</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59]">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xs text-gray-400">
              Vishwakarma Web Private Limited
            </p>
          </div>

          <p>
            Vishwakarma Web Private Limited operates on a milestone-driven, sprint-verified delivery model. Each project phase requires mutual signoff before progression to subsequent milestones.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">1. Milestone Approvals</h3>
          <p>
            Payments are linked to verifiable deliverables (e.g., UI/UX signoff, frontend completion, API integration, and final staging deployment). Once a milestone deliverable is approved in writing by the client, the corresponding fee is non-refundable as engineering labor has been expended.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">2. Cancellation During Discovery</h3>
          <p>
            If a project is cancelled during the initial discovery phase prior to commencement of active software development, any unallocated advance funds will be refunded pro-rata after deducting scoping and advisory hours worked.
          </p>

          <h3 className="text-base font-bold text-[#082B59] pt-2">3. Dispute Resolution</h3>
          <p>
            In the rare event of a deliverable dispute, both parties agree to engage in a formal technical mediation review within 14 business days to achieve resolution or scope adjustment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
