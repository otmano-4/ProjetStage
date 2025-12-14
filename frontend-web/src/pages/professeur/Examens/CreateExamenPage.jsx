import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, X, Trash2, Save } from "lucide-react";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import { fetchAllExamens, createExamFun, createQuestionFun } from "../../../store/slices/examSlice";
import { fetchClassesByProfesseur } from "../../../store/slices/classSlice";

export default function CreateExamenPage({ pages }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { data: classes } = useSelector((state) => state.classes);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchClassesByProfesseur(user.id));
    }
  }, [dispatch, user?.id]);

  const [newExam, setNewExam] = useState({
    titre: "",
    description: "",
    duree: 0,
    classeId: 0,
    professeurId: user?.id || null,
    afficher: true,
    dateDebut: "",
    dateFin: "",
  });
  
  // Mettre à jour professeurId si user change
  useEffect(() => {
    if (user?.id) {
      setNewExam(prev => ({ ...prev, professeurId: user.id }));
    }
  }, [user?.id]);

  const [calculatedDuration, setCalculatedDuration] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [questionForm, setQuestionForm] = useState({
    type: "MULTIPLE",
    titre: "",
    options: "",
    correct: "",
    bareme: 1.0,
  });

  const handleExamChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedExam = {
      ...newExam,
      [name]: type === "checkbox" ? checked : name === "classeId" ? Number(value) : value,
    };
    setNewExam(updatedExam);

    // Calculer la durée automatiquement
    if ((name === "dateDebut" || name === "dateFin") && updatedExam.dateDebut && updatedExam.dateFin) {
      const debut = new Date(updatedExam.dateDebut);
      const fin = new Date(updatedExam.dateFin);
      if (fin > debut) {
        const diffMs = fin - debut;
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        setCalculatedDuration(diffMinutes);
        updatedExam.duree = diffMinutes;
        setNewExam(updatedExam);
      } else {
        setCalculatedDuration(0);
      }
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({
      ...prev,
      [name]: name === "bareme" ? parseFloat(value) || 1.0 : value,
    }));
  };

  const handleTypeChange = (value) => {
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

  const handleAddQuestion = () => {
    if (!questionForm.titre) {
      setError("Veuillez renseigner l'intitulé de la question");
      return;
    }
    if (questionForm.type !== "TEXT" && !questionForm.options) {
      setError("Les options sont obligatoires pour ce type de question");
      return;
    }
    if (!questionForm.correct) {
      setError("Veuillez renseigner la réponse correcte");
      return;
    }
    if (questionForm.bareme <= 0) {
      setError("Le barème doit être supérieur à 0");
      return;
    }

    const newQuestion = {
      id: Date.now(), // ID temporaire pour l'affichage
      ...questionForm,
    };
    setQuestions([...questions, newQuestion]);
    setQuestionForm({
      type: "MULTIPLE",
      titre: "",
      options: "",
      correct: "",
      bareme: 1.0,
    });
    setError("");
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!newExam.titre) {
      setError("Veuillez renseigner le titre de l'examen");
      setLoading(false);
      return;
    }
    if (!newExam.dateDebut || !newExam.dateFin) {
      setError("Veuillez renseigner la date de début et la date de fin");
      setLoading(false);
      return;
    }
    if (questions.length === 0) {
      setError("Veuillez ajouter au moins une question");
      setLoading(false);
      return;
    }

    // Calculer la durée
    const debut = new Date(newExam.dateDebut);
    const fin = new Date(newExam.dateFin);
    if (fin <= debut) {
      setError("La date de fin doit être après la date de début");
      setLoading(false);
      return;
    }
    const dureeFinale = Math.round((fin - debut) / (1000 * 60));

    // Convertir les dates
    const convertLocalDateTime = (localDateTimeString) => {
      if (!localDateTimeString) return null;
      return localDateTimeString + ":00";
    };

    const examData = {
      ...newExam,
      duree: dureeFinale,
      dateDebut: convertLocalDateTime(newExam.dateDebut),
      dateFin: convertLocalDateTime(newExam.dateFin),
    };

    try {
      // Créer l'examen
      const examResult = await dispatch(createExamFun(examData)).unwrap();
      const examId = examResult.id;

      // Ajouter toutes les questions
      for (const question of questions) {
        const questionData = {
          type: question.type,
          titre: question.titre,
          choix: question.options,
          correct: question.correct,
          bareme: question.bareme,
        };
        await dispatch(createQuestionFun({ examId, question: questionData })).unwrap();
      }

      // Recharger la liste et rediriger
      await dispatch(fetchAllExamens());
      navigate(`/professeur/exams/${examId}`);
    } catch (err) {
      setError(err.message || "Erreur lors de la création de l'examen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-6">
            <button
              onClick={() => navigate("/professeur/exams")}
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
            >
              ← Retour à la liste
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Créer un nouvel examen</h1>
            <p className="text-gray-600 mt-2">Remplissez les informations de l'examen et ajoutez les questions</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION 1 : INFORMATIONS DE L'EXAMEN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Informations de l'examen
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Titre de l'examen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={newExam.titre}
                    onChange={handleExamChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Examen de Mathématiques - Chapitre 3"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newExam.description}
                    onChange={handleExamChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description de l'examen..."
                  />
                </div>

                {/* Classe */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Classe <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="classeId"
                    value={newExam.classeId}
                    onChange={handleExamChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Sélectionner une classe</option>
                    {classes?.map((c) => (
                      <option key={c.id} value={Number(c.id)}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date de début */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Date et heure de début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="dateDebut"
                    value={newExam.dateDebut}
                    onChange={handleExamChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">L'examen sera visible à partir de cette date/heure</p>
                </div>

                {/* Date de fin */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Date et heure de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="dateFin"
                    value={newExam.dateFin}
                    onChange={handleExamChange}
                    min={newExam.dateDebut || undefined}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">L'examen sera bloqué après cette date/heure</p>
                  {calculatedDuration > 0 && (
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      ⏱️ Durée calculée : {calculatedDuration} minutes
                    </p>
                  )}
                </div>

                {/* Visibilité */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="afficher"
                      checked={newExam.afficher}
                      onChange={handleExamChange}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <label className="text-sm text-gray-700 cursor-pointer">
                      <span className="font-medium">Publier l'examen</span>
                      <span className="block text-xs text-gray-500 mt-1">
                        L'examen sera visible aux étudiants dans la période définie
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2 : AJOUT DE QUESTIONS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Ajouter des questions
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {questions.length} question{questions.length !== 1 ? "s" : ""} ajoutée{questions.length !== 1 ? "s" : ""}
                </span>
              </h2>

              {/* Formulaire d'ajout de question */}
              <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Nouvelle question</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Type de question</label>
                    <select
                      value={questionForm.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MULTIPLE">QCM / Choix multiples</option>
                      <option value="TRUE_FALSE">Vrai / Faux</option>
                      <option value="TEXT">Question ouverte</option>
                    </select>
                  </div>

                  {/* Barème */}
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Barème (points)</label>
                    <input
                      type="number"
                      name="bareme"
                      value={questionForm.bareme}
                      onChange={handleQuestionChange}
                      min="0.1"
                      step="0.1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Intitulé */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Intitulé de la question</label>
                    <input
                      type="text"
                      name="titre"
                      value={questionForm.titre}
                      onChange={handleQuestionChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Quelle est la capitale de la France ?"
                    />
                  </div>

                  {/* Options (si pas TEXT) */}
                  {questionForm.type !== "TEXT" && (
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-xs font-medium mb-1.5">
                        Options (séparées par des virgules)
                      </label>
                      <input
                        type="text"
                        name="options"
                        value={questionForm.options}
                        onChange={handleQuestionChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Option A, Option B, Option C"
                      />
                    </div>
                  )}

                  {/* Réponse correcte */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-xs font-medium mb-1.5">Réponse correcte</label>
                    <input
                      type="text"
                      name="correct"
                      value={questionForm.correct}
                      onChange={handleQuestionChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Option B"
                    />
                  </div>

                  {/* Bouton ajouter */}
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Ajouter la question
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des questions ajoutées */}
              {questions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Questions ajoutées</h3>
                  {questions.map((q, index) => {
                    const optionsArray = (q.options || "").split(",").filter(Boolean);
                    const typeLabel =
                      q.type === "TEXT"
                        ? "Question ouverte"
                        : q.type === "TRUE_FALSE"
                        ? "Vrai/Faux"
                        : "QCM";
                    return (
                      <div
                        key={q.id || index}
                        className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {typeLabel}
                            </span>
                            <span className="text-xs text-gray-500">{q.bareme} pts</span>
                          </div>
                          <p className="font-medium text-gray-800 mb-1">{q.titre}</p>
                          {optionsArray.length > 0 && (
                            <p className="text-xs text-gray-600">Options: {optionsArray.join(", ")}</p>
                          )}
                          <p className="text-xs text-green-700 mt-1">✓ Réponse: {q.correct}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="ml-4 text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BOUTON DE CRÉATION */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/professeur/exams")}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || questions.length === 0}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Créer l'examen
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

