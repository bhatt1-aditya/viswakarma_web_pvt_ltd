import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Lock,
  LayoutTemplate,
  PhoneCall,
  Users,
  LayoutDashboard,
} from "lucide-react";
import API_BASE_URL from "../../../utils/apiConfig";
import { INDIAN_STATES } from "../../../utils/indianStates";

const MODULE_DEFINITIONS = [
  {
    key: "homeControl",
    name: "Home Screen CMS",
    icon: LayoutTemplate,
    description: "Manage public website copy, hero typewriter, 7 pillars & SLA guarantees",
    buttons: [
      { key: "edit", label: "Edit Content", hint: "Allow modifying text & configuration" },
      { key: "deploy", label: "Deploy / Publish", hint: "Allow saving & publishing live changes" },
      { key: "delete", label: "Delete Elements", hint: "Allow removing phrases & items" },
    ],
  },
  {
    key: "telecaller",
    name: "Telecaller & Leads",
    icon: PhoneCall,
    description: "Handle incoming customer inquiries, project submissions & territory follow-ups",
    buttons: [
      { key: "call", label: "Direct Call", hint: "Allow initiating phone calls to leads" },
      { key: "updateStatus", label: "Update Status", hint: "Allow changing lead pipeline stages" },
      { key: "addNote", label: "Add Call Log", hint: "Allow recording client conversation notes" },
      { key: "delete", label: "Delete Lead", hint: "Allow deleting inquiry records" },
    ],
  },
  {
    key: "staff",
    name: "Staff & Team",
    icon: Users,
    description: "Workforce governance, create staff accounts & configure permissions",
    buttons: [
      { key: "add", label: "Add Staff", hint: "Allow onboarding new staff members" },
      { key: "edit", label: "Edit Staff", hint: "Allow updating member profile & roles" },
      { key: "delete", label: "Delete Staff", hint: "Allow deleting staff accounts" },
    ],
  },
  {
    key: "dashboard",
    name: "Console Dashboard",
    icon: LayoutDashboard,
    description: "Access to telemetry metrics and administrative console overview",
    buttons: [],
  },
];

const StaffForm = ({ initial, roles, mode, onSave, onCancel }) => {
  const [form, setForm] = useState(() => {
    const sidebar = {
      dashboard: false,
      telecaller: true,
      homeControl: false,
      staff: false,
      ...(initial?.permissions?.sidebar || {}),
    };

    const buttons = {
      telecaller: {
        call: false,
        updateStatus: false,
        addNote: false,
        delete: false,
        ...(initial?.permissions?.buttons?.telecaller || {}),
      },
      homeControl: {
        edit: false,
        deploy: false,
        publish: false,
        delete: false,
        ...(initial?.permissions?.buttons?.homeControl || {}),
      },
      staff: {
        add: false,
        edit: false,
        delete: false,
        ...(initial?.permissions?.buttons?.staff || {}),
      },
      ...(initial?.permissions?.buttons || {}),
    };

    // If initial had publish but not deploy, keep them synchronized
    if (buttons.homeControl?.publish && !buttons.homeControl.deploy) {
      buttons.homeControl.deploy = true;
    }

    return {
      name: initial?.name || "",
      email: initial?.email || "",
      phone: initial?.phone || "",
      password: "",
      role: initial?.role?._id || (typeof initial?.role === "string" ? initial.role : ""),
      state: initial?.state || "All",
      ...initial,
      permissions: {
        sidebar,
        buttons,
      },
    };
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleSidebar(key) {
    setForm((f) => {
      const isEnabled = !f.permissions.sidebar[key];
      return {
        ...f,
        permissions: {
          ...f.permissions,
          sidebar: {
            ...f.permissions.sidebar,
            [key]: isEnabled,
          },
        },
      };
    });
  }

  function toggleButton(section, action) {
    setForm((f) => {
      const sectionButtons = f.permissions?.buttons?.[section] || {};
      const newVal = !sectionButtons[action];
      const updatedSection = { ...sectionButtons, [action]: newVal };

      // Keep deploy and publish synchronized for Home Control CMS
      if (section === "homeControl" && (action === "deploy" || action === "publish")) {
        updatedSection.deploy = newVal;
        updatedSection.publish = newVal;
      }

      return {
        ...f,
        permissions: {
          ...f.permissions,
          buttons: {
            ...f.permissions?.buttons,
            [section]: updatedSection,
          },
        },
      };
    });
  }

  const submit = async () => {
    setErr("");

    if (!form.name || !form.phone) {
      setErr("Name and phone are required.");
      return;
    }

    if (mode === "add" && !form.password) {
      setErr("Password is required for new staff.");
      return;
    }

    const body = { ...form };
    if (!body.password) delete body.password;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url =
        mode === "edit"
          ? `${API_BASE_URL}/users/update-user/${initial._id}`
          : `${API_BASE_URL}/users/create-user`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Request failed");
      }

      onSave();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#0756A5] focus:ring-1 focus:ring-blue-100 bg-white text-gray-800";

  return (
    <div className="space-y-5">
      {/* ── BASIC INFO ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Full name *
          </label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Rahul Sharma"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Email *
          </label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="e.g. rahul@vishwakarma.com"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Phone *
          </label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="e.g. +91 98765 43210"
          />
        </div>

        {mode === "add" && (
          <div>
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Password *
            </label>
            <input
              className={inputClass}
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Role
          </label>
          <select
            className={inputClass}
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="">Select role…</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Assigned State (Territory Routing)
          </label>
          <select
            className={inputClass}
            value={form.state || "All"}
            onChange={(e) => update("state", e.target.value)}
          >
            <option value="All">All States (National / Head Office)</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── GRANULAR PERMISSION CONTROLS (SIDEBAR & BUTTONS) ── */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div>
          <h3 className="text-xs font-black text-[#082B59] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#FF6900]" />
            <span>Module Access & Granular Button Permissions</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Enable sidebar navigation access, then specify exact buttons (Edit, Deploy, Delete, etc.) permitted for this user.
          </p>
        </div>

        <div className="space-y-3">
          {MODULE_DEFINITIONS.map((mod) => {
            const IconComp = mod.icon;
            const hasSidebarAccess = form.permissions?.sidebar?.[mod.key] === true;
            const sectionButtons = form.permissions?.buttons?.[mod.key] || {};

            return (
              <div
                key={mod.key}
                className={`p-3.5 rounded-2xl border transition-all ${
                  hasSidebarAccess
                    ? "bg-white border-blue-200 shadow-xs"
                    : "bg-gray-50/70 border-gray-200/70 opacity-75"
                }`}
              >
                {/* Module Header / Toggle */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        hasSidebarAccess
                          ? "bg-blue-50 text-[#0756A5]"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <IconComp size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#082B59] flex items-center gap-2">
                        <span>{mod.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            hasSidebarAccess
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {hasSidebarAccess ? "Sidebar Granted" : "No Sidebar Access"}
                        </span>
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSidebar(mod.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      hasSidebarAccess
                        ? "bg-[#0756A5] text-white shadow-xs hover:bg-blue-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {hasSidebarAccess ? "Disable Tab" : "Enable Tab"}
                  </button>
                </div>

                {/* Button Permissions Sub-Section */}
                {mod.buttons.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Allowed Button Actions:
                    </span>

                    {!hasSidebarAccess ? (
                      <div className="text-[11px] text-gray-400 italic bg-gray-100/60 p-2 rounded-xl flex items-center gap-1.5">
                        <Lock size={12} className="text-gray-400 shrink-0" />
                        <span>All button actions locked (Enable sidebar tab above to grant actions).</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {mod.buttons.map((btn) => {
                          const isAllowed = sectionButtons[btn.key] === true;

                          return (
                            <button
                              type="button"
                              key={btn.key}
                              onClick={() => toggleButton(mod.key, btn.key)}
                              title={btn.hint}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                                isAllowed
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs hover:bg-emerald-100"
                                  : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200 hover:text-gray-600"
                              }`}
                            >
                              {isAllowed ? (
                                <Check size={12} className="text-emerald-600 stroke-[3]" />
                              ) : (
                                <X size={12} className="text-gray-400" />
                              )}
                              <span>{btn.label}</span>
                              <span
                                className={`text-[9px] px-1 py-0.2 rounded font-mono uppercase ${
                                  isAllowed
                                    ? "bg-emerald-200/70 text-emerald-900"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {isAllowed ? "Allowed" : "Denied"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {err && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
          {err}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white hover:from-[#064a8f] hover:to-[#072449] shadow-md transition-all disabled:opacity-50"
        >
          {loading ? "Saving Staff..." : mode === "add" ? "Create Staff Account" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default StaffForm;
