import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, ArrowLeft, Leaf, Plus, X, FloppyDisk, Trash,
  Pencil, WarningCircle, Clock, Power, Check,
} from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { lembreteService } from '../services/lembreteService'
import type { LembreteEntry, CreateLembreteRequest, UpdateLembreteRequest, TipoLembrete } from '../services/lembreteService'
import { lembreteTemplates } from '../data/lembreteTemplates'

const TIPO_LABELS: Record<TipoLembrete, string> = {
  PAUSA: 'Pausa',
  HIDRATACAO: 'Hidratação',
  DESCANSO: 'Descanso',
}

const TIPO_COLORS: Record<TipoLembrete, { color: string; bg: string }> = {
  PAUSA: { color: 'var(--color-primary-600)', bg: 'var(--color-primary-100)' },
  HIDRATACAO: { color: '#4a6fa5', bg: 'rgba(74,111,165,0.1)' },
  DESCANSO: { color: '#7a6ea5', bg: 'rgba(122,110,165,0.1)' },
}

function formatHora(hora: string | null) {
  if (!hora) return null
  return hora.slice(0, 5)
}

// ─── Formulário ───────────────────────────────────────────────

interface FormProps {
  initial?: LembreteEntry | null
  usuarioId: number
  onSave: () => void
  onCancel: () => void
}

function LembreteForm({ initial, usuarioId, onSave, onCancel }: FormProps) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? '')
  const [descricao, setDescricao] = useState(initial?.descricao ?? '')
  const [tipo, setTipo] = useState<TipoLembrete>(initial?.tipoLembrete ?? 'PAUSA')
  const [hora, setHora] = useState(initial?.horaLembrete ? formatHora(initial.horaLembrete)! : '')
  const [ativo, setAtivo] = useState(initial?.ativo ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fill = (t: typeof lembreteTemplates[0]) => {
    setTitulo(t.titulo)
    setDescricao(t.descricao)
    setTipo(t.tipoLembrete)
    setHora(t.horaLembrete)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!titulo.trim()) { setError('O título é obrigatório.'); return }
    setLoading(true); setError('')
    try {
      if (initial) {
        const payload: UpdateLembreteRequest = {
          titulo: titulo.trim(),
          descricao: descricao.trim() || undefined,
          tipoLembrete: tipo,
          horaLembrete: hora ? `${hora}:00` : undefined,
          ativo,
        }
        await lembreteService.atualizar(initial.id, payload)
      } else {
        const payload: CreateLembreteRequest = {
          usuarioId,
          titulo: titulo.trim(),
          descricao: descricao.trim() || undefined,
          tipoLembrete: tipo,
          horaLembrete: hora ? `${hora}:00` : undefined,
        }
        await lembreteService.criar(payload)
      }
      onSave()
    } catch {
      setError('Não foi possível salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--color-surface)',
    border: '1.5px solid var(--color-surface-alt)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-sans)',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-2xl p-6 mb-6"
      style={{ background: 'var(--color-surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
          {initial ? 'Editar lembrete' : 'Novo lembrete'}
        </h2>
        <button onClick={onCancel} style={{ background: 'var(--color-surface-alt)', border: 'none', borderRadius: '0.5rem', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
          <X size={16} />
        </button>
      </div>

      {/* Sugestões */}
      {!initial && (
        <div className="mb-5">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Comece com uma sugestão</p>
          <div className="flex flex-wrap gap-2">
            {lembreteTemplates.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => fill(t)}
                className="text-xs px-3 py-1.5 rounded-full transition-smooth"
                style={{ background: 'var(--color-surface-alt)', border: '1px solid transparent', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary-300)'; e.currentTarget.style.color = 'var(--color-primary-600)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                {t.titulo}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 rounded-xl p-3 mb-4"
            style={{ background: 'rgba(194,90,90,0.08)', border: '1px solid rgba(194,90,90,0.2)' }}>
            <WarningCircle size={16} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem' }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Título */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Título <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Beber água" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--color-primary-400)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-surface-alt)')} />
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Mensagem <span className="font-normal text-xs" style={{ color: 'var(--color-text-light)' }}>(opcional)</span></label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Uma mensagem gentil para você..." rows={3}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
            onFocus={e => (e.target.style.borderColor = 'var(--color-primary-400)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-surface-alt)')} />
        </div>

        {/* Tipo + Hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value as TipoLembrete)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="PAUSA">Pausa</option>
              <option value="HIDRATACAO">Hidratação</option>
              <option value="DESCANSO">Descanso</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Horário <span className="font-normal text-xs" style={{ color: 'var(--color-text-light)' }}>(opcional)</span></label>
            <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary-400)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-surface-alt)')} />
          </div>
        </div>

        {/* Ativo (só edição) */}
        {initial && (
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setAtivo(v => !v)}
              className="w-10 h-6 rounded-full relative transition-smooth"
              style={{ background: ativo ? 'var(--color-primary-500)' : 'var(--color-surface-alt)', cursor: 'pointer' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-smooth"
                style={{ left: ativo ? '1.25rem' : '0.25rem' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{ativo ? 'Ativo' : 'Inativo'}</span>
          </label>
        )}

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'var(--color-surface-alt)', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Cancelar
          </button>
          <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: loading ? 'var(--color-primary-300)' : 'var(--color-primary-500)', border: 'none', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}>
            {loading
              ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : <><FloppyDisk size={16} weight="fill" />{initial ? 'Salvar' : 'Criar lembrete'}</>}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

// ─── Card de lembrete ─────────────────────────────────────────

function LembreteCard({ entry, onEdit, onDelete, onToggle }: {
  entry: LembreteEntry
  onEdit: (e: LembreteEntry) => void
  onDelete: (id: number) => void
  onToggle: (e: LembreteEntry) => void
}) {
  const tipo = entry.tipoLembrete
  const colors = tipo ? TIPO_COLORS[tipo] : { color: 'var(--color-text-muted)', bg: 'var(--color-surface-alt)' }
  const label = tipo ? TIPO_LABELS[tipo] : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-5"
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${entry.ativo ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.03)'}`,
        boxShadow: 'var(--shadow-card)',
        opacity: entry.ativo ? 1 : 0.65,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Indicador de tipo */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: colors.bg }}>
          <Bell size={16} weight="duotone" style={{ color: colors.color }} />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{entry.titulo}</h3>
            {label && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: colors.bg, color: colors.color }}>{label}</span>
            )}
            {!entry.ativo && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-light)' }}>Inativo</span>
            )}
          </div>

          {entry.descricao && (
            <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {entry.descricao}
            </p>
          )}

          {entry.horaLembrete && (
            <div className="flex items-center gap-1 mt-2">
              <Clock size={12} style={{ color: 'var(--color-text-light)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                {formatHora(entry.horaLembrete)}
              </span>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button title={entry.ativo ? 'Desativar' : 'Ativar'} onClick={() => onToggle(entry)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-smooth"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: entry.ativo ? 'var(--color-primary-500)' : 'var(--color-text-light)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-alt)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            {entry.ativo ? <Check size={15} weight="bold" /> : <Power size={15} />}
          </button>
          <button title="Editar" onClick={() => onEdit(entry)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-smooth"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-alt)'; e.currentTarget.style.color = 'var(--color-text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
            <Pencil size={14} />
          </button>
          <button title="Excluir" onClick={() => onDelete(entry.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-smooth"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(194,90,90,0.08)'; e.currentTarget.style.color = 'var(--color-error)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
            <Trash size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Modal de confirmação de exclusão ────────────────────────

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,43,39,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="rounded-2xl p-6 w-full max-w-sm"
        style={{ background: 'var(--color-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(194,90,90,0.1)' }}>
          <Trash size={22} weight="fill" style={{ color: 'var(--color-error)' }} />
        </div>
        <h3 className="font-semibold text-center mb-2" style={{ color: 'var(--color-text)', fontSize: '1rem' }}>Excluir lembrete?</h3>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'var(--color-surface-alt)', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--color-error)', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Excluir
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Página principal ─────────────────────────────────────────

export function RemindersPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LembreteEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<LembreteEntry | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const load = async () => {
    if (!user) return
    setLoading(true); setFetchError('')
    try {
      const page = await lembreteService.listar(user.id)
      setEntries(page.content)
    } catch {
      setFetchError('Não foi possível carregar seus lembretes. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user])

  const handleSave = () => { setShowForm(false); setEditing(null); load() }
  const handleEdit = (e: LembreteEntry) => { setEditing(e); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handleToggle = async (e: LembreteEntry) => {
    try {
      const updated = await lembreteService.toggleAtivo(e)
      setEntries(prev => prev.map(x => x.id === updated.id ? updated : x))
    } catch { /* silently fail */ }
  }

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return
    try {
      await lembreteService.deletar(deletingId)
      setEntries(prev => prev.filter(e => e.id !== deletingId))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10"
        style={{ background: 'rgba(245,247,244,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-smooth"
              style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              <ArrowLeft size={17} />
            </Link>
            <div className="flex items-center gap-2">
              <Leaf size={18} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
              <span className="font-semibold tracking-tight" style={{ color: 'var(--color-text)', fontSize: '1rem' }}>
                Meus Lembretes
              </span>
            </div>
          </div>
          {!showForm && (
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => { setEditing(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--color-primary-500)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              <Plus size={16} weight="bold" />
              Novo lembrete
            </motion.button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Cabeçalho acolhedor */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Pequenos cuidados ao longo do dia podem ajudar na sua rotina. Você decide o ritmo.
          </p>
        </motion.div>

        {/* Formulário */}
        <AnimatePresence>
          {showForm && (
            <LembreteForm
              key="form"
              initial={editing}
              usuarioId={user!.id}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null) }}
            />
          )}
        </AnimatePresence>

        {/* Lista */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-24 animate-pulse"
                style={{ background: 'var(--color-surface-alt)' }} />
            ))}
          </div>
        ) : fetchError ? (
          <div className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(194,90,90,0.06)', border: '1px solid rgba(194,90,90,0.15)' }}>
            <WarningCircle size={28} style={{ color: 'var(--color-error)', margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--color-error)', fontSize: '0.9375rem', fontWeight: 500 }}>{fetchError}</p>
          </div>
        ) : entries.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-14">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'var(--color-primary-100)' }}>
              <Bell size={28} weight="duotone" style={{ color: 'var(--color-primary-500)' }} />
            </div>
            <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
              Nenhum lembrete ainda
            </h2>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
              Que tal começar com um lembrete simples para respirar ou beber água?
            </p>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => { setEditing(null); setShowForm(true) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--color-primary-500)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              <Plus size={16} weight="bold" />
              Criar primeiro lembrete
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-3">
            <AnimatePresence>
              {entries.map(e => (
                <LembreteCard
                  key={e.id}
                  entry={e}
                  onEdit={handleEdit}
                  onDelete={id => setDeletingId(id)}
                  onToggle={handleToggle}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {deletingId !== null && (
          <DeleteModal onConfirm={handleDeleteConfirm} onCancel={() => setDeletingId(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
