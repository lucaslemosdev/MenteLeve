import api from './api'

export interface FraseMotivacionalDTO {
  id: number
  texto: string
  autor: string
  dataFrase: string
  categoria: string
  ativo: boolean
}

export const fraseMotivacionalService = {
  async obterFraseDoDia(): Promise<FraseMotivacionalDTO> {
    const response = await api.get<FraseMotivacionalDTO>('/frases-motivacionais/do-dia')
    return response.data
  },

  async listarAtivas(): Promise<FraseMotivacionalDTO[]> {
    const response = await api.get<FraseMotivacionalDTO[]>('/frases-motivacionais/ativas')
    return response.data
  },

  async listarPorCategoria(categoria: string): Promise<FraseMotivacionalDTO[]> {
    const response = await api.get<FraseMotivacionalDTO[]>(`/frases-motivacionais/categoria/${categoria}`)
    return response.data
  }
}
