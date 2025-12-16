import React, { useEffect } from "react";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import { FileText, Clock, Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchExamensByClasse } from "../../../store/slices/examSlice";

export default function ExamensEtudiant({ pages }) {
  const dispatch = useDispatch();
  const { list: examens } = useSelector((state) => state.examens);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.classeId) {
      dispatch(fetchExamensByClasse(user.classeId));
      // Rafraîchir automatiquement toutes les 10 secondes pour voir les nouveaux examens
      const interval = setInterval(() => {
        dispatch(fetchExamensByClasse(user.classeId));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user?.classeId]);

  const getStatutBadge = (examen) => {
    const maintenant = new Date();
    const dateDebut = examen.dateDebut ? new Date(examen.dateDebut) : null;
    const dateFin = examen.dateFin ? new Date(examen.dateFin) : null;

    if (dateDebut && maintenant < dateDebut) {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          À venir
        </span>
      );
    }
    if (dateFin && maintenant > dateFin) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          Terminé
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        Disponible
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Examens</h1>
            <p className="text-gray-600">Consultez et passez vos examens</p>
          </div>

          {examens.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700">Aucun examen disponible</p>
              <p className="text-sm text-gray-500 mt-2">
                Les examens créés par votre professeur apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {examens.map((exam) => (
                <Link
                  to={`/etudiant/exams/${exam.id}`}
                  key={exam.id}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {exam.titre}
                        </h3>
                        {exam.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {exam.description}
                          </p>
                        )}
                      </div>
                      {getStatutBadge(exam)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duree} minutes</span>
                      </div>
                      {exam.dateDebut && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Début: {formatDate(exam.dateDebut)}</span>
                        </div>
                      )}
                      {exam.dateFin && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Fin: {formatDate(exam.dateFin)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

