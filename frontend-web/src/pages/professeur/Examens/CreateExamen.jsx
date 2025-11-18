import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchExamens, createExamFun } from "../../../store/slices/examSlice";

function CreateExamen({ setShowModal, user, classes }) {
  const dispatch = useDispatch();

  const [newExam, setNewExam] = useState({
    titre: "",
    description: "",
    duree: "",
    classeId: "",
    professeurId: user?.id || null,
    afficher: 1,
    date_publication: new Date().toISOString().slice(0, 19).replace("T", " "),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewExam((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(createExamFun(newExam)).then(() => {
        dispatch(fetchExamens());
        setShowModal(false);
      });
    } catch (err) {
      console.error("❌ Erreur lors de la création :", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📝 Create a New Exam
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITRE */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Title</label>
            <input
              type="text"
              name="titre"
              value={newExam.titre}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Exam title"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={newExam.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Exam description"
            />
          </div>

          {/* DUREE & CLASSE */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">Duration (min)</label>
              <input
                type="number"
                name="duree"
                value={newExam.duree}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">Class</label>
              <select
                name="classeId"
                value={newExam.classeId}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select class</option>
                {classes?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* VISIBILITÉ */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="afficher"
              checked={newExam.afficher === 1}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            <label className="text-sm text-gray-700">
              Visible to students
            </label>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 mr-3 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExamen;
