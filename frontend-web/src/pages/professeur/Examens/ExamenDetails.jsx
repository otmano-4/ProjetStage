import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X, PlusCircle, Trash2 } from "lucide-react";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";

export default function ExamenDetails({ pages }) {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [soumissions, setSoumissions] = useState([]);
  const [selectedSoumission, setSelectedSoumission] = useState(null);
  const [reponsesSoumission, setReponsesSoumission] = useState([]);
  const [noteInputs, setNoteInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [questionForm, setQuestionForm] = useState({
    type: "MULTIPLE", // MULTIPLE (QCM/choix multiples), TEXT (ouverte), TRUE_FALSE
    titre: "",
    options: "",
    correct: "",
    bareme: 1.0,
  });

  // Charger l'examen et ses questions
  useEffect(() => {
    setLoading(true);
    setError("");
    
    Promise.all([
      fetch(`http://localhost:8080/api/examens/${id}/details`)
        .then((res) => {
          if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((data) => {
          setExam(data);
          setQuestions(data.questions || []);
        }),
      fetch(`http://localhost:8080/api/examens/${id}/soumissions`)
        .then((res) => {
          if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((data) => setSoumissions(data || []))
    ])
    .catch((err) => {
      console.error("Erreur chargement examen:", err);
      setError(`Erreur lors du chargement: ${err.message}`);
    })
    .finally(() => setLoading(false));
  }, [id]);

  // Charger les réponses d'une soumission sélectionnée
  useEffect(() => {
    if (selectedSoumission && selectedSoumission.id) {
      console.log("Chargement réponses pour soumission:", selectedSoumission.id);
      fetch(`http://localhost:8080/api/examens/soumissions/${selectedSoumission.id}/reponses`)
        .then((res) => {
          if (!res.ok) {
            console.error("Erreur HTTP:", res.status, res.statusText);
            throw new Error(`Erreur ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Réponses chargées:", data);
          setReponsesSoumission(data || []);
        })
        .catch((err) => {
          console.error("Erreur chargement réponses:", err);
          setReponsesSoumission([]);
        });
    } else {
      setReponsesSoumission([]);
    }
  }, [selectedSoumission]);

  const handleTypeChange = (value) => {
    // Pour TRUE_FALSE on pré-remplit les options usuelles
    if (value === "TRUE_FALSE") {
      setQuestionForm((prev) => ({
        ...prev,
        type: value,
        options: "Vrai,Faux",
        correct: "Vrai",
      }));
      return;
    }
    setQuestionForm((prev) => ({ ...prev, type: value }));
  };

  // Ajouter une question (QCM, multi, ouverte, V/F)
  const handleAddQuestion = async () => {
    if (!questionForm.titre) {
      alert("Merci de renseigner l'intitulé.");
      return;
    }

    if (questionForm.type !== "TEXT" && !questionForm.options) {
      alert("Pour un QCM ou Vrai/Faux, renseigne les options.");
      return;
    }

    if (!questionForm.correct) {
      alert("Merci de renseigner la réponse correcte.");
      return;
    }

    if (questionForm.bareme <= 0) {
      alert("Le barème doit être supérieur à 0");
      return;
    }

    const payload = {
      type: questionForm.type, // TEXT | MULTIPLE | TRUE_FALSE (enum backend)
      titre: questionForm.titre,
      choix: questionForm.options, // chaîne avec options séparées par des virgules
      correct: questionForm.correct, // une ou plusieurs réponses (séparées par virgules si multi)
      bareme: questionForm.bareme,
    };

    try {
      const res = await fetch(`http://localhost:8080/api/examens/${id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erreur ajout question", res.status, text);
        alert("Erreur lors de l'ajout de la question");
        return;
      }

      const created = await res.json();
      setQuestions([...questions, created]);

      setQuestionForm({
        type: "MULTIPLE",
        titre: "",
        options: "",
        correct: "",
        bareme: 1.0,
      });
    } catch (err) {
      console.error("Erreur réseau ajout question", err);
      alert("Erreur réseau lors de l'ajout de la question");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Aside pages={pages} />
        <div className="flex flex-col flex-1 w-full min-h-screen">
          <Header />
          <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <p className="text-gray-600">Chargement...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Aside pages={pages} />
        <div className="flex flex-col flex-1 w-full min-h-screen">
          <Header />
          <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">Erreur</p>
              <p className="text-red-600">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Aside pages={pages} />
        <div className="flex flex-col flex-1 w-full min-h-screen">
          <Header />
          <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <p className="text-gray-600">Examen non trouvé</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {exam.titre}
          </h1>

          <p className="text-gray-600 mb-4">{exam.description}</p>

          <div className="border-t mt-4 pt-4">
            <h3 className="text-lg font-semibold mb-2">Ajouter une question</h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm text-gray-600">Type de question</label>
                <select
                  className="w-full border px-3 py-2 rounded bg-white"
                  value={questionForm.type}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, type: e.target.value })
                  }
                >
                  <option value="MULTIPLE">QCM / Choix multiples</option>
                  <option value="TEXT">Question ouverte</option>
                  <option value="TRUE_FALSE">Vrai / Faux</option>
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm text-gray-600">Intitulé</label>
                <input
                  type="text"
                  placeholder="Ex : Définissez le polymorphisme en POO"
                  value={questionForm.titre}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, titre: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>


              {questionForm.type !== "TEXT" && (
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm text-gray-600">
                    Options (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    placeholder="Option A, Option B, Option C"
                    value={questionForm.options}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, options: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm text-gray-600">
                  Réponse correcte (si plusieurs : séparez par des virgules)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Option B"
                  value={questionForm.correct}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, correct: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm text-gray-600">Barème (points)</label>
                <input
                  type="number"
                  placeholder="1.0"
                  value={questionForm.bareme}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, bareme: parseFloat(e.target.value) || 1.0 })
                  }
                  min="0.1"
                  step="0.1"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  onClick={handleAddQuestion}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Ajouter
                </button>
              </div>
            </div>

            {questions.length > 0 && (
              <ul className="mt-6 space-y-2">
                {questions.map((q, index) => {
                  const optionsArray = (q.choix || "").split(",").filter(Boolean);
                  const typeLabel =
                    q.type === "TEXT"
                      ? "Question ouverte"
                      : q.type === "TRUE_FALSE"
                      ? "Vrai/Faux"
                      : "QCM / Choix multiples";

                  return (
                    <li
                      key={q.id || index}
                      className="flex justify-between items-start p-3 border rounded bg-white"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{q.titre}</p>
                        <p className="text-xs text-gray-500">{typeLabel}</p>
                        {optionsArray.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Options : {optionsArray.join(", ")}
                          </p>
                        )}
                        <p className="text-sm text-green-700">
                          Réponse : {q.correct}
                        </p>
                        <p className="text-sm text-blue-700">
                          Barème : {q.bareme || 1} pts
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setQuestions(questions.filter((_, i) => i !== index))
                        }
                        className="text-red-600 hover:underline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Tableau des soumissions */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Soumissions des étudiants</h3>
            {soumissions.length === 0 ? (
              <p className="text-gray-500">Aucune soumission pour cet examen.</p>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Étudiant</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score Auto</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score Manuel</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {soumissions.map((s) => (
                      <tr
                        key={s.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedSoumission?.id === s.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => setSelectedSoumission(s)}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">{s.etudiantNom}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            s.statut === "EN_COURS" ? "bg-yellow-100 text-yellow-800" :
                            s.statut === "SOUMIS" ? "bg-blue-100 text-blue-800" :
                            s.statut === "CORRIGE" ? "bg-green-100 text-green-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {s.statut}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.scoreAuto || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.scoreManuel || 0}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{s.scoreTotal || 0}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              console.log("Clic sur Voir pour soumission:", s.id);
                              setSelectedSoumission(s);
                              // Charger les réponses immédiatement
                              try {
                                const res = await fetch(
                                  `http://localhost:8080/api/examens/soumissions/${s.id}/reponses`
                                );
                                if (res.ok) {
                                  const data = await res.json();
                                  console.log("Réponses chargées depuis bouton:", data);
                                  setReponsesSoumission(data || []);
                                } else {
                                  console.error("Erreur HTTP:", res.status, res.statusText);
                                  const errorText = await res.text();
                                  console.error("Détails erreur:", errorText);
                                }
                              } catch (err) {
                                console.error("Erreur chargement réponses:", err);
                              }
                            }}
                            className="text-blue-600 hover:underline mr-2"
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Détails d'une soumission sélectionnée */}
          {selectedSoumission && (
            <div className="mt-8 border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Détails de la soumission de {selectedSoumission.etudiantNom}
                </h3>
                <div className="flex gap-2">
                  {selectedSoumission.statut === "SOUMIS" && (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `http://localhost:8080/api/examens/soumissions/${selectedSoumission.id}/valider`,
                            { method: "POST", headers: { "Content-Type": "application/json" } }
                          );
                          if (!res.ok) {
                            const text = await res.text();
                            alert(`Erreur validation: ${text}`);
                            return;
                          }
                          const updated = await res.json();
                          setSoumissions((prev) =>
                            prev.map((s) => (s.id === updated.id ? updated : s))
                          );
                          setSelectedSoumission(updated);
                          // Recharger les réponses pour mettre à jour les statuts
                          const repsRes = await fetch(
                            `http://localhost:8080/api/examens/soumissions/${updated.id}/reponses`
                          );
                          if (repsRes.ok) {
                            const reps = await repsRes.json();
                            setReponsesSoumission(reps || []);
                          }
                          alert("Soumission validée avec succès");
                        } catch (e) {
                          console.error(e);
                          alert("Erreur lors de la validation");
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Valider
                    </button>
                  )}
                  {selectedSoumission.statut === "CORRIGE" && (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `http://localhost:8080/api/examens/soumissions/${selectedSoumission.id}/publier`,
                            { method: "POST", headers: { "Content-Type": "application/json" } }
                          );
                          if (!res.ok) {
                            const text = await res.text();
                            alert(`Erreur publication: ${text}`);
                            return;
                          }
                          const updated = await res.json();
                          setSoumissions((prev) =>
                            prev.map((s) => (s.id === updated.id ? updated : s))
                          );
                          setSelectedSoumission(updated);
                          // Recharger les réponses
                          const repsRes = await fetch(
                            `http://localhost:8080/api/examens/soumissions/${updated.id}/reponses`
                          );
                          if (repsRes.ok) {
                            const reps = await repsRes.json();
                            setReponsesSoumission(reps || []);
                          }
                          alert("Résultats publiés avec succès ! Les étudiants peuvent maintenant voir leurs résultats.");
                        } catch (e) {
                          console.error(e);
                          alert("Erreur lors de la publication");
                        }
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Publier les résultats
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm">
                  <span className="font-medium">Statut :</span> {selectedSoumission.statut} |{" "}
                  <span className="font-medium">Score Auto :</span> {selectedSoumission.scoreAuto || 0} |{" "}
                  <span className="font-medium">Score Manuel :</span> {selectedSoumission.scoreManuel || 0} |{" "}
                  <span className="font-medium">Score Total :</span> {selectedSoumission.scoreTotal || 0}
                </p>
              </div>

              <div className="space-y-4">
                {reponsesSoumission.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucune réponse pour cette soumission.
                  </p>
                ) : (
                  reponsesSoumission.map((r) => {
                  const needsCorrection = r.type === "TEXT" && r.statut === "A_CORRIGER";
                  return (
                    <div key={r.id} className="bg-white border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{r.questionTitre}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Type : {r.type} | Barème : {r.questionBareme || 1} pts
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          r.statut === "AUTO_CORRIGE" ? "bg-green-100 text-green-800" :
                          r.statut === "A_CORRIGER" ? "bg-yellow-100 text-yellow-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {r.statut}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Réponse étudiant :</span> {r.reponse || "Aucune"}
                      </div>
                      {r.type !== "TEXT" && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Réponse correcte :</span> {r.questionCorrect}
                        </div>
                      )}
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Note :</span> {r.note !== null ? `${r.note} / ${r.questionBareme || 1}` : "Non noté"}
                      </div>

                      {needsCorrection && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max={r.questionBareme || 1}
                            className="border rounded px-3 py-2 text-sm w-32"
                            placeholder="Note"
                            value={noteInputs[r.id] ?? ""}
                            onChange={(e) =>
                              setNoteInputs({ ...noteInputs, [r.id]: e.target.value })
                            }
                          />
                          <button
                            onClick={async () => {
                              const note = parseFloat(noteInputs[r.id]);
                              if (isNaN(note) || note < 0) {
                                alert("Saisissez une note valide");
                                return;
                              }
                              try {
                                const res = await fetch(
                                  `http://localhost:8080/api/examens/soumissions/${r.id}/corriger`,
                                  {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ note }),
                                  }
                                );
                                if (!res.ok) {
                                  const text = await res.text();
                                  alert(`Erreur correction: ${text}`);
                                  return;
                                }
                                const updated = await res.json();
                                setReponsesSoumission((prev) =>
                                  prev.map((x) => (x.id === updated.id ? updated : x))
                                );
                                // Recharger la soumission pour mettre à jour les scores
                                try {
                                  const soumRes = await fetch(
                                    `http://localhost:8080/api/examens/${id}/soumissions`
                                  );
                                  if (soumRes.ok) {
                                    const soums = await soumRes.json();
                                    const updatedSoum = soums.find((s) => s.id === selectedSoumission.id);
                                    if (updatedSoum) {
                                      setSelectedSoumission(updatedSoum);
                                      setSoumissions(soums);
                                    }
                                  }
                                } catch (e) {
                                  console.error("Erreur rechargement soumissions:", e);
                                }
                                setNoteInputs((prev) => {
                                  const newInputs = { ...prev };
                                  delete newInputs[r.id];
                                  return newInputs;
                                });
                              } catch (e) {
                                console.error(e);
                                alert("Erreur lors de la correction");
                              }
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                          >
                            Noter
                          </button>
                        </div>
                      )}
                    </div>
                  );
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
