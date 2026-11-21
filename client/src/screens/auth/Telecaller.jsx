import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneCall,
  Phone,
  MessageSquare,
  Search,
  Filter,
  MapPin,
  Clock,
  Layers,
  X,
  Plus,
  RefreshCw,
  Mail,
  Building,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../utils/apiConfig";
import { INDIAN_STATES } from "../../utils/indianStates";

const STATUS_OPTIONS = ["New", "Contacted", "Interested", "Follow-up", "Qualified", "Closed"];

const getStatusBadge = (status = "New") => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "contacted":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "interested":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "follow-up":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "qualified":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "closed":
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const Telecaller = () => {
  const navigate = useNavigate();
  const { user, permissions, loading: authLoading } = useAuth();
  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const isAdmin = ["admin", "superadmin"].includes(roleName);
  const hasTelecallerAccess = isAdmin || permissions?.sidebar?.telecaller === true;

  // Granular button permissions
  const canCall = isAdmin || permissions?.buttons?.telecaller?.call === true;
  const canUpdateStatus = isAdmin || permissions?.buttons?.telecaller?.updateStatus === true;
  const canAddNote = isAdmin || permissions?.buttons?.telecaller?.addNote === true;

  // Route guard: if user does not have permission for telecaller section, redirect
  useEffect(() => {
    if (!authLoading && user && !hasTelecallerAccess) {
      if (permissions?.sidebar?.dashboard === true) {
        navigate("/dashboard", { replace: true });
      } else if (permissions?.sidebar?.staff === true) {
        navigate("/staff", { replace: true });
      }
    }
  }, [authLoading, user, hasTelecallerAccess, permissions, navigate]);

  // Determine user's assigned state: if assigned to specific state, default to it
  const userAssignedState = user?.state && user.state !== "All" && user.state !== "All States (National)"
    ? user.state
    : "All";

  const [selectedState, setSelectedState] = useState(userAssignedState);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'projects' | 'contact'
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Inquiries data
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  // Sync assigned state if user loads later
  useEffect(() => {
    if (user?.state && user.state !== "All" && user.state !== "All States (National)") {
      setSelectedState(user.state);
    }
  }, [user]);

  // Fetch inquiries from both endpoints and unify them
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const params = {
        state: selectedState !== "All" ? selectedState : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search.trim() || undefined,
        limit: 100,
      };

      const [inqRes, quoteRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/inquiries/all`, {
          params,
          withCredentials: true,
          headers: authHeader,
        }),
        axios.get(`${API_BASE_URL}/quotes/all`, {
          params,
          withCredentials: true,
          headers: authHeader,
        }),
      ]);

      const rawInquiries = inqRes.status === "fulfilled" && inqRes.value.data?.inquiries
        ? inqRes.value.data.inquiries.map((item) => ({
          ...item,
          type: "contact",
          typeLabel: "Contact Form",
          projectName: item.serviceRequired || "General Consultation",
        }))
        : [];

      const rawQuotes = quoteRes.status === "fulfilled" && quoteRes.value.data?.quotes
        ? quoteRes.value.data.quotes.map((item) => ({
          ...item,
          type: "project",
          typeLabel: "Project Application",
          projectName: item.serviceName || item.serviceCategory || "Custom Software Project",
        }))
        : [];

      // Combine and sort newest first
      const combined = [...rawQuotes, ...rawInquiries].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setInquiries(combined);
    } catch (err) {
      console.error("Failed to load telecaller inquiries:", err);
      toast.error("Failed to fetch telecaller leads.");
    } finally {
      setLoading(false);
    }
  }, [selectedState, statusFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter by Tab (All, Projects Only, Contact Only)
  const filteredInquiries = inquiries.filter((item) => {
    if (activeTab === "projects") return item.type === "project";
    if (activeTab === "contact") return item.type === "contact";
    return true;
  });

  // Calculate Metrics
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => (i.status || "New").toLowerCase() === "new").length;
  const followUpCount = inquiries.filter((i) => (i.status || "").toLowerCase() === "follow-up").length;
  const qualifiedCount = inquiries.filter((i) => (i.status || "").toLowerCase() === "qualified").length;

  // Handle status update
  const handleUpdateStatus = async (item, newStatus) => {
    if (!canUpdateStatus) {
      toast.error("Permission Denied: You do not have permission to update lead status.");
      return;
    }
    try {
      const endpoint = item.type === "project" ? `/quotes/status/${item._id}` : `/inquiries/status/${item._id}`;
      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.put(
        `${API_BASE_URL}${endpoint}`,
        { status: newStatus, author: user?.name || "Telecaller" },
        { withCredentials: true, headers: authHeader }
      );

      toast.success(`Status updated to ${newStatus}`);
      setInquiries((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle call note addition
  const handleSaveNote = async () => {
    if (!canAddNote) {
      toast.error("Permission Denied: You do not have permission to add call notes.");
      return;
    }
    if (!noteText.trim() || !selectedInquiry) return;
    setSavingNote(true);
    try {
      const endpoint =
        selectedInquiry.type === "project"
          ? `/quotes/status/${selectedInquiry._id}`
          : `/inquiries/status/${selectedInquiry._id}`;

      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(
        `${API_BASE_URL}${endpoint}`,
        {
          noteText: noteText.trim(),
          author: user?.name || "Telecaller Staff",
        },
        { withCredentials: true, headers: authHeader }
      );

      toast.success("Call note added to lead record");
      const updatedItem = res.data.inquiry || res.data.quote;
      if (updatedItem) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === selectedInquiry._id ? { ...i, notes: updatedItem.notes } : i))
        );
      }
      setNoteText("");
      setNoteModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const getCleanPhone = (phone = "") => phone.replace(/\D/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 mx-auto"
    >
      {/* ── 1. HEADER & STATE ASSIGNMENT BANNER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#FF6900] uppercase tracking-wider block">
              Telecaller & Inbound Operations
            </span>
            {userAssignedState !== "All" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0756A5] border border-blue-200">
                <MapPin size={11} className="text-[#FF6900]" />
                <span>Assigned State: {userAssignedState}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck size={11} />
                <span>National Coverage (All States)</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59] mt-0.5">
            Project Applications & Client Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Real-time queue of potential clients applying for software projects, enterprise systems, or contact consultations.
          </p>
        </div>

        {/* State Filter + Refresh Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* State Selector */}
          <div className="relative min-w-[200px]">
            <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6900] pointer-events-none" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full pl-8 pr-8 py-2.5 text-xs font-bold border border-gray-300 rounded-xl outline-none focus:border-[#0756A5] bg-white shadow-2xs appearance-none text-gray-800"
            >
              {isAdmin && <option value="All">All States (National Feed)</option>}
              {INDIAN_STATES.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 shadow-2xs transition-colors flex items-center justify-center"
            title="Refresh Inbound Queue"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#0756A5]" : ""} />
          </button>
        </div>
      </div>

      {/* ── 2. METRIC STATS CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Total Inbound
          </span>
          <p className="text-2xl font-black text-[#082B59] mt-0.5">{totalCount}</p>
          <span className="text-[10px] text-gray-500 font-medium">In {selectedState}</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Needs Calling (New)
          </span>
          <p className="text-2xl font-black text-blue-600 mt-0.5">{newCount}</p>
          <span className="text-[10px] text-blue-600 font-semibold">Immediate Action</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Follow-Ups
          </span>
          <p className="text-2xl font-black text-[#FF6900] mt-0.5">{followUpCount}</p>
          <span className="text-[10px] text-orange-600 font-medium">Active Conversations</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Qualified / Closed
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-0.5">{qualifiedCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for Proposal</span>
        </div>
      </div>

      {/* ── 3. FILTER & SEARCH CONTROLS ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "all" ? "bg-white text-[#0756A5] shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
          >
            All Leads ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "projects" ? "bg-white text-[#0756A5] shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Project Inquiries ({inquiries.filter((i) => i.type === "project").length})
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "contact" ? "bg-white text-[#0756A5] shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Contact Forms ({inquiries.filter((i) => i.type === "contact").length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, project..."
              className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#0756A5] bg-gray-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="relative min-w-[130px]">
            <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-7 pr-6 py-1.5 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-[#0756A5] bg-gray-50/50 appearance-none"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── 4. INQUIRY CARDS QUEUE ── */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400 space-y-2">
          <RefreshCw size={24} className="mx-auto animate-spin text-[#0756A5]" />
          <p>Syncing inbound telecaller queue for {selectedState}...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center space-y-3">
          <PhoneCall size={36} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-800">No applications found in {selectedState}</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {search || statusFilter !== "all"
              ? "Try resetting your search query or status filter."
              : `New inquiries submitted from ${selectedState} will automatically appear in this telecaller queue.`}
          </p>
          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="px-4 py-1.5 rounded-xl bg-blue-50 text-[#0756A5] text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((item) => {
            const cleanPhone = getCleanPhone(item.phone);
            const notes = item.notes || [];

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Top Row: Client Info, Type Badge, State Pill, Status Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0756A5] to-[#FF6900] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {item.fullName ? item.fullName.slice(0, 2).toUpperCase() : "CL"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-900">{item.fullName}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.type === "project"
                              ? "bg-orange-50 text-[#FF6900] border-orange-200"
                              : "bg-blue-50 text-[#0756A5] border-blue-200"
                            }`}
                        >
                          {item.typeLabel}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
                          <MapPin size={10} className="text-[#FF6900]" />
                          <span>{item.state || "All States"}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                        {item.companyName && (
                          <span className="flex items-center gap-1">
                            <Building size={12} />
                            <span>{item.companyName}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[11px] font-semibold text-gray-400">Call Status:</span>
                    <select
                      disabled={!canUpdateStatus}
                      value={item.status || "New"}
                      onChange={(e) => handleUpdateStatus(item, e.target.value)}
                      title={
                        !canUpdateStatus
                          ? "Status update permission not granted by Admin"
                          : "Change call status"
                      }
                      className={`px-3 py-1 rounded-xl text-xs font-bold border outline-none ${
                        !canUpdateStatus
                          ? "opacity-60 cursor-not-allowed bg-gray-100 text-gray-500 border-gray-200"
                          : "cursor-pointer " + getStatusBadge(item.status)
                      }`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Middle Row: Project Details & Description */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                  {/* Left: Project Applied For (4 cols) */}
                  <div className="lg:col-span-4 bg-slate-50/70 p-3.5 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Target Project / Service
                    </span>
                    <p className="font-bold text-[#082B59] text-xs flex items-center gap-1.5">
                      <Layers size={14} className="text-[#0756A5]" />
                      <span>{item.projectName}</span>
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200/50">
                      <span className="text-gray-400">Budget:</span>
                      <span className="font-semibold text-gray-700">
                        {item.projectBudget || item.estimatedPriceRange || "Custom Scope"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">Timeline:</span>
                      <span className="font-semibold text-gray-700">
                        {item.projectTimeline || item.timeline || "Standard Sprint"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Client Message / Scope Description (8 cols) */}
                  <div className="lg:col-span-8 bg-slate-50/70 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Client Scope & Requirements
                      </span>
                      <p className="text-xs text-gray-700 leading-relaxed italic">
                        "{item.projectDescription || item.message || "No project description provided."}"
                      </p>
                    </div>

                    {/* Telecaller Notes summary */}
                    {notes.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200/50">
                        <span className="text-[10px] font-bold text-blue-800 uppercase block">
                          Latest Telecaller Note ({notes.length} total):
                        </span>
                        <p className="text-[11px] text-gray-600">
                          <strong className="text-gray-800">{notes[notes.length - 1].author}:</strong>{" "}
                          {notes[notes.length - 1].text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Contact Actions & Add Note */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} className="text-gray-400" />
                      <span>{item.phone}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} className="text-gray-400" />
                      <span>{item.email}</span>
                    </span>
                  </div>

                  {/* Telecaller Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Call Button */}
                    {canCall ? (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#0756A5] hover:bg-blue-100 text-xs font-bold transition-colors"
                      >
                        <PhoneCall size={13} />
                        <span>Direct Call</span>
                      </a>
                    ) : (
                      <span
                        title="Direct Call permission not granted by Admin"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
                      >
                        <PhoneCall size={13} />
                        <span>Call Locked</span>
                      </span>
                    )}

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                        item.fullName
                      )},%20this%20is%20from%20Vishwakarma%20Web%20regarding%20your%20inquiry%20for%20${encodeURIComponent(
                        item.projectName
                      )}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>

                    {/* Add Call Log Note Button */}
                    <button
                      onClick={() => {
                        if (!canAddNote) {
                          toast.error("Permission Denied: You do not have permission to add call notes.");
                          return;
                        }
                        setSelectedInquiry(item);
                        setNoteModalOpen(true);
                      }}
                      disabled={!canAddNote}
                      title={!canAddNote ? "Add Note permission not granted by Admin" : "Add Call Log"}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        canAddNote
                          ? "bg-orange-50 text-[#FF6900] hover:bg-orange-100 cursor-pointer"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Plus size={13} />
                      <span>{canAddNote ? "Add Call Log" : "Note Locked"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── 5. ADD TELECALLER CALL LOG / NOTE MODAL ── */}
      <AnimatePresence>
        {noteModalOpen && selectedInquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNoteModalOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative bg-white border border-gray-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h4 className="text-base font-bold text-[#082B59]">Add Telecaller Log</h4>
                  <p className="text-xs text-gray-400">
                    Client: <strong className="text-gray-700">{selectedInquiry.fullName}</strong> ({selectedInquiry.phone})
                  </p>
                </div>
                <button
                  onClick={() => setNoteModalOpen(false)}
                  className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Existing Notes history */}
              {selectedInquiry.notes && selectedInquiry.notes.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Call History Logs:
                  </span>
                  {selectedInquiry.notes.map((n, idx) => (
                    <div key={idx} className="pb-1.5 border-b border-gray-200/50 last:border-b-0">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="font-bold text-[#0756A5]">{n.author || "Telecaller"}</span>
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mt-0.5">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Note input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Call Discussion / Follow-Up Details:
                </label>
                <textarea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Spoke with client. Client requires Next.js web application for real estate. Budget ₹2.5 Lakh. Scheduled demo call for Thursday 4 PM."
                  className="w-full p-3 text-xs border border-gray-200 rounded-2xl outline-none focus:border-[#0756A5] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-2">
                <button
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote || !noteText.trim()}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white hover:from-[#064a8f] hover:to-[#072449] disabled:opacity-50 transition-all shadow-sm"
                >
                  {savingNote ? "Saving..." : "Save Call Log"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Telecaller;
