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
import Classe from "./pages/admin/Classes/Classe";
import ClasseDetails from "./pages/admin/Classes/ClasseDetails";
import AdminUtilisateurs from "./pages/admin/Users/Utilisateurs";

import Profile from "./components/Pages/Profile";

import { useDispatch, useSelector } from 'react-redux'


import {BookText, LayoutDashboard, Newspaper, Users} from 'lucide-react'
import { useEffect } from "react";
import { fetchExamens, fetchExamensByClasse } from "./store/slices/examSlice";
import { fetchClasses, fetchClassesByProfesseur } from "./store/slices/classSlice";
import { fetchUtilisateurs } from "./store/slices/usersSlice";
import "./App.css"
import UserDetails from "./pages/admin/Users/UserDetails";
import ExamenDetails from "./pages/professeur/Examens/ExamenDetails";


function App() {
  const user = useSelector((state) => state.auth.user);


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
    }
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
    }
  ]

  const adminPages = [
    {
      title: "Dashboard",
      link: "/admin/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Utilisateurs",
      link: "/admin/utilisateurs",
      icon: <Users />,
    },
    {
      title: "Classes",
      link: "/admin/classe",
      icon: <Newspaper />,
    },
  ];



  const dispatch = useDispatch()
  

  useEffect(() => {

    if(user?.role === "ETUDIANT"){
      dispatch(fetchExamensByClasse(user?.classeId));
    }
    if(user?.role === "PROFESSEUR"){
      dispatch(fetchExamens());
      dispatch(fetchClassesByProfesseur(user?.id));
    }
    if(user?.role === "ADMIN"){
      dispatch(fetchUtilisateurs());
      dispatch(fetchClasses());
      dispatch(fetchExamens());
    }
  }, [dispatch, user]);

  


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
          <Route path="/professeur/exams">
            <Route index element={<ProfExamens pages={profPages} />} />
            <Route path=":id" element={<ExamenDetails pages={profPages} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard pages={adminPages}  />} />
          <Route path="/admin/utilisateurs">
            <Route index element={<AdminUtilisateurs pages={adminPages} />} />
            <Route path=":id" element={<UserDetails pages={adminPages} />} />
          </Route>
          <Route path="/admin/classe">
            <Route index element={<Classe pages={adminPages} />} />
            <Route path=":id" element={<ClasseDetails pages={adminPages} />} />
          </Route>
        </Route>

        {/* <Route path="/profile" element={<Profile pages={user?.role === "ETUDIANT" && etudiantPages || user.role === "PROFESSEUR" && profPages || user.role === "ADMIN" && adminPages} />} /> */}
        
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
