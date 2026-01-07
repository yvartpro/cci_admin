import { createContext, useContext, useState, useEffect } from "react"
export const AuthContext = createContext()
import { useAppContext } from "./AppContext"
import axios from "axios"


export const AuthProvider = ({ children }) => {
  const { API_URL } = useAppContext()
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(sessionStorage.getItem("token") || null)

  // fetch user profile when token changes
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    axios.get(`${API_URL}/user/me`, {
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
        sessionStorage.removeItem("token")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  // login with axios
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password })
    const data = res.data

    if (data.error) {
      throw new Error(data.error)
    }
    setToken(data.token)
    sessionStorage.setItem("token", data.token)
    setUser(data.user)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)