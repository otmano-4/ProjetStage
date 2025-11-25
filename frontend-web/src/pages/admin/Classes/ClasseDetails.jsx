import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserCheck, PlusCircle, Upload, ArrowLeft } from "lucide-react";
import Header from "../../../components/Layouts/Header";
import Aside from "../../../components/Layouts/Aside";
import { useSelector, useDispatch } from "react-redux";
import { fetchClasseById } from "../../../store/slices/classSlice";
import AddStudentModal from "./AddStudentModal";
import ImportStudentsModal from "./ImportStudentsModal";

function ClasseDetails({ pages }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedClasse, loading } = useSelector((state) => state.classes);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    dispatch(fetchClasseById(id));
  }, [dispatch, id]);

  if (loading || !selectedClasse) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 sm:px-6 lg:px-20 py-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-yellow-600 hover:underline mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Retour
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Classe : {selectedClasse.nom}
              </h1>
              <p className="text-gray-500">
                Année scolaire : <span className="font-medium">{selectedClasse.annee}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl shadow-sm"
              >
                <Upload className="w-5 h-5" /> Importer (.xlsx)
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl shadow-sm"
              >
                <PlusCircle className="w-5 h-5" /> Ajouter un élève
              </motion.button>
            </div>
          </div>


           {/* Professors List */}
          <section className="bg-white rounded-2xl mb-8 shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <UserCheck className="w-5 h-5 text-blue-500" /> Liste des professeurs
            </h2>

            {selectedClasse.professeurs?.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun professeur assigné pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {selectedClasse.professeurs.map((prof, index) => (
                      <tr
                        key={prof.id || index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{prof.nom}</td>
                        <td className="px-4 py-2">{prof.email}</td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Students List */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Users className="w-5 h-5 text-yellow-500" /> Liste des élèves
            </h2>

            {selectedClasse.etudiants?.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun élève ajouté pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClasse.etudiants.map((student, index) => (
                      <tr
                        key={student.id || index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{student.nom}</td>
                        <td className="px-4 py-2">{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {showAddModal && <AddStudentModal classeId={id} setShowModal={setShowAddModal} />}
      {showImportModal && <ImportStudentsModal setShowModal={setShowImportModal} classeId={id} />}
    </div>
  );
}

export default ClasseDetails;
