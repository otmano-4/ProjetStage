import React, { useState } from "react"
import { X } from "lucide-react"

function CreateProfesseur({ setShowModal, classes, onAdd }) {
  const [newProf, setNewProf] = useState({
    nom: "",
    matiere: "",
    classe_id: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewProf({ ...newProf, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(newProf)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* bouton fermer */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          👨‍🏫 Ajouter un Professeur
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={newProf.nom}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nom du professeur"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Matière</label>
            <input
              type="text"
              name="matiere"
              value={newProf.matiere}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Ex: Mathématiques"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Classe</label>
            <select
              name="classe_id"
              value={newProf.classe_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">-- Choisir une classe --</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 mr-3 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg shadow-sm"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProfesseur
