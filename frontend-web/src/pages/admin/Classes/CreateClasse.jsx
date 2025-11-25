import React, { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { createClasse } from "../../../store/slices/classSlice";

function CreateClasse({ setShowModal }) {
  const [formData, setFormData] = useState({
    nom: "",
    annee: "",
  });


  const dispatch = useDispatch()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createClasse(formData))
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        {/* === Fermer === */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* === Titre === */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Ajouter une Classe
        </h2>

        {/* === Formulaire === */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nom de la classe
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: 6ème A"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-yellow-200"
              required
            />
          </div>

          {/* Année */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Année scolaire
            </label>
            <input
              type="text"
              name="annee"
              value={formData.annee}
              onChange={handleChange}
              placeholder="Ex: 2024-2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-yellow-200"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateClasse;
