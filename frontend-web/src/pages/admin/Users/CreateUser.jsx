import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createUtilisateur, fetchUtilisateurs } from '../../../store/slices/usersSlice';

function CreateUser({ setShowModal }) {

  const dispatch = useDispatch();

  const [newUser, setNewUser] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    role: "ETUDIANT",
  });

  const handleCreate = async () => {
    try {
      await dispatch(createUtilisateur(newUser));
      await dispatch(fetchUtilisateurs());
      setShowModal(false);
    } catch (err) {
      console.error("Erreur création utilisateur:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        
        <h2 className="text-xl font-semibold mb-4">
          Créer un utilisateur
        </h2>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>

          <input
            type="text"
            placeholder="Nom"
            value={newUser.nom}
            onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />

          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={newUser.motDePasse}
            onChange={(e) => setNewUser({ ...newUser, motDePasse: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />

          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border rounded-lg p-2 w-full"
          >
            <option value="ETUDIANT">Étudiant</option>
            <option value="PROFESSEUR">Professeur</option>
            <option value="ADMIN">Admin</option>
          </select>

          <div className="flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
            >
              Ajouter
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}

export default CreateUser
