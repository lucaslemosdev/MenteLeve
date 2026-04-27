import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/authService'
import type { AuthResponse } from '../services/authService'

interface User {
  id: number
  nome: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restaura sessão do localStorage na inicialização
  useEffect(() => {
    const storedToken = localStorage.getItem('menteleve_token')
    const storedUser = localStorage.getItem('menteleve_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('menteleve_token')
        localStorage.removeItem('menteleve_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    const response = await authService.login({ email, senha })
    const userData: User = {
      id: response.usuarioId,
      nome: response.nome,
      email: response.email,
    }
    localStorage.setItem('menteleve_token', response.token)
    localStorage.setItem('menteleve_user', JSON.stringify(userData))
    setToken(response.token)
    setUser(userData)
  }

  const register = async (nome: string, email: string, senha: string): Promise<AuthResponse> => {
    const response = await authService.register({ nome, email, senha })
    return response
  }

  const logout = () => {
    localStorage.removeItem('menteleve_token')
    localStorage.removeItem('menteleve_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
