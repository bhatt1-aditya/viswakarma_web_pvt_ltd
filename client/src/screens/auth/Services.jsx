import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";
import {
  Loader2,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import ViewModal from "../../components/AdminComponents/service/ViewModal";
import ServiceCreateModal from "../../components/AdminComponents/service/ServiceCreateModal";
import ServiceUpdateModal from "../../components/AdminComponents/service/ServiceUpdateModal";
import Swal from "sweetalert2";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ServiceSkeletonAdmin from './../../components/AdminComponents/service/ServiceSkeletonAdmin';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewServiceModal, setViewServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [createServiceModal, setCreateServiceModal] = useState(false);
  const [updateServiceModal, setUpdateServiceModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_BASE_URL}/service/get-all-services`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setServices(response.data.services);
        setFilteredServices(response.data.services);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/category/fetch-all`,
        { withCredentials: true }
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleCreateService = () => {
    setCreateServiceModal(true);
  };

  const handleViewService = (service) => {
    setViewServiceModal(true);
    setSelectedService(service);
  };

  const handleUpdateService = (service) => {
    setSelectedService(service);
    setUpdateServiceModal(true);
  };

  const handleDeleteService = async (service) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This will delete the service permanently!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#0bb6d9",
      cancelButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(service._id);

        const token = localStorage.getItem("token");
        await axios.delete(
          `${API_BASE_URL}/service/delete-service/${service._id}`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const updatedServices = services.filter((s) => s._id !== service._id);
        setServices(updatedServices);
        setFilteredServices(updatedServices);
        if (currentServices.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        Swal.fire("Deleted!", "Service has been deleted successfully.", "success");
      } catch (err) {
        console.error("Error deleting service:", err);
        Swal.fire("Error!", err.response?.data?.message || "Failed to delete service", "error");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Services
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchServices}
            className="bg-[#0bb6d9] text-white px-6 py-2 rounded-lg hover:bg-[#069ab7] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              <span className="text-[#0bb6d9]">Services</span>
            </h1>
            <p className="text-gray-600">
              Showing {currentServices.length} of {filteredServices.length} services
            </p>
          </div>

          <button
            onClick={handleCreateService}
            className="flex items-center gap-2 bg-[#0bb6d9] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#069ab7] transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Service
          </button>
        </div>

        {/* Services List */}
        {
          loading ? <ServiceSkeletonAdmin /> :
            <>
              {currentServices.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Services Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first service to get started
                  </p>
                  <button
                    onClick={handleCreateService}
                    className="inline-flex items-center gap-2 bg-[#0bb6d9] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#069ab7] transition"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Service
                  </button>
                </div>
              ) : (
                /* Services Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentServices.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white group rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl"
                    >
                      {/* Service Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>

                      {/* Service Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-xl group-hover:text-[#0bb6d9] transition-colors duration-500 font-bold text-gray-800 mb-3 line-clamp-2">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewService(service)}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#0bb6d9] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#069ab7] transition-colors duration-300 shadow-md hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4 md:flex hidden" />
                            View
                          </button>
                          <button
                            onClick={() => handleUpdateService(service)}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                          >
                            <Edit className="w-4 h-4 md:flex hidden" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service)}
                            disabled={deleteLoading === service._id}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteLoading === service._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 md:flex hidden" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
        }

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center mt-8 space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <FaChevronLeft size={14} /> Prev
            </button>

            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md transition-colors ${currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <FaChevronRight size={14} />
            </button>
          </div>
        )}

        {viewServiceModal && (
          <ViewModal
            service={selectedService}
            onClose={() => setViewServiceModal(false)}
            onClick={() => {
              setUpdateServiceModal(true);
              setViewServiceModal(false);
            }}
          />
        )}

        {updateServiceModal && (
          <ServiceUpdateModal
            categories={categories}
            service={selectedService}
            onClose={() => setUpdateServiceModal(false)}
            onSuccess={fetchServices}
          />
        )}

        {createServiceModal && (
          <ServiceCreateModal
            categories={categories}
            onClose={() => setCreateServiceModal(false)}
            onSuccess={fetchServices}
          />
        )}
      </div>
    </div>
  );
};

export default Services;