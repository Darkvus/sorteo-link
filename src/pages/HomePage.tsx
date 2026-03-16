import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDraw, encodeDraw } from '../services/drawService'
import { CoinSlot } from '../components/CoinSlot'

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
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-glitch flex-shrink-0">
              <defs>
                <linearGradient id="hbg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0d0d1a"/>
                  <stop offset="100%" stopColor="#070710"/>
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="12" fill="url(#hbg)"/>
              <rect x="2" y="2" width="60" height="60" rx="10" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.5"/>
              <circle cx="32" cy="30" r="19" fill="#ffe600"/>
              <circle cx="32" cy="30" r="17" fill="#ffd000"/>
              <circle cx="32" cy="30" r="15" fill="#ffb800"/>
              <circle cx="32" cy="30" r="19" fill="none" stroke="#b8860b" strokeWidth="2"/>
              <rect x="24" y="21" width="16" height="3" fill="#7a5800"/>
              <rect x="34" y="24" width="3" height="5" fill="#7a5800"/>
              <rect x="31" y="29" width="3" height="5" fill="#7a5800"/>
              <rect x="27" y="34" width="4" height="4" fill="#7a5800"/>
              <ellipse cx="26" cy="23" rx="5" ry="2.5" fill="#fff" fillOpacity="0.3" transform="rotate(-30 26 23)"/>
              <rect x="20" y="52" width="24" height="4" rx="1" fill="#0a0a1a" stroke="#00f5ff" strokeWidth="1.5"/>
              <rect x="24" y="53.5" width="16" height="1" fill="#00f5ff" fillOpacity="0.5"/>
              <rect x="4"  y="4"  width="6" height="2" fill="#00f5ff" fillOpacity="0.7"/>
              <rect x="4"  y="4"  width="2" height="6" fill="#00f5ff" fillOpacity="0.7"/>
              <rect x="54" y="4"  width="6" height="2" fill="#00f5ff" fillOpacity="0.7"/>
              <rect x="58" y="4"  width="2" height="6" fill="#00f5ff" fillOpacity="0.7"/>
            </svg>
            <h1 className="text-neon-green text-sm neon-green animate-glitch tracking-widest">
              RETROJACKPOT
            </h1>
          </div>
          <span className="text-neon-pink text-[9px] animate-blink">▶ PLAYER 1</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg flex flex-col gap-4">

          {/* Subtitle */}
          <div className="text-center mb-2 flex justify-center">
            <CoinSlot>
              <p className="text-neon-cyan text-[9px] tracking-widest animate-neon-pulse font-pixel">
                — INSERT COIN TO PLAY —
              </p>
            </CoinSlot>
          </div>

          {/* Title input */}
          <PixelCard color="green">
            <FieldLabel color="green">NOMBRE DEL SORTEO</FieldLabel>
            <div className="flex items-center gap-2 bg-retro-bg border border-neon-green/30 px-3 py-2 mt-2">
              <span className="neon-green text-xs animate-blink">▶</span>
              <input
                type="text"
                value={title}
                placeholder="EJ. Ganemos todos a una"
                maxLength={40}
                onChange={(e) => setTitle(e.target.value.toUpperCase())}
                className="bg-transparent text-neon-green text-xl w-full outline-none placeholder:text-neon-green/30 tracking-wider font-mono"
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
                className="w-full bg-retro-bg font-mono text-xl px-3 py-2 outline-none appearance-none tracking-wider cursor-pointer border"
                style={{ color: '#ff006e', borderColor: '#ff006e66', caretColor: '#ff006e' }}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-retro-border px-4 py-4">
        <div className="flex flex-col items-center gap-3">
          <a
            href="https://paypal.me/alexcaraballo96"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border-2 border-neon-yellow/60 bg-neon-yellow/10 px-4 py-2 font-pixel text-[8px] tracking-widest transition-all hover:bg-neon-yellow/20 active:translate-y-0.5 shadow-pixel active:shadow-none"
            style={{ color: '#ffe600', textShadow: '0 0 6px #ffe60080' }}
          >
            ♥ DONAR · PAYPAL
          </a>
          <p className="text-retro-dim text-[7px] text-center tracking-widest">
            © RETROJACKPOT · ALL RIGHTS RESERVED · 2025
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ── Reusable components ────────────────────────────────────── */

type NeonColor = 'green' | 'cyan' | 'pink' | 'yellow'

function PixelCard({ children, color = 'green' }: { children: React.ReactNode; color?: NeonColor }) {
  const hex = neonColors[color]
  return (
    <div
      className="border-2 p-4 relative"
      style={{ borderColor: `${hex}80`, backgroundColor: `${hex}0d` }}
    >
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 opacity-60" style={{ borderColor: hex }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 opacity-60" style={{ borderColor: hex }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 opacity-60" style={{ borderColor: hex }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 opacity-60" style={{ borderColor: hex }} />
      {children}
    </div>
  )
}

function FieldLabel({ children, color = 'green', small = false }: { children: React.ReactNode; color?: NeonColor; small?: boolean }) {
  const hex = neonColors[color]
  return (
    <p
      className={`${small ? 'text-[7px]' : 'text-[9px]'} tracking-widest mb-1 font-pixel`}
      style={{ color: hex, textShadow: `0 0 8px ${hex}80` }}
    >
      {children}
    </p>
  )
}

const neonColors = {
  green:  '#00ff41',
  cyan:   '#00f5ff',
  pink:   '#ff006e',
  yellow: '#ffe600',
}

function PixelInput({ value, onChange, min = -999999, max = 999999, color = 'green' }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; color?: keyof typeof neonColors
}) {
  const hex = neonColors[color]
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
      className="w-full bg-retro-bg font-mono text-2xl px-3 py-2 outline-none text-center border"
      style={{ color: hex, borderColor: `${hex}66`, caretColor: hex }}
    />
  )
}
