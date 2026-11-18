import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  HeartPulse,
} from "lucide-react";
import toast from "react-hot-toast";

const initialDoctors = [
  { id: 1, name: "Dr. Vikram Sethi", specialty: "Cardiology", room: "OPD-102", fee: 1200, status: "Available" },
  { id: 2, name: "Dr. Rohini Deshmukh", specialty: "Neurology", room: "OPD-204", fee: 1500, status: "In Surgery" },
  { id: 3, name: "Dr. Amitava Mukherjee", specialty: "Orthopedics", room: "OPD-108", fee: 1000, status: "Available" },
];

const initialAppointments = [
  { id: "APT-401", patient: "Harish Gupta", age: 54, doctor: "Dr. Vikram Sethi", time: "10:30 AM", status: "Checked In" },
  { id: "APT-402", patient: "Meenakshi Sundaram", age: 38, doctor: "Dr. Amitava Mukherjee", time: "11:15 AM", status: "Waiting" },
];

const DemoHospital = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [selectedDoc, setSelectedDoc] = useState("Dr. Vikram Sethi");

  const handleReset = () => {
    setDoctors(initialDoctors);
    setAppointments(initialAppointments);
    setPatientName("");
    setPatientAge("");
    toast.success("Hospital system demo reset!");
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!patientName || !patientAge) return;
    const newApt = {
      id: "APT-" + Math.floor(400 + Math.random() * 500),
      patient: patientName,
      age: parseInt(patientAge),
      doctor: selectedDoc,
      time: "Today, Next Slot",
      status: "Waiting",
    };
    setAppointments([newApt, ...appointments]);
    setPatientName("");
    setPatientAge("");
    toast.success(`Appointment registered for ${newApt.patient}!`);
  };

  return (
    <DemoLayout
      demoNumber={8}
      title="Hospital & Clinic Portal Demo"
      category="Custom Software & Enterprise Solutions"
      description="Healthcare administration platform featuring patient records, doctor specialty schedules, appointment bookings, and lab billing."
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PATIENT REGISTRATION (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <HeartPulse size={20} className="text-[#FF6900]" />
            <h3 className="text-base font-bold text-[#082B59]">OPD Patient Registration</h3>
          </div>

          <form onSubmit={handleBookAppointment} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Patient Full Name *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Sumanth Narayan"
                className="mt-1 w-full p-2.5 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Age *</label>
              <input
                type="number"
                required
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 42"
                className="mt-1 w-full p-2.5 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Consulting Specialist *</label>
              <select
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
                className="mt-1 w-full p-2.5 border rounded-xl text-xs"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.specialty} — ₹{d.fee})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0756A5] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors"
            >
              Issue OPD Consultation Token
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: DOCTORS & APPOINTMENT QUEUE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Appointments Queue */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#082B59]">Today's OPD Queue</h3>
            <div className="space-y-2">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0756A5]">{apt.id}</span>
                      <span className="font-bold text-gray-900">{apt.patient} ({apt.age}y)</span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">{apt.doctor} • {apt.time}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    apt.status === "Checked In" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors On Duty */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-[#082B59]">Doctors On Duty</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {doctors.map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-[#F5F8FC] border border-gray-100 space-y-1 text-xs">
                  <h4 className="font-bold text-gray-900">{d.name}</h4>
                  <p className="text-[11px] text-[#FF6900] font-semibold">{d.specialty}</p>
                  <p className="text-[10px] text-gray-400">Room: {d.room}</p>
                  <span className="text-[10px] font-bold text-emerald-600 block">{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoHospital;
