import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Quotes, ArrowsClockwise } from '@phosphor-icons/react'
import { iaService } from '../services/iaService'
import { PageTransition } from '../components/PageTransition'

// Mensagens fallback — usadas quando a IA não está disponível
const FALLBACK_MESSAGES = [
  "Tudo bem ir devagar.",
  "Pequenos passos também contam.",
  "Você não precisa resolver tudo hoje.",
  "Respirar também é produtividade.",
  "Descansar também faz parte.",
  "Você pode tentar novamente amanhã.",
  "Nem todos os dias precisam ser produtivos.",
  "Está tudo bem não estar bem o tempo todo.",
]

export function QuotesPage() {
  const navigate = useNavigate()
  const [currentMessage, setCurrentMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(false)
  const [messageKey, setMessageKey] = useState(0)

  const getRandomFallback = () => {
    return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)]
  }

  const gerarMensagem = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true)
    } else {
      setGenerating(true)
    }
    setError(false)

    try {
      const data = await iaService.gerarMensagemMotivacional()
      setCurrentMessage(data.mensagem)
      setMessageKey(prev => prev + 1)
    } catch {
      if (isInitial) {
        // Na primeira carga, mostrar fallback silenciosamente
        setCurrentMessage(getRandomFallback())
        setMessageKey(prev => prev + 1)
      } else {
        setError(true)
      }
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  useEffect(() => {
    gerarMensagem(true)
  }, [])

  return (
    <PageTransition>
      <div className="min-h-[100dvh]" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
        {/* Header */}
        <header className="sticky top-0 z-10" style={{ background: 'rgba(var(--color-bg-rgb, 245, 247, 244), 0.85)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-sm font-medium transition-smooth"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center">
          
          <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-4" style={{ background: 'rgba(232, 163, 142, 0.12)' }}>
            <Quotes size={28} weight="duotone" style={{ color: 'var(--color-accent-600)' }} />
          </div>

          <h1 className="text-2xl font-semibold mb-2 text-center" style={{ color: 'var(--color-text)' }}>
            Mensagem para você
          </h1>
          <p className="text-sm mb-10 text-center max-w-sm" style={{ color: 'var(--color-text-muted)' }}>
            Mensagens acolhedoras geradas com carinho pela nossa IA
          </p>

          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent-400)', borderTopColor: 'transparent' }}></div>
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary-300)', borderTopColor: 'transparent', animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>Preparando sua mensagem...</p>
            </div>
          ) : (
            <div className="w-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageKey}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card rounded-3xl p-10 md:p-14 text-center"
                  style={{ 
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)'
                  }}
                >
                  <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8" style={{ color: 'var(--color-text)' }}>
                    "{currentMessage}"
                  </p>
                  
                  {/* Error message */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm mb-6 px-4 py-2 rounded-xl inline-block"
                      style={{ color: 'var(--color-error)', background: 'rgba(194, 90, 90, 0.08)' }}
                    >
                      Não conseguimos gerar uma nova mensagem agora. Tente novamente em alguns instantes.
                    </motion.p>
                  )}
                  
                  {/* Action buttons */}
                  <div className="mt-2 flex justify-center items-center gap-4 border-t pt-6" style={{ borderColor: 'rgba(120,138,130,0.1)' }}>
                    <button
                      onClick={() => gerarMensagem(false)}
                      disabled={generating}
                      className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-smooth disabled:opacity-60"
                      style={{ 
                        background: generating ? 'var(--color-text-light)' : 'var(--color-accent-500)', 
                        boxShadow: generating ? 'none' : '0 4px 12px rgba(217, 134, 112, 0.3)' 
                      }}
                    >
                      <ArrowsClockwise size={18} weight="bold" className={generating ? 'animate-spin' : ''} />
                      {generating ? 'Gerando...' : 'Gerar nova mensagem'}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

        </main>
      </div>
    </PageTransition>
  )
}
