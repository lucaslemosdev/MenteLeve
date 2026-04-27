import api from './api'

// ──────────────────────────────────────────────────────────────
// Tipos baseados no LembreteDTO do back-end
// Campos reais: id, usuarioId, titulo, descricao, tipoLembrete,
//               horaLembrete (LocalTime → "HH:mm:ss"), ativo, dataCriacao
// ──────────────────────────────────────────────────────────────

export type TipoLembrete = 'PAUSA' | 'HIDRATACAO' | 'DESCANSO'

export interface LembreteEntry {
  id: number
  usuarioId: number
  titulo: string
  descricao: string | null
  tipoLembrete: TipoLembrete | null
  horaLembrete: string | null // formato "HH:mm:ss"
  ativo: boolean
  dataCriacao: string | null
}

export interface CreateLembreteRequest {
  usuarioId: number
  titulo: string
  descricao?: string
  tipoLembrete?: TipoLembrete
  horaLembrete?: string // "HH:mm:ss"
}

export interface UpdateLembreteRequest {
  titulo: string
  descricao?: string
  tipoLembrete?: TipoLembrete
  horaLembrete?: string // "HH:mm:ss"
  ativo: boolean
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const lembreteService = {
  async listar(usuarioId: number, page = 0, size = 50): Promise<PageResponse<LembreteEntry>> {
    const response = await api.get<PageResponse<LembreteEntry>>(
      `/lembretes/usuario/${usuarioId}?page=${page}&size=${size}&sort=dataCriacao,desc`
    )
    return response.data
  },

  async criar(data: CreateLembreteRequest): Promise<LembreteEntry> {
    const response = await api.post<LembreteEntry>('/lembretes', data)
    return response.data
  },

  async atualizar(id: number, data: UpdateLembreteRequest): Promise<LembreteEntry> {
    const response = await api.put<LembreteEntry>(`/lembretes/${id}`, data)
    return response.data
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/lembretes/${id}`)
  },

  // Toggle ativo/inativo — reaproveita o PUT
  async toggleAtivo(entry: LembreteEntry): Promise<LembreteEntry> {
    const payload: UpdateLembreteRequest = {
      titulo: entry.titulo,
      descricao: entry.descricao ?? undefined,
      tipoLembrete: entry.tipoLembrete ?? undefined,
      horaLembrete: entry.horaLembrete ?? undefined,
      ativo: !entry.ativo,
    }
    const response = await api.put<LembreteEntry>(`/lembretes/${entry.id}`, payload)
    return response.data
  },
}
