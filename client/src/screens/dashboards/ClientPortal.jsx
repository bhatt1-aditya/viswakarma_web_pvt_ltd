import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Video,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../utils/apiConfig";

const ClientPortal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [dailyReports, setDailyReports] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const selectProject = useCallback(async (proj) => {
    setActiveProject(proj);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [reportsRes, invoicesRes, meetingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/daily-reports/project/${proj._id}`, { headers }),
        axios.get(`${API_BASE_URL}/financial/project/${proj._id}`, { headers }),
        axios.get(`${API_BASE_URL}/meetings/project/${proj._id}`, { headers }),
      ]);

      setDailyReports(reportsRes.data.data || []);
      setInvoices(invoicesRes.data.data || []);
      setMeetings(meetingsRes.data.data || []);
    } catch {
      // ignore
    }
  }, []);

  const fetchClientProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API_BASE_URL}/lifecycle-projects`, { headers });
      const projs = res.data.data || [];
      setProjects(projs);

      if (projs.length > 0) {
        selectProject(projs[0]);
      }
    } catch {
      toast.error("Failed to load client portal");
    }
  }, [selectProject]);

  useEffect(() => {
    fetchClientProjects();
  }, [fetchClientProjects]);

  const handleApproveMilestone = async (milestoneId) => {
    if (!window.confirm("Confirm approval and sign-off on this completed project milestone?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/lifecycle-projects/${activeProject._id}/milestones/${milestoneId}/approve`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Milestone signed off successfully!");
      // Refresh project
      const updatedProj = await axios.get(
        `${API_BASE_URL}/lifecycle-projects/${activeProject._id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setActiveProject(updatedProj.data.data);
    } catch {
      toast.error("Failed to sign off milestone");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-4 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#FF6900] tracking-wider uppercase">
            Client Self-Service Portal
          </span>
          <h1 className="text-2xl font-black text-[#082B59] mt-0.5">
            Welcome, {user?.name || "Client"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Client ID: <span className="font-mono font-bold text-[#0756A5]">{user?.clientId || "VK-CL-2026"}</span> • Monitor development progress, review daily reports, attend meetings, and sign off milestones.
          </p>
        </div>

        {activeProject && (
          <button
            onClick={() => navigate(`/projects/${activeProject._id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
          >
            <MessageSquare size={16} />
            <span>Open Project Team Chat</span>
          </button>
        )}
      </div>

      {/* PROJECT SELECTOR PILLS */}
      {projects.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {projects.map((p) => (
            <button
              key={p._id}
              onClick={() => selectProject(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeProject?._id === p._id
                  ? "bg-[#0756A5] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {activeProject ? (
        <div className="space-y-6">
          {/* PROJECT STATUS & PROGRESS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Card */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0756A5] border border-blue-200">
                    {activeProject.projectId}
                  </span>
                  <h2 className="text-lg font-extrabold text-[#082B59] mt-1.5">
                    {activeProject.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeProject.description || "Active custom software project"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Current Stage</span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-50 text-[#0756A5] border border-blue-200 mt-1 inline-block">
                    {activeProject.lifecycleStatus?.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Milestones Timeline */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-extrabold text-[#082B59] mb-3">
                  Project Milestones & Deliverables
                </h4>

                <div className="space-y-3">
                  {activeProject.milestones?.map((m, idx) => (
                    <div
                      key={m._id || idx}
                      className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0756A5] text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs text-[#082B59]">
                            {m.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 pl-7">{m.description}</p>
                      </div>

                      <div className="flex items-center gap-3 pl-7 md:pl-0">
                        {m.clientApproval ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 size={13} />
                            <span>Signed Off</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveMilestone(m._id)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold shadow-2xs hover:shadow-sm"
                          >
                            Approve Milestone
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Contacts & Meetings Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#082B59] mb-3">
                  Scheduled Meetings
                </h3>

                {meetings.length === 0 ? (
                  <p className="text-xs text-gray-400">No scheduled meetings at this time.</p>
                ) : (
                  <div className="space-y-2.5">
                    {meetings.slice(0, 3).map((mtg) => (
                      <div key={mtg._id} className="p-3 rounded-xl border border-gray-100 bg-blue-50/30">
                        <p className="font-bold text-xs text-[#082B59]">{mtg.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(mtg.meetingDate).toLocaleDateString()} at {mtg.startTime}
                        </p>
                        {mtg.meetingLink && (
                          <a
                            href={mtg.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0756A5] text-white text-[10px] font-bold"
                          >
                            <Video size={12} />
                            <span>Join Google Meet</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 block">Assigned Project Manager</span>
                <p className="font-bold text-xs text-[#082B59] mt-0.5">
                  {activeProject.assignedProjectManager?.name || "Support Lead"}
                </p>
                <p className="text-[11px] text-gray-500">
                  {activeProject.assignedProjectManager?.email || "support@vishwakarma.com"}
                </p>
              </div>
            </div>
          </div>

          {/* PUBLISHED DAILY PROGRESS REPORTS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#082B59]">
                  Published Daily Updates
                </h3>
                <p className="text-xs text-gray-400">
                  Verified daily progress reports submitted by developers and reviewed by PM
                </p>
              </div>
            </div>

            {dailyReports.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Clock size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-semibold">No daily progress reports published yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyReports.map((rpt) => (
                  <div
                    key={rpt._id}
                    className="p-4 rounded-xl border border-gray-200/90 bg-gray-50/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700">
                        {new Date(rpt.reportDate).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Verified by PM
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                        Completed Work
                      </span>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                        {rpt.completedTasks?.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>

                    {rpt.tomorrowsPlan && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400">Tomorrow's Plan:</span>
                        <p className="text-xs text-gray-600 mt-0.5">{rpt.tomorrowsPlan}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INVOICES & PAYMENTS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#082B59]">
              Billing & Invoices
            </h3>

            {invoices.length === 0 ? (
              <p className="text-xs text-gray-400">No invoices generated yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 font-bold">
                      <th className="py-2.5 px-4">Invoice No</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4">Amount</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                      <tr key={inv._id}>
                        <td className="py-3 px-4 font-mono font-bold text-[#0756A5]">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-800 font-semibold">{inv.title}</td>
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                          ₹{inv.amount?.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === "PAID"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-400">
          <FolderGit2 size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-600">No projects linked to your account yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Once your deal is approved by the admin team, your workspace and progress tracker will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
