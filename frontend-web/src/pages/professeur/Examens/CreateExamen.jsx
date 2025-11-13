import React, { useState } from 'react'
import { X } from "lucide-react";
import { useDispatch } from 'react-redux';
import { fetchExamens, createExamFun } from "../../../store/slices/examSlice";


function CreateExamen({setShowModal}) {
    const dispatch = useDispatch()

    const [newExam, setNewExam] = useState({
        titre: "ff",
        description: "gg",
        duree: 10,
        classeId: 1,
        professeurId: 2, // assign from logged-in user
        afficher: 1,       // 1 = true, 0 = false
        date_publication: new Date().toISOString().slice(0, 19).replace("T", " ") // current datetime in MySQL format
    });
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewExam({ ...newExam, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(createExamFun(newExam))
            dispatch(fetchExamens())
            console.log("✅ Examen créé avec succès !");
        } catch (err) {
          console.error("❌ Erreur lors de la création :", err);
        }
    };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 bg-opacity-40 z-50">
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
              <div>
                <label className="block text-gray-700 text-sm mb-1">Title</label>
                <input
                  type="text"
                  name="titre"
                  value={newExam.titre}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Exam title"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={newExam.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Exam description"
                  rows="3"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-1">Duration (min)</label>
                  <input
                    type="number"
                    name="duree"
                    value={newExam.duree}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-1">Class ID</label>
                  <input
                    type="number"
                    name="classe_id"
                    value={newExam.classe_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="afficher"
                  checked={newExam.afficher}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <label className="text-sm text-gray-700">Visible to students</label>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 mr-3 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
  )
}

export default CreateExamen