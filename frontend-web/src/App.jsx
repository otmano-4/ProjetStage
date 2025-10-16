import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// 🧩 Pages Étudiant
import ExamensEtudiant from "./pages/etudiant/Examens";
import ExercicesEtudiant from "./pages/etudiant/Exercices";

// 🧩 Pages Professeur
import ProfExamens from "./pages/professeur/Examens";

// 🧩 Pages Admin
import AdminUtilisateurs from "./pages/admin/Utilisateurs";
import "./App.css"
import Dashboard from "./components/Pages/Dashboard";
import Profile from "./components/Pages/Profile";

function App() {
  const user = JSON.parse(localStorage.getItem("utilisateur"));


  const etudiantPages = [ 
    {
      "title": "Dashboard",
      "link": "/etudiant/dashboard"
    },
    {
      "title": "Exams",
      "link": "/etudiant/exams"
    },
    {
      "title": "Exercices",
      "link": "/etudiant/exercices"
    },
  ]
  
  const profPages = [ 
    {
      "title": "Dashboard",
      "link": "/"
    },
    {
      "title": "Exams",
      "link": "/exams"
    },
  ]

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Page de connexion --- */}
        <Route path="/login" element={<Login />} />

        {/* ================= ÉTUDIANT ================= */}
        <Route element={<ProtectedRoute allowedRoles={["ETUDIANT"]} />}>
          <Route path="/etudiant/dashboard" element={<Dashboard pages={etudiantPages} />} />
          <Route path="/etudiant/exams" element={<ExamensEtudiant pages={etudiantPages} />} />
          <Route path="/etudiant/exercices" element={<ExercicesEtudiant pages={etudiantPages} />} />
        </Route>

        {/* ================= PROFESSEUR ================= */}
        <Route element={<ProtectedRoute allowedRoles={["PROFESSEUR"]} />}>
          <Route path="/professeur/dashboard" element={<Dashboard pages={profPages}  />} />
          <Route path="/professeur/examens" element={<ProfExamens />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
          {/* 🔜 plus tard : <Route path="/admin/dashboard" ... /> */}
        </Route>


        <Route path="/profile" element={<Profile pages={etudiantPages} />} />
        
        
        
        
        {/* --- Redirection automatique selon rôle --- */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "ETUDIANT" ? (
                <Navigate to="/etudiant/dashboard" replace />
              ) : user.role === "PROFESSEUR" ? (
                <Navigate to="/professeur/examens" replace />
              ) : (
                <Navigate to="/admin/utilisateurs" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* --- Route par défaut --- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
