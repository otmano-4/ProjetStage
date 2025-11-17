import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";


import Dashboard from "./components/Pages/Dashboard";


// 🧩 Pages Étudiant
import ExamensEtudiant from "./pages/etudiant/Examen/Examens";
import ExercicesEtudiant from "./pages/etudiant/Exercices/Exercices";

// 🧩 Pages Professeur
import ProfExamens from "./pages/professeur/Examens/Examens";

// 🧩 Pages Admin
import AdminUtilisateurs from "./pages/admin/Utilisateurs";
import "./App.css"
import Profile from "./components/Pages/Profile";


import { useDispatch } from 'react-redux'


import {BookText, LayoutDashboard, Newspaper} from 'lucide-react'
import { useEffect } from "react";
import { fetchExamens } from "./store/slices/examSlice";
import Classe from "./pages/professeur/Classes/Classe";
import { fetchClasses } from "./store/slices/classSlice";
import ClasseDetails from "./pages/professeur/Classes/ClasseDetails";


function App() {
  const user = JSON.parse(localStorage.getItem("utilisateur"));


  const etudiantPages = [ 
    {
      "title": "Dashboard",
      "link": "/etudiant/dashboard",
      "icon": <LayoutDashboard />
    },
    {
      "title": "Exams",
      "link": "/etudiant/exams",
      "icon": <Newspaper />
    },
    {
      "title": "Exercices",
      "link": "/etudiant/exercices",
      "icon": <BookText />
    },
  ]
  
  const profPages = [ 
    {
      "title": "Dashboard",
      "link": "/professeur/dashboard",
      "icon": <LayoutDashboard />
    },
    {
      "title": "Exams",
      "link": "/professeur/exams",
      "icon": <Newspaper />
    },
     {
      "title": "Classe",
      "link": "/professeur/classe",
      "icon": <Newspaper />
    },
  ]



  const dispatch = useDispatch()
  

  useEffect(() => {
    dispatch(fetchExamens());
    dispatch(fetchClasses());
  }, [dispatch]);

  


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["ETUDIANT"]} />}>
          <Route path="/etudiant/dashboard" element={<Dashboard pages={etudiantPages} />} />
          <Route path="/etudiant/exams" element={<ExamensEtudiant pages={etudiantPages} />} />
          <Route path="/etudiant/exercices" element={<ExercicesEtudiant pages={etudiantPages} />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["PROFESSEUR"]} />}>
          <Route path="/professeur/dashboard" element={<Dashboard pages={profPages}  />} />
          <Route path="/professeur/exams" element={<ProfExamens pages={profPages} />} />
          <Route path="/professeur/classe" element={<Classe pages={profPages}  />} />
          <Route path="/professeur/classe/:id" element={<ClasseDetails pages={profPages}  />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
        </Route>


        <Route path="/profile" element={<Profile pages={etudiantPages} />} />
        
        
        
        
        <Route
          path="/"
          element={
            user ? (
              user.role === "ETUDIANT" ? (
                <Navigate to="/etudiant/dashboard" replace />
              ) : user.role === "PROFESSEUR" ? (
                <Navigate to="/professeur/dashboard" replace />
              ) : (
                <Navigate to="/admin/dashboard" replace />
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
