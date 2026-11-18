import React, { useState, useRef, useEffect } from "react";
import DemoLayout from "./DemoLayout";
import {
  Bot,
  Send,
  RotateCcw,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const preconfiguredQA = [
  {
    triggers: ["what services", "services offered", "capabilities", "what do you do"],
    answer: "Vishwakarma Web Private Limited delivers 108 enterprise services across 9 core categories: Website Design & Development, CMS, E-Commerce, Mobile Apps (Flutter/React Native), Custom ERPs & CRMs, AI & Automation Workflows, Cloud & DevOps, Digital Marketing/SEO, and UI/UX Branding.",
  },
  {
    triggers: ["tech stack", "technologies", "frameworks", "database"],
    answer: "Our core production stack includes React.js, Next.js, Node.js, Express, Python (FastAPI/LangChain for AI), Flutter, React Native, MongoDB, PostgreSQL, Redis, Docker, and AWS/GCP cloud infrastructure.",
  },
  {
    triggers: ["pricing", "cost", "how much", "quote"],
    answer: "Projects typically start with custom scopes. Starter solutions begin at competitive market rates, while customized enterprise ERPs and AI workflows are scoped after an architectural discovery sprint. You can use our interactive project calculator on the Pricing page!",
  },
  {
    triggers: ["timeline", "how long", "turnaround", "delivery time"],
    answer: "Standard web and mobile MVP builds typically take 2 to 6 weeks. Enterprise multi-department ERP and supply chain software typically takes 8 to 16 weeks delivered in bi-weekly agile sprint milestones.",
  },
  {
    triggers: ["contact", "phone", "email", "office", "address", "location"],
    answer: "You can reach Vishwakarma Web Private Limited at +91 70775 60648 or contact@vishwakarmaweb.com. Our corporate engineering center is located at Tech Hub Tower, Sector 62, Noida, Uttar Pradesh, India.",
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Hello! I am the Vishwakarma Web AI Assistant. How can I help you explore our software architectures, 108 services, or project timelines today?",
    time: "Just now",
  },
];

const suggestedChips = [
  "What services do you offer?",
  "What technologies do you use?",
  "What is the typical project timeline?",
  "How can I get a custom quote?",
];

const DemoAIChatbot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleReset = () => {
    setMessages(initialMessages);
    setInputMessage("");
    setIsTyping(false);
    toast.success("AI Chat session cleared!");
  };

  const handleSend = (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate intelligent context matching
    setTimeout(() => {
      const lower = text.toLowerCase();
      let matchedAnswer = null;

      for (const qa of preconfiguredQA) {
        if (qa.triggers.some((trig) => lower.includes(trig))) {
          matchedAnswer = qa.answer;
          break;
        }
      }

      if (!matchedAnswer) {
        matchedAnswer = `Thank you for your inquiry regarding "${text}". Vishwakarma Web Private Limited specializes in tailor-made software solutions for this domain. Would you like our senior solutions architect to prepare a custom project proposal?`;
      }

      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: matchedAnswer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <DemoLayout
      demoNumber={12}
      title="Enterprise AI Chatbot Demo"
      category="AI, Machine Learning & Automation"
      description="Interactive conversational AI assistant preconfigured with company knowledge, instant Q&A, and quick suggestion chips."
      onReset={handleReset}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Chatbot Header */}
        <div className="bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#FF8A00]">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Vishwakarma AI Assistant</h3>
              <p className="text-[11px] text-blue-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>Simulated Enterprise Knowledge Agent</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 flex items-center gap-1.5"
            title="Clear Chat History"
          >
            <RotateCcw size={12} />
            <span>Clear</span>
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto pb-2">
          {suggestedChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] font-medium bg-white border border-gray-200 hover:border-[#0756A5] text-gray-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F5F8FC]/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${
                m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === "user"
                    ? "bg-[#FF6900] text-white"
                    : "bg-[#0756A5] text-white"
                }`}
              >
                {m.sender === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  m.sender === "user"
                    ? "bg-[#0756A5] text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] block mt-1.5 ${
                    m.sender === "user" ? "text-blue-200 text-right" : "text-gray-400"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto">
              <div className="w-7 h-7 rounded-full bg-[#0756A5] text-white flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">Searching knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about our services, tech stack, or solutions..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#0756A5] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#0756A5] text-white hover:bg-blue-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send size={13} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoAIChatbot;
