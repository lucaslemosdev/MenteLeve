// ──────────────────────────────────────────────────────────────────────────────
// Templates de lembretes pré-prontos
// Esses são apenas sugestões no front-end — ao clicar, preenchem o formulário.
// O usuário pode ajustar e salvar normalmente via API.
// ──────────────────────────────────────────────────────────────────────────────

import type { TipoLembrete } from '../services/lembreteService'

export interface LembreteTemplate {
  titulo: string
  descricao: string
  tipoLembrete: TipoLembrete
  horaLembrete: string // "HH:mm"
  emoji: string
}

export const lembreteTemplates: LembreteTemplate[] = [
  {
    titulo: 'Momento de respirar',
    descricao: 'Pare por 2 minutos e respire com calma. Inspire fundo, expire devagar.',
    tipoLembrete: 'PAUSA',
    horaLembrete: '10:00',
    emoji: '🌬',
  },
  {
    titulo: 'Como estou me sentindo?',
    descricao: 'Abra o diário e registre seu estado emocional de hoje. Pode ser breve.',
    tipoLembrete: 'PAUSA',
    horaLembrete: '20:00',
    emoji: '📓',
  },
  {
    titulo: 'Pequena pausa',
    descricao: 'Levante, alongue o corpo ou olhe para longe por alguns instantes.',
    tipoLembrete: 'DESCANSO',
    horaLembrete: '14:00',
    emoji: '🌿',
  },
  {
    titulo: 'Beber água',
    descricao: 'Hidratação é cuidado. Tome um copo de água agora.',
    tipoLembrete: 'HIDRATACAO',
    horaLembrete: '09:00',
    emoji: '💧',
  },
  {
    titulo: 'Tomar um ar',
    descricao: 'Se possível, vá até uma janela ou lado de fora por alguns minutos.',
    tipoLembrete: 'DESCANSO',
    horaLembrete: '15:30',
    emoji: '☀️',
  },
  {
    titulo: 'Agradecer por algo simples',
    descricao: 'Pense em uma coisa pequena pelo qual você é grato hoje.',
    tipoLembrete: 'PAUSA',
    horaLembrete: '21:00',
    emoji: '✨',
  },
  {
    titulo: 'Organizar uma pequena tarefa',
    descricao: 'Escolha algo simples para organizar agora. Um passo de cada vez.',
    tipoLembrete: 'PAUSA',
    horaLembrete: '11:00',
    emoji: '📋',
  },
]
