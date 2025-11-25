import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import { useSelector, useDispatch } from "react-redux";
import { deleteUtilisateur, fetchUtilisateurById } from "../../../store/slices/usersSlice";
import { Trash2, Edit } from "lucide-react";

function UserDetails({ pages }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const utilisateur = useSelector((state) => state.utilisateurs.selectedUtilisateur);
  const loading = useSelector((state) => state.utilisateurs.loading);

  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchUtilisateurById(id)).unwrap().catch((err) => setError(err));
  }, [dispatch, id]);

  const roleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700";
      case "PROFESSEUR":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Chargement...</p>
          ) : error ? (
            <p className="text-center py-6 text-red-500">{error}</p>
          ) : utilisateur ? (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Détails de l’utilisateur
                </h1>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Retour
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-gray-500 text-sm mb-1">Nom</h2>
                  <p className="text-gray-800 font-medium">{utilisateur.nom}</p>
                </div>

                <div>
                  <h2 className="text-gray-500 text-sm mb-1">Email</h2>
                  <p className="text-gray-800 font-medium">{utilisateur.email}</p>
                </div>

                <div>
                  <h2 className="text-gray-500 text-sm mb-1">Role</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor(
                      utilisateur.role
                    )}`}
                  >
                    {utilisateur.role}
                  </span>
                </div>

                {utilisateur.classe && (
                  <div>
                    <h2 className="text-gray-500 text-sm mb-1">Classe</h2>
                    <p className="text-gray-800 font-medium">{utilisateur.classe}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                  <Edit size={18} />
                  Modifier
                </button>

                <button
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  onClick={() => {
                    if (confirm("Supprimer cet utilisateur ?")) {
                      dispatch(deleteUtilisateur(utilisateur.id)).then(() => navigate("/admin/utilisateurs"));
                    }
                  }}
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">Utilisateur introuvable</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default UserDetails;
