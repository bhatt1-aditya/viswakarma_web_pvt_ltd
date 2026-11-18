import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const initialEmployees = [
  { id: "EMP-101", name: "Aarav Sharma", department: "Engineering", designation: "Senior Cloud Architect", salary: 145000, attendance: "Present", punchTime: "09:12 AM" },
  { id: "EMP-102", name: "Pooja Hegde", department: "UI/UX Design", designation: "Lead Product Designer", salary: 110000, attendance: "Present", punchTime: "09:28 AM" },
  { id: "EMP-103", name: "Rohan Nair", department: "Quality Assurance", designation: "QA Automation Engineer", salary: 85000, attendance: "On Leave", punchTime: "—" },
  { id: "EMP-104", name: "Deepika Verma", department: "Product", designation: "Technical Product Manager", salary: 160000, attendance: "Present", punchTime: "08:55 AM" },
];

const initialLeaves = [
  { id: 1, empName: "Rohan Nair", type: "Casual Leave", dates: "18 Nov – 19 Nov", reason: "Family Function", status: "Pending" },
  { id: 2, empName: "Aarav Sharma", type: "Medical Leave", dates: "24 Nov", reason: "Dental Checkup", status: "Approved" },
];

const DemoHRMS = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [activeTab, setActiveTab] = useState("directory"); // "directory" | "attendance" | "leaves" | "payroll"
  const [myPunchStatus, setMyPunchStatus] = useState("Punched Out");

  const handleReset = () => {
    setEmployees(initialEmployees);
    setLeaves(initialLeaves);
    setActiveTab("directory");
    setMyPunchStatus("Punched Out");
    toast.success("HRMS demo reset!");
  };

  const handlePunchToggle = () => {
    if (myPunchStatus === "Punched Out") {
      setMyPunchStatus("Punched In (09:42 AM)");
      toast.success("Biometric attendance punch recorded for today!");
    } else {
      setMyPunchStatus("Punched Out");
      toast.success("Biometric sign-out recorded!");
    }
  };

  const updateLeaveStatus = (id, newStatus) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    toast.success(`Leave request marked as ${newStatus}!`);
  };

  const totalPayroll = employees.reduce((acc, emp) => acc + emp.salary, 0);

  return (
    <DemoLayout
      demoNumber={6}
      title="HRMS & Payroll Portal Demo"
      category="Custom Software & Enterprise Solutions"
      description="Human resources portal with staff directory, daily attendance punch simulator, leave request approvals, and payroll computation."
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* TOP TAB CONTROLS & BIOMETRIC PUNCH */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {[
              { id: "directory", label: "Staff Directory" },
              { id: "attendance", label: "Daily Attendance" },
              { id: "leaves", label: "Leave Requests" },
              { id: "payroll", label: "Payroll Overview" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0756A5] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handlePunchToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              myPunchStatus === "Punched Out"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            <Clock size={14} />
            <span>{myPunchStatus === "Punched Out" ? "Simulate Punch In" : "Simulate Punch Out"}</span>
          </button>
        </div>

        {/* STAFF DIRECTORY TAB */}
        {activeTab === "directory" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#082B59]">Company Personnel Roster</h3>
              <span className="text-xs font-bold text-gray-500">{employees.length} Active Staff</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((emp) => (
                <div key={emp.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#0756A5]">{emp.id}</span>
                    <h4 className="text-sm font-bold text-gray-900">{emp.name}</h4>
                    <p className="text-xs text-gray-500">{emp.designation}</p>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-[#0756A5]">
                      {emp.department}
                    </span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      emp.attendance === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {emp.attendance}
                    </span>
                    <p className="text-xs font-bold text-gray-900 mt-2">
                      ₹{emp.salary.toLocaleString("en-IN")}/mo
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#082B59]">Real-Time Shift Attendance Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Punch Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="p-3 font-semibold text-gray-800">{emp.name}</td>
                      <td className="p-3 text-gray-600">{emp.department}</td>
                      <td className="p-3 font-mono text-gray-700">{emp.punchTime}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.attendance === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {emp.attendance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEAVES TAB */}
        {activeTab === "leaves" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#082B59]">Pending Leave Approval Desk</h3>
            <div className="space-y-3">
              {leaves.map((leave) => (
                <div key={leave.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{leave.empName} — {leave.type}</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5">Dates: {leave.dates} • Reason: {leave.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      leave.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {leave.status}
                    </span>
                    {leave.status === "Pending" && (
                      <div className="flex gap-1.5 ml-2">
                        <button
                          onClick={() => updateLeaveStatus(leave.id, "Approved")}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                          className="px-2.5 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYROLL TAB */}
        {activeTab === "payroll" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-50">
                <span className="text-xs text-blue-700 font-medium">Monthly Gross Payroll</span>
                <p className="text-2xl font-black text-[#0756A5] mt-1">₹{totalPayroll.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <span className="text-xs text-gray-500 font-medium">Statutory TDS / PF Est.</span>
                <p className="text-2xl font-black text-gray-700 mt-1">₹{Math.round(totalPayroll * 0.12).toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50">
                <span className="text-xs text-emerald-700 font-medium">Net Disbursed</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">₹{Math.round(totalPayroll * 0.88).toLocaleString("en-IN")}</p>
              </div>
            </div>

            <button
              onClick={() => toast.success("Simulated batch payslips generated and queued for direct bank transfer!")}
              className="w-full py-3 rounded-xl bg-[#0756A5] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors"
            >
              Generate Monthly Payslips & Export Payroll Ledger
            </button>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default DemoHRMS;
