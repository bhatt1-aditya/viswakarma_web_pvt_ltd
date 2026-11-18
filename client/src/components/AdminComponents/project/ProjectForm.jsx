import React, { useState } from "react";
import { uploadToCloudinary } from "../../../utils/cloudinary";

const ProjectForm = ({ mode, initial = {}, onSave, onCancel }) => {
  const isFormDisabled = mode === "view";
  const [formData, setFormData] = useState({
    name: initial.name || "",
    price: initial.price || "",
    description: initial.description || "",
    status: initial.status || "active",
    location: {
      address: initial.location?.address || "",
      city: initial.location?.city || "",
      state: initial.location?.state || "",
      country: initial.location?.country || "",
      pincode: initial.location?.pincode || "",
    },
    photos: initial.photos || [],
    videos: initial.videos || [],
    brochure: initial.brochure || "",
  });

  const [uploading, setUploading] = useState({
    photos: false,
    videos: false,
    brochure: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      if (type === "brochure") {
        const url = await uploadToCloudinary(files[0]);
        setFormData((prev) => ({ ...prev, brochure: url }));
      } else {
        const urls = await Promise.all(
          Array.from(files).map((file) => uploadToCloudinary(file))
        );
        setFormData((prev) => ({
          ...prev,
          [type]: [...prev[type], ...urls],
        }));
      }
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const removeFile = (type, index) => {
    if (type === "brochure") {
      setFormData((prev) => ({ ...prev, brochure: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#069ab7] outline-none"
            required
            disabled={isFormDisabled}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#069ab7] outline-none"
            required
            disabled={isFormDisabled}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#069ab7] outline-none"
          disabled={isFormDisabled}
        ></textarea>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            name="location.address"
            placeholder="Address"
            value={formData.location.address}
            onChange={handleChange}
            className="col-span-full px-3 py-2 border rounded-lg text-sm"
            disabled={isFormDisabled}
          />
          <input
            type="text"
            name="location.city"
            placeholder="City"
            value={formData.location.city}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg text-sm"
            disabled={isFormDisabled}
          />
          <input
            type="text"
            name="location.state"
            placeholder="State"
            value={formData.location.state}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg text-sm"
            disabled={isFormDisabled}
          />
          <input
            type="text"
            name="location.pincode"
            placeholder="Pincode"
            value={formData.location.pincode}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg text-sm"
            disabled={isFormDisabled}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Photos {uploading.photos && <span className="text-[#069ab7] animate-pulse ml-2">Uploading...</span>}
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "photos")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#069ab7]/10 file:text-[#069ab7] hover:file:bg-[#069ab7]/20"
            disabled={uploading.photos}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.photos.map((src, i) => (
              <div key={i} className="relative w-20 h-20 group">
                <img src={src} className="w-full h-full object-cover rounded-lg" alt="Project" />
                <button
                  type="button"
                  onClick={() => removeFile("photos", i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isFormDisabled}
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Videos {uploading.videos && <span className="text-[#069ab7] animate-pulse ml-2">Uploading...</span>}
          </label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => handleFileUpload(e, "videos")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#069ab7]/10 file:text-[#069ab7] hover:file:bg-[#069ab7]/20"
            disabled={uploading.videos}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.videos.map((src, i) => (
              <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center group">
                <span className="text-[10px] text-gray-500">Video {i+1}</span>
                <button
                  type="button"
                  onClick={() => removeFile("videos", i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isFormDisabled}
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Brochure (PDF/Image) {uploading.brochure && <span className="text-[#069ab7] animate-pulse ml-2">Uploading...</span>}
          </label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => handleFileUpload(e, "brochure")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#069ab7]/10 file:text-[#069ab7] hover:file:bg-[#069ab7]/20"
            disabled={uploading.brochure}
          />
          {formData.brochure && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100 group">
              <span className="text-xs text-gray-500 truncate max-w-[200px]">{formData.brochure}</span>
              <button
                type="button"
                onClick={() => removeFile("brochure")}
                className="text-red-500 hover:text-red-700 text-xs font-bold ml-auto"
                disabled={isFormDisabled}
              >Remove</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
          disabled={isFormDisabled}
        >Cancel</button>
        {(mode === "add" || mode === "edit") && (
          <button
            type="submit"
            disabled={isFormDisabled}
            className="px-8 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold shadow-md disabled:opacity-50"
          >{mode === "add" ? "Create Project" : "Save Changes"}</button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
