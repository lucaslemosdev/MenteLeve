import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeSimple, ArrowRight, WarningCircle, CheckCircle, Leaf } from '@phosphor-icons/react'
import { authService } from '../services/authService'
import { PageTransition } from '../components/PageTransition'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await authService.forgotPassword({ email: email.trim() })
      setSuccess(true)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr.response?.data?.message || 'Ocorreu um erro ao tentar recuperar a senha.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-[100dvh] flex bg-[var(--color-bg)] font-sans">
        
        {/* Mobile Header (similar to LoginPage but smaller) */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden z-10">
          <Leaf size={22} weight="fill" className="text-[var(--color-primary-500)]" />
          <span className="font-semibold text-lg text-[var(--color-text)]">Mente Leve</span>
        </div>

        {/* Formulário centralizado */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-16">
          <div className="w-full max-w-md">
            
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
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-[var(--color-primary-100)]"
                  >
                    <CheckCircle size={32} weight="fill" className="text-[var(--color-primary-500)]" />
                  </motion.div>
                  <h2 className="font-semibold text-2xl mb-3 text-[var(--color-text)]">
                    Enviamos as instruções!
                  </h2>
                  <p className="text-[var(--color-text-muted)] text-[0.9375rem] leading-relaxed mb-8 max-w-sm mx-auto">
                    Para fins de teste nesta versão, o link com o token foi gerado no console do backend. Pegue-o para prosseguir!
                  </p>
                  <Link 
                    to="/reset-password"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-smooth bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]"
                  >
                    Ir para Redefinição
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  
                  {/* Desktop Title */}
                  <h1 className="font-semibold mb-2 text-3xl tracking-tight text-[var(--color-text)] text-center lg:text-left">
                    Recuperar senha
                  </h1>
                  <p className="text-[var(--color-text-muted)] text-[0.9375rem] mb-8 text-center lg:text-left">
                    Informe seu e-mail para receber as instruções de acesso.
                  </p>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="flex items-start gap-2 rounded-xl p-3 mb-5 border bg-red-500/10 border-red-500/20"
                      >
                        <WarningCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-500 text-sm leading-relaxed">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="forgot-email" className="font-medium text-sm text-[var(--color-text)]">
                        E-mail cadastrado
                      </label>
                      <div className="relative">
                        <EnvelopeSimple
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-light)]"
                        />
                        <input
                          id="forgot-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-smooth bg-[var(--color-surface)] border-[1.5px] border-[var(--color-surface-alt)] text-[var(--color-text)] focus:border-[var(--color-primary-400)]"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm mt-2 transition-smooth disabled:cursor-not-allowed disabled:opacity-80"
                      style={{ background: 'var(--color-primary-500)', color: 'white' }}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Solicitar recuperação
                          <ArrowRight size={17} weight="bold" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="text-center mt-8">
                    <Link
                      to="/login"
                      className="text-sm font-semibold transition-smooth text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]"
                    >
                      Voltar para o Login
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </PageTransition>
  )
}
