import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, EnvelopeSimple, Lock, ArrowRight, WarningCircle, CheckCircle, Leaf } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { PageTransition } from '../components/PageTransition'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validate = (): string => {
    if (!nome.trim()) return 'Por favor, informe seu nome.'
    if (nome.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres.'
    if (!email.trim()) return 'Por favor, informe seu e-mail.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido.'
    if (!senha) return 'Por favor, crie uma senha.'
    if (senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres.'
    if (senha !== confirmaSenha) return 'As senhas não coincidem.'
    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await register(nome.trim(), email.trim(), senha)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2200)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(
        axiosErr.response?.data?.message ||
        'Não foi possível criar sua conta. Tente novamente.'
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
      {/* Painel esquerdo */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: '48%',
          background: 'linear-gradient(145deg, var(--color-primary-700) 0%, var(--color-primary-500) 55%, var(--color-primary-300) 100%)',
        }}
      >
        <div
          className="absolute -bottom-24 -right-24 rounded-full opacity-15"
          style={{ width: '26rem', height: '26rem', background: 'var(--color-primary-200)' }}
        />
        <div
          className="absolute top-16 -left-16 rounded-full opacity-10"
          style={{ width: '20rem', height: '20rem', background: 'white' }}
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
              Comece sua<br />
              <strong className="font-semibold">jornada hoje.</strong>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: '1.6', maxWidth: '30ch' }}>
              Crie sua conta e tenha um espaço seguro para registrar como você se sente.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 grid gap-3"
          >
            {['Diário emocional', 'Exercícios de respiração', 'Frases de apoio', 'Lembretes de autocuidado'].map(
              (item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <CheckCircle size={12} weight="fill" color="white" />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{item}</span>
                </div>
              )
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Painel direito */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-16"
      >
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Leaf size={22} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
            <span className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Mente Leve</span>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--color-primary-100)' }}
                >
                  <CheckCircle size={32} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
                </motion.div>
                <h2 className="font-semibold text-2xl mb-2" style={{ color: 'var(--color-text)' }}>
                  Conta criada!
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
                  Redirecionando para o login...
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h1
                  className="font-semibold mb-2"
                  style={{ fontSize: '1.875rem', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
                >
                  Criar conta
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
                  Preencha as informações abaixo para começar.
                </p>

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
                  {/* Nome */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-nome" className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Nome</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-light)' }} />
                      <input
                        id="reg-nome"
                        type="text"
                        autoComplete="name"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-smooth"
                        style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-surface-alt)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-alt)')}
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-email" className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>E-mail</label>
                    <div className="relative">
                      <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-light)' }} />
                      <input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-smooth"
                        style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-surface-alt)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-alt)')}
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-senha" className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Senha</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-light)' }} />
                      <input
                        id="reg-senha"
                        type="password"
                        autoComplete="new-password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-smooth"
                        style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-surface-alt)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-alt)')}
                      />
                    </div>
                  </div>

                  {/* Confirmar senha */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-confirma" className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Confirmar senha</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-light)' }} />
                      <input
                        id="reg-confirma"
                        type="password"
                        autoComplete="new-password"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        placeholder="Repita sua senha"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-smooth"
                        style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-surface-alt)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-alt)')}
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm mt-1 transition-smooth"
                    style={{
                      background: isLoading ? 'var(--color-primary-300)' : 'var(--color-primary-500)',
                      color: 'white',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      border: 'none',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        Criar minha conta
                        <ArrowRight size={17} weight="bold" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="font-semibold transition-smooth"
                    style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}
                  >
                    Entrar
                  </Link>
                </p>

                <p className="text-center mt-6 text-xs" style={{ color: 'var(--color-text-light)', lineHeight: 1.5 }}>
                  O Mente Leve não substitui acompanhamento de profissionais de saúde mental.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
    </PageTransition>
  )
}
