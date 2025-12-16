import React, { useState, useEffect } from "react";
import Aside from "../Layouts/Aside";
import Header from "../Layouts/Header";
import { BookOpen, Users, ClipboardList, Calendar, TrendingUp, Award } from "lucide-react";
import { useSelector } from "react-redux";
import ScoreDistributionChart from "../Charts/ScoreDistributionChart";
import PerformanceChart from "../Charts/PerformanceChart";
import PieChartComponent from "../Charts/PieChartComponent";
import ClasseStatsChart from "../Charts/ClasseStatsChart";

export default function Dashboard({ pages }) {
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user?.id, user?.role]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      if (user?.role === "PROFESSEUR") {
        const res = await fetch(`http://localhost:8080/api/statistics/professeurs/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } else if (user?.role === "ETUDIANT") {
        const res = await fetch(`http://localhost:8080/api/statistics/etudiants/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      }
    } catch (err) {
      console.error("Erreur chargement statistiques:", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats pour professeur
  const getProfessorStats = () => {
    if (!stats) return [];
    
    return [
      {
        title: "Total Examens",
        value: stats.nombreExamens || 0,
        icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      },
      {
        title: "Soumissions",
        value: stats.totalSoumissions || 0,
        icon: <Users className="w-6 h-6 text-green-600" />,
      },
      {
        title: "Moyenne Globale",
        value: stats.moyenneGlobale ? `${stats.moyenneGlobale.toFixed(1)}` : "0",
        icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      },
      {
        title: "Examens Corrigés",
        value: stats.nombreExamensAvecSoumissions || 0,
        icon: <Award className="w-6 h-6 text-orange-600" />,
      },
    ];
  };

  // Stats pour étudiant
  const getStudentStats = () => {
    if (!stats) return [];
    
    return [
      {
        title: "Examens Passés",
        value: stats.nombreExamensPasses || 0,
        icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      },
      {
        title: "Moyenne Globale",
        value: stats.moyenneGlobale ? `${stats.moyenneGlobale.toFixed(1)}` : "0",
        icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      },
      {
        title: "Meilleur Score",
        value: stats.meilleurScore ? `${stats.meilleurScore.toFixed(1)}` : "0",
        icon: <Award className="w-6 h-6 text-purple-600" />,
      },
      {
        title: "Score Total",
        value: stats.scoreTotal ? `${stats.scoreTotal.toFixed(1)}` : "0",
        icon: <BookOpen className="w-6 h-6 text-orange-600" />,
      },
    ];
  };

  const displayStats = user?.role === "PROFESSEUR" ? getProfessorStats() : 
                       user?.role === "ETUDIANT" ? getStudentStats() : [];

  // Préparer les données pour le graphique en camembert (professeur)
  const getDistributionPieData = () => {
    if (!stats?.distributionGlobale) return [];
    return Object.entries(stats.distributionGlobale)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value: Number(value)
      }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100/60">
      <Aside pages={pages} />

      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Dashboard Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {user?.role === "ETUDIANT" && "Étudiant "} 
            {user?.role === "PROFESSEUR" && "Professeur "} 
            {user?.role === "ADMIN" && "Administrateur "} 
            Dashboard
          </h1>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Chargement des statistiques...</p>
            </div>
          ) : (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {displayStats.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition"
                  >
                    <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
                    <div>
                      <p className="text-gray-500 text-sm">{item.title}</p>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {item.value}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphiques pour Professeur */}
              {user?.role === "PROFESSEUR" && stats && (
                <div className="space-y-6">
                  {stats.distributionGlobale && Object.values(stats.distributionGlobale).some(v => v > 0) && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-900 mb-2">💡 Comprendre les graphiques</h4>
                        <p className="text-sm text-blue-800">
                          Les graphiques ci-dessous vous montrent comment vos étudiants ont performé dans vos examens.
                          Utilisez ces informations pour identifier les points forts et les difficultés de vos étudiants.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ScoreDistributionChart data={stats.distributionGlobale} />
                        <PieChartComponent 
                          data={getDistributionPieData()} 
                          title="Distribution des notes (camembert)" 
                        />
                      </div>
                    </>
                  )}
                  
                  {stats.statsParExamen && stats.statsParExamen.length > 0 && (
                    <PerformanceChart 
                      data={stats.statsParExamen} 
                      title="Performance moyenne par examen"
                    />
                  )}

                  {stats.statsParClasse && stats.statsParClasse.length > 0 && (
                    <ClasseStatsChart data={stats.statsParClasse} />
                  )}

                  {(!stats.distributionGlobale || !Object.values(stats.distributionGlobale).some(v => v > 0)) && 
                   (!stats.statsParExamen || stats.statsParExamen.length === 0) && (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                      <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-700">Aucune donnée disponible</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Les graphiques apparaîtront ici une fois que vous aurez publié les résultats de vos examens.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Graphiques pour Étudiant */}
              {user?.role === "ETUDIANT" && stats && (
                <div className="space-y-6">
                  {stats.statsParExamen && stats.statsParExamen.length > 0 && (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-green-900 mb-2">💡 Comprendre votre graphique</h4>
                        <p className="text-sm text-green-800">
                          Le graphique ci-dessous montre votre progression à travers vos examens. 
                          La ligne bleue représente votre score en points, et la ligne verte votre pourcentage de réussite.
                          Utilisez-le pour suivre votre évolution et identifier les matières où vous excellez ou où vous devez progresser.
                        </p>
                      </div>
                      <PerformanceChart 
                        data={stats.statsParExamen} 
                        title="Mes résultats par examen"
                      />
                    </>
                  )}
                  
                  {stats.statsParExamen && stats.statsParExamen.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">📋 Détails de mes examens</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Tableau récapitulatif de tous vos examens avec vos scores, pourcentages et points totaux.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Examen
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pourcentage
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Points
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {stats.statsParExamen.map((exam, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {exam.examenTitre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.score?.toFixed(1) || '0'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.pourcentage?.toFixed(1) || '0'}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.totalPoints?.toFixed(1) || '0'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {(!stats.statsParExamen || stats.statsParExamen.length === 0) && (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                      <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-700">Aucun résultat disponible</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Vos résultats apparaîtront ici une fois que vos examens seront publiés.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Dashboard Admin (pas de graphiques pour l'instant) */}
              {user?.role === "ADMIN" && (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                  <p className="text-gray-500">Dashboard administrateur - Fonctionnalités à venir</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
