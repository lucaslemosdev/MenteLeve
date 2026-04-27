import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor: adiciona o token JWT em toda requisição autenticada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('menteleve_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor: trata 401 global (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('menteleve_token')
      localStorage.removeItem('menteleve_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
