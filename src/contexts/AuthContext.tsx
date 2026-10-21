
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import axios from 'axios'
import { api } from '../lib/api'

export type User = {
  id: string
  name: string
  email: string
}

type AuthResponse = {
  user: User
  token: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'kurio-auth-token'
const USER_KEY = 'kurio-auth-user'



function getSavedToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function saveSession(response: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, response.token)
  localStorage.setItem(USER_KEY, JSON.stringify(response.user))
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Não foi possível concluir a operação.'
  }

  return 'Ocorreu um erro inesperado.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  useEffect(() => {
    let active = true

    async function restoreSession() {
      const token = getSavedToken()

      if (!token) {
        if (active) setIsLoading(false)
        return
      }

      try {
        const response = await api.get<{ user: User }>('/auth/session', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (active) {
          setUser(response.data.user)
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
        }
      } catch {
        if (active) clearAuth()
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void restoreSession()

    return () => {
      active = false
    }
  }, [clearAuth])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const response = await api.post<AuthResponse>('/auth/register', {
          name,
          email,
          password,
        })

        saveSession(response.data)
        setUser(response.data.user)
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    [],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await api.post<AuthResponse>('/auth/login', {
          email,
          password,
        })

        saveSession(response.data)
        setUser(response.data.user)
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    const token = getSavedToken()

    try {
      if (token) {
        await api.post(
          '/auth/logout',
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
      }
    } finally {
      clearAuth()
    }
  }, [clearAuth])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider')
  }

  return context
}
