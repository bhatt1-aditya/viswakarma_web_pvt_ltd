import React, { useState } from "react";
import API_BASE_URL from "../../../utils/apiConfig";
import { INDIAN_STATES } from "../../../utils/indianStates";

const StaffForm = ({ initial, roles, mode, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    state: "All",
    ...initial,
    permissions: {
      sidebar: {
        dashboard: false,
        telecaller: true,
        staff: false,
        ...(initial?.permissions?.sidebar || {}),
      },
      buttons: {
        telecaller: {
          call: true,
          updateStatus: true,
          addNote: true,
          ...(initial?.permissions?.buttons?.telecaller || {}),
        },
        staff: {
          add: false,
          edit: false,
          delete: false,
          ...(initial?.permissions?.buttons?.staff || {}),
        },
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [activeSidebar, setActiveSidebar] = useState(null);

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleSidebar(key) {
    setForm((f) => {
      const isEnabled = !f.permissions.sidebar[key];
      setActiveSidebar(isEnabled ? key : null);

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
      return {
        ...f,
        permissions: {
          ...f.permissions,
          buttons: {
            ...f.permissions?.buttons,
            [section]: {
              ...sectionButtons,
              [action]: !sectionButtons[action],
            },
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
      const url =
        mode === "edit"
          ? `${API_BASE_URL}/users/update-user/${initial._id}`
          : `${API_BASE_URL}/users/create-user`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
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
    }

    setLoading(false);
  }

  const inputClass =
    "w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 bg-white text-gray-800";

  return (
    <>
      {/* ── BASIC INFO ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-medium">
            Full name
          </label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium">Email</label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium">Phone</label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>

        {mode === "add" && (
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Password
            </label>
            <input
              className={inputClass}
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-500 font-medium">Role</label>
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
          <label className="text-xs text-gray-500 font-medium">Assigned State (Telecaller & Region)</label>
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

      {/* ── PERMISSIONS ── */}
      <div className="mt-6">
        {/* Sidebar */}
        <p className="text-xs text-gray-500 font-medium mb-2">
          Sidebar Permissions
        </p>

        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(form.permissions.sidebar).map((key) => {
            const active = form.permissions.sidebar[key];

            return (
              <span
                key={key}
                onClick={() => toggleSidebar(key)}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer border
          ${active
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
              >
                {key}
              </span>
            );
          })}
        </div>

        {/* Buttons */}
        <p className="text-xs text-gray-500 font-medium mb-2">
          Button Permissions
        </p>

        {!activeSidebar || !form.permissions.sidebar[activeSidebar] ? (
          <div className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg p-3 text-center">
            N/A — Select a sidebar module first
          </div>
        ) : !form.permissions.buttons[activeSidebar] ? (
          <div className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg p-3 text-center">
            No button permissions available
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 mb-1 capitalize">
              {activeSidebar}
            </p>

            <div className="flex gap-2 flex-wrap">
              {Object.keys(form.permissions.buttons[activeSidebar]).map(
                (action) => {
                  const active =
                    form.permissions.buttons[activeSidebar][action];

                  return (
                    <span
                      key={action}
                      onClick={() =>
                        toggleButton(activeSidebar, action)
                      }
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer border
                ${active
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                    >
                      {action}
                    </span>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* ERROR */}
      {err && (
        <p className="text-xs text-red-600 mt-3">{err}</p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 justify-end mt-5">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className={`px-4 py-2 text-sm rounded-lg text-white font-medium
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-700"
            }`}
        >
          {loading
            ? "Saving…"
            : mode === "add"
              ? "Add member"
              : "Save changes"}
        </button>
      </div>
    </>
  );
};

export default StaffForm;