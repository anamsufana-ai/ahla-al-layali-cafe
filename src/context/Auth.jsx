import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { account } from '../auth'

const AuthContext = createContext(null)
const TOKEN = 'aal-token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN)
    if (!token) {
      setReady(true)
      return undefined
    }
    account({ action: 'me', token })
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN))
      .finally(() => setReady(true))
    return undefined
  }, [])

  const keep = (data) => {
    localStorage.setItem(TOKEN, data.token)
    setUser(data.user)
    return data.user
  }

  const register = (fields) => account({ action: 'register', ...fields }).then(keep)
  const login = (email, password) => account({ action: 'login', email, password }).then(keep)

  const logout = () => {
    localStorage.removeItem(TOKEN)
    setUser(null)
  }

  const updateProfile = async (fields) => {
    const data = await account({ action: 'update', token: localStorage.getItem(TOKEN), ...fields })
    setUser(data.user)
    return data.user
  }

  const saveRecord = async (kind, record) => {
    const data = await account({ action: 'record', token: localStorage.getItem(TOKEN), kind, record })
    setUser(data.user)
    return data.record
  }

  const loadAdmin = useCallback(() => account({ action: 'admin', token: localStorage.getItem(TOKEN) }), [])
  const saveCrm = (fields) => account({ action: 'crm', token: localStorage.getItem(TOKEN), ...fields })

  return (
    <AuthContext.Provider value={{ user, ready, register, login, logout, updateProfile, saveRecord, loadAdmin, saveCrm }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
