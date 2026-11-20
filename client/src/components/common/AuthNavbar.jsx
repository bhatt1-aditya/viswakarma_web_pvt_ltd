import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Activity,
  PhoneCall,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AuthNavbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, permissions, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  ).toLowerCase();
  const isAdmin = ["admin", "superadmin"].includes(roleName);
  const displayRole =
    user?.role?.name ||
    (typeof user?.role === "string" && user.role.trim()
      ? user.role
      : isAdmin
      ? "Admin"
      : "Telecaller Staff");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/80 z-50 shadow-xs">
      <div className="h-full px-2 sm:px-4 flex items-center justify-between">
        {/* LEFT: MOBILE TOGGLE + BRAND LOGO */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-[#0756A5] hover:bg-blue-50 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0756A5] to-[#082B59] flex items-center justify-center text-white font-black text-sm shadow-sm">
              VK
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-wider text-[#082B59] uppercase">
                  Vishwakarma
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-[#0756A5] border border-blue-200 uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                Web Pvt Ltd
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER / STATUS: TELEMETRY BADGE (Hidden on smallest mobile) */}
        <div className="hidden md:flex items-center gap-3">

        </div>

        {/* RIGHT: PORTAL SHORTCUTS + USER DROPDOWN */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink size={12} className="text-gray-400" />
          </a>

          <a
            href="/live-demos"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#FF6900] hover:bg-orange-100 text-xs font-bold transition-colors"
          >
            <Sparkles size={12} />
            <span>20 Demos</span>
          </a>

          {/* USER PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0756A5] to-[#FF6900] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-gray-800 max-w-[120px] truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] text-gray-400 font-medium capitalize">
                  {displayRole}
                </span>
              </div>

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#0756A5]" : ""
                  }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
                >
                  {/* User info box */}
                  <div className="p-3 bg-gradient-to-r from-blue-50/60 to-orange-50/30 rounded-xl mb-1 border border-blue-100/50">
                    <p className="text-xs font-bold text-[#082B59] truncate">
                      {user?.name || "Staff Member"}
                    </p>
                    <p className="text-[11px] text-gray-500 font-mono truncate">
                      {user?.email || "user@vishwakarma.com"}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-[#0756A5] font-semibold">
                      <ShieldCheck size={11} />
                      <span className="capitalize">{displayRole}</span>
                    </div>
                  </div>

                  {/* Menu Options - Dynamic Permission Filtered */}
                  <div className="space-y-0.5">
                    {(isAdmin || permissions?.sidebar?.dashboard === true) && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0756A5] transition-colors"
                      >
                        <Activity size={14} className="text-[#0756A5]" />
                        <span>Console Dashboard</span>
                      </Link>
                    )}

                    {(isAdmin || permissions?.sidebar?.telecaller === true) && (
                      <Link
                        to="/telecaller"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0756A5] transition-colors"
                      >
                        <PhoneCall size={14} className="text-[#FF6900]" />
                        <span>Telecaller Portal</span>
                      </Link>
                    )}

                    {(isAdmin || permissions?.sidebar?.staff === true) && (
                      <Link
                        to="/staff"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0756A5] transition-colors"
                      >
                        <User size={14} className="text-[#0756A5]" />
                        <span>Staff & Team Access</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;
