import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProfesseurToClasse } from "../../../store/slices/classSlice";

function AddProfesseurModal({ classeId, setShowModal }) {
  const dispatch = useDispatch();
  const [idProf, setIdProf] = useState(0);

  const { selectedClasse } = useSelector((state) => state.classes);
  const utilisateurs = useSelector((state) => state.utilisateurs.data);

  // Only professors not already in this class
  const professeursDisponibles = utilisateurs.filter(
    (user) =>
      user.role === "PROFESSEUR" &&
      !selectedClasse.professeurs?.some((p) => p.id === user.id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idProf) {
      alert("Veuillez sélectionner un professeur.");
      return;
    }

    try {
      await dispatch(addProfesseurToClasse({ classeId, idProf: Number(idProf) }));
      setShowModal(false);
    } catch (error) {
      console.error("Error adding professor:", error);
      alert("Impossible d'ajouter le professeur.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Ajouter un professeur</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            value={idProf}
            onChange={(e) => setIdProf(e.target.value)}
            className="border rounded p-2"
          >
            <option value={0}>-- Sélectionner un professeur --</option>
            {professeursDisponibles.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nom}
              </option>
            ))}
          </select>

          {professeursDisponibles.length === 0 && (
          <p className="text-gray-500 mt-2 text-sm">
            Tous les professeurs sont déjà assignés à cette classe.
          </p>
        )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={professeursDisponibles.length === 0} // disable if none available
            >
              Ajouter
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default AddProfesseurModal;
