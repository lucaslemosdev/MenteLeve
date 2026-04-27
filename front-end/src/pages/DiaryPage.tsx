import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  BookOpenText,
  ArrowLeft,
  Leaf,
  Pencil,
  Trash,
  X,
  FloppyDisk,
  WarningCircle,
  SmileyMeh,
  SmileySad,
  Smiley,
  SmileyWink,
  SmileyXEyes,
  Tag,
  CalendarBlank,
} from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { diarioService } from '../services/diarioService'
import type { DiarioEntry, CreateDiarioRequest, UpdateDiarioRequest } from '../services/diarioService'

// ─── Componente: Seletor de Humor ─────────────────────────────────────────────

const humorOptions = [
  { value: 1, label: 'Muito mal', icon: SmileyXEyes, color: '#c25a5a', bg: 'rgba(194,90,90,0.1)' },
  { value: 2, label: 'Mal', icon: SmileySad, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  { value: 3, label: 'Mais ou menos', icon: SmileyMeh, color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  { value: 4, label: 'Bem', icon: Smiley, color: 'var(--color-success)', bg: 'rgba(74,158,106,0.1)' },
  { value: 5, label: 'Muito bem', icon: SmileyWink, color: 'var(--color-primary-500)', bg: 'var(--color-primary-100)' },
]

function HumorSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {humorOptions.map((opt) => {
        const Icon = opt.icon
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className="flex flex-col items-center gap-1 flex-1 py-2.5 rounded-xl transition-smooth"
            style={{
              background: selected ? opt.bg : 'var(--color-surface-alt)',
              border: selected ? `2px solid ${opt.color}` : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Icon size={22} weight={selected ? 'fill' : 'regular'} style={{ color: selected ? opt.color : 'var(--color-text-light)' }} />
            <span className="text-xs font-medium hidden sm:block" style={{ color: selected ? opt.color : 'var(--color-text-light)' }}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Componente: Card do Diário ────────────────────────────────────────────────

function DiarioCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: DiarioEntry
  onEdit: (entry: DiarioEntry) => void
  onDelete: (id: number) => void
}) {
  const opt = humorOptions.find((o) => o.value === entry.nivelHumor) || humorOptions[2]
  const Icon = opt.icon
  const date = entry.dataRegistro
    ? new Date(entry.dataRegistro).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  const tags = entry.tags
    ? entry.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: opt.bg }}
          >
            <Icon size={18} weight="fill" style={{ color: opt.color }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
              {entry.titulo}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <CalendarBlank size={11} style={{ color: 'var(--color-text-light)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>{date}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(entry)}
            title="Editar"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-smooth"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-alt)'
              e.currentTarget.style.color = 'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            title="Excluir"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-smooth"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(194,90,90,0.08)'
              e.currentTarget.style.color = 'var(--color-error)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <Trash size={15} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      {entry.conteudo && (
        <p
          className="text-sm leading-relaxed"
          style={{
            color: 'var(--color-text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {entry.conteudo}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)' }}
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Componente: Formulário (criar / editar) ──────────────────────────────────

interface DiarioFormProps {
  initial?: DiarioEntry | null
  usuarioId: number
  onSave: () => void
  onCancel: () => void
}

function DiarioForm({ initial, usuarioId, onSave, onCancel }: DiarioFormProps) {
  const [titulo, setTitulo] = useState(initial?.titulo || '')
  const [conteudo, setConteudo] = useState(initial?.conteudo || '')
  const [nivelHumor, setNivelHumor] = useState(initial?.nivelHumor || 3)
  const [tags, setTags] = useState(initial?.tags || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!titulo.trim()) {
      setError('O título é obrigatório.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      if (initial) {
        const payload: UpdateDiarioRequest = {
          titulo: titulo.trim(),
          conteudo: conteudo.trim(),
          nivelHumor,
          tags: tags.trim() || undefined,
        }
        await diarioService.atualizar(initial.id, payload)
      } else {
        const payload: CreateDiarioRequest = {
          usuarioId,
          titulo: titulo.trim(),
          conteudo: conteudo.trim(),
          nivelHumor,
          tags: tags.trim() || undefined,
        }
        await diarioService.criar(payload)
      }
      onSave()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr.response?.data?.message || 'Não foi possível salvar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--color-surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
          {initial ? 'Editar entrada' : 'Nova entrada no diário'}
        </h2>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-smooth"
          style={{ background: 'var(--color-surface-alt)', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
        >
          <X size={16} />
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 rounded-xl p-3 mb-5"
            style={{ background: 'rgba(194, 90, 90, 0.08)', border: '1px solid rgba(194, 90, 90, 0.2)' }}
          >
            <WarningCircle size={16} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem' }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Humor */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
            Como você está se sentindo?
          </label>
          <HumorSelector value={nivelHumor} onChange={setNivelHumor} />
        </div>

        {/* Título */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="diario-titulo" className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
            Título <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <input
            id="diario-titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Dê um título para este momento..."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-smooth"
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

        {/* Conteúdo */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="diario-conteudo" className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
            O que você quer registrar?
          </label>
          <textarea
            id="diario-conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva com calma, sem pressa. Este é o seu espaço..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-smooth"
            style={{
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-surface-alt)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.6',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-alt)')}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="diario-tags" className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
            Tags{' '}
            <span className="font-normal" style={{ color: 'var(--color-text-light)', fontSize: '0.8125rem' }}>
              (separe com vírgulas)
            </span>
          </label>
          <input
            id="diario-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ex: gratidão, trabalho, família"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-smooth"
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

        {/* Ações */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-smooth"
            style={{
              background: 'var(--color-surface-alt)',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-smooth"
            style={{
              background: isLoading ? 'var(--color-primary-300)' : 'var(--color-primary-500)',
              border: 'none',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <FloppyDisk size={16} weight="fill" />
                {initial ? 'Salvar alterações' : 'Salvar entrada'}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

// ─── Componente: Modal de confirmação de exclusão ──────────────────────────────

function DeleteConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28, 43, 39, 0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="rounded-2xl p-6 w-full max-w-sm"
        style={{ background: 'var(--color-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(194, 90, 90, 0.1)' }}
        >
          <Trash size={22} weight="fill" style={{ color: 'var(--color-error)' }} />
        </div>
        <h3 className="font-semibold text-center mb-2" style={{ color: 'var(--color-text)', fontSize: '1.0625rem' }}>
          Excluir entrada?
        </h3>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          Esta ação não pode ser desfeita. Sua entrada será apagada permanentemente.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-smooth"
            style={{ background: 'var(--color-surface-alt)', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-smooth"
            style={{ background: 'var(--color-error)', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Sim, excluir
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Página Principal do Diário ───────────────────────────────────────────────

export function DiaryPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<DiarioEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiarioEntry | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [fetchError, setFetchError] = useState('')

  const loadEntries = async () => {
    if (!user) return
    setIsLoading(true)
    setFetchError('')
    try {
      const page = await diarioService.listar(user.id)
      setEntries(page.content)
    } catch {
      setFetchError('Não foi possível carregar seu diário. Verifique sua conexão.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [user])

  const handleSave = () => {
    setShowForm(false)
    setEditingEntry(null)
    loadEntries()
  }

  const handleEdit = (entry: DiarioEntry) => {
    setEditingEntry(entry)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return
    try {
      await diarioService.deletar(deletingId)
      setEntries((prev) => prev.filter((e) => e.id !== deletingId))
    } catch {
      // silently fail — keep modal open briefly
    } finally {
      setDeletingId(null)
    }
  }

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
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-smooth"
              style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', textDecoration: 'none' }}
            >
              <ArrowLeft size={17} />
            </Link>
            <div className="flex items-center gap-2">
              <Leaf size={18} weight="fill" style={{ color: 'var(--color-primary-500)' }} />
              <span className="font-semibold tracking-tight" style={{ color: 'var(--color-text)', fontSize: '1rem' }}>
                Meu Diário
              </span>
            </div>
          </div>

          {!showForm && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { setEditingEntry(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-smooth"
              style={{
                background: 'var(--color-primary-500)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <Plus size={16} weight="bold" />
              Nova entrada
            </motion.button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Formulário */}
        <AnimatePresence>
          {showForm && (
            <div className="mb-8">
              <DiarioForm
                initial={editingEntry}
                usuarioId={user!.id}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditingEntry(null) }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Lista */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl h-32 animate-pulse"
                style={{ background: 'var(--color-surface-alt)' }}
              />
            ))}
          </div>
        ) : fetchError ? (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(194, 90, 90, 0.06)', border: '1px solid rgba(194, 90, 90, 0.15)' }}
          >
            <WarningCircle size={28} style={{ color: 'var(--color-error)', margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--color-error)', fontSize: '0.9375rem', fontWeight: 500 }}>{fetchError}</p>
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-16"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'var(--color-primary-100)' }}
            >
              <BookOpenText size={28} weight="duotone" style={{ color: 'var(--color-primary-500)' }} />
            </div>
            <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
              Seu diário está esperando
            </h2>
            <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Comece registrando como você está hoje. Cada palavra conta.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setEditingEntry(null); setShowForm(true) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-smooth"
              style={{
                background: 'var(--color-primary-500)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <Plus size={16} weight="bold" />
              Criar primeira entrada
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-4">
            <AnimatePresence>
              {entries.map((entry) => (
                <DiarioCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeletingId(id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Modal de exclusão */}
      <AnimatePresence>
        {deletingId !== null && (
          <DeleteConfirmModal
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
