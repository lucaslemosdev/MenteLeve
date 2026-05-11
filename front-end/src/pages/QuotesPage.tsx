import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Quotes, ArrowsClockwise, Heart } from '@phosphor-icons/react'
import { fraseMotivacionalService } from '../services/fraseMotivacionalService'
import type { FraseMotivacionalDTO } from '../services/fraseMotivacionalService'
import { PageTransition } from '../components/PageTransition'

export function QuotesPage() {
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState<FraseMotivacionalDTO[]>([])
  const [currentQuote, setCurrentQuote] = useState<FraseMotivacionalDTO | null>(null)
  const [loading, setLoading] = useState(true)

  // Mensagens fallback (acolhedoras, sem positividade tóxica)
  const fallbackQuotes: FraseMotivacionalDTO[] = [
    { id: 1, texto: "Tudo bem ir devagar.", autor: "Mente Leve", dataFrase: "", categoria: "Acolhimento", ativo: true },
    { id: 2, texto: "Pequenos passos também contam.", autor: "Mente Leve", dataFrase: "", categoria: "Acolhimento", ativo: true },
    { id: 3, texto: "Você não precisa resolver tudo hoje.", autor: "Mente Leve", dataFrase: "", categoria: "Acolhimento", ativo: true },
    { id: 4, texto: "Respirar também é produtividade.", autor: "Mente Leve", dataFrase: "", categoria: "Autocuidado", ativo: true },
    { id: 5, texto: "Descansar também faz parte.", autor: "Mente Leve", dataFrase: "", categoria: "Autocuidado", ativo: true },
    { id: 6, texto: "Você pode tentar novamente amanhã.", autor: "Mente Leve", dataFrase: "", categoria: "Acolhimento", ativo: true },
  ]

  useEffect(() => {
    async function fetchQuotes() {
      try {
        setLoading(true)
        const data = await fraseMotivacionalService.listarAtivas()
        if (data && data.length > 0) {
          setQuotes(data)
          setCurrentQuote(data[Math.floor(Math.random() * data.length)])
        } else {
          setQuotes(fallbackQuotes)
          setCurrentQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)])
        }
      } catch (error) {
        console.error('Erro ao buscar frases:', error)
        setQuotes(fallbackQuotes)
        setCurrentQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)])
      } finally {
        setLoading(false)
      }
    }
    fetchQuotes()
  }, [])

  const handleNextQuote = () => {
    if (quotes.length > 0) {
      let nextIndex = Math.floor(Math.random() * quotes.length)
      // Evitar repetir a mesma na sequência se houver mais de uma
      while (quotes.length > 1 && quotes[nextIndex].id === currentQuote?.id) {
        nextIndex = Math.floor(Math.random() * quotes.length)
      }
      setCurrentQuote(quotes[nextIndex])
    }
  }

  return (
    <PageTransition>
      <div className="min-h-[100dvh]" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ background: 'rgba(245, 247, 244, 0.85)', backdropFilter: 'blur(16px)' }}>
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
        
        <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-10" style={{ background: 'rgba(232, 163, 142, 0.12)' }}>
          <Quotes size={28} weight="duotone" style={{ color: 'var(--color-accent-600)' }} />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-accent-500)' }}></div>
          </div>
        ) : (
          <div className="w-full relative">
            <AnimatePresence mode="wait">
              {currentQuote && (
                <motion.div
                  key={currentQuote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-sm"
                  style={{ 
                    border: '1px solid rgba(0,0,0,0.03)',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)'
                  }}
                >
                  <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
                    "{currentQuote.texto}"
                  </p>
                  
                  {currentQuote.autor && currentQuote.autor !== "Mente Leve" && (
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
                      — {currentQuote.autor}
                    </p>
                  )}
                  
                  {/* Botões de Ação na Frase */}
                  <div className="mt-10 flex justify-center items-center gap-4 border-t pt-6" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    <button 
                      className="p-3 rounded-full transition-smooth hover:bg-gray-50"
                      style={{ color: 'var(--color-text-light)' }}
                      title="Favoritar"
                    >
                      <Heart size={22} weight="regular" />
                    </button>
                    
                    <button
                      onClick={handleNextQuote}
                      className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-smooth"
                      style={{ background: 'var(--color-accent-500)', boxShadow: '0 4px 12px rgba(217, 134, 112, 0.3)' }}
                    >
                      <ArrowsClockwise size={18} weight="bold" />
                      Outra mensagem
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </main>
    </div>
    </PageTransition>
  )
}
