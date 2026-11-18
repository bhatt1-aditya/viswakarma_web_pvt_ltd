import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  ShieldCheck,
  Users,
  Settings,
  Layers,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

const initialUsers = [
  { id: 1, name: "Aditya Bhatt", email: "aditya@vishwakarmaweb.com", role: "SuperAdmin", status: "Active" },
  { id: 2, name: "Sneha Kapur", email: "sneha.k@enterprise.com", role: "Manager", status: "Active" },
  { id: 3, name: "Vikram Rathore", email: "vikram.r@enterprise.com", role: "Staff", status: "Active" },
  { id: 4, name: "Alok Nanda", email: "alok.n@contractor.in", role: "Auditor", status: "Pending" },
];

const DemoAdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("users");
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const handleReset = () => {
    setActiveMenu("users");
    setUsers(initialUsers);
    setSearch("");
    toast.success("Admin console reset!");
  };

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === "Active" ? "Suspended" : "Active";
          return { ...u, status: next };
        }
        return u;
      })
    );
    toast.success("User access privileges updated!");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DemoLayout
      demoNumber={16}
      title="Enterprise Admin Console Demo"
      category="Custom Software & Enterprise Solutions"
      description="Modular administrative console featuring system health metrics, role-based user management, and permission toggles."
      onReset={handleReset}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Mock Admin Sidebar (3 cols) */}
        <div className="md:col-span-3 bg-[#082B59] text-white p-5 space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-[#FF8A00]" />
            <h4 className="font-bold text-sm tracking-wide">Enterprise Admin</h4>
          </div>

          <div className="space-y-1 text-xs">
            {[
              { id: "overview", label: "System Health & KPIs", icon: Layers },
              { id: "users", label: "Role & User Access", icon: Users },
              { id: "settings", label: "Security & Policies", icon: Settings },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                    activeMenu === item.id
                      ? "bg-[#0756A5] text-white font-bold"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <IconComp size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mock Main Content Area (9 cols) */}
        <div className="md:col-span-9 p-6 space-y-5">
          {activeMenu === "overview" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#082B59]">System Performance & Cluster Health</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border">
                  <span className="text-xs text-gray-500">API Response Latency</span>
                  <p className="text-2xl font-black text-emerald-600">42 ms</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border">
                  <span className="text-xs text-gray-500">Active DB Connections</span>
                  <p className="text-2xl font-black text-[#0756A5]">18 Pools</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border">
                  <span className="text-xs text-gray-500">Node Cluster Status</span>
                  <p className="text-2xl font-black text-emerald-600">Healthy (3/3)</p>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "users" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-[#082B59]">RBAC Personnel Ledger</h3>
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Assigned Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{u.email}</p>
                        </td>
                        <td className="p-3 font-semibold text-[#0756A5]">{u.role}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className="text-[11px] font-semibold text-[#0756A5] hover:underline"
                          >
                            {u.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "settings" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#082B59]">Security Policies & IP Whitelists</h3>
              <p className="text-xs text-gray-600">
                Granular multi-factor authentication requirements, session token TTL, and CIDR subnet restrictions.
              </p>
              <div className="p-4 rounded-xl bg-gray-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Enforce Two-Factor Authentication (2FA) for All Staff</span>
                  <span className="font-bold text-emerald-600">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>JWT Session Inactivity Expiry</span>
                  <span className="font-bold text-gray-800">24 Hours</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoAdminDashboard;
