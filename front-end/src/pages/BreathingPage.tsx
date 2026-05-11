import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Wind, Play, Pause, Stop, CheckCircle } from '@phosphor-icons/react'
import { exercicioRespiracaoService } from '../services/exercicioRespiracaoService'
import type { ExercicioRespiracaoDTO } from '../services/exercicioRespiracaoService'
import { PageTransition } from '../components/PageTransition'

// Componente do Exercício Ativo
function ActiveExercise({ 
  exercise, 
  onFinish, 
  onStop 
}: { 
  exercise: ExercicioRespiracaoDTO; 
  onFinish: () => void; 
  onStop: () => void;
}) {
  const [phase, setPhase] = useState<'inspirar' | 'segurar' | 'expirar'>('inspirar')
  const [timeLeft, setTimeLeft] = useState(4) // Começa com inspirar 4s por padrão
  const [isPaused, setIsPaused] = useState(false)
  const [totalTimeLeft, setTotalTimeLeft] = useState(exercise.duracaoSegundos || 60)
  
  // Analisar instruções para extrair tempos se possível, caso contrário usar padrão 4-4-4 ou similar.
  // Vamos usar um padrão 4-4-4 para demonstração, já que a string instrucoes pode variar
  const timings = { inspirar: 4, segurar: 4, expirar: 4 }
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (!isPaused && totalTimeLeft > 0) {
      timer = setTimeout(() => {
        setTotalTimeLeft(prev => prev - 1)
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Troca de fase
            if (phase === 'inspirar') {
              setPhase('segurar')
              return timings.segurar
            } else if (phase === 'segurar') {
              setPhase('expirar')
              return timings.expirar
            } else {
              setPhase('inspirar')
              return timings.inspirar
            }
          }
          return prev - 1
        })
      }, 1000)
    } else if (totalTimeLeft === 0) {
      onFinish()
    }
    return () => clearTimeout(timer)
  }, [isPaused, totalTimeLeft, phase, timeLeft, onFinish, timings])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Animação do círculo baseada na fase
  const getCircleScale = () => {
    if (phase === 'inspirar') return 1.5
    if (phase === 'segurar') return 1.5
    return 1 // expirar
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-medium mb-2 text-center" style={{ color: 'var(--color-text)' }}>
        {exercise.nome}
      </h2>
      <p className="text-sm mb-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
        {formatTime(totalTimeLeft)} restantes
      </p>

      <div className="relative w-64 h-64 flex items-center justify-center mb-16">
        {/* Círculo animado */}
        <motion.div
          animate={{ scale: getCircleScale() }}
          transition={{ 
            duration: phase === 'segurar' ? 0 : phase === 'inspirar' ? timings.inspirar : timings.expirar,
            ease: "easeInOut"
          }}
          className="absolute w-32 h-32 rounded-full"
          style={{ background: 'var(--color-primary-200)', opacity: 0.5 }}
        />
        <motion.div
          animate={{ scale: getCircleScale() }}
          transition={{ 
            duration: phase === 'segurar' ? 0 : phase === 'inspirar' ? timings.inspirar : timings.expirar,
            ease: "easeInOut"
          }}
          className="absolute w-24 h-24 rounded-full"
          style={{ background: 'var(--color-primary-300)', opacity: 0.8 }}
        />
        
        {/* Texto do centro */}
        <div className="z-10 text-center">
          <span className="block text-2xl font-medium" style={{ color: 'var(--color-primary-900)' }}>
            {phase === 'inspirar' && 'Inspire'}
            {phase === 'segurar' && 'Segure'}
            {phase === 'expirar' && 'Expire'}
          </span>
          <span className="block text-lg" style={{ color: 'var(--color-primary-800)' }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white transition-smooth"
          style={{ background: 'var(--color-primary-500)' }}
        >
          {isPaused ? <Play weight="fill" /> : <Pause weight="fill" />}
          {isPaused ? 'Continuar' : 'Pausar'}
        </button>
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-6 py-3 rounded-full transition-smooth"
          style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)' }}
        >
          <Stop weight="fill" />
          Encerrar
        </button>
      </div>
    </div>
  )
}

export function BreathingPage() {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<ExercicioRespiracaoDTO[]>([])
  const [loading, setLoading] = useState(true)
  
  const [activeExercise, setActiveExercise] = useState<ExercicioRespiracaoDTO | null>(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = await exercicioRespiracaoService.listarAtivos()
        setExercises(data)
      } catch (error) {
        console.error('Erro ao buscar exercícios:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

  // Se não houver exercícios na API, usamos alguns mockados para não quebrar a experiência
  const displayExercises = exercises.length > 0 ? exercises : [
    {
      id: 1,
      nome: 'Relaxar a ansiedade',
      descricao: 'Respiracão 4-7-8 para acalmar rapidamente o sistema nervoso.',
      duracaoSegundos: 60,
      instrucoes: 'Inspire 4s, Segure 7s, Expire 8s',
      ativo: true
    },
    {
      id: 2,
      nome: 'Recuperar o foco',
      descricao: 'Respiração em caixa (Box Breathing) para clareza mental.',
      duracaoSegundos: 60,
      instrucoes: 'Inspire 4s, Segure 4s, Expire 4s, Segure 4s',
      ativo: true
    },
    {
      id: 3,
      nome: 'Pausa rápida',
      descricao: 'Apenas 1 minuto focado na sua respiração natural.',
      duracaoSegundos: 60,
      instrucoes: 'Acompanhe o ritmo confortavelmente',
      ativo: true
    }
  ]

  return (
    <PageTransition>
      <div className="min-h-[100dvh]" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ background: 'rgba(245, 247, 244, 0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeExercise && !finished) {
                if (window.confirm('Deseja realmente sair do exercício atual?')) {
                  setActiveExercise(null)
                  navigate('/dashboard')
                }
              } else {
                navigate('/dashboard')
              }
            }}
            className="flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-sm font-medium transition-smooth"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {!activeExercise && !finished && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10 text-center">
                <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-4" style={{ background: 'rgba(74, 111, 165, 0.1)' }}>
                  <Wind size={28} weight="duotone" color="#4a6fa5" />
                </div>
                <h1 className="text-3xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  Respire com calma
                </h1>
                <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
                  Pequenas pausas também podem ajudar.<br />Escolha um exercício e siga no seu ritmo.
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary-500)' }}></div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {displayExercises.map((ex) => (
                    <motion.button
                      key={ex.id}
                      whileHover={{ y: -4, boxShadow: 'var(--shadow-card-hover)' }}
                      onClick={() => setActiveExercise(ex)}
                      className="text-left rounded-2xl p-6 glass-card transition-smooth group"
                    >
                      <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>{ex.nome}</h3>
                      <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{ex.descricao}</p>
                      
                      <div className="flex items-center gap-2 text-sm mt-auto">
                        <Wind size={16} style={{ color: 'var(--color-primary-500)' }} />
                        <span style={{ color: 'var(--color-primary-600)' }}>
                          Aprox. {Math.round(ex.duracaoSegundos / 60)} min
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeExercise && !finished && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <ActiveExercise 
                exercise={activeExercise} 
                onFinish={() => setFinished(true)} 
                onStop={() => setActiveExercise(null)} 
              />
            </motion.div>
          )}

          {finished && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-center"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-primary-100)' }}>
                <CheckCircle size={40} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
              </div>
              <h2 className="text-2xl font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                Exercício concluído
              </h2>
              <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
                Espero que esse momento tenha ajudado você a desacelerar um pouco.
              </p>
              
              <button
                onClick={() => {
                  setFinished(false)
                  setActiveExercise(null)
                }}
                className="px-8 py-3 rounded-full text-white font-medium transition-smooth"
                style={{ background: 'var(--color-primary-500)' }}
              >
                Voltar aos exercícios
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
    </PageTransition>
  )
}
