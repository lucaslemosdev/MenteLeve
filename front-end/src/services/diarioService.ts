import api from './api'

export interface DiarioEntry {
  id: number
  usuarioId: number
  titulo: string
  conteudo: string
  nivelHumor: number // 1 a 5
  dataRegistro: string
  tags: string
}

export interface CreateDiarioRequest {
  usuarioId: number
  titulo: string
  conteudo: string
  nivelHumor: number
  tags?: string
}

export interface UpdateDiarioRequest {
  titulo: string
  conteudo: string
  nivelHumor: number
  tags?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const diarioService = {
  async listar(usuarioId: number, page = 0, size = 20): Promise<PageResponse<DiarioEntry>> {
    const response = await api.get<PageResponse<DiarioEntry>>(
      `/diarios/usuario/${usuarioId}?page=${page}&size=${size}&sort=dataRegistro,desc`
    )
    return response.data
  },

  async criar(data: CreateDiarioRequest): Promise<DiarioEntry> {
    const response = await api.post<DiarioEntry>('/diarios', data)
    return response.data
  },

  async atualizar(id: number, data: UpdateDiarioRequest): Promise<DiarioEntry> {
    const response = await api.put<DiarioEntry>(`/diarios/${id}`, data)
    return response.data
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/diarios/${id}`)
  },
}
