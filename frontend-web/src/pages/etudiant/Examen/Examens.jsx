import { FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";

import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Examens({ pages }) {
  const { list: examens, loading, error } = useSelector((state) => state.examens);

  const historique = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Aside pages={pages} />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-green-600" size={28} />
              Examens de la classe
            </h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-6">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Exam list */}
          <ul className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {examens.map((e) => (
              <li
                key={e.id}
                className="border border-green-100 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{e.titre}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{e.description}</p>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Clock size={18} />
                  <span>Durée : {e.duree} min</span>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/etudiant/exams/${e.id}`}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                  >
                    Accéder à l'examen
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Historique section */}
          {/* <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
              Historique
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {historique.map((item, key) => {
                const note = key + 8;
                const isGood = note >= 10;
                return (
                  <div
                    key={key}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
                      isGood ? "border-green-200" : "border-red-200"
                    }`}
                  >
                    <h2 className="text-lg font-medium text-gray-700">
                      Examen {key + 1}
                    </h2>
                    <div className="flex items-end space-x-1">
                      <p
                        className={`text-2xl font-semibold ${
                          isGood ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {note}
                      </p>
                      <p className="text-gray-500">/20</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section> */}
        </main>
      </div>
    </div>
  );
}
