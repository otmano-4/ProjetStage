import React, { useState, useEffect } from "react";
import { PlusCircle, Users, GraduationCap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ FIXED IMPORT
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import CreateClasse from "./CreateClasse";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function Classe({ pages }) {
  const { data: classes, loading } = useSelector((state) => state.classes);

  const [showClassModal, setShowClassModal] = useState(false);


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === Sidebar === */}
      <Aside pages={pages} />

      {/* === Main content === */}
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 sm:px-6 lg:px-20 py-10">
          {/* === Header section === */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                📚 Gestion des Classes
              </h1>
              <p className="text-gray-500 mt-1">
                Gérez les classes, professeurs et matières de votre
                établissement.
              </p>
            </div>

            <motion.button
              onClick={() => setShowClassModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              Nouvelle Classe
            </motion.button>
          </div>

          {/* === Classes grid === */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
            </div>
          ) : classes?.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p>Aucune classe enregistrée pour le moment.</p>
              <p className="text-sm mt-1">
                Cliquez sur{" "}
                <span className="font-semibold">“Nouvelle Classe”</span> pour en
                ajouter une.
              </p>
            </div>
          ) : (
            <motion.section
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {classes.map((classe, index) => (
                <motion.div
                  key={classe.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/professeur/classe/${classe.id}`} // 👈 dynamic route
                    className="block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {classe.nom}
                      </h2>
                      <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>

                    <p className="text-gray-500 text-sm mb-3">
                      Année scolaire :{" "}
                      <span className="font-medium text-gray-700">
                        {classe.annee}
                      </span>
                    </p>

                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>25 élèves</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.section>
          )}
        </main>
      </div>

      {/* === Modal === */}
      {showClassModal && <CreateClasse setShowModal={setShowClassModal} />}
    </div>
  );
}

export default Classe;
