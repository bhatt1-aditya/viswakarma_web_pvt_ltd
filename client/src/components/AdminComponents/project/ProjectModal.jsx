import React from "react";

const ProjectModal = ({ title, children, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <p className="text-xl font-bold text-gray-900">{title}</p>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ProjectModal;
