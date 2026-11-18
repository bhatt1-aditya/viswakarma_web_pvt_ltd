import React, { useState, useEffect, useCallback } from "react";
import ProjectModal from "../../components/AdminComponents/project/ProjectModal";
import ProjectForm from "../../components/AdminComponents/project/ProjectForm";
import Pagination from "../../components/common/Pagination";
import { MdOutlineDeleteForever } from "react-icons/md";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/AdminComponents/staff/Toast";
import ProjectMediaModal from "../../components/AdminComponents/project/ProjectMediaModal";
import ProjectTableSkeleton from "../../components/AdminComponents/project/ProjectTableSkeleton";
import StatsGrid from "../../components/AdminComponents/staff/StatsGrid";
import API_BASE_URL from "../../utils/apiConfig";


const Projects = () => {
    const { permissions, user } = useAuth();
    const isAdmin = ["admin", "superadmin"].includes(user?.role?.name);
    const canAdd = isAdmin || permissions?.buttons?.projects?.add;
    const canEdit = isAdmin || permissions?.buttons?.projects?.edit;
    const canDelete = isAdmin || permissions?.buttons?.projects?.delete;
    const canView = isAdmin || permissions?.buttons?.projects?.view;


    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modal, setModal] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    const [mediaModal, setMediaModal] = useState({ isOpen: false, type: null, data: [], title: "" });


    const showToast = useCallback((message, type = "ok") => {
        setToast({ message, type });
    }, []);

    const loadProjects = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page,
                limit: 10,
                search,
                status: statusFilter,
            }).toString();
            const res = await fetch(
                `${API_BASE_URL}/project/get-all-project?${queryParams}`,
                { credentials: "include" }
            );
            const data = await res.json();
            setProjects(data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            showToast("Failed to load projects", "err");
        }
        setLoading(false);
    }, [page, search, statusFilter, showToast]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const handleSave = async (formData) => {
        try {
            const url = modal.mode === "add"
                ? `${API_BASE_URL}/project/create-project`
                : `${API_BASE_URL}/project/update-project/${modal.project._id}`;

            const res = await fetch(url, {
                method: modal.mode === "add" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Save failed");

            showToast(modal.mode === "add" ? "Project created" : "Project updated");
            setModal(null);
            loadProjects();
        } catch (err) {
            showToast(err.message, "err");
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/project/delete-project/${id}`,
                { method: "DELETE", credentials: "include" }
            );
            if (!res.ok) throw new Error("Delete failed");
            showToast("Project deleted");
            setConfirm(null);
            loadProjects();
        } catch (err) {
            showToast(err.message, "err");
        }
    };

    return (
        <div className="px-6 pt-4 pb-6">
            <div className="flex justify-between items-end mb-6">
                <div className="mt-3">
                    <h1 className="text-2xl font-bold mb-1">Projects</h1>
                    <p className="text-sm text-gray-500 mb-4">
                        Manage your projects and assignments
                    </p>
                </div>

            </div>

            {/* Stats Overview */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Projects</p>
                    <p className="text-3xl font-black text-gray-900">{projects.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active</p>
                    <p className="text-3xl font-black text-green-600">{projects.filter(p => p.status === 'active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Inactive</p>
                    <p className="text-3xl font-black text-gray-400">{projects.filter(p => p.status === 'inactive').length}</p>
                </div>
            </div> */}
            {/* In feature change also */}
            <StatsGrid />

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex justify-between flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-gray-400 w-64 bg-white"
                />
                <div className="flex gap-2"> <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-[38px] text-xs border border-gray-200 rounded-lg px-3 outline-none focus:border-gray-400 bg-white min-w-[140px] font-medium text-gray-600 shadow-sm"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>{canAdd && (
                    <button
                        onClick={() => setModal({ mode: "add" })}
                        className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer font-medium"
                    >
                        + Add Project
                    </button>
                )}

                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-start">Project</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Media</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <ProjectTableSkeleton rows={10} />
                        ) : projects.length === 0 ? (
                            <tr><td colSpan="6" className="py-12 text-sm text-gray-400">No projects found.</td></tr>
                        ) : (
                            projects.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {p.photos?.[0] ? (
                                                <img src={p.photos[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">🏗</div>
                                            )}
                                            <div className="text-left font-bold text-gray-900 capitalize">{p.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#069ab7]">₹{p.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {p.location?.city}, {p.location?.state}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 justify-center text-xs font-bold">
                                            <span
                                                onClick={() => setMediaModal({
                                                    isOpen: true,
                                                    type: 'photo',
                                                    data: p.photos || [],
                                                    title: p.name
                                                })}
                                                className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                                            >
                                                📸 {p.photos?.length || 0}
                                            </span>
                                            <span
                                                onClick={() => setMediaModal({
                                                    isOpen: true,
                                                    type: 'video',
                                                    data: p.videos || [],
                                                    title: p.name
                                                })}
                                                className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded cursor-pointer hover:bg-purple-100 transition-colors"
                                            >
                                                🎥 {p.videos?.length || 0}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            {canView && (
                                                <button
                                                    onClick={() => setModal({ mode: "view", project: p })}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all"
                                                    title="View Details"
                                                >👁</button>
                                            )}
                                            {canEdit && (
                                                <button
                                                    onClick={() => setModal({ mode: "edit", project: p })}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#069ab7] hover:border-[#069ab7] transition-all"
                                                    title="Edit Project"
                                                >✎</button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => setConfirm(p)}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 transition-all"
                                                    title="Delete Project"
                                                ><MdOutlineDeleteForever size={18} /></button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}

            {/* Project Modal */}
            {modal && (
                <ProjectModal
                    title={modal.mode === "add" ? "New Project" : modal.mode === "edit" ? "Edit Project" : "Project Details"}
                    onClose={() => setModal(null)}
                >
                    <ProjectForm
                        mode={modal.mode}
                        initial={modal.project || {}}
                        onSave={handleSave}
                        onCancel={() => setModal(null)}
                    />
                </ProjectModal>
            )}


            {/* Delete Confirmation */}
            {confirm && (
                <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">Are you sure you want to remove <span className="font-bold text-gray-900">"{confirm.name}"</span>? This action is permanent.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirm(null)}
                                className="flex-1 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50"
                            >Cancel</button>
                            <button
                                onClick={() => handleDelete(confirm._id)}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200"
                            >Delete</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Media Modal */}
            <ProjectMediaModal
                isOpen={mediaModal.isOpen}
                onClose={() => setMediaModal({ ...mediaModal, isOpen: false })}
                type={mediaModal.type}
                data={mediaModal.data}
                title={mediaModal.title}
            />
        </div>

    );
};

export default Projects;
