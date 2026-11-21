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
  Compass,
  Layers,
  Globe,
  ChevronDown,
  Building2,
  FolderGit2,
  Tag,
} from "lucide-react";
import API_BASE_URL from "../../../utils/apiConfig";
import { INDIAN_STATES } from "../../../utils/indianStates";

const CORE_MODULE_DEFINITIONS = [
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

const WEBSITE_CONTROL_MODULES = [
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
    key: "aboutControl",
    name: "About Us CMS",
    icon: Compass,
    description: "Manage About Us company story, mission, vision, core values & engineering framework",
    buttons: [
      { key: "edit", label: "Edit Content", hint: "Allow modifying text & configuration" },
      { key: "deploy", label: "Deploy / Publish", hint: "Allow saving & publishing live changes" },
      { key: "delete", label: "Delete Elements", hint: "Allow removing phrases & items" },
    ],
  },
  {
    key: "servicesControl",
    name: "Services CMS",
    icon: Layers,
    description: "Manage 108+ digital services catalog, add new services, update tech stack & delete",
    buttons: [
      { key: "add", label: "Add Service", hint: "Allow creating new service entries" },
      { key: "edit", label: "Edit Service", hint: "Allow modifying service details & tech stacks" },
      { key: "delete", label: "Delete Service", hint: "Allow deleting service records" },
    ],
  },
  {
    key: "industriesControl",
    name: "Industries CMS",
    icon: Building2,
    description: "Manage 12 industry sectors, architectural pain points, engineered solutions & demo links",
    buttons: [
      { key: "add", label: "Add Industry", hint: "Allow adding new industry verticals" },
      { key: "edit", label: "Edit Industry", hint: "Allow modifying industry solutions & details" },
      { key: "delete", label: "Delete Industry", hint: "Allow deleting industry records" },
    ],
  },
  {
    key: "portfolioControl",
    name: "Portfolio CMS",
    icon: FolderGit2,
    description: "Manage case studies, client ROI, deliverables, tech stacks & live prototype links",
    buttons: [
      { key: "add", label: "Add Case Study", hint: "Allow creating new case study entries" },
      { key: "edit", label: "Edit Case Study", hint: "Allow modifying case study deliverables & results" },
      { key: "delete", label: "Delete Case Study", hint: "Allow removing portfolio projects" },
    ],
  },
  {
    key: "pricingControl",
    name: "Pricing CMS",
    icon: Tag,
    description: "Manage standard engagement tiers, highlight badges, deliverables & billing FAQs",
    buttons: [
      { key: "add", label: "Add Tier / FAQ", hint: "Allow adding new pricing packages or FAQs" },
      { key: "edit", label: "Edit Tier / FAQ", hint: "Allow modifying tier packages & FAQ answers" },
      { key: "delete", label: "Delete Tier / FAQ", hint: "Allow deleting pricing records" },
    ],
  },
];

const StaffForm = ({ initial, roles, mode, onSave, onCancel }) => {
  const [form, setForm] = useState(() => {
    const sidebar = {
      dashboard: false,
      telecaller: true,
      websiteControl: false,
      homeControl: false,
      aboutControl: false,
      servicesControl: false,
      industriesControl: false,
      portfolioControl: false,
      pricingControl: false,
      staff: false,
      ...(initial?.permissions?.sidebar || {}),
    };

    if (
      sidebar.homeControl ||
      sidebar.aboutControl ||
      sidebar.servicesControl ||
      sidebar.industriesControl ||
      sidebar.portfolioControl ||
      sidebar.pricingControl
    ) {
      sidebar.websiteControl = true;
    }

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
      aboutControl: {
        edit: false,
        deploy: false,
        publish: false,
        delete: false,
        ...(initial?.permissions?.buttons?.aboutControl || {}),
      },
      servicesControl: {
        add: false,
        edit: false,
        deploy: false,
        publish: false,
        delete: false,
        ...(initial?.permissions?.buttons?.servicesControl || {}),
      },
      industriesControl: {
        add: false,
        edit: false,
        deploy: false,
        publish: false,
        delete: false,
        ...(initial?.permissions?.buttons?.industriesControl || {}),
      },
      portfolioControl: {
        add: false,
        edit: false,
        deploy: false,
        publish: false,
        delete: false,
        ...(initial?.permissions?.buttons?.portfolioControl || {}),
      },
      pricingControl: {
        add: false,
        edit: false,
        deploy: false,
        publish: false,
        delete: false,
        ...(initial?.permissions?.buttons?.pricingControl || {}),
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
    if (buttons.aboutControl?.publish && !buttons.aboutControl.deploy) {
      buttons.aboutControl.deploy = true;
    }
    if (buttons.servicesControl?.publish && !buttons.servicesControl.deploy) {
      buttons.servicesControl.deploy = true;
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

  function toggleWebsiteControl() {
    setForm((f) => {
      const current = f.permissions?.sidebar?.websiteControl === true;
      const next = !current;
      return {
        ...f,
        permissions: {
          ...f.permissions,
          sidebar: {
            ...f.permissions.sidebar,
            websiteControl: next,
            ...(!next
              ? {
                  homeControl: false,
                  aboutControl: false,
                  servicesControl: false,
                  industriesControl: false,
                  portfolioControl: false,
                  pricingControl: false,
                }
              : {}),
          },
        },
      };
    });
  }

  function toggleSidebar(key) {
    setForm((f) => {
      const isEnabled = !f.permissions.sidebar[key];
      const updatedSidebar = {
        ...f.permissions.sidebar,
        [key]: isEnabled,
      };
      if (
        [
          "homeControl",
          "aboutControl",
          "servicesControl",
          "industriesControl",
          "portfolioControl",
          "pricingControl",
        ].includes(key) &&
        isEnabled
      ) {
        updatedSidebar.websiteControl = true;
      }
      return {
        ...f,
        permissions: {
          ...f.permissions,
          sidebar: updatedSidebar,
        },
      };
    });
  }

  function toggleButton(section, action) {
    setForm((f) => {
      const sectionButtons = f.permissions?.buttons?.[section] || {};
      const newVal = !sectionButtons[action];
      const updatedSection = { ...sectionButtons, [action]: newVal };

      // Keep deploy and publish synchronized for Home, About, Services, Industries, Portfolio, Pricing
      if (
        (section === "homeControl" ||
          section === "aboutControl" ||
          section === "servicesControl" ||
          section === "industriesControl" ||
          section === "portfolioControl" ||
          section === "pricingControl") &&
        (action === "deploy" || action === "publish")
      ) {
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
            Enable sidebar navigation access (Edit, Deploy, Delete, etc.) permitted for this user.
          </p>
        </div>

        <div className="space-y-4">
          {/* Core Modules (Telecaller, Staff, Dashboard) */}
          {CORE_MODULE_DEFINITIONS.map((mod) => {
            const IconComp = mod.icon;
            const hasSidebarAccess = form.permissions?.sidebar?.[mod.key] === true;
            const sectionButtons = form.permissions?.buttons?.[mod.key] || {};

            return (
              <div
                key={mod.key}
                className={`p-3.5 rounded-2xl border transition-all ${hasSidebarAccess
                  ? "bg-white border-blue-200 shadow-xs"
                  : "bg-gray-50/70 border-gray-200/70 opacity-75"
                  }`}
              >
                {/* Module Header / Toggle */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${hasSidebarAccess
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
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${hasSidebarAccess
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                          {hasSidebarAccess ? "Sidebar Granted" : "No Sidebar Access"}
                        </span>
                      </h4>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSidebar(mod.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${hasSidebarAccess
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
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${isAllowed
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
                                className={`text-[9px] px-1 py-0.2 rounded font-mono uppercase ${isAllowed
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

          {/* ── PARENT MASTER WEBSITE CONTROLS CARD ── */}
          <div
            className={`p-4 rounded-2xl border transition-all ${form.permissions?.sidebar?.websiteControl === true
              ? "bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-300 shadow-sm"
              : "bg-gray-50/70 border-gray-200/80"
              }`}
          >
            {/* Master Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${form.permissions?.sidebar?.websiteControl === true
                    ? "bg-[#0756A5] text-white shadow-xs"
                    : "bg-gray-200 text-gray-400"
                    }`}
                >
                  <Globe size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#082B59] flex items-center gap-2">
                    <span>Website Controls</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${form.permissions?.sidebar?.websiteControl === true
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {form.permissions?.sidebar?.websiteControl === true
                        ? "Master Granted"
                        : "Master Disabled"}
                    </span>
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleWebsiteControl}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${form.permissions?.sidebar?.websiteControl === true
                  ? "bg-[#0756A5] text-white shadow-xs hover:bg-blue-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {form.permissions?.sidebar?.websiteControl === true
                  ? "Disable Website Controls"
                  : "Enable Website Controls"}
              </button>
            </div>

            {/* NESTED SUB-TABS (Only shown if websiteControl master is enabled) */}
            {form.permissions?.sidebar?.websiteControl === true ? (
              <div className="mt-4 pt-4 border-t border-blue-100 space-y-3 pl-2 sm:pl-4">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0756A5] uppercase tracking-wider">
                  <ChevronDown size={14} />
                  <span>Sub-Tabs Under Website Controls</span>
                </div>

                <div className="space-y-3">
                  {WEBSITE_CONTROL_MODULES.map((subMod) => {
                    const SubIcon = subMod.icon;
                    const hasSubAccess = form.permissions?.sidebar?.[subMod.key] === true;
                    const sectionButtons = form.permissions?.buttons?.[subMod.key] || {};

                    return (
                      <div
                        key={subMod.key}
                        className={`p-3 rounded-xl border transition-all ${hasSubAccess
                          ? "bg-white border-blue-200 shadow-2xs"
                          : "bg-gray-50/80 border-gray-200/70"
                          }`}
                      >
                        {/* Sub-tab Header */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasSubAccess
                                ? "bg-blue-100 text-[#0756A5]"
                                : "bg-gray-200 text-gray-400"
                                }`}
                            >
                              <SubIcon size={14} />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-[#082B59] flex items-center gap-1.5">
                                <span>{subMod.name}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${hasSubAccess
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                                >
                                  {hasSubAccess ? "Active Tab" : "Tab Disabled"}
                                </span>
                              </h5>

                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSidebar(subMod.key)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${hasSubAccess
                              ? "bg-blue-600 text-white shadow-2xs hover:bg-blue-700"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                          >
                            {hasSubAccess ? "Disable Tab" : "Enable Tab"}
                          </button>
                        </div>

                        {/* Sub-tab Buttons */}
                        {subMod.buttons.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100">
                            {!hasSubAccess ? (
                              <div className="text-[10px] text-gray-400 italic flex items-center gap-1">
                                <Lock size={11} />
                                <span>Enable {subMod.name} to grant button actions.</span>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {subMod.buttons.map((btn) => {
                                  const isAllowed = sectionButtons[btn.key] === true;
                                  return (
                                    <button
                                      type="button"
                                      key={btn.key}
                                      onClick={() => toggleButton(subMod.key, btn.key)}
                                      title={btn.hint}
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border transition-all ${isAllowed
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                        : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200"
                                        }`}
                                    >
                                      {isAllowed ? (
                                        <Check size={11} className="text-emerald-600 stroke-[3]" />
                                      ) : (
                                        <X size={11} className="text-gray-400" />
                                      )}
                                      <span>{btn.label}</span>
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
            ) : (
              <div className="mt-2.5 p-2.5 bg-gray-100/60 rounded-xl text-center text-xs text-gray-400 italic flex items-center justify-center gap-1.5">
                <Lock size={12} />
                <span>Website Controls are disabled. Enable above to reveal sub-tabs (Home, About Us, Services).</span>
              </div>
            )}
          </div>
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
