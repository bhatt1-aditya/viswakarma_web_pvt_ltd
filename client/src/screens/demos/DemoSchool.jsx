import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import toast from "react-hot-toast";

const initialStudents = [
  { rollNo: "10A-01", name: "Ananya Iyer", grade: "Class 10-A", feeStatus: "Paid", attendance: "96%", rank: "1st" },
  { rollNo: "10A-02", name: "Kabir Malhotra", grade: "Class 10-A", feeStatus: "Paid", attendance: "92%", rank: "4th" },
  { rollNo: "10A-03", name: "Tanvi Saxena", grade: "Class 10-A", feeStatus: "Pending (₹14,500)", attendance: "88%", rank: "8th" },
  { rollNo: "10A-04", name: "Devansh Rathore", grade: "Class 10-A", feeStatus: "Paid", attendance: "95%", rank: "2nd" },
];

const initialTeachers = [
  { id: "T-01", name: "Prof. S. R. Raman", subject: "Advanced Physics & Mechanics", classes: "Grade 10 & 11" },
  { id: "T-02", name: "Mrs. Meera Nambiar", subject: "Mathematics & Statistics", classes: "Grade 9 & 10" },
  { id: "T-03", name: "Dr. Alok Bannerjee", subject: "Organic Chemistry", classes: "Grade 11 & 12" },
];

const DemoSchool = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState(initialStudents);

  const handleReset = () => {
    setActiveTab("students");
    setStudents(initialStudents);
    toast.success("School portal demo reset!");
  };

  const markFeePaid = (rollNo) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, feeStatus: "Paid" } : s))
    );
    toast.success(`Fee receipt generated for roll number ${rollNo}!`);
  };

  return (
    <DemoLayout
      demoNumber={7}
      title="School & Campus Management Demo"
      category="Custom Software & Enterprise Solutions"
      description="Comprehensive education management system showing student enrollment, class schedules, fee collection, and grade reports."
      onReset={handleReset}
    >
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { id: "students", label: "Student Roster" },
              { id: "teachers", label: "Faculty Directory" },
              { id: "fees", label: "Fee Collection" },
              { id: "results", label: "Academic Results" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0756A5] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400 font-mono">Academic Year 2026-27</span>
        </div>

        {activeTab === "students" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#082B59]">Enrolled Students — Class 10 Section A</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Term Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((st) => (
                    <tr key={st.rollNo} className="hover:bg-gray-50/70">
                      <td className="p-3 font-mono font-bold text-[#0756A5]">{st.rollNo}</td>
                      <td className="p-3 font-bold text-gray-900">{st.name}</td>
                      <td className="p-3 text-gray-600">{st.grade}</td>
                      <td className="p-3 font-semibold text-emerald-600">{st.attendance}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.feeStatus === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {st.feeStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "teachers" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialTeachers.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                  {t.id}
                </div>
                <h4 className="text-sm font-bold text-[#082B59]">{t.name}</h4>
                <p className="text-xs text-[#FF6900] font-semibold">{t.subject}</p>
                <p className="text-xs text-gray-500">Classes: {t.classes}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "fees" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#082B59]">Term Fee Settlement Console</h3>
            <div className="space-y-3">
              {students.map((st) => (
                <div key={st.rollNo} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[#0756A5] font-bold">{st.rollNo}</span>
                    <h5 className="font-bold text-gray-900">{st.name}</h5>
                    <p className="text-gray-500 text-[11px]">{st.grade}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${st.feeStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                      {st.feeStatus}
                    </span>
                    {st.feeStatus !== "Paid" && (
                      <button
                        onClick={() => markFeePaid(st.rollNo)}
                        className="px-3 py-1.5 rounded-lg bg-[#0756A5] text-white text-[11px] font-bold hover:bg-blue-700"
                      >
                        Record Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#082B59]">Semester Examination Marks & Ranks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {students.map((st) => (
                <div key={st.rollNo} className="p-4 rounded-xl bg-[#F5F8FC] border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">{st.rollNo}</span>
                    <span className="text-xs font-black text-[#FF6900] bg-orange-100 px-2 py-0.5 rounded-full">
                      Rank {st.rank}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{st.name}</h4>
                  <p className="text-xs text-gray-500">GPA Score: 9.4 / 10</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default DemoSchool;
