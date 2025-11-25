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
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-slide-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Importer des élèves via Excel
        </h2>

        <form onSubmit={handleImport} className="space-y-6">
          {/* Dropzone */}
          <div className="flex items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-200"
            >
              <svg
                className="w-10 h-10 mb-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                />
              </svg>
              <p className="text-gray-600 mb-1 font-semibold">Cliquez pour télécharger</p>
              <p className="text-gray-400 text-sm">Fichier Excel (.xlsx, .xls)</p>
              <input
                required
                id="dropzone-file"
                accept=".xlsx,.xls"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-yellow-600 text-white hover:bg-yellow-700 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin w-5 h-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Importation..." : "Importer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportStudentsModal;
