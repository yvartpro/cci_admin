import { useState } from "react";
import { AtSign, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Users, ListOrdered } from "lucide-react";
import { ButtonLoadingSpinner } from "../components/LoadingSpinner";

export default function Login() {
  const navigate = useNavigate();
  const { error, setError } = useAppContext();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true)
    await login(form.email, form.password)
      .then(() => {
        navigate("/cci");
        console.log("success");
      })
      .catch((err) => {
        console.error("Erreur lors de la connexion :", err);
        setError("Email ou mot de passe incorrect.");
      })
      .finally(() => setLoading(false))
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mx-auto mt-4 mb-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-1 mx-auto w-20 text-white border-2 border-yellow-300 bg-blue-600 p-2 rounded-full ">
            <Users className="h-6 w-6" />
            <ListOrdered className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
          <p className="text-gray-500 text-sm">
            Accédez au système de gestion des articles
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <AtSign className="absolute top-3 left-3 text-gray-500 h-5 w-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-500 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
            {showPassword ? (
              <Eye className="absolute top-3 right-3 text-gray-500 h-5 w-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <EyeOff className="absolute top-3 right-3 text-gray-500 h-5 w-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>

          {/* show error message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all"
          >
            {loading ? <ButtonLoadingSpinner /> : "Se connecter"}
          </button>
        </form>

        {/* Link to Register */}
        <p className="text-center mt-4 text-sm text-gray-600 pb-4">
          Pas encore de compte ?{" "}
          <span
            onClick={() => navigate("/cci/register")}
            className="text-blue-700 font-medium cursor-pointer hover:underline"
          >
            Créer un compte
          </span>
        </p>
      </div>
    </div>
  );
}