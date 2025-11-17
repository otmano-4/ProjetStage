import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchClasseById } from "../../../store/slices/classSlice";
import axios from "axios";

function ImportStudentsModal({ setShowModal, classeId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `http://localhost:8080/api/classes/${classeId}/upload-excel`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Refresh the class
      dispatch(fetchClasseById(classeId));

      setShowModal(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Erreur lors de l'import du fichier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Importer des élèves via Excel
        </h2>

        <form onSubmit={handleImport} className="space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border rounded-lg"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Importation..." : "Importer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportStudentsModal;
