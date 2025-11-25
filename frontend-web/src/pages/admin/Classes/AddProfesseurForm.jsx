import React, { useState } from "react"
import { PlusCircle } from "lucide-react"

function AddProfesseurForm({ onAdd, classes }) {
  const [newProf, setNewProf] = useState("")
  const [selectedMatiere, setSelectedMatiere] = useState("")
  const [selectedClasse, setSelectedClasse] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!newProf.trim() || !selectedMatiere || !selectedClasse) {
      alert("Veuillez remplir tous les champs.")
      return
    }

    const newProfesseur = {
      id: Date.now(),
      nom: newProf,
      matieres: [
        {
          id: Date.now() + 1,
          nom: selectedMatiere,
          classes: [
            {
              id: parseInt(selectedClasse),
              nom: classes.find((c) => c.id === parseInt(selectedClasse))?.nom,
              etudiants: [],
            },
          ],
        },
      ],
    }

    onAdd(newProfesseur)

    // Réinitialisation du formulaire
    setNewProf("")
    setSelectedMatiere("")
    setSelectedClasse("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow p-6 mb-8"
    >
      <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5" />
        Ajouter un professeur
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Nom du professeur"
          value={newProf}
          onChange={(e) => setNewProf(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-yellow-500"
        />

        <input
          type="text"
          placeholder="Matière (ex: Mathématiques)"
          value={selectedMatiere}
          onChange={(e) => setSelectedMatiere(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-yellow-500"
        />

        <select
          value={selectedClasse}
          onChange={(e) => setSelectedClasse(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-yellow-500"
        >
          <option value="">-- Choisir une classe --</option>
          {classes.map((classe) => (
            <option key={classe.id} value={classe.id}>
              {classe.nom}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition"
      >
        Ajouter le professeur
      </button>
    </form>
  )
}

export default AddProfesseurForm
