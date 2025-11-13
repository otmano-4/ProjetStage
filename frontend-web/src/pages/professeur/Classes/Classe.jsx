import React, { useState } from "react"
import {
  BookOpen,
  Users,
  GraduationCap,
  User,
  PlusCircle,
} from "lucide-react"
import Aside from "../../../components/Layouts/Aside"
import Header from "../../../components/Layouts/Header"
import CreateProfesseur from "./CreateProfesseur"
import CreateMatiere from "./CreateMatiere"

function Classe({ pages }) {
  // === Données locales simulées (à connecter à Redux ou API ensuite) ===
  const [professeurs, setProfesseurs] = useState([
    {
      id: 1,
      nom: "M. Dupont",
      matieres: [
        {
          id: 1,
          nom: "Mathématiques",
          classes: [
            {
              id: 1,
              nom: "6ème A",
              etudiants: ["Alice", "Benoît", "Camille"],
            },
          ],
        },
      ],
    },
  ])

  const [matieres, setMatieres] = useState([
    { id: 1, nom: "Mathématiques", description: "Cours de logique et calcul" },
  ])

  const [classes] = useState([
    { id: 1, nom: "6ème A" },
    { id: 2, nom: "5ème B" },
    { id: 3, nom: "4ème A" },
  ])

  // === États des modales ===
  const [showProfModal, setShowProfModal] = useState(false)
  const [showMatiereModal, setShowMatiereModal] = useState(false)

  // === Ajouter un professeur ===
  const handleAddProf = (newProf) => {
    const profData = {
      id: Date.now(),
      nom: newProf.nom,
      matieres: [
        {
          id: Date.now() + 1,
          nom: newProf.matiere,
          classes: [
            {
              id: parseInt(newProf.classe_id),
              nom: classes.find(
                (c) => c.id === parseInt(newProf.classe_id)
              )?.nom,
              etudiants: [],
            },
          ],
        },
      ],
    }

    setProfesseurs((prev) => [...prev, profData])
    setShowProfModal(false)
  }

  // === Ajouter une matière ===
  const handleAddMatiere = (newMatiere) => {
    const matiereData = {
      id: Date.now(),
      nom: newMatiere.nom,
      description: newMatiere.description,
      professeur_id: parseInt(newMatiere.professeur_id),
      professeur_nom:
        professeurs.find(
          (p) => p.id === parseInt(newMatiere.professeur_id)
        )?.nom || "Inconnu",
    }

    setMatieres((prev) => [...prev, matiereData])
    setShowMatiereModal(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* === En-tête === */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              📚 Gestion des Classes, Professeurs et Matières
            </h1>

            <div className="flex gap-3">
              <button
                onClick={() => setShowProfModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <PlusCircle className="w-5 h-5" /> Ajouter un professeur
              </button>

              <button
                onClick={() => setShowMatiereModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <PlusCircle className="w-5 h-5" /> Ajouter une matière
              </button>
            </div>
          </div>

          {/* === Modales === */}
          {showProfModal && (
            <CreateProfesseur
              setShowModal={setShowProfModal}
              classes={classes}
              onAdd={handleAddProf}
            />
          )}

          {showMatiereModal && (
            <CreateMatiere
              setShowModal={setShowMatiereModal}
              professeurs={professeurs}
              onAdd={handleAddMatiere}
            />
          )}

          {/* === Liste des Professeurs === */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              👨‍🏫 Professeurs
            </h2>

            {professeurs.length === 0 ? (
              <p className="text-gray-500 italic">
                Aucun professeur pour le moment.
              </p>
            ) : (
              professeurs.map((prof) => (
                <div
                  key={prof.id}
                  className="mb-6 bg-white rounded-2xl shadow p-5 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    {prof.nom}
                  </h3>

                  {prof.matieres.map((matiere) => (
                    <div
                      key={matiere.id}
                      className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100"
                    >
                      <h4 className="text-lg font-medium text-blue-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> {matiere.nom}
                      </h4>

                      {matiere.classes.map((classe) => (
                        <div
                          key={classe.id}
                          className="mt-3 bg-white border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 text-gray-800 font-medium">
                            <Users className="w-4 h-4 text-blue-600" />
                            {classe.nom}
                          </div>

                          <ul className="mt-2 ml-6 list-disc text-gray-600 space-y-1">
                            {classe.etudiants.length > 0 ? (
                              classe.etudiants.map((etudiant, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <User className="w-4 h-4 text-gray-500" />
                                  {etudiant}
                                </li>
                              ))
                            ) : (
                              <li className="italic text-gray-400">
                                Aucun étudiant pour le moment
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))
            )}
          </section>

          {/* === Liste des Matières === */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              📘 Matières
            </h2>

            {matieres.length === 0 ? (
              <p className="text-gray-500 italic">
                Aucune matière enregistrée.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {matieres.map((matiere) => (
                  <div
                    key={matiere.id}
                    className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {matiere.nom}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {matiere.description || "Pas de description."}
                    </p>
                    <p className="text-gray-500 mt-2 text-sm italic">
                      Professeur :{" "}
                      <span className="font-medium text-gray-700">
                        {matiere.professeur_nom}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Classe
