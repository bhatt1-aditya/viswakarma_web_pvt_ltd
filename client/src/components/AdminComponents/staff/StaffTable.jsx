import React from "react";
import { User, ShieldCheck, Phone, Key, Settings } from "lucide-react";

const StaffTable = () => {
  return (
    <thead>
      <tr className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-b border-gray-200/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
        <th className="px-4 py-3.5 text-left w-14">#</th>

        <th className="px-4 py-3.5 text-left">
          <span className="inline-flex items-center gap-1.5">
            <User size={13} className="text-[#0756A5]" />
            <span>Staff Member</span>
          </span>
        </th>

        <th className="px-4 py-3.5 text-left">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#FF6900]" />
            <span>Security Role</span>
          </span>
        </th>

        <th className="px-4 py-3.5 text-left">
          <span className="inline-flex items-center gap-1.5">
            <Phone size={13} className="text-gray-400" />
            <span>Phone Contact</span>
          </span>
        </th>

        <th className="px-4 py-3.5 text-left">
          <span className="inline-flex items-center gap-1.5">
            <Key size={13} className="text-purple-600" />
            <span>Access Privileges</span>
          </span>
        </th>

        <th className="px-4 py-3.5 text-right">
          <span className="inline-flex items-center gap-1.5 justify-end">
            <Settings size={13} className="text-gray-400" />
            <span>Actions</span>
          </span>
        </th>
      </tr>
    </thead>
  );
};

export default StaffTable;
