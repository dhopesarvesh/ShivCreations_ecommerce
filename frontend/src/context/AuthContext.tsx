import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../features/auth/auth.api'

export interface UserAccount {
  id: number
  name: string
  email: string
  role: 'admin' | 'customer'
}

interface AuthContextValue {
  user: UserAccount | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AUTH_STORAGE_KEY = 'shiv-creations-user'
const TOKEN_STORAGE_KEY = 'shiv-creations-token'
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): UserAccount | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as UserAccount
  } catch {
    return null
  }
}

function readStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(readStoredUser)
  const [token, setToken] = useState<string | null>(readStoredToken)

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }, [token])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    login: async (email, password) => {
      try {
        const response = await authApi.login({ email, password })
        setUser(response.user)
        setToken(response.access_token)
        return true
      } catch {
        return false
      }
    },
    signup: async (name, email, password) => {
      try {
        const response = await authApi.register({ name, email, password })
        setUser(response.user)
        setToken(response.access_token)
        return true
      } catch {
        return false
      }
    },
    logout: () => {
      setUser(null)
      setToken(null)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    },
  }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
