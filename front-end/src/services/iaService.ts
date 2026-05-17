import api from './api'

export interface IAMensagemResponse {
  mensagem: string
  autor: string
}

export const iaService = {
  async gerarMensagemMotivacional(): Promise<IAMensagemResponse> {
    const response = await api.post<IAMensagemResponse>('/ia/mensagem-motivacional')
    return response.data
  }
}
