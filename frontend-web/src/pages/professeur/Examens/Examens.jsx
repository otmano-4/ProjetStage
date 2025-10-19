import React, { useState } from "react";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import { PlusCircle, FileText } from "lucide-react";
import { useSelector } from "react-redux";
import CreateExamen from "./CreateExamen";

export default function Examens({ pages }) {
  const { list: examens, loading, error } = useSelector((state) => state.examens);

  const [showModal, setShowModal] = useState(false);
  
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />

      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manage Exams</h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Exam</span>
            </button>
          </div>

          {examens.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No exams available</p>
              <p className="text-sm mt-1">Start by creating your first exam.</p>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Exams List</h2>
              <ul className="space-y-3">
                {examens.map((exam) => (
                  <li
                    key={exam.id}
                    className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {exam.titre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Duration: {exam.duree} min
                      </p>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <CreateExamen setShowModal={setShowModal} />
      )}
    </div>
  );
}
