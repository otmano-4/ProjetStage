import React, { useState } from "react"
import { X } from "lucide-react"
import { useDispatch } from "react-redux"
import { createMatiereFun, fetchMatieres } from "../../../store/slices/matiereSlice" // adapte selon ton projet

function CreateMatiere({ setShowModal, professeurs, onAdd }) {
  const dispatch = useDispatch()

  const [newMatiere, setNewMatiere] = useState({
    nom: "",
    description: "",
    professeur_id: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewMatiere({ ...newMatiere, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Si tu veux stocker côté Redux :
      // await dispatch(createMatiereFun(newMatiere))
      // await dispatch(fetchMatieres())

      // Si tu veux juste l'ajouter localement :
      onAdd(newMatiere)
      setShowModal(false)

      console.log("✅ Matière ajoutée :", newMatiere)
    } catch (err) {
      console.error("❌ Erreur lors de la création :", err)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Bouton X */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📘 Créer une Matière
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={newMatiere.nom}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex : Mathématiques"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={newMatiere.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Brève description de la matière"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Professeur Responsable
            </label>
            <select
              name="professeur_id"
              value={newMatiere.professeur_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Sélectionner un professeur --</option>
              {professeurs.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nom}
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatiere
