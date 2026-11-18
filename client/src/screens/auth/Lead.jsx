import React, { useState, useEffect, useCallback } from "react";
import StatsGrid from "../../components/AdminComponents/staff/StatsGrid";
import Toast from "../../components/AdminComponents/staff/Toast";
import LeadModal from "../../components/AdminComponents/lead/LeadModal";
import ImportLeadsModal from "../../components/AdminComponents/lead/ImportLeadsModal";
import BulkAssignModal from "../../components/AdminComponents/lead/BulkAssignModal";
import Pagination from "../../components/common/Pagination";
import { MdOutlineDeleteForever } from "react-icons/md";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import LeadSkeletonBody from "../../components/AdminComponents/lead/LeadSkeletonBody";
import API_BASE_URL from "../../utils/apiConfig";

function initials(name = "") {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase() || "?"
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-lg">
        <p className="text-base font-medium text-gray-800 mb-5">{title}</p>
        {children}
      </div>
    </div>
  );
}

const Lead = () => {
  const { permissions, user } = useAuth();
  const isAdmin = ["admin", "superadmin"].includes(user?.role?.name);
  const canEditLead = isAdmin || permissions?.buttons?.leads?.edit;
  const canDeleteLead = isAdmin || permissions?.buttons?.leads?.delete;
  const canTransferLead = isAdmin || permissions?.buttons?.leads?.assign;
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [importModal, setImportModal] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkMode, setBulkMode] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState(""); // "", "raw", "transfer"
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const showToast = useCallback((message, type = "ok") => {
    setToast({ message, type });
  }, []);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search,
        status: statusFilter,
        assigned:
          assignmentFilter === "raw"
            ? "false"
            : assignmentFilter === "transfer"
              ? "true"
              : "",
        startDate,
        endDate,
      }).toString();
      const res = await fetch(
        `${API_BASE_URL}/lead/get-all-lead?${queryParams}`,
        { credentials: "include" },
      );
      const data = await res.json();
      setLeads(data.data || []);
      setTotalPages(data.totalPages || 1);
      setSelectedLeads([]);
    } catch (err) {
      showToast("Failed to load leads.", "err");
    }
    setLoading(false);
  }, [
    page,
    limit,
    search,
    statusFilter,
    assignmentFilter,
    startDate,
    endDate,
    showToast,
  ]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleDelete = async (lead) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/lead/delete-lead/${lead._id}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error("Delete failed");
      showToast("Lead removed");
      setConfirm(null);
      loadLeads();
    } catch (err) {
      showToast(err.message, "err");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedLeads.length} leads?`,
      )
    )
      return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/lead/bulk-delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedLeads }),
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Bulk delete failed");
      showToast(`${selectedLeads.length} leads removed`);
      setSelectedLeads([]);
      loadLeads();
    } catch (err) {
      showToast(err.message, "err");
    }
  };

  const handleBulkAssign = async (userId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/lead/bulk-assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedLeads, assignedTo: userId }),
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Bulk assign failed");
      showToast(`${selectedLeads.length} leads assigned`);
      setSelectedLeads([]);
      setBulkMode(null);
      loadLeads();
    } catch (err) {
      showToast(err.message, "err");
    }
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((l) => l._id));
    }
  };

  const toggleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="px-6 pt-4 pb-6">
      <div className="flex mb-4">
        <div className="mt-3">
          <h1 className="text-2xl font-bold mb-1">Leads</h1>
          <p className="text-sm text-gray-500 mb-4">
            Manage your leads and assignments
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsGrid />

      <div className="flex items-center justify-between gap-2 flex-wrap mb-4 mt-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAssignmentFilter("")}
            className={`h-[38px] min-w-[120px] text-[11px] font-bold rounded-lg transition-all border uppercase tracking-tight
              ${assignmentFilter === "" ? "bg-gray-900 text-white border-gray-900 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
          >
            All Data
          </button>
          <button
            onClick={() => setAssignmentFilter("raw")}
            className={`h-[38px] min-w-[120px] text-[11px] font-bold rounded-lg transition-all border uppercase tracking-tight
              ${assignmentFilter === "raw" ? "bg-gray-900 text-white border-gray-900 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
          >
            Raw Data
          </button>
          <button
            onClick={() => setAssignmentFilter("transfer")}
            className={`h-[38px] min-w-[120px] text-[11px] font-bold rounded-lg transition-all border uppercase tracking-tight
              ${assignmentFilter === "transfer" ? "bg-gray-900 text-white border-gray-900 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
          >
            Transfer Data
          </button>
        </div>
        {permissions?.buttons?.leads?.add && (
          <div className="flex gap-2">
            <button
              onClick={() => setImportModal(true)}
              className="px-4 py-2 text-sm border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium"
            >
              📥 Import
            </button>
            <button
              onClick={() => setModal({ mode: "add" })}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer font-medium"
            >
              + Add Lead
            </button>
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex justify-between flex-wrap items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, email…"
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-400 w-64 bg-white"
        />

        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] text-xs border border-gray-200 rounded-lg px-3 outline-none focus:border-gray-400 bg-white min-w-[140px] font-medium text-gray-600 shadow-sm"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {!showDateFilter ? (
              <button
                onClick={() => setShowDateFilter(true)}
                className="h-[38px] min-w-[140px] px-4 text-[11px] font-bold rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 uppercase tracking-tight shadow-sm"
              >
                📅{" "}
                {startDate && endDate
                  ? `${startDate} - ${endDate}`
                  : "Date Range"}
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-[32px] text-xs border border-gray-200 rounded-md px-2 outline-none focus:border-gray-400 bg-white"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-[32px] text-xs border border-gray-200 rounded-md px-2 outline-none focus:border-gray-400 bg-white"
                />
                <button
                  onClick={() => setShowDateFilter(false)}
                  className="h-[32px] px-3 text-[11px] font-bold rounded-md bg-gray-900 text-white hover:bg-gray-700 uppercase"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowDateFilter(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="h-[32px] px-3 text-[11px] font-bold rounded-md bg-white text-gray-400 hover:text-gray-600 border border-gray-200"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bulk Actions Bar ── */}
      {selectedLeads.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {selectedLeads.length}
            </span>
            <span className="text-sm font-medium text-blue-800">
              Leads Selected
            </span>
          </div>
          <div className="flex gap-2">
            {(isAdmin || permissions?.buttons?.leads?.assign) && (
              <button
                onClick={() => setBulkMode("assign")}
                className="px-3 py-1.5 text-xs bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold"
              >
                Assign Selected
              </button>
            )}
            {(isAdmin || permissions?.buttons?.leads?.delete) && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-xs bg-white text-red-600 border border-red-100 rounded-lg hover:bg-red-50 font-semibold"
              >
                Delete Selected
              </button>
            )}
            <button
              onClick={() => setSelectedLeads([])}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 font-medium"
            >
              Deselect All
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={
                    leads.length > 0 && selectedLeads.length === leads.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                Sl No
              </th>

              <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                👤 Lead
              </th>

              <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                🛡 Assigned To
              </th>

              <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                📞 Phone
              </th>

              <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                ⚙ Email
              </th>

              <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                🏷 Status
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                📅 Date
              </th>

              <th className="px-4 py-3 text-right text-sm text-gray-900 font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LeadSkeletonBody rows={10} />
            ) : leads.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-12 text-sm text-gray-400"
                >
                  {search ||
                  statusFilter ||
                  assignmentFilter ||
                  startDate ||
                  endDate
                    ? "No leads match your search/filters."
                    : "No leads yet. Create your first one."}
                </td>
              </tr>
            ) : (
              leads.map((l, i) => (
                <tr
                  key={l._id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(l._id)}
                      onChange={() => toggleSelectLead(l._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials(l.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {l.name || "—"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {l.source || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {l.assignedTo?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${
                        l.status === "Closed"
                          ? "bg-green-100 text-green-700"
                          : l.status === "Not Interested"
                            ? "bg-red-100 text-red-700"
                            : l.status === "Interested"
                              ? "bg-blue-100 text-blue-700"
                              : l.status === "Follow-up"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {l.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {l.createdAt
                      ? new Date(l.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button
                      title={canEditLead ? "Edit" : "No permission"}
                      disabled={!canEditLead}
                      onClick={() =>
                        canEditLead && setModal({ mode: "edit", lead: l })
                      }
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                        ${
                          canEditLead
                            ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            : "text-gray-300 bg-gray-50 cursor-not-allowed"
                        }`}
                    >
                      ✎
                    </button>
                    <button
                      title={canDeleteLead ? "Delete" : "No permission"}
                      disabled={!canDeleteLead}
                      onClick={() => canDeleteLead && setConfirm(l)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                        ${
                          canDeleteLead
                            ? "text-red-600 hover:bg-red-50"
                            : "text-gray-300 bg-gray-50 cursor-not-allowed"
                        }`}
                    >
                      <MdOutlineDeleteForever />
                    </button>

                    <button
                      title={canTransferLead ? "Transfer" : "No permission"}
                      disabled={!canTransferLead}
                      onClick={() =>
                        canTransferLead &&
                        setModal({ mode: "transfer", lead: l })
                      }
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
    ${
      canTransferLead
        ? "text-green-600 hover:bg-green-50"
        : "text-gray-300 bg-gray-50 cursor-not-allowed"
    }`}
                    >
                      ⇄
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* ── Add/Edit/Transfer Modal ── */}
      {modal && (
        <LeadModal
          mode={modal.mode}
          lead={modal.lead}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            showToast(
              modal.mode === "add"
                ? "Lead added."
                : modal.mode === "edit"
                  ? "Lead updated."
                  : "Lead transferred.",
            );
            loadLeads();
          }}
        />
      )}

      {/* ── Import Modal ── */}
      {importModal && (
        <ImportLeadsModal
          onClose={() => setImportModal(false)}
          onUpload={() => {
            setImportModal(false);
            showToast("Leads imported successfully.");
            loadLeads();
          }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {confirm && (
        <Modal title="Remove lead" onClose={() => setConfirm(null)}>
          <p className="text-sm text-gray-500 mb-5">
            Are you sure you want to remove <b>{confirm.name}</b>? This action
            cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setConfirm(null)}
              className="px-4 py-2 text-sm border rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(confirm)}
              className="px-4 py-2 text-sm border rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        </Modal>
      )}

      {/* ── Bulk Assign Modal ── */}
      {bulkMode === "assign" && (
        <BulkAssignModal
          selectedCount={selectedLeads.length}
          onClose={() => setBulkMode(null)}
          onAssign={handleBulkAssign}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Lead;
