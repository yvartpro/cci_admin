import { Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'user')
      return <Navigate to="/" />
    else
      return <Navigate to={`/${user.role}`} />
  }

  return children
}