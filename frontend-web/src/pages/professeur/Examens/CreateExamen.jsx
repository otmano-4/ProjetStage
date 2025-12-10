import React, { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchExamens, createExamFun } from "../../../store/slices/examSlice";

function CreateExamen({ setShowModal, classes }) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("utilisateur"));

  const [newExam, setNewExam] = useState({
    titre: "",
    description: "",
    duree: 0,
    classeId: 0,
    professeurId: user?.id || null,
    afficher: true,
    dateDebut: "", // Format: YYYY-MM-DDTHH:mm
    dateFin: "",   // Format: YYYY-MM-DDTHH:mm
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewExam((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "classeId" || name === "duree"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir les dates au format attendu par Spring Boot
    // datetime-local donne "YYYY-MM-DDTHH:mm" en heure locale
    // Spring Boot attend "YYYY-MM-DDTHH:mm:ss" ou "YYYY-MM-DD HH:mm:ss"
    const convertLocalDateTime = (localDateTimeString) => {
      if (!localDateTimeString) return null;
      // datetime-local format: "YYYY-MM-DDTHH:mm"
      // On ajoute ":00" pour les secondes
      return localDateTimeString + ":00";
    };

    const examData = {
      ...newExam,
      dateDebut: convertLocalDateTime(newExam.dateDebut),
      dateFin: convertLocalDateTime(newExam.dateFin),
    };

    console.log(examData);
    dispatch(createExamFun(examData)).then(() => {
      dispatch(fetchExamens());
      setShowModal(false);
    });
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

          {/* DUREE + CLASSE */}
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
                <option value={0}>Select class</option>
                {classes?.map((c) => (
                  <option key={c.id} value={Number(c.id)}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* DATE DE DÉBUT */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Date et heure de début
            </label>
            <input
              type="datetime-local"
              name="dateDebut"
              value={newExam.dateDebut}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              L'examen sera visible à partir de cette date/heure
            </p>
          </div>

          {/* DATE DE FIN */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Date et heure de fin
            </label>
            <input
              type="datetime-local"
              name="dateFin"
              value={newExam.dateFin}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              L'examen sera bloqué après cette date/heure
            </p>
          </div>

          {/* VISIBILITÉ */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="afficher"
              checked={newExam.afficher}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            <label className="text-sm text-gray-700">
              Publier l'examen (visible aux étudiants dans la période définie)
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
