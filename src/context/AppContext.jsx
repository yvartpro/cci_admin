// create a globalContext for the app
import { createContext, useState, useContext } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const API_URL = "https://capbio.bi/cci/api"
  const DIR_URL = "https://capbio.bi/cci"
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)
  const [agents, setAgents] = useState([])

  // dismiss error after 3 seconds
  if (error) {
    setTimeout(() => {
      setError(null)
    }, 3000);
  }

  return (
    <AppContext.Provider value={{
      user, setUser,
      error, setError,
      msg, setMsg,
      API_URL, DIR_URL,
      agents, setAgents,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)