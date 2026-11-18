import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API_BASE_URL from "../../../utils/apiConfig";

const LeadModal = ({ mode, lead = {}, onClose, onSave }) => {
  const [name, setName] = useState(lead.name || "");
  const [phone, setPhone] = useState(lead.phone || "");
  const [email, setEmail] = useState(lead.email || "");
  const [source, setSource] = useState(lead.source || "");
  const [status, setStatus] = useState(lead.status || "Pending");
  const [note, setNote] = useState("");
  const [users, setUsers] = useState([]);
  const { permissions, user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo?._id || lead.assignedTo || "");

  const isAdmin = ["admin", "superadmin"].includes(currentUser?.role?.name);
  const canAssign = isAdmin || permissions?.buttons?.leads?.assign;

  useEffect(() => {
    if (canAssign && (mode === "transfer" || mode === "edit" || mode === "add")) {
      fetch(`${API_BASE_URL}/users/get-all-user`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setUsers(data.data || []))
        .catch(() => setUsers([]));
    }
  }, [mode, canAssign]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = `${API_BASE_URL}/lead/create-lead`;
      let method = "POST";
      let body = { name, phone, email, source, status, notes: note, assignedTo };

      if (mode === "edit") {
        url = `${API_BASE_URL}/lead/update-lead-by-id/${lead._id}`;
        method = "PUT";
        body = { name, phone, email, source, status, assignedTo, note };
      } else if (mode === "transfer") {
        url = `${API_BASE_URL}/lead/transfer-lead/${lead._id}`;
        method = "PUT";
        body = { assignedTo };
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Request failed");
      }

      onSave();
    } catch (err) {
      alert(err.message || "Error saving lead");
    }

    setLoading(false);
  };

  const statusOptions = [
    "Pending",
    "Interested",
    "Not Interested",
    "Follow-up",
    "Closed",
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          {mode === "add"
            ? "Add Lead"
            : mode === "edit"
              ? "Edit Lead"
              : "Transfer Lead"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === "add" || mode === "edit") && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {mode === "edit" && lead.notes?.length > 0 && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Notes
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-50">
                    {lead.notes.map((n, idx) => (
                      <div key={idx} className="text-xs text-gray-600 border-b pb-1 last:border-b-0">
                        <p className="font-semibold">{n.createdBy?.name || "System"}:</p>
                        <p>{n.text}</p>
                        <p className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {mode === "add" ? "Notes" : "Add New Note"}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
                  placeholder="Enter notes here..."
                />
              </div>
            </>
          )}

          {canAssign && (mode === "edit" || mode === "transfer" || mode === "add") && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg border bg-gray-900 text-white hover:bg-gray-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
