import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeSimple, Lock, ArrowRight, WarningCircle, Leaf } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { PageTransition } from '../components/PageTransition'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !senha.trim()) {
      setError('Por favor, preencha todos os campos.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await login(email.trim(), senha)
      navigate('/dashboard')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(
        axiosErr.response?.data?.message ||
        'Não foi possível entrar. Verifique suas credenciais.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div
      className="min-h-[100dvh] flex"
      style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}
    >
      {/* Painel esquerdo — visual */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: '48%',
          background: 'linear-gradient(145deg, var(--color-primary-600) 0%, var(--color-primary-400) 60%, var(--color-primary-300) 100%)',
        }}
      >
        {/* Blob decorativo */}
        <div
          className="absolute -bottom-32 -left-32 rounded-full opacity-20"
          style={{ width: '28rem', height: '28rem', background: 'var(--color-primary-200)' }}
        />
        <div
          className="absolute top-20 -right-20 rounded-full opacity-10"
          style={{ width: '22rem', height: '22rem', background: 'white' }}
        />

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <Leaf size={28} weight="fill" color="white" />
            <span className="text-white font-semibold text-xl tracking-tight">Mente Leve</span>
          </div>
        </div>

        <div className="relative z-10 p-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p
              className="text-white font-light mb-6"
              style={{ fontSize: '2.25rem', lineHeight: '1.2', letterSpacing: '-0.02em' }}
            >
              Um espaço só<br />
              <strong className="font-semibold">para você.</strong>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: '1.6', maxWidth: '30ch' }}>
              Registre seus pensamentos com calma. Pequenos passos também importam.
            </p>
          </motion.div>

          {/* Citação flutuante */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-10 glass-card rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic' }}>
              "Acompanhe seu dia de forma leve. Cada registro é um passo de autocuidado."
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Painel direito — formulário */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-16"
      >
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Leaf size={22} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
            <span className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Mente Leve</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h1
              className="font-semibold mb-2"
              style={{ fontSize: '1.875rem', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
            >
              Bem-vindo de volta
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
              Entre para continuar seu espaço de autocuidado.
            </p>

            {/* Erro */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-start gap-2 rounded-xl p-3 mb-5"
                  style={{ background: 'rgba(194, 90, 90, 0.08)', border: '1px solid rgba(194, 90, 90, 0.2)' }}
                >
                  <WarningCircle size={18} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', lineHeight: '1.4' }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* E-mail */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="font-medium text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  E-mail
                </label>
                <div className="relative">
                  <EnvelopeSimple
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--color-text-light)' }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-smooth"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1.5px solid var(--color-surface-alt)',
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-alt)')}
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-senha"
                  className="font-medium text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--color-text-light)' }}
                  />
                  <input
                    id="login-senha"
                    type="password"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-smooth"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1.5px solid var(--color-surface-alt)',
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-alt)')}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-[-8px]">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium transition-smooth"
                  style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary-500)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  Esqueci minha senha
                </Link>
              </div>

              {/* Botão */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm mt-1 transition-smooth"
                style={{
                  background: isLoading
                    ? 'var(--color-primary-300)'
                    : 'var(--color-primary-500)',
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={17} weight="bold" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Ainda não tem conta?{' '}
              <Link
                to="/register"
                className="font-semibold transition-smooth"
                style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary-500)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-primary-600)')}
              >
                Criar conta
              </Link>
            </p>

            <p className="text-center mt-8 text-xs" style={{ color: 'var(--color-text-light)', lineHeight: 1.5 }}>
              O Mente Leve não substitui acompanhamento de profissionais de saúde mental.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
    </PageTransition>
  )
}
