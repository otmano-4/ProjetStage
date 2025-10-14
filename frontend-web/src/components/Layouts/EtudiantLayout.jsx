import SidebarEtudiant from "../SidebarEtudiant";
import HeaderEtudiant from "../HeaderEtudiant";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function EtudiantLayout({ children }) {
  const utilisateur = JSON.parse(localStorage.getItem("utilisateur")) || {
    nom: "Étudiant Test",
    role: "ETUDIANT",
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== Sidebar (fixe sur desktop) ===== */}
      <aside
        className={`fixed md:static z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <SidebarEtudiant />
      </aside>

      {/* ===== Contenu principal ===== */}
      <div className="flex flex-col flex-1 w-full min-h-screen md:ml-64">
        {/* Header (mobile) */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
          <h1 className="text-xl font-bold text-blue-700">E-Exam</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded hover:bg-gray-100">
            <Menu size={22} />
          </button>
        </div>

        {/* Header étudiant (profil, nom, rôle) */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <HeaderEtudiant utilisateur={utilisateur} />
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
