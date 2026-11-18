import React, { useState } from "react";
import * as XLSX from "xlsx";
import API_BASE_URL from "../../../utils/apiConfig";

const ImportLeadsModal = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(false);

  const targetFields = [
    { key: "name", label: "Name (Required)", required: true },
    { key: "phone", label: "Phone (Required)", required: true },
    { key: "email", label: "Email", required: false },
    { key: "source", label: "Source", required: false },
    { key: "status", label: "Status", required: false },
    { key: "notes", label: "Notes", required: false },
  ];

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (data.length > 0) {
        setHeaders(data[0]);
        setPreviewData(data.slice(1, 6));

        const initialMapping = {};
        data[0].forEach((header) => {
          const h = header.toString().toLowerCase();
          if (h.includes("name")) initialMapping.name = header;
          if (
            h.includes("phone") ||
            h.includes("mobile") ||
            h.includes("contact")
          )
            initialMapping.phone = header;
          if (h.includes("email")) initialMapping.email = header;
          if (h.includes("source")) initialMapping.source = header;
          if (h.includes("status")) initialMapping.status = header;
          if (h.includes("note")) initialMapping.notes = header;
        });
        setMapping(initialMapping);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleUpload = async () => {
    if (!mapping.name || !mapping.phone) {
      alert("Please map Name and Phone columns.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(ws);

      const formattedLeads = rawData.map((row) => {
        const lead = {};
        Object.keys(mapping).forEach((field) => {
          lead[field] = row[mapping[field]];
        });
        return lead;
      });

      try {
        const res = await fetch(
          `${API_BASE_URL}/lead/bulk-upload`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leads: formattedLeads }),
            credentials: "include",
          },
        );

        const result = await res.json();
        if (res.ok) {
          alert(
            `Success! Inserted: ${result.insertedCount}, Skipped: ${result.skipped}`,
          );
          onUpload();
        } else {
          throw new Error(result.message || "Upload failed");
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Import Leads from Excel/CSV
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {!file ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                📄
              </div>
              <p className="text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Excel (.xlsx, .xls) or CSV files supported
              </p>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-blue-900">{file.name}</p>
                  <p className="text-xs text-blue-700">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewData([]);
                  setHeaders([]);
                }}
                className="text-sm cursor-pointer font-medium text-blue-600 hover:underline"
              >
                Change File
              </button>
            </div>

            {/* Preview Section */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">
                Data Preview (First 5 rows)
              </p>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {headers.map((h, i) => (
                        <th
                          key={i}
                          className="px-3 py-2 font-semibold text-gray-600 truncate max-w-[150px]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-3 py-2 text-gray-500 truncate max-w-[150px]"
                          >
                            {cell || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mapping Section */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">
                Map Columns to Lead Fields
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
                {targetFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      {field.label}
                    </label>
                    <select
                      value={mapping[field.key] || ""}
                      onChange={(e) =>
                        setMapping({ ...mapping, [field.key]: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    >
                      <option value="">Do not import</option>
                      {headers.map((h, i) => (
                        <option key={i} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={loading || !mapping.name || !mapping.phone}
                className="px-8 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Import Leads"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportLeadsModal;
