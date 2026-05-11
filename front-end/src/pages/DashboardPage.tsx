import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpenText,
  Wind,
  Quotes,
  Bell,
  SignOut,
  Leaf,
  Heart,
  Moon,
  Sun,
  MusicNotes,
  PlusCircle,
  Smiley,
  SmileySad,
  SmileyMeh,
  CalendarBlank,
} from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { PageTransition } from '../components/PageTransition'
import { diarioService } from '../services/diarioService'
import type { DiarioEntry } from '../services/diarioService'
import { lembreteService } from '../services/lembreteService'
import { fraseMotivacionalService } from '../services/fraseMotivacionalService'
import type { FraseMotivacionalDTO } from '../services/fraseMotivacionalService'

// Componente do Header com o Theme Toggle
function DashboardHeader() {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10" style={{ background: 'rgba(var(--color-bg-rgb), 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(120,138,130,0.1)' }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Leaf size={22} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
          <span className="font-semibold text-lg tracking-tight" style={{ color: 'var(--color-text)' }}>
            Mente Leve
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full transition-smooth hover:bg-[var(--color-surface-alt)]"
            style={{ color: 'var(--color-text-muted)' }}
            title="Sons relaxantes (Em breve)"
          >
            <MusicNotes size={18} />
          </button>
          
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-smooth hover:bg-[var(--color-surface-alt)]"
            style={{ color: 'var(--color-text-muted)' }}
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth hover:bg-[var(--color-surface-alt)]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <SignOut size={17} />
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}

function getMoodIcon(nivel: number) {
  if (nivel >= 4) return <Smiley size={24} weight="fill" style={{ color: 'var(--color-success)' }} />
  if (nivel === 3) return <SmileyMeh size={24} weight="fill" style={{ color: 'var(--color-warning)' }} />
  return <SmileySad size={24} weight="fill" style={{ color: 'var(--color-error)' }} />
}

function getMoodText(nivel: number) {
  if (nivel === 5) return 'Muito bem'
  if (nivel === 4) return 'Bem'
  if (nivel === 3) return 'Neutro'
  if (nivel === 2) return 'Triste'
  return 'Muito triste'
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [diarios, setDiarios] = useState<DiarioEntry[]>([])
  const [activeRemindersCount, setActiveRemindersCount] = useState(0)
  const [quote, setQuote] = useState<FraseMotivacionalDTO | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        if (user?.id) {
          const [diariosRes, lembretesRes] = await Promise.all([
            diarioService.listar(user.id, 0, 10),
            lembreteService.listar(user.id, 0, 50)
          ])
          
          setDiarios(diariosRes.content || [])
          const ativos = (lembretesRes.content || []).filter(l => l.ativo).length
          setActiveRemindersCount(ativos)
        }

        try {
          const quoteData = await fraseMotivacionalService.obterFraseDoDia()
          setQuote(quoteData)
        } catch {
          setQuote({
            id: 0,
            texto: "Tudo bem ir devagar. O importante é não parar.",
            autor: "Mente Leve",
            categoria: "Acolhimento",
            ativo: true,
            dataFrase: ""
          })
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [user?.id])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  // Calcular humor mais frequente
  const frequentMood = diarios.length > 0 
    ? getMoodText(Math.round(diarios.reduce((acc, curr) => acc + curr.nivelHumor, 0) / diarios.length))
    : 'Sem registros'

  return (
    <PageTransition>
      <div className="min-h-[100dvh]" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
        <DashboardHeader />

        <main className="max-w-5xl mx-auto px-6 py-8 md:py-12">
          
          {/* Saudações e Frase do dia */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              {greeting}, {user?.nome?.split(' ')[0]}.
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Que bom ver você por aqui hoje.
            </p>

            {quote && (
              <div className="rounded-3xl p-6 md:p-8 mb-10 relative overflow-hidden" style={{ background: 'var(--color-primary-100)' }}>
                <Quotes size={80} weight="fill" className="absolute -top-4 -right-4 opacity-5" style={{ color: 'var(--color-primary-900)' }} />
                <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-3xl relative z-10" style={{ color: 'var(--color-primary-900)' }}>
                  "{quote.texto}"
                </p>
              </div>
            )}
          </motion.div>

          {/* Cards Emocionais (Resumo) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-50)' }}>
                  <BookOpenText size={20} style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <span className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>{diarios.length}</span>
              </div>
              <p className="font-medium text-sm" style={{ color: 'var(--color-text-muted)' }}>Registros no Diário</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-50)' }}>
                  <Heart size={20} style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <span className="text-lg font-semibold capitalize" style={{ color: 'var(--color-text)' }}>{frequentMood}</span>
              </div>
              <p className="font-medium text-sm" style={{ color: 'var(--color-text-muted)' }}>Humor mais frequente</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-50)' }}>
                  <Bell size={20} style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <span className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>{activeRemindersCount}</span>
              </div>
              <p className="font-medium text-sm" style={{ color: 'var(--color-text-muted)' }}>Lembretes ativos</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Histórico Emocional */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Seu Histórico Recente</h2>
                <button onClick={() => navigate('/diario')} className="text-sm font-medium transition-smooth hover:opacity-80" style={{ color: 'var(--color-primary-500)' }}>Ver tudo</button>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1,2].map(i => <div key={i} className="h-24 bg-[var(--color-surface-alt)] rounded-2xl w-full"></div>)}
                </div>
              ) : diarios.length > 0 ? (
                <div className="space-y-4">
                  {diarios.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="glass-card p-5 rounded-2xl flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-50)' }}>
                        {getMoodIcon(entry.nivelHumor)}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{entry.titulo}</h3>
                          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-light)' }}>
                            {new Date(entry.dataRegistro).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>{entry.conteudo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-10 rounded-2xl text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--color-surface-alt)' }}>
                    <CalendarBlank size={32} style={{ color: 'var(--color-text-light)' }} />
                  </div>
                  <h3 className="font-medium mb-2 text-lg" style={{ color: 'var(--color-text)' }}>Seu espaço está vazio</h3>
                  <p className="text-sm max-w-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                    Que tal registrar como você está se sentindo hoje? Um pequeno registro já é um grande começo.
                  </p>
                  <button onClick={() => navigate('/diario')} className="px-6 py-2.5 rounded-full text-white font-medium text-sm transition-smooth" style={{ background: 'var(--color-primary-500)' }}>
                    Criar primeiro registro
                  </button>
                </div>
              )}
            </motion.div>

            {/* Ações Rápidas */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Continue de onde parou</h2>
              
              <div className="space-y-3">
                <button onClick={() => navigate('/diario')} className="w-full flex items-center justify-between p-4 rounded-2xl glass-card transition-smooth hover:-translate-y-1 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-primary-50)]">
                      <PlusCircle size={20} className="text-[var(--color-primary-600)]" />
                    </div>
                    <span className="font-medium text-[var(--color-text)]">Novo registro</span>
                  </div>
                </button>
                
                <button onClick={() => navigate('/respiracao')} className="w-full flex items-center justify-between p-4 rounded-2xl glass-card transition-smooth hover:-translate-y-1 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(74,111,165,0.1)]">
                      <Wind size={20} color="#4a6fa5" />
                    </div>
                    <span className="font-medium text-[var(--color-text)]">Respirar um pouco</span>
                  </div>
                </button>

                <button onClick={() => navigate('/lembretes')} className="w-full flex items-center justify-between p-4 rounded-2xl glass-card transition-smooth hover:-translate-y-1 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(122,110,165,0.1)]">
                      <Bell size={20} color="#7a6ea5" />
                    </div>
                    <span className="font-medium text-[var(--color-text)]">Ajustar lembretes</span>
                  </div>
                </button>

                <button onClick={() => navigate('/frases')} className="w-full flex items-center justify-between p-4 rounded-2xl glass-card transition-smooth hover:-translate-y-1 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(232,163,142,0.12)]">
                      <Quotes size={20} className="text-[var(--color-accent-600)]" />
                    </div>
                    <span className="font-medium text-[var(--color-text)]">Ler uma mensagem</span>
                  </div>
                </button>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </PageTransition>
  )
}
