import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, CheckCircle, Clock, FileText, ArrowLeft } from "lucide-react";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import { useSelector } from "react-redux";

export default function Soumissions({ pages }) {
  const user = useSelector((state) => state.auth.user);
  const [examens, setExamens] = useState([]);
  const [soumissionsByExam, setSoumissionsByExam] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Charger uniquement les examens du professeur connecté
      const examRes = await fetch(`http://localhost:8080/api/examens/professeur/${user.id}`);
      const examData = await examRes.json();
      setExamens(examData || []);

      // Charger les soumissions pour chaque examen
      const soumissionsMap = {};
      for (const exam of examData) {
        try {
          const soumRes = await fetch(`http://localhost:8080/api/examens/${exam.id}/soumissions`);
          if (soumRes.ok) {
            const soumData = await soumRes.json();
            soumissionsMap[exam.id] = soumData || [];
          }
        } catch (err) {
          soumissionsMap[exam.id] = [];
        }
      }
      setSoumissionsByExam(soumissionsMap);
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      EN_COURS: "bg-yellow-100 text-yellow-800 border-yellow-300",
      SOUMIS: "bg-blue-100 text-blue-800 border-blue-300",
      CORRIGE: "bg-green-100 text-green-800 border-green-300",
      PUBLIE: "bg-purple-100 text-purple-800 border-purple-300",
    };
    const labels = {
      EN_COURS: "En cours",
      SOUMIS: "Soumis",
      CORRIGE: "Corrigé",
      PUBLIE: "Publié",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[statut] || "bg-gray-100 text-gray-800"}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Aside pages={pages} />
        <div className="flex flex-col flex-1 w-full min-h-screen">
          <Header />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <p className="text-gray-600">Chargement...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Aside pages={pages} />
        <div className="flex flex-col flex-1 w-full min-h-screen">
          <Header />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Afficher tous les examens, même ceux sans soumissions
  // Filtrer uniquement par professeur si nécessaire (à implémenter si besoin)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-6">
            <Link
              to="/professeur/exams"
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux examens
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Soumissions des étudiants</h1>
            <p className="text-gray-600 mt-2">Consultez et gérez toutes les soumissions d'examens</p>
          </div>

          {examens.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun examen</h3>
              <p className="text-gray-600">Vous n'avez pas encore créé d'examen.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {examens.map((exam) => {
                const soumissions = soumissionsByExam[exam.id] || [];
                return (
                  <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* En-tête de l'examen */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">{exam.titre}</h2>
                          <p className="text-sm text-gray-600 mt-1">{exam.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Durée: {exam.duree} min</span>
                            {exam.dateDebut && <span>Début: {formatDate(exam.dateDebut)}</span>}
                            {exam.dateFin && <span>Fin: {formatDate(exam.dateFin)}</span>}
                          </div>
                        </div>
                        <Link
                          to={`/professeur/exams/${exam.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Voir détails →
                        </Link>
                      </div>
                    </div>

                    {/* Tableau des soumissions */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Étudiant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Score Auto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Score Manuel
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Score Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Date de soumission
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {soumissions.map((soum) => (
                            <tr key={soum.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{soum.etudiantNom}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{getStatutBadge(soum.statut)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {soum.scoreAuto || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {soum.scoreManuel || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-semibold text-gray-900">
                                  {soum.scoreTotal || 0}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {soum.submittedAt ? formatDate(soum.submittedAt) : "Non soumis"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Link
                                  to={`/professeur/exams/${exam.id}?soumission=${soum.id}`}
                                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  Voir
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Résumé */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Total: <span className="font-semibold text-gray-800">{soumissions.length}</span> soumission
                          {soumissions.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            Soumis:{" "}
                            <span className="font-semibold text-blue-600">
                              {soumissions.filter((s) => s.statut !== "EN_COURS").length}
                            </span>
                          </span>
                          <span className="text-gray-600">
                            Corrigés:{" "}
                            <span className="font-semibold text-green-600">
                              {soumissions.filter((s) => s.statut === "CORRIGE" || s.statut === "PUBLIE").length}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

