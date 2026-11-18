import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Workflow,
  Play,
  Sparkles,
  MessageCircle,
  Database,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";

const initialNodes = [
  { id: 1, type: "trigger", title: "New Lead Form Submission", subtitle: "Website Contact Webhook", icon: Globe, status: "ready" },
  { id: 2, type: "action", title: "AI Lead Scoring & Intent Analysis", subtitle: "Extract Budget & Timeline", icon: Sparkles, status: "ready" },
  { id: 3, type: "action", title: "CRM Pipeline Sync", subtitle: "Create Contact & Deal in HubSpot", icon: Database, status: "ready" },
  { id: 4, type: "action", title: "Instant WhatsApp Alert to Sales Rep", subtitle: "Send Alert with Lead Score", icon: MessageCircle, status: "ready" },
];

const DemoAutomationWorkflow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);

  const handleReset = () => {
    setNodes(initialNodes);
    setIsRunning(false);
    setExecutionLogs([]);
    toast.success("Workflow builder reset!");
  };

  const runWorkflow = () => {
    setIsRunning(true);
    setExecutionLogs(["[00:00.12] Trigger received: Incoming Lead Payload from Webhook"]);

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        "[00:00.65] Step 2: Running AI model (Identified Intent: High-Value ERP Modernization)",
      ]);
    }, 600);

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        "[00:01.20] Step 3: Synced lead record to CRM with score 94/100",
      ]);
    }, 1200);

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        "[00:01.85] Step 4: WhatsApp notification dispatched to Assigned Account Exec",
        "[00:01.90] Workflow executed successfully with exit code 0",
      ]);
      setIsRunning(false);
      toast.success("Workflow simulation completed!");
    }, 1900);
  };

  return (
    <DemoLayout
      demoNumber={20}
      title="Visual Automation Workflow Builder Demo"
      category="AI, Machine Learning & Automation"
      description="Node-based automation designer where users select triggers, connect actions, and execute simulated workflows with real-time logs."
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* WORKFLOW CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6900] flex items-center justify-center font-bold">
              <Workflow size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#082B59]">Inbound Lead Autonomous Pipeline</h3>
              <p className="text-[11px] text-gray-500">4-Stage Connected Enterprise Chain</p>
            </div>
          </div>

          <button
            onClick={runWorkflow}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl bg-[#0756A5] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50 transition-all"
          >
            <Play size={13} fill="currentColor" />
            <span>{isRunning ? "Simulating Pipeline..." : "Execute Test Workflow"}</span>
          </button>
        </div>

        {/* VISUAL NODE PIPELINE CHAIN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {nodes.map((node, idx) => {
            const IconComp = node.icon;
            return (
              <div
                key={node.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3 relative hover:border-[#0756A5] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      node.type === "trigger"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-[#0756A5]"
                    }`}
                  >
                    {node.type}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Step 0{idx + 1}</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#0756A5]">
                  <IconComp size={20} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900">{node.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{node.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* LIVE EXECUTION CONSOLE */}
        <div className="bg-[#071426] text-white p-5 rounded-2xl shadow-xl font-mono text-xs space-y-2 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 text-gray-400">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#FF8A00]">
              Real-Time Execution Runtime Output
            </span>
            <span className="text-[10px]">Python Engine v3.12</span>
          </div>

          <div className="min-h-[100px] space-y-1 text-emerald-400 pt-1">
            {executionLogs.length === 0 ? (
              <p className="text-gray-500">Click "Execute Test Workflow" to simulate event firing...</p>
            ) : (
              executionLogs.map((log, i) => (
                <p key={i} className="leading-relaxed">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoAutomationWorkflow;
