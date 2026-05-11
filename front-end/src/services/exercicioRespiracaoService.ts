import api from './api'

export interface ExercicioRespiracaoDTO {
  id: number
  nome: string
  descricao: string
  duracaoSegundos: number
  instrucoes: string
  ativo: boolean
}

export const exercicioRespiracaoService = {
  async listarAtivos(): Promise<ExercicioRespiracaoDTO[]> {
    const response = await api.get<ExercicioRespiracaoDTO[]>('/exercicios-respiracao/ativos')
    return response.data
  },
}
