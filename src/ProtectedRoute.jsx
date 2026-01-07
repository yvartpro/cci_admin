import { Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { LoadingSpinner } from "./components/LoadingSpinner"

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner text="Chargement..." />

  if (!user) return <Navigate to="/cci/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/cci" />

  return children
}