import React, { useState, useEffect, useCallback } from "react";
import StatsGrid from "../../components/AdminComponents/staff/StatsGrid";
import Toast from "../../components/AdminComponents/staff/Toast";
import StaffModal from "../../components/AdminComponents/staff/StaffModal";
import StaffForm from "../../components/AdminComponents/staff/StaffForm";
import { getRoleBadgeClass } from "../../utils/roleBadge";
import TableSkeleton from "../../components/AdminComponents/staff/TableSkeleton";
import StaffTable from "../../components/AdminComponents/staff/StaffTable";
import Pagination from "../../components/common/Pagination";
import { MdOutlineDeleteForever } from "react-icons/md";

import { useAuth } from "../../context/AuthContext";
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

const Staff = () => {
  const { permissions, user } = useAuth();
  const isAdmin = ["admin", "superadmin"].includes(user?.role?.name);
  const canEdit = isAdmin || permissions?.buttons?.staff?.edit;
  const canDelete = isAdmin || permissions?.buttons?.staff?.delete;
  const hasStaffAccess = isAdmin || permissions?.buttons?.staff;
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  const showToast = useCallback((message, type = "ok") => {
    setToast({ message, type });
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search,
        role: roleFilter,
      }).toString();

      const res = await fetch(
        `${API_BASE_URL}/users/get-all-user?${queryParams}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast("Could not load staff. Check API.", "err");
    }
    setLoading(false);
  }, [page, limit, search, roleFilter, showToast]);

  const loadRoles = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/role/get-all-role`,
        { credentials: "include" }
      );
      const data = await res.json();
      setRoles(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch {
      setRoles([]);
    }

  }, []);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [loadUsers, loadRoles]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/users/delete-user/${id._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      showToast("Staff member removed.");
      setConfirm(null);
      loadUsers();
    } catch (e) {
      showToast(e.message, "err");
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/role/create-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoleName }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create role");
      showToast("Role created");
      setNewRoleName("");
      loadRoles();
    } catch (err) {
      showToast(err.message, "err");
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !editingRole.name.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/role/update-role-by-id/${editingRole._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingRole.name }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");
      showToast("Role updated");
      setEditingRole(null);
      loadRoles();
    } catch (err) {
      showToast(err.message, "err");
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure? This may affect users with this role.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/role/delete-role/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete role");
      showToast("Role deleted");
      loadRoles();
    } catch (err) {
      showToast(err.message, "err");
    }
  };


  return (
    <div className="px-6 pt-4 pb-6">
      <div className="flex ">
        <div className="mt-3">
          <h1 className="text-2xl font-bold mb-1">Staff</h1>
          <p className="text-sm text-gray-500 mb-4  ">
            Manage team members and their roles
          </p>


        </div>
      </div>

      {/* ── Stats ── */}
      <StatsGrid />
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, phone, role…"
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-400 w-72 bg-white shadow-sm"
          />

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-gray-400 bg-white min-w-[150px] shadow-sm cursor-pointer"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {(search || roleFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("");
                setPage(1);
              }}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <button
              onClick={() => setRoleModalOpen(true)}
              className="px-4 py-2.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all cursor-pointer font-semibold shadow-sm active:scale-95"
            >
              ⚙ Manage Roles
            </button>
          )}
          {permissions?.buttons?.staff?.add ? (
            <button
              onClick={() => setModal({ mode: "add" })}
              className="px-6 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all cursor-pointer font-semibold shadow-md active:scale-95"
            >
              + Add Staff
            </button>
          ) : null}
        </div>
      </div>
      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <StaffTable />
          <tbody>
            {loading ? (
              <TableSkeleton rows={10} />
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-sm text-gray-400"
                >
                  {search || roleFilter
                    ? "No staff match your search/filters."
                    : "No staff yet. Add your first member."}
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {/* Id */}
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {i + 1 || "—"}
                  </td>
                  {/* Member */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {u.name || "—"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {u.email || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium $ ${getRoleBadgeClass(
                        u.role?.name,
                      )}`}
                    >
                      {u.role?.name || "—"}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {u.phone || "—"}
                  </td>

                  {/* Permissions */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 items-center">
                      {(() => {
                        const perms = Array.isArray(u.permissions)
                          ? u.permissions
                          : typeof u.permissions === "object" &&
                            u.permissions !== null
                            ? Object.keys(u.permissions)
                            : [];

                        return (
                          <>
                            {perms.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-500"
                              >
                                {p}
                              </span>
                            ))}

                            {perms.length > 3 && (
                              <span className="text-[10px] text-gray-400">
                                +{perms.length - 3}
                              </span>
                            )}

                            {perms.length === 0 && (
                              <span className="text-xs text-gray-300">
                                none
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <div className="flex gap-1.5 justify-end min-w-[80px]">
                        {!hasStaffAccess ? (
                          <span className="text-xs text-gray-300 italic w-full text-center">
                            N/A
                          </span>
                        ) : (
                          <>
                            {/* EDIT */}
                            <button
                              title={canEdit ? "Edit" : "No permission"}
                              onClick={() =>
                                canEdit && setModal({ mode: "edit", user: u })
                              }
                              disabled={!canEdit}
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200
          ${canEdit
                                  ? "border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                  : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                                }`}
                            >
                              ✎
                            </button>

                            {/* DELETE */}
                            <button
                              title={canDelete ? "Delete" : "No permission"}
                              onClick={() => canDelete && setConfirm(u)}
                              disabled={!canDelete}
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200
          ${canDelete
                                  ? "border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                  : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                                }`}
                            >
                              <MdOutlineDeleteForever />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
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

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <StaffModal
          title={
            modal.mode === "add" ? "Add staff member" : "Edit staff member"
          }
          onClose={() => setModal(null)}
        >
          <StaffForm
            mode={modal.mode}
            initial={
              modal.mode === "edit"
                ? {
                  ...modal.user,
                  role: modal.user.role?._id || modal.user.role || "",
                }
                : {}
            }
            roles={roles}
            onSave={() => {
              setModal(null);
              showToast(
                modal.mode === "add"
                  ? "Staff member added."
                  : "Staff member updated.",
              );
              loadUsers();
            }}
            onCancel={() => setModal(null)}
          />
        </StaffModal>
      )}

      {/* ── Delete Confirm ── */}
      {confirm && (
        <Modal title="Remove staff member" onClose={() => setConfirm(null)}>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-800">{confirm.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setConfirm(null)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(confirm)}
              className="px-4 py-2 text-sm rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer transition-colors"
            >
              Remove
            </button>
          </div>
        </Modal>
      )}

      {/* ── Role Management Modal ── */}
      {roleModalOpen && (
        <Modal title="Manage User Roles" onClose={() => setRoleModalOpen(false)}>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Enter role name..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-400"
            />
            <button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim()}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
            {roles.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 group">
                {editingRole?._id === r._id ? (
                  <input
                    type="text"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border rounded mr-2"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {r.name}
                  </span>
                )}

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingRole?._id === r._id ? (
                    <>
                      <button onClick={handleUpdateRole} className="text-green-600 hover:text-green-700 text-xs font-bold">Save</button>
                      <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-gray-600 text-xs font-bold">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingRole(r)} className="text-gray-400 hover:text-blue-600 transition-colors">✎</button>
                      <button onClick={() => handleDeleteRole(r._id)} className="text-gray-400 hover:text-red-600 transition-colors">🗑</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {roles.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">No roles created yet.</p>
            )}
          </div>
        </Modal>
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

export default Staff;
