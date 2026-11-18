import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Send, ShieldAlert } from "lucide-react";

const DemoLayout = ({
  demoNumber,
  title,
  category,
  description,
  onReset,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-16">
      {/* DEMO TOOLBAR & HEADER */}
      <div className="bg-[#082B59] text-white border-b border-white/10 sticky top-16 z-30 shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/live-demos"
              className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-all"
            >
              <ArrowLeft size={14} />
              <span>All Demos</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF6900] text-white">
                  DEMO #{String(demoNumber).padStart(2, "0")}
                </span>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                  {category}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 transition-colors"
                title="Reset this demonstration to initial data"
              >
                <RotateCcw size={13} />
                <span>Reset Demo</span>
              </button>
            )}

            <Link
              to={`/quote?service=${encodeURIComponent(title)}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FF6900] hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Send size={13} />
              <span>Request Similar Solution</span>
            </Link>
          </div>
        </div>

        {/* SIMULATED DATA DISCLAIMER BAR */}
        <div className="bg-[#071426] py-1.5 px-4 text-center border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-center gap-2">
          <ShieldAlert size={13} className="text-[#FF8A00]" />
          <span>
            Interactive Demonstration environment powered by client-side simulation. No real financial or proprietary data is processed.
          </span>
        </div>
      </div>

      {/* DEMO WORKSPACE CANVAS */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {children}
      </div>
    </div>
  );
};

export default DemoLayout;
