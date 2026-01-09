import { createContext, useContext, useState, useEffect } from "react"
export const AuthContext = createContext()
import { useAppContext } from "./AppContext"
import api from "../services/apiClient"


export const AuthProvider = ({ children }) => {
  const { API_URL } = useAppContext()
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  // fetch user profile when token changes
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.get(`/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setUser(res.data)
      })
      .catch(err => {
        console.error(err?.response?.data || err.message)
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  // login with axios
  const login = async (email, password) => {
    setLoading(true)
    return api.post(`/user/login`, { email, password })
      .then(res => {
        setUser(res.data.user)
        setToken(res.data.token)
        localStorage.setItem("token", res.data.token)

        return res.data
      })
      .catch(err => {
        console.error(err?.response?.data || err.message)
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")

        throw err
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)