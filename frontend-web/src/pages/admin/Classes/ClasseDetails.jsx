import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Upload, ChevronDown, ChevronUp } from "lucide-react";
import Header from "../../../components/Layouts/Header";
import Aside from "../../../components/Layouts/Aside";
import { useSelector, useDispatch } from "react-redux";
import { fetchClasseById } from "../../../store/slices/classSlice";
import AddStudentModal from "./AddStudentModal";
import ImportStudentsModal from "./ImportStudentsModal";
import AddProfesseurModal from "./AddProfesseurModal";

function ClasseDetails({ pages }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedClasse, loading } = useSelector((state) => state.classes);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [showStudents, setShowStudentts] = useState(false);
  const [showAddProfModal, setShowAddProfModal] = useState(false);



  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    if (!selectedClasse?.etudiants) return [];
    return selectedClasse.etudiants.filter((student) =>
      student.nom.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, selectedClasse]);







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

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Classe : {selectedClasse.nom}
              </h1>
              <p className="text-gray-500">
                Année scolaire : <span className="font-medium">{selectedClasse.annee}</span>
              </p>
            </div>

            
          </div>


           {/* Professors List */}
          <section className="bg-white rounded-ms mb-8 shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4 justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                Liste des professeurs
              </h2>
              <button
                onClick={() => setShowAddProfModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl shadow-sm mt-4"
              >
                <PlusCircle className="w-5 h-5" /> Ajouter un professeur
              </button>
            </div>

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
                    {selectedClasse.professeurs?.map((prof, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{prof.nom}</td>
                        <td className="px-4 py-2">{prof.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>


          <section className="mb-10 shadow">
            <button
              onClick={() => setShowStudentts(!showStudents)}
              className="bg-white w-full py-6 flex justify-between px-8 cursor-pointer hover:shadow-md transition-all rounded-ms shadow"
            >
              <p className="font-medium text-xl">
                Etudiants ({selectedClasse?.etudiants?.length})
              </p>
              {showStudents ? <ChevronDown /> : <ChevronUp />}
            </button>

            {showStudents && (
              <div className="bg-white px-8 pb-4">
                <div className="mb-4 flex justify-between items-center mb-6">
                  {selectedClasse.etudiants?.length != 0 ? (
                  <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-64 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  ): <div></div>}

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
                {selectedClasse.etudiants?.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Aucun élève ajouté pour le moment.
                  </p>
                ) : (
                  <>
                    {/* Search Input */}
                    

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student, index) => (
                            <tr
                              key={student.id || index}
                              className="hover:bg-yellow-50 transition duration-200"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                <Link
                                  to={`/admin/utilisateurs/${student.id}`}
                                  className="text-yellow-600 hover:text-yellow-800 underline"
                                >
                                  {student.nom}
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                {student.email}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {showAddModal && <AddStudentModal classeId={id} setShowModal={setShowAddModal} />}
      {showImportModal && <ImportStudentsModal setShowModal={setShowImportModal} classeId={id} />}
      {showAddProfModal && <AddProfesseurModal classeId={id} setShowModal={setShowAddProfModal} />}
    </div>  
  );
}

export default ClasseDetails;
