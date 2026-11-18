import React from "react";

const StaffModal = ({ title, children, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-xl p-6 max-h-[75vh] overflow-y-auto shadow-lg">
        <p className="text-base font-medium text-gray-800 mb-3">{title}</p>
        {children}
      </div>
    </div>
  );
}

export default StaffModal;
