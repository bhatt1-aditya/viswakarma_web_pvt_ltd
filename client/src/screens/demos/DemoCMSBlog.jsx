import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  PenTool,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const initialArticles = [
  {
    id: 1,
    title: "Why Modern Microservices Prevent Checkout Bottlenecks",
    category: "Cloud Architecture",
    excerpt: "Exploring event-driven asynchronous queues and decoupled frontend architectures for high-traffic peak seasons.",
    content: "When traffic spikes during flash sales, monolithic databases experience row locks that lead to payment timeouts. By isolating cart calculations into high-speed Redis memory stores and queuing order fulfillment via RabbitMQ, enterprises can maintain 99.99% uptime.",
    status: "Published",
    author: "Vishwakarma Architecture Group",
    date: "14 Nov 2026",
  },
  {
    id: 2,
    title: "5 Critical Security Vulnerabilities in Legacy ERPs",
    category: "Enterprise Software",
    excerpt: "A deep dive into unencrypted legacy databases, lack of session tokens, and spreadsheet data loss risks.",
    content: "Many manufacturing companies continue running unpatched on-premise software. These legacy engines lack granular role-based access control, making them prime targets for ransomware attacks.",
    status: "Draft",
    author: "Security Operations Center",
    date: "16 Nov 2026",
  },
];

const DemoCMSBlog = () => {
  const [articles, setArticles] = useState(initialArticles);
  const [activeArticle, setActiveArticle] = useState(initialArticles[0]);
  const [editTitle, setEditTitle] = useState(initialArticles[0].title);
  const [editCategory, setEditCategory] = useState(initialArticles[0].category);
  const [editContent, setEditContent] = useState(initialArticles[0].content);

  const handleReset = () => {
    setArticles(initialArticles);
    setActiveArticle(initialArticles[0]);
    setEditTitle(initialArticles[0].title);
    setEditCategory(initialArticles[0].category);
    setEditContent(initialArticles[0].content);
    toast.success("CMS Editorial Studio reset!");
  };

  const handleSelectArticle = (art) => {
    setActiveArticle(art);
    setEditTitle(art.title);
    setEditCategory(art.category);
    setEditContent(art.content);
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    setArticles((prev) =>
      prev.map((a) =>
        a.id === activeArticle.id
          ? { ...a, title: editTitle, category: editCategory, content: editContent }
          : a
      )
    );
    setActiveArticle((prev) => ({
      ...prev,
      title: editTitle,
      category: editCategory,
      content: editContent,
    }));
    toast.success("Article saved and updated!");
  };

  const togglePublish = () => {
    const nextStatus = activeArticle.status === "Published" ? "Draft" : "Published";
    setArticles((prev) =>
      prev.map((a) => (a.id === activeArticle.id ? { ...a, status: nextStatus } : a))
    );
    setActiveArticle((prev) => ({ ...prev, status: nextStatus }));
    toast.success(`Article set to ${nextStatus}!`);
  };

  const createNewArticle = () => {
    const newArt = {
      id: Date.now(),
      title: "New Architectural Analysis Document",
      category: "Software Engineering",
      excerpt: "Summary of new technology adoption and cloud benchmarks.",
      content: "Write your technical insights and research documentation here...",
      status: "Draft",
      author: "Editorial Team",
      date: new Date().toLocaleDateString(),
    };
    setArticles([newArt, ...articles]);
    handleSelectArticle(newArt);
    toast.success("New draft created!");
  };

  return (
    <DemoLayout
      demoNumber={19}
      title="Headless CMS & Editorial Studio Demo"
      category="Content Management Systems (CMS)"
      description="Publishing studio allowing real-time creation, editing, category tagging, draft-to-publish toggling, and live preview."
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ARTICLES ROSTER (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-bold text-[#082B59]">Articles Studio</h3>
            <button
              onClick={createNewArticle}
              className="p-1.5 rounded-lg bg-[#0756A5] text-white hover:bg-blue-800"
              title="Create New Post"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto">
            {articles.map((art) => {
              const isSelected = activeArticle.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => handleSelectArticle(art)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#0756A5] bg-blue-50/70 shadow-xs"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {art.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        art.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {art.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{art.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1">{art.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* EDITOR & PREVIEW (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-2">
              <PenTool size={18} className="text-[#0756A5]" />
              <h3 className="text-base font-bold text-[#082B59]">Live Editorial Studio</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePublish}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeArticle.status === "Published"
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {activeArticle.status === "Published" ? "Switch to Draft" : "Publish to Live Site"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveArticle} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Article Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1 w-full p-2.5 border rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Category Tag</label>
              <input
                type="text"
                required
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="mt-1 w-full p-2.5 border rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Markdown Content Body</label>
              <textarea
                rows={6}
                required
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mt-1 w-full p-3 border rounded-xl text-xs leading-relaxed font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0756A5] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors"
            >
              Update & Save Article
            </button>
          </form>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoCMSBlog;
