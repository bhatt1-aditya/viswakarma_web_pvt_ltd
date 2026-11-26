import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const StaffModal = ({ title, children, onClose }) => {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/40"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative bg-white border border-gray-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-[0_20px_60px_-15px_rgba(8,43,89,0.28)] flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white shrink-0">
            <h3 className="text-base font-bold text-[#082B59]">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="p-6 overflow-y-auto overscroll-contain flex-1">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default StaffModal;
