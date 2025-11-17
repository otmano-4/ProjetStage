import React, { useState } from "react";

function ImportStudentsModal({ setShowModal }) {
  const [file, setFile] = useState(null);

  const handleImport = (e) => {
    e.preventDefault();
    console.log("Importing Excel file:", file);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
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
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Importer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportStudentsModal;
