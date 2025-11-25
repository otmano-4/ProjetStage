import { useState, useMemo } from "react";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";
import { UserPlus, Trash2 } from "lucide-react";
import CreateUser from "./CreateUser";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteUser from "./DeleteUser";

function Utilisateurs({ pages }) {
  const utilisateurs = useSelector((state) => state.utilisateurs.data);
  const loading = useSelector((state) => state.utilisateurs.loading);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const roleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-yellow-100 text-yellow-800";
      case "PROFESSEUR":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const filteredUsers = useMemo(() => {
    return utilisateurs?.filter((u) => {
      const matchesSearch =
        u.nom.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      return matchesSearch && matchesRole;
    });
  }, [utilisateurs, search, roleFilter]);



  const [deleteUserId, setDeleteUserId] = useState(null); // user ID to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100/60">
      <Aside pages={pages} />

      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Header + Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des Utilisateurs
            </h1>

            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Rechercher par nom ou email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded-lg shadow-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border p-2 rounded-lg shadow-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                <option value="">Tous les rôles</option>
                <option value="ETUDIANT">Étudiant</option>
                <option value="PROFESSEUR">Professeur</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-yellow-600 text-white px-5 py-2 rounded-lg shadow hover:bg-yellow-700 transition duration-200"
              >
                <UserPlus size={18} />
                Ajouter
              </button>
            </div>
          </div>

          {/* USERS TABLE */}
          <div className="bg-white rounded-2xl shadow p-6 w-full overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-6">Chargement...</p>
            ) : filteredUsers?.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                Aucun utilisateur trouvé
              </p>
            ) : (
              <table className="w-full table-auto border-separate border-spacing-0">
                <thead className="bg-gray-50 rounded-t-2xl">
                  <tr className="text-gray-600 uppercase text-sm">
                    <th className="py-3 px-4 text-left rounded-tl-2xl">Nom</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-center rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <tr
                      key={u.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-yellow-50 transition`}
                    >
                      <td className="py-3 px-4">
                        <Link
                          to={`${u.id}`}
                          className="hover:underline hover:text-yellow-600 font-medium transition"
                        >
                          {u.nom}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setDeleteUserId(u.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showModal && <CreateUser setShowModal={setShowModal} />}
          {showDeleteModal && <DeleteUser deleteUserId={deleteUserId} setShowDeleteModal={setShowDeleteModal} setDeleteUserId={setDeleteUserId} />}
        </main>
      </div>
    </div>
  );
}

export default Utilisateurs;
