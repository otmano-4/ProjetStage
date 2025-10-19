import { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

export default function Exercices({pages}) {
  const [exercices, setexercices] = useState([]);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const utilisateur = {}

  useEffect(() => {
    axios.get("http://localhost:8080/api/exercices/classe/1")
      .then(res => {
        console.log("✅ exercices reçus :", res.data);
        setexercices(res.data);
      })
      .catch(err => {
        console.error("❌ Erreur :", err);
        setError("Impossible de charger les exercices");
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== Sidebar (fixe sur desktop) ===== */}
      <aside
        className={`fixed md:static z-30  w-64 bg-white shadow-lg transform transition-transform duration-300 h-screen ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="font-bold text-3xl text-blue-600 mb-6 text-center pt-5">🎓 E-Exam</div>
        
        {pages?.map((item,key)=> (
            <Link
                to={item.link}
                key={key}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
            >
                {item.title}
            </Link>
        ))}



      </aside>


      <div className="flex flex-col flex-1 w-full min-h-screen ">
        {/* Header (mobile) */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
          <h1 className="text-xl font-bold text-blue-700">E-Exam</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded hover:bg-gray-100">
          </button>
        </div>

        <div className="sticky top-0 w-full left-0 z-10 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    👋 Bienvenue <span className="text-blue-600">{utilisateur.nom}</span>
                    </h1>
                    <p className="text-sm text-gray-500">
                        Connecté en tant que <strong>{utilisateur.role}</strong>
                    </p>
                </div>

                <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="rounded-full w-10 h-10 border-2 border-blue-200"
                />
            </header>
          </div>
        </div>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">📘 Exercice de la classe</h1>

          {error && <p className="text-red-500">{error}</p>}

          <ul>
            
          </ul>
        </div>
        </main>
      </div>
    </div>
  );
}

