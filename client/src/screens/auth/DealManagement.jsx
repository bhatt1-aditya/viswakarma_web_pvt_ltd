import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Handshake,
  CheckCircle2,
  XCircle,
  Building,
  User,
  Search,
  ExternalLink,
  Copy,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/apiConfig";
import { INDIAN_STATES } from "../../utils/indianStates";

const DealManagement = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING_APPROVAL");
  const [stateFilter, setStateFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Approval Result Modal
  const [approvalResult, setApprovalResult] = useState(null);

  // Rejection Modal
  const [rejectionModal, setRejectionModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // Lock background scroll while a modal is open
  useEffect(() => {
    if (!approvalResult && !rejectionModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [approvalResult, rejectionModal]);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/deals/all?status=${statusFilter}&state=${stateFilter}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setDeals(res.data.data || []);
    } catch {
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, stateFilter]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleApprove = async (leadId) => {
    if (!window.confirm("Approve this deal and automatically provision client credentials & project workspace?")) {
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/deals/approve/${leadId}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data?.whatsappSent) {
        toast.success("Deal approved! Login details sent to client on WhatsApp.");
      } else {
        toast.success("Deal approved! Client account and Project created.");
      }
      setApprovalResult({ ...res.data.data, whatsappSent: res.data?.whatsappSent });
      fetchDeals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve deal");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionModal) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/deals/reject/${rejectionModal._id}`,
        { rejectionReason },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      toast.success("Deal rejected and returned to negotiation");
      setRejectionModal(null);
      setRejectionReason("");
      fetchDeals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject deal");
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const filteredDeals = deals.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.phone?.includes(search) ||
      d.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      d.dealDetails?.submittedBy?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-4 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#FF6900] tracking-wider uppercase">
            Sales & Deal Confirmation
          </span>
          <h1 className="text-2xl font-black text-[#082B59] mt-0.5">
            Client Deal Approvals
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review confirmed deals submitted by telecallers. Approved deals automatically provision unique Client IDs, client logins, and Project Workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0756A5] text-xs font-bold border border-blue-200">
            {deals.filter((d) => d.dealDetails?.status === "PENDING_APPROVAL").length} Pending Review
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search client, phone, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#0756A5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
          >
            <option value="ALL">All Deal Statuses</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved Deals</option>
            <option value="REJECTED">Rejected Deals</option>
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
          >
            <option value="All">All States (National)</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DEALS LIST / CARDS */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
          <div className="animate-spin w-8 h-8 border-4 border-[#0756A5] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading deals...</p>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
          <Handshake size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-600">No deals found for selected criteria</p>
          <p className="text-xs text-gray-400 mt-1">Confirmed deals from telecallers will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeals.map((deal) => {
            const isPending = deal.dealDetails?.status === "PENDING_APPROVAL";
            const isApproved = deal.dealDetails?.status === "APPROVED";
            const isRejected = deal.dealDetails?.status === "REJECTED";

            return (
              <div
                key={deal._id}
                className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0756A5] border border-blue-200">
                      {deal.state || "National"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isRejected
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {deal.dealDetails?.status?.replace("_", " ") || "NEW"}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#082B59] text-base leading-snug">
                    {deal.name}
                  </h3>
                  {deal.companyName && (
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Building size={12} className="text-gray-400" />
                      <span>{deal.companyName}</span>
                    </p>
                  )}

                  {/* Financial & Scope Summary */}
                  <div className="mt-4 p-3 rounded-xl bg-gray-50/80 border border-gray-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Deal Value:</span>
                      <span className="font-mono font-black text-[#082B59] text-sm">
                        ₹{(deal.dealDetails?.dealValue || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Advance Paid:</span>
                      <span className="font-mono font-bold text-emerald-600">
                        ₹{(deal.dealDetails?.advanceAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="font-bold text-gray-700">
                        {deal.dealDetails?.category || "Web Development"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Estimated Days:</span>
                      <span className="font-bold text-gray-700">
                        {deal.dealDetails?.estimatedDays || 30} Days
                      </span>
                    </div>
                  </div>

                  {/* Project scope snippet */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-gray-400 block mb-0.5">
                      Project Scope & Requirements:
                    </span>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {deal.dealDetails?.projectScope || deal.requirement || "Custom Solution"}
                    </p>
                  </div>

                  {/* Submitter Telecaller info */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-[#0756A5]" />
                      <span>Closed by:</span>
                    </span>
                    <span className="font-bold text-gray-700">
                      {deal.dealDetails?.submittedBy?.name || deal.assignedTo?.name || "Telecaller"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100">
                  {isPending ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleApprove(deal._id)}
                        disabled={processing}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-xs hover:shadow-sm disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve Deal</span>
                      </button>

                      <button
                        onClick={() => setRejectionModal(deal)}
                        disabled={processing}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : isApproved ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#0756A5] font-bold">
                        {deal.dealDetails?.createdClientId || "Client Active"}
                      </span>
                      {deal.dealDetails?.createdProjectId && (
                        <button
                          onClick={() => navigate(`/projects/${deal.dealDetails.createdProjectId?._id || deal.dealDetails.createdProjectId}`)}
                          className="text-xs font-bold text-[#0756A5] hover:underline flex items-center gap-1"
                        >
                          <span>Open Project</span>
                          <ExternalLink size={12} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-red-500 italic">
                      Rejected: {deal.dealDetails?.rejectionReason || "Requirements incomplete"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* APPROVAL SUCCESS MODAL */}
      {typeof document !== "undefined" &&
        approvalResult &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <div
              onClick={() => setApprovalResult(null)}
              className="fixed inset-0 bg-gray-900/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-[0_20px_60px_-15px_rgba(8,43,89,0.28)] border border-gray-200 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-black text-[#082B59]">
                  Deal Approved & Provisioned!
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  The client user account, unique IDs, and dedicated project workspace have been created.
                </p>
                {approvalResult.whatsappSent && (
                  <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 mt-2">
                    Login credentials sent via WhatsApp to {approvalResult.client.phone}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Client ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#0756A5]">
                      {approvalResult.client.clientId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(approvalResult.client.clientId, "Client ID")}
                      className="text-gray-400 hover:text-[#0756A5]"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Login Mobile:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {approvalResult.client.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Initial Password:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {approvalResult.client.tempPassword}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                  <span className="text-gray-500">Project ID:</span>
                  <span className="font-mono font-bold text-[#082B59]">
                    {approvalResult.project.projectId}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setApprovalResult(null)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    setApprovalResult(null);
                    navigate(`/projects/${approvalResult.project.id}`);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-xs font-bold shadow-sm"
                >
                  Go to Workspace
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* REJECTION MODAL */}
      {typeof document !== "undefined" &&
        rejectionModal &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <div
              onClick={() => setRejectionModal(null)}
              className="fixed inset-0 bg-gray-900/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-[0_20px_60px_-15px_rgba(8,43,89,0.28)] border border-gray-200 space-y-4"
            >
              <h3 className="text-base font-extrabold text-[#082B59]">
                Reject Deal Confirmation
              </h3>
              <p className="text-xs text-gray-500">
                Please specify the reason for rejection. This will be transmitted to the telecaller and the lead will revert to negotiation.
              </p>

              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Contract value below minimum threshold or milestone timeline unrealistic..."
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-red-500"
                  required
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectionModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {processing ? "Rejecting..." : "Confirm Rejection"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DealManagement;
