import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shuffle, Clock, Hash, ChevronDown } from 'lucide-react'
import { createDraw, encodeDraw } from '../services/drawService'

const DELAY_OPTIONS = [
  { label: 'Inmediato',  value: 0    },
  { label: '1 minuto',   value: 1    },
  { label: '2 minutos',  value: 2    },
  { label: '5 minutos',  value: 5    },
  { label: '10 minutos', value: 10   },
  { label: '15 minutos', value: 15   },
  { label: '30 minutos', value: 30   },
  { label: '1 hora',     value: 60   },
  { label: '2 horas',    value: 120  },
]

export function HomePage() {
  const navigate = useNavigate()
  const [title, setTitle]     = useState('')
  const [min, setMin]         = useState(1)
  const [max, setMax]         = useState(100)
  const [count, setCount]     = useState(1)
  const [delay, setDelay]     = useState(0)
  const [error, setError]     = useState('')

  const maxCount = Math.max(1, max - min + 1)

  const handleCreate = () => {
    if (min >= max) return setError('El mínimo debe ser menor que el máximo.')
    if (count < 1 || count > maxCount) return setError(`La cantidad debe estar entre 1 y ${maxCount}.`)
    setError('')

    const draw = createDraw(title || 'Sorteo', min, max, count, delay)
    navigate(`/draw/${draw.uuid}#${encodeDraw(draw)}`)
  }

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col">
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="bg-brand-700 p-2 rounded-xl">
            <Shuffle size={20} className="text-brand-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SorteoLink</h1>
            <p className="text-slate-500 text-xs">Sorteos con cuenta atrás compartibles</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-lg flex flex-col gap-5">
          {/* Title */}
          <div className="bg-surface-card rounded-2xl border border-slate-700 p-5 flex flex-col gap-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Nombre del sorteo</p>
            <input
              type="text"
              placeholder="Ej. Quién paga la cena"
              value={title}
              maxLength={60}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-surface border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors placeholder:text-slate-600 w-full"
            />
          </div>

          {/* Range */}
          <div className="bg-surface-card rounded-2xl border border-slate-700 p-5 flex flex-col gap-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium flex items-center gap-1.5">
              <Hash size={12} /> Rango de números
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mínimo">
                <NumberInput value={min} min={-999999} max={max - 1} onChange={(v) => { setMin(v); if (count > max - v) setCount(1) }} />
              </Field>
              <Field label="Máximo">
                <NumberInput value={max} min={min + 1} max={999999} onChange={(v) => { setMax(v); if (count > v - min) setCount(1) }} />
              </Field>
            </div>

            <Field label={`Cuántos números sacar (máx. ${maxCount})`}>
              <NumberInput value={count} min={1} max={maxCount} onChange={setCount} />
            </Field>
          </div>

          {/* Delay */}
          <div className="bg-surface-card rounded-2xl border border-slate-700 p-5 flex flex-col gap-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium flex items-center gap-1.5">
              <Clock size={12} /> Revelar en...
            </p>
            <div className="relative">
              <select
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full appearance-none bg-surface border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors pr-10"
              >
                {DELAY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
            {delay === 0 && (
              <p className="text-xs text-yellow-500/80 -mt-1">
                El número se revelará al instante al abrir el link.
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={handleCreate}
            className="w-full bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base"
          >
            <Shuffle size={18} />
            Crear sorteo
          </button>
        </div>
      </main>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function NumberInput({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseInt(e.target.value)
        if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)))
      }}
      className="bg-surface border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors w-full"
    />
  )
}
