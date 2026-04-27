import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  BookOpenText,
  Wind,
  Quotes,
  Bell,
  SignOut,
  ArrowRight,
  Leaf,
  Heart,
} from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  bgColor: string
  to?: string
  comingSoon?: boolean
}

function FeatureCard({ icon, title, description, color, bgColor, to, comingSoon }: FeatureCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      variants={cardVariants}
      whileHover={!comingSoon ? { y: -4, boxShadow: 'var(--shadow-card-hover)' } : {}}
      onClick={() => !comingSoon && to && navigate(to)}
      className="relative flex flex-col gap-4 rounded-2xl p-6 cursor-pointer"
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid rgba(0,0,0,0.04)',
        cursor: comingSoon ? 'default' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {comingSoon && (
        <div
          className="absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)' }}
        >
          Em breve
        </div>
      )}

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: bgColor }}
      >
        <span style={{ color }}>{icon}</span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      </div>

      {!comingSoon && (
        <div className="flex items-center gap-1.5 mt-auto pt-2">
          <span className="text-sm font-medium" style={{ color }}>Acessar</span>
          <ArrowRight size={14} weight="bold" style={{ color }} />
        </div>
      )}
    </motion.div>
  )
}

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div
      className="min-h-[100dvh]"
      style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10"
        style={{
          background: 'rgba(245, 247, 244, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf size={22} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
            <span className="font-semibold text-lg tracking-tight" style={{ color: 'var(--color-text)' }}>
              Mente Leve
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth"
            style={{ color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-alt)'
              e.currentTarget.style.color = 'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <SignOut size={17} />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Boas-vindas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h1
            className="font-semibold mb-3"
            style={{ fontSize: '1.875rem', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
          >
            {greeting}, {user?.nome?.split(' ')[0]} 
          </h1>

          <div
            className="rounded-2xl p-6 flex items-start gap-4"
            style={{
              background: 'linear-gradient(120deg, var(--color-primary-50) 0%, white 100%)',
              border: '1px solid var(--color-primary-100)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-primary-100)' }}
            >
              <Heart size={20} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
            </div>
            <div>
              <p className="font-medium mb-1" style={{ color: 'var(--color-text)', fontSize: '0.9375rem' }}>
                Este é o seu espaço de autocuidado
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Aqui você pode registrar seus sentimentos, praticar exercícios e acompanhar seu bem-estar de forma leve e gentil.
                Pequenos passos também importam.
              </p>
              <p className="text-xs mt-3" style={{ color: 'var(--color-text-light)' }}>
                O Mente Leve não substitui acompanhamento profissional de saúde mental.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cards de funcionalidades */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
        >
          <FeatureCard
            icon={<BookOpenText size={22} weight="duotone" />}
            title="Meu Diário"
            description="Registre seus pensamentos e como você está se sentindo. Acompanhe sua trajetória emocional."
            color="var(--color-primary-600)"
            bgColor="var(--color-primary-100)"
            to="/diario"
          />
          <FeatureCard
            icon={<Wind size={22} weight="duotone" />}
            title="Exercícios de Respiração"
            description="Técnicas simples para acalmar a mente e o corpo em momentos de tensão."
            color="#4a6fa5"
            bgColor="rgba(74, 111, 165, 0.1)"
            comingSoon
          />
          <FeatureCard
            icon={<Quotes size={22} weight="duotone" />}
            title="Frases de Apoio"
            description="Palavras gentis para acompanhar seu dia. Uma frase diferente para cada momento."
            color="var(--color-accent-600)"
            bgColor="rgba(232, 163, 142, 0.12)"
            comingSoon
          />
          <FeatureCard
            icon={<Bell size={22} weight="duotone" />}
            title="Lembretes"
            description="Configure lembretes para pausas, hidratação e outros momentos de cuidado ao longo do dia."
            color="#7a6ea5"
            bgColor="rgba(122, 110, 165, 0.1)"
            to="/lembretes"
          />
        </motion.div>
      </main>
    </div>
  )
}
