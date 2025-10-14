import { Home, FileText, BarChart2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SidebarEtudiant() {
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/etudiant/dashboard" },
    { label: "Examens", icon: <FileText size={20} />, path: "/etudiant/examens" },
    { label: "Résultats", icon: <BarChart2 size={20} />, path: "/etudiant/resultats" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    navigate("/login");
  };

  return (
    <aside className="flex flex-col justify-between h-full p-4">
      <div>
        <div className="font-bold text-xl text-blue-600 mb-6">🎓 E-Exam</div>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
      >
        <LogOut size={18} /> Déconnexion
      </button>
    </aside>
  );
}
