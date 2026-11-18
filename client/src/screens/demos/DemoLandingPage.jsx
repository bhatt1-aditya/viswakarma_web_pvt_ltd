import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Target,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const DemoLandingPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReset = () => {
    setEmail("");
    setSubmitted(false);
    toast.success("Landing page demo reset!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("Lead captured in campaign database!");
  };

  return (
    <DemoLayout
      demoNumber={18}
      title="High-Converting Landing Page Demo"
      category="Website Design & Development"
      description="Conversion-focused landing page with attention-grabbing value proposition, interactive CTA, and lead capture form."
      onReset={handleReset}
    >
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#071426] via-[#082B59] to-[#0756A5] text-white p-8 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FF8A00] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Proven 3.8x Higher Conversion Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold max-w-3xl mx-auto leading-tight">
            Double Your Inbound Sales Pipeline With Conversion Engineering.
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate friction, boost trust, and capture high-intent enterprise leads with our scientifically optimized landing page systems.
          </p>

          {/* Lead Capture Form */}
          <div className="max-w-md mx-auto pt-2">
            {submitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center space-y-1 text-emerald-200">
                <CheckCircle2 size={24} className="mx-auto text-emerald-400" />
                <p className="text-sm font-bold text-white">Thank you! Your spot is secured.</p>
                <p className="text-xs">We sent a free audit checklist to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your corporate email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-900 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FF6900] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0"
                >
                  Get Free Audit
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3 Pillar Value Props */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F5F8FC]">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
              <Zap size={20} />
            </div>
            <h4 className="text-base font-bold text-[#082B59]">Sub-Second LCP Speed</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every 100ms of latency reduced boosts paid ad conversion by up to 1.2%.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6900] flex items-center justify-center font-bold">
              <Target size={20} />
            </div>
            <h4 className="text-base font-bold text-[#082B59]">Zero-Distraction Layout</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Laser-focused visual hierarchy guiding prospects directly to conversion CTAs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-base font-bold text-[#082B59]">Instant CRM Injection</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Leads are automatically verified, tagged with UTMs, and routed to sales reps in real time.
            </p>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoLandingPage;
