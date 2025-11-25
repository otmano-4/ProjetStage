import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice";
import imgauth from '../assets/imgauth.jpg';

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  // Redirect automatically if user is already logged in
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "ETUDIANT":
          navigate("/etudiant/dashboard");
          break;
        case "PROFESSEUR":
          navigate("/professeur/dashboard");
          break;
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/login");
      }
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, motDePasse }));
  };

  return (
    <div className="flex p-8 space-x-20">
      <div 
        className="rounded-2xl h-screen w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${imgauth})` }}
      />

      <div className="py-8 h-screen px-20 w-1/2 flex flex-col justify-between">
        <div>Logo</div>

        <div className="text-white">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <h1 className="text-gray-600 text-3xl font-semibold text-center">Welcome back</h1>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse e-mail
              </label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none rounded-xl px-4 py-2.5 text-gray-700 transition duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none rounded-xl px-4 py-2.5 text-gray-700 transition duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white font-semibold py-2.5 rounded-xl transition duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {error && (
            <p className="text-red-500 mt-4 text-center font-medium animate-pulse">
              {error}
            </p>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <a href="/inscription" className="text-blue-600 hover:underline font-medium">
              S'inscrire
            </a>
          </p>
        </div>

        <div></div>
      </div>
    </div>
  );
}
