import { useEffect, useState } from "react";
import axios from "axios";

import Aside from "../../components/Layouts/Aside";
import Header from "../../components/Layouts/Header";

export default function Examens({pages}) {
  const [examens, setExamens] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/examens/afficher")
      .then(res => {
        console.log("✅ Examens reçus :", res.data);
        setExamens(res.data);
      })
      .catch(err => {
        console.error("❌ Erreur :", err);
        setError("Impossible de charger les examens");
      });
  }, []);



  const historique = [1,2,3,4,5,6]



  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />


      <div className="flex flex-col flex-1 w-full min-h-screen ">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📘 Examens de la classe</h1>

            {error && <p className="text-red-500">{error}</p>}

            <ul>
              {examens.map(e => (
                <li className="border p-3 rounded-lg mb-2 border  bg-blue-600 hover:scale-105 text-white shadow-md transition-all px-8 py-5 hover:shadow-2xl">
                  <h2 className="text-lg font-semibold"> {e.titre}</h2>
                  <p> {e.description} </p>
                  <p className="mt-4 font-medium text-lg">⏱ Durée : {e.duree} min</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold px-6 opacity-90 "> Historique </h2>
            
            <div className="grid grid-cols-3 gap-4 mt-4 px-12">
              {historique.map((item,key)=> (
                <div className="bg-white opacity-60 hover:opacity-100 transition-all rounded-md hover:shadow cursor-pointer h-20 px-4 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold"> Examen {key} </h2>
                  <div className="flex items-center space-x-1">
                    <p className={`scale-120  ${key+8 >= 10 ? 'text-green-400' : 'text-red-400'}`}> {key+8} </p>
                    <p> /20 </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}