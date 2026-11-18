import React from "react";
import { X, CheckCircle, Cpu } from "lucide-react";

const ViewModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6900]">
              Service #{service.idNumber || "—"} • {service.categoryName}
            </span>
            <h2 className="text-2xl font-bold text-[#082B59]">{service.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Short Description</h3>
            <p className="mt-1 text-gray-700">{service.shortDescription}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Full Overview</h3>
            <p className="mt-1 leading-relaxed text-gray-700">{service.overview}</p>
          </div>

          {service.features?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0756A5] uppercase">
                <CheckCircle size={16} /> Key Capabilities & Features
              </h3>
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.features.map((feat, idx) => (
                  <li key={idx} className="rounded-lg bg-blue-50/60 p-2 text-xs font-medium text-gray-800">
                    • {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.techStack?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-600 uppercase">
                <Cpu size={16} /> Technology Stack
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {service.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#082B59]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {service.demoSlug && (
            <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#FF6900] uppercase">Interactive Demonstration</p>
                <p className="text-sm font-medium text-gray-800">Mapped Demo: {service.demoSlug}</p>
              </div>
              <a
                href={`/live-demos/${service.demoSlug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-[#FF6900] px-4 py-2 text-xs font-bold text-white hover:bg-orange-600"
              >
                Launch Demo
              </a>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
