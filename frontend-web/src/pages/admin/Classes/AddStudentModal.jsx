import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUtilisateur, fetchUtilisateurs } from "../../../store/slices/usersSlice";
import { addStudentToClasse } from "../../../store/slices/classSlice";

function AddStudentModal({ classeId, setShowModal }) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    role: "ETUDIANT",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert fields to match backend expectations
    const student = {
      nom: formData.nom,
      email: formData.email,
      motDePasse: formData.motDePasse,
      role: formData.role,
    };

    dispatch(addStudentToClasse({classeId, student})).then(() => {
      dispatch(fetchUtilisateurs());
      setShowModal(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Ajouter un élève
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          <input
            type="password"
            name="motDePasse"
            placeholder="Mot de passe"
            value={formData.motDePasse}
            onChange={handleChange}
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
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
