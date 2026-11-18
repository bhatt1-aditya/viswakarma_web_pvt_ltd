import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  X,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Lock,
  Plus,
  Save,
  AlertTriangle,
} from "lucide-react";
import StatsGrid from "../../components/AdminComponents/staff/StatsGrid";
import Toast from "../../components/AdminComponents/staff/Toast";
import StaffModal from "../../components/AdminComponents/staff/StaffModal";
import StaffForm from "../../components/AdminComponents/staff/StaffForm";
import { getRoleBadgeClass } from "../../utils/roleBadge";
import TableSkeleton from "../../components/AdminComponents/staff/TableSkeleton";
import StaffTable from "../../components/AdminComponents/staff/StaffTable";
import Pagination from "../../components/common/Pagination";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../utils/apiConfig";

function initials(name = "") {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase() || "VK"
  );
}

function Modal({ title, children, onClose }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative bg-white border border-gray-200 rounded-3xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto shadow-2xl z-10"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <h4 className="text-base font-bold text-[#082B59]">{title}</h4>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const Staff = () => {
  const { permissions, user } = useAuth();
  const isAdmin = ["admin", "superadmin"].includes(user?.role?.name?.toLowerCase());
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

      const res = await fetch(`${API_BASE_URL}/users/get-all-user?${queryParams}`, {
        credentials: "include",
      });

      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast("Could not load staff list. Check server connection.", "err");
    }
    setLoading(false);
  }, [page, limit, search, roleFilter, showToast]);

  const loadRoles = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/role/get-all-role`, {
        credentials: "include",
      });
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

  const handleDelete = async (targetUser) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/delete-user/${targetUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Staff member removed successfully.");
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
      showToast("Security role created");
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
    if (!window.confirm("Are you sure? This may affect users assigned to this role.")) return;
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl mx-auto"
    >
      {/* ── HEADER WITH ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FF6900] uppercase tracking-wider block">
            Workforce Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59] mt-0.5">
            Staff & Team Administration
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Oversee authorized team members, manage granular access privileges, and configure security roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {isAdmin && (
            <button
              onClick={() => setRoleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShieldCheck size={14} className="text-[#FF6900]" />
              <span>Manage Roles</span>
            </button>
          )}

          {(isAdmin || permissions?.buttons?.staff?.add) && (
            <button
              onClick={() => setModal({ mode: "add" })}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white hover:from-[#064a8f] hover:to-[#072449] text-xs font-bold shadow-md hover:shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <UserPlus size={14} />
              <span>Add Staff Member</span>
            </button>
          )}
        </div>
      </div>

      {/* ── METRIC STATS GRID ── */}
      <StatsGrid />

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, phone, email, or role..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative min-w-[160px]">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-7 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100 bg-gray-50/50 cursor-pointer appearance-none font-medium text-gray-700"
            >
              <option value="">All Security Roles</option>
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
              className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-[11px] font-semibold text-gray-400 self-end md:self-center">
          Showing <span className="text-gray-800 font-bold">{users.length}</span> staff members
        </div>
      </div>

      {/* ── STAFF TABLE ── */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <StaffTable />
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <TableSkeleton rows={8} />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <Users size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-700 text-sm">No staff members found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {search || roleFilter
                        ? "Try clearing your search query or role filter."
                        : "Click 'Add Staff Member' above to onboard your first team member."}
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr
                    key={u._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {/* Index */}
                    <td className="px-4 py-3.5 text-gray-400 font-mono text-[11px]">
                      {(page - 1) * limit + i + 1}
                    </td>

                    {/* Member */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0756A5] to-[#FF6900] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                          {initials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{u.name || "—"}</p>
                          <p className="text-[11px] text-gray-400 font-mono flex items-center gap-1 truncate">
                            <Mail size={11} className="text-gray-400" />
                            <span>{u.email || "No email"}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${getRoleBadgeClass(
                          u.role?.name
                        )}`}
                      >
                        {u.role?.name || "Member"}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-gray-600 font-mono text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Phone size={12} className="text-gray-400" />
                        <span>{u.phone || "—"}</span>
                      </span>
                    </td>

                    {/* Permissions */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 items-center max-w-[200px]">
                        {(() => {
                          const perms = Array.isArray(u.permissions)
                            ? u.permissions
                            : typeof u.permissions === "object" && u.permissions !== null
                            ? Object.keys(u.permissions)
                            : [];

                          if (perms.length === 0) {
                            return (
                              <span className="text-[10px] text-gray-400 italic">
                                Standard Role
                              </span>
                            );
                          }

                          return (
                            <>
                              {perms.slice(0, 2).map((p) => (
                                <span
                                  key={p}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-600 border border-gray-200"
                                >
                                  {p}
                                </span>
                              ))}
                              {perms.length > 2 && (
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                                  +{perms.length - 2}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      {!hasStaffAccess ? (
                        <span className="text-xs text-gray-300 italic">N/A</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title={canEdit ? "Edit Staff" : "No permission"}
                            onClick={() => canEdit && setModal({ mode: "edit", user: u })}
                            disabled={!canEdit}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              canEdit
                                ? "text-gray-500 hover:text-[#0756A5] hover:bg-blue-50"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            title={canDelete ? "Remove Staff" : "No permission"}
                            onClick={() => canDelete && setConfirm(u)}
                            disabled={!canDelete}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              canDelete
                                ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* ── ADD / EDIT STAFF MODAL ── */}
      {modal && (
        <StaffModal
          title={modal.mode === "add" ? "Provision New Staff Member" : "Update Staff Profile & Role"}
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
                  ? "Staff member onboarded successfully."
                  : "Staff record updated successfully."
              );
              loadUsers();
            }}
            onCancel={() => setModal(null)}
          />
        </StaffModal>
      )}

      {/* ── REMOVE CONFIRMATION MODAL ── */}
      {confirm && (
        <Modal title="Revoke Staff Access" onClose={() => setConfirm(null)}>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-gray-500">
                Are you sure you want to remove access for
              </p>
              <p className="text-base font-bold text-gray-900">{confirm.name}?</p>
              <p className="text-[11px] text-gray-400">
                This will revoke their credentials and immediately terminate portal access.
              </p>
            </div>

            <div className="flex gap-2.5 justify-end pt-2">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirm)}
                className="flex-1 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MANAGE ROLES MODAL ── */}
      {roleModalOpen && (
        <Modal title="Security Role Hierarchy" onClose={() => setRoleModalOpen(false)}>
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              Define administrative and team roles used to assign access control policies.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter new role title (e.g. Lead Engineer)..."
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#0756A5]"
              />
              <button
                onClick={handleCreateRole}
                disabled={!newRoleName.trim()}
                className="px-4 py-2 text-xs font-bold bg-[#0756A5] text-white rounded-xl hover:bg-[#064a8f] disabled:opacity-50 transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
              {roles.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  {editingRole?._id === r._id ? (
                    <input
                      type="text"
                      value={editingRole.name}
                      onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs border rounded-lg mr-2 outline-none"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock size={12} className="text-[#FF6900]" />
                      <span className="text-xs font-bold text-gray-800 capitalize">
                        {r.name}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingRole?._id === r._id ? (
                      <>
                        <button
                          onClick={handleUpdateRole}
                          className="px-2 py-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Save size={13} />
                        </button>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="px-2 py-1 text-[11px] font-semibold text-gray-400 hover:bg-gray-100 rounded"
                        >
                          <X size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingRole(r)}
                          className="p-1 rounded text-gray-400 hover:text-[#0756A5] hover:bg-blue-50 transition-colors"
                          title="Edit role"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(r._id)}
                          className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete role"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {roles.length === 0 && (
                <p className="text-center text-gray-400 text-xs py-4">
                  No custom security roles defined.
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
};

export default Staff;
