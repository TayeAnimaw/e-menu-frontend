import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setUser(null)
      setLoading(false)
      return null
    }

    try {
      const { data } = await apiClient.get('/me')
      setUser(data.data)
      return data.data
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  const applySession = (newToken, newUser) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const login = async (identifier, password) => {
    const { data } = await apiClient.post('/login', { identifier, password })
    applySession(data.token, data.user)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await apiClient.post('/register', payload)
    applySession(data.token, data.user)
    return data.user
  }

  const loginWithToken = async (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setLoading(true)
    const me = await fetchMe()
    return me
  }

  const logout = async () => {
    try {
      await apiClient.post('/logout')
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, loginWithToken, refresh: fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
