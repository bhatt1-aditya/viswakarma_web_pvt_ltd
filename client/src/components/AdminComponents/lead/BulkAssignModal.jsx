import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../utils/apiConfig";

const BulkAssignModal = ({ selectedCount, onClose, onAssign }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/get-all-user`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    onAssign(selectedUser);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-sm p-6 shadow-lg">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Bulk Assign</h2>
        <p className="text-sm text-gray-500 mb-4">
          Assign <b>{selectedCount}</b> selected leads to:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-gray-400"
            required
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

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
              disabled={!selectedUser}
              className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-400"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkAssignModal;
