import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// 🧩 Pages Étudiant
import ExamensEtudiant from "./pages/etudiant/Examens";
import DashboardEtudiant from "./pages/etudiant/DashboardEtudiant"; // nouvelle page

// 🧩 Pages Professeur
import ProfExamens from "./pages/professeur/Examens";

// 🧩 Pages Admin
import AdminUtilisateurs from "./pages/admin/Utilisateurs";

function App() {
  const user = JSON.parse(localStorage.getItem("utilisateur"));

  return (
    <Router>
      <Routes>
        {/* --- Page de connexion --- */}
        <Route path="/login" element={<Login />} />

        {/* ================= ÉTUDIANT ================= */}
        <Route element={<ProtectedRoute allowedRoles={["ETUDIANT"]} />}>
          <Route path="/etudiant/dashboard" element={<DashboardEtudiant />} />
          <Route path="/etudiant/examens" element={<ExamensEtudiant />} />
        </Route>

        {/* ================= PROFESSEUR ================= */}
        <Route element={<ProtectedRoute allowedRoles={["PROFESSEUR"]} />}>
          <Route path="/professeur/examens" element={<ProfExamens />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
          {/* 🔜 plus tard : <Route path="/admin/dashboard" ... /> */}
        </Route>

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
    </Router>
  );
}

export default App;
