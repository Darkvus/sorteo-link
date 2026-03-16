import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDraw, encodeDraw } from '../services/drawService'

const DELAY_OPTIONS = [
  { label: 'AHORA MISMO',  value: 0   },
  { label: '1 MINUTO',     value: 1   },
  { label: '2 MINUTOS',    value: 2   },
  { label: '5 MINUTOS',    value: 5   },
  { label: '10 MINUTOS',   value: 10  },
  { label: '15 MINUTOS',   value: 15  },
  { label: '30 MINUTOS',   value: 30  },
  { label: '1 HORA',       value: 60  },
  { label: '2 HORAS',      value: 120 },
]

export function HomePage() {
  const navigate = useNavigate()
  const [title, setTitle]   = useState('')
  const [min, setMin]       = useState(1)
  const [max, setMax]       = useState(100)
  const [count, setCount]   = useState(1)
  const [delay, setDelay]   = useState(0)
  const [error, setError]   = useState('')

  const maxCount = Math.max(1, max - min + 1)

  const handleCreate = () => {
    if (min >= max) return setError('> ERROR: MIN DEBE SER MENOR QUE MAX')
    if (count < 1 || count > maxCount) return setError(`> ERROR: CANTIDAD 1–${maxCount}`)
    setError('')
    const draw = createDraw(title || 'SORTEO', min, max, count, delay)
    navigate(`/draw/${draw.uuid}#${encodeDraw(draw)}`)
  }

  return (
    <div className="crt min-h-screen bg-retro-bg text-white font-pixel flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-neon-green/40 px-4 py-4 bg-retro-surface">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-neon-green text-xl animate-glitch">🎮</span>
            <h1 className="text-neon-green text-sm neon-green animate-glitch tracking-widest">
              SORTEOLINK
            </h1>
          </div>
          <span className="text-neon-pink text-[9px] animate-blink">▶ PLAYER 1</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg flex flex-col gap-4">

          {/* Subtitle */}
          <div className="text-center mb-2">
            <p className="text-neon-cyan text-[9px] tracking-widest animate-neon-pulse">
              — INSERT COIN TO PLAY —
            </p>
          </div>

          {/* Title input */}
          <PixelCard color="green">
            <FieldLabel color="green">NOMBRE DEL SORTEO</FieldLabel>
            <div className="flex items-center gap-2 bg-retro-bg border border-neon-green/30 px-3 py-2 mt-2">
              <span className="neon-green text-xs animate-blink">▶</span>
              <input
                type="text"
                value={title}
                placeholder="EJ. QUIEN PAGA LA CENA"
                maxLength={40}
                onChange={(e) => setTitle(e.target.value.toUpperCase())}
                className="bg-transparent text-neon-green text-xs w-full outline-none placeholder:text-neon-green/30 tracking-wider font-pixel"
              />
            </div>
          </PixelCard>

          {/* Range */}
          <PixelCard color="cyan">
            <FieldLabel color="cyan">RANGO DE NÚMEROS</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <FieldLabel color="cyan" small>MIN</FieldLabel>
                <PixelInput
                  value={min}
                  onChange={(v) => { setMin(v); if (count > max - v) setCount(1) }}
                  color="cyan"
                />
              </div>
              <div>
                <FieldLabel color="cyan" small>MAX</FieldLabel>
                <PixelInput
                  value={max}
                  onChange={(v) => { setMax(v); if (count > v - min) setCount(1) }}
                  color="cyan"
                />
              </div>
            </div>
            <div className="mt-3">
              <FieldLabel color="cyan" small>PICKS (MÁX {maxCount})</FieldLabel>
              <PixelInput value={count} onChange={setCount} min={1} max={maxCount} color="cyan" />
            </div>
          </PixelCard>

          {/* Delay */}
          <PixelCard color="pink">
            <FieldLabel color="pink">⏱ REVELAR EN...</FieldLabel>
            <div className="relative mt-2">
              <select
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full bg-retro-bg border border-neon-pink/40 text-neon-pink font-pixel text-[9px] px-3 py-2.5 outline-none appearance-none tracking-wider focus:border-neon-pink cursor-pointer"
              >
                {DELAY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-retro-bg">{o.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-pink text-xs pointer-events-none">▼</span>
            </div>
            {delay === 0 && (
              <p className="text-neon-yellow text-[8px] mt-2 tracking-wide animate-blink">
                ⚡ SE REVELA AL INSTANTE
              </p>
            )}
          </PixelCard>

          {/* Error */}
          {error && (
            <p className="neon-pink font-pixel text-[8px] text-center animate-blink border border-neon-pink/40 px-3 py-2">
              {error}
            </p>
          )}

          {/* CTA */}
          <button
            onClick={handleCreate}
            className="w-full bg-neon-green text-retro-bg font-pixel text-sm py-4 tracking-widest
              shadow-pixel hover:bg-white active:translate-y-1 active:shadow-none transition-all
              uppercase mt-2"
          >
            ▶ START GAME ◀
          </button>

          <p className="text-retro-dim text-[7px] text-center tracking-widest mt-1">
            LOS NÚMEROS SE GENERAN AL CREAR Y SE SELLAN EN EL LINK
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-retro-border px-4 py-3">
        <p className="text-retro-dim text-[7px] text-center tracking-widest">
          © SORTEOLINK · ALL RIGHTS RESERVED · 2025
        </p>
      </footer>
    </div>
  )
}

/* ── Reusable components ────────────────────────────────────── */

const colorMap = {
  green:  { border: 'border-neon-green/50', bg: 'bg-neon-green/5'  },
  cyan:   { border: 'border-neon-cyan/50',  bg: 'bg-neon-cyan/5'   },
  pink:   { border: 'border-neon-pink/50',  bg: 'bg-neon-pink/5'   },
  yellow: { border: 'border-neon-yellow/50',bg: 'bg-neon-yellow/5' },
}

function PixelCard({ children, color = 'green' }: { children: React.ReactNode; color?: keyof typeof colorMap }) {
  const c = colorMap[color]
  return (
    <div className={`border-2 ${c.border} ${c.bg} p-4 relative`}>
      {/* Corner decorations */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-60" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-60" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-60" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-60" />
      {children}
    </div>
  )
}

const labelColorMap = {
  green:  'text-neon-green',
  cyan:   'text-neon-cyan',
  pink:   'text-neon-pink',
  yellow: 'text-neon-yellow',
}

function FieldLabel({ children, color = 'green', small = false }: { children: React.ReactNode; color?: keyof typeof labelColorMap; small?: boolean }) {
  return (
    <p className={`${labelColorMap[color]} ${small ? 'text-[7px]' : 'text-[9px]'} tracking-widest mb-1`}>
      {children}
    </p>
  )
}

const inputColorMap = {
  green:  'border-neon-green/40 text-neon-green focus:border-neon-green',
  cyan:   'border-neon-cyan/40  text-neon-cyan  focus:border-neon-cyan',
  pink:   'border-neon-pink/40  text-neon-pink  focus:border-neon-pink',
  yellow: 'border-neon-yellow/40 text-neon-yellow focus:border-neon-yellow',
}

function PixelInput({ value, onChange, min = -999999, max = 999999, color = 'green' }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; color?: keyof typeof inputColorMap
}) {
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
      className={`w-full bg-retro-bg border ${inputColorMap[color]} font-pixel text-xs px-3 py-2 outline-none tracking-widest text-center`}
    />
  )
}
