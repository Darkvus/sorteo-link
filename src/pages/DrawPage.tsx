import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { decodeDraw, buildDrawURL } from '../services/drawService'
import type { DrawConfig } from '../types'

/* ── Countdown hook ───────────────────────────────────────── */
function useCountdown(drawAt: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, drawAt - Date.now()))
  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining(Math.max(0, drawAt - Date.now())), 250)
    return () => clearInterval(id)
  }, [drawAt])
  return remaining
}

/* ── Slot machine number ──────────────────────────────────── */
function SlotNumber({ target, min, max, delay = 0, active }: {
  target: number; min: number; max: number; delay?: number; active: boolean
}) {
  const [display, setDisplay] = useState<number | '?'>('?')
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!active) return
    const spinDuration = 1200 + delay
    const spinInterval = 70
    let elapsed = 0

    const id = setInterval(() => {
      elapsed += spinInterval
      if (elapsed >= spinDuration) {
        clearInterval(id)
        setDisplay(target)
        setSettled(true)
      } else {
        setDisplay(Math.floor(Math.random() * (max - min + 1)) + min)
      }
    }, spinInterval)

    return () => clearInterval(id)
  }, [active, target, min, max, delay])

  const big = target > 9999

  return (
    <div
      className={`
        flex items-center justify-center border-2 font-pixel transition-all duration-200
        ${settled
          ? 'border-neon-yellow text-neon-yellow shadow-neon-yellow bg-neon-yellow/10 animate-pop-in'
          : 'border-neon-cyan/50 text-neon-cyan/70 bg-retro-card'
        }
      `}
      style={{
        width:    big ? '7rem' : target > 999 ? '6rem' : target > 99 ? '5rem' : '4.5rem',
        height:   big ? '7rem' : target > 999 ? '6rem' : target > 99 ? '5rem' : '4.5rem',
        fontSize: big ? '1rem' : target > 999 ? '1.1rem' : target > 99 ? '1.3rem' : '1.6rem',
        opacity:  settled ? undefined : 1,
      }}
    >
      {display}
    </div>
  )
}

/* ── Countdown display ────────────────────────────────────── */
function CountdownDisplay({ ms }: { ms: number }) {
  const total = ms / 1000
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = Math.floor(total % 60)

  return (
    <div className="flex items-end justify-center gap-2 font-pixel">
      {h > 0 && <><Unit v={h} label="HH" /><Sep /></>}
      <Unit v={m} label="MM" />
      <Sep />
      <Unit v={s} label="SS" />
    </div>
  )
}

function Sep() {
  return <span className="text-neon-cyan/50 text-3xl mb-6 animate-blink">:</span>
}

function Unit({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl text-neon-cyan tabular-nums leading-none neon-cyan">{String(Math.floor(v)).padStart(2, '0')}</span>
      <span className="text-[7px] text-retro-dim mt-2 tracking-widest">{label}</span>
    </div>
  )
}

/* ── Copy button ──────────────────────────────────────────── */
function CopyButton({ draw }: { draw: DrawConfig }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await navigator.clipboard.writeText(buildDrawURL(draw))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={`
        font-pixel text-[9px] px-4 py-2.5 border-2 tracking-widest transition-all
        active:translate-y-0.5 shadow-pixel active:shadow-none
        ${copied
          ? 'border-neon-green text-neon-green bg-neon-green/10'
          : 'border-neon-cyan text-neon-cyan bg-neon-cyan/5 hover:bg-neon-cyan/10'
        }
      `}
    >
      {copied ? '✓ COPIADO!' : '⧉ COPIAR LINK'}
    </button>
  )
}

/* ── Main page ────────────────────────────────────────────── */
export function DrawPage() {
  const navigate = useNavigate()
  const hash = window.location.hash.slice(1)
  const draw = useRef<DrawConfig | null>(decodeDraw(hash)).current
  const remaining = useCountdown(draw?.drawAt ?? 0)
  const revealed = remaining <= 0
  const [slotActive, setSlotActive] = useState(false)
  const activatedRef = useRef(false)

  // Trigger slot spin exactly once when countdown hits 0
  useEffect(() => {
    if (revealed && !activatedRef.current) {
      activatedRef.current = true
      setSlotActive(true)
    }
  }, [revealed])

  if (!draw) {
    return (
      <div className="crt min-h-screen bg-retro-bg font-pixel flex flex-col items-center justify-center gap-6">
        <p className="neon-pink text-sm animate-blink">ERROR 404</p>
        <p className="text-retro-dim text-[9px]">LINK INVÁLIDO O CADUCADO</p>
        <button onClick={() => navigate('/')} className="text-neon-cyan text-[9px] border border-neon-cyan/40 px-4 py-2 hover:bg-neon-cyan/10 transition-colors">
          ▶ NUEVO SORTEO
        </button>
      </div>
    )
  }

  const isLongCountdown = remaining > 3600_000

  return (
    <div className="crt min-h-screen bg-retro-bg text-white font-pixel flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-neon-green/40 px-4 py-4 bg-retro-surface">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-neon-green hover:animate-glitch transition-all">
            <span className="text-lg">🎮</span>
            <span className="text-[10px] neon-green tracking-widest">SORTEOLINK</span>
          </button>
          <CopyButton draw={draw} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-8">
        {/* Title */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-retro-dim text-[7px] tracking-widest">— SORTEO —</p>
          <h2 className="text-neon-yellow text-sm neon-yellow tracking-wide max-w-xs break-words text-center">
            {draw.title}
          </h2>
          <p className="text-retro-dim text-[7px] tracking-widest mt-1">
            {draw.count === 1
              ? `1 NÚMERO · RANGO ${draw.min}–${draw.max}`
              : `${draw.count} NÚMEROS · RANGO ${draw.min}–${draw.max}`
            }
          </p>
        </div>

        {/* Countdown / Numbers */}
        {!revealed ? (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="w-full border-2 border-neon-cyan/40 bg-neon-cyan/5 p-6 flex flex-col items-center gap-5 relative">
              <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-cyan/60" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-cyan/60" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-cyan/60" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-cyan/60" />

              <p className="text-neon-cyan text-[7px] tracking-widest animate-neon-pulse">REVELANDO EN</p>
              <CountdownDisplay ms={remaining} />

              {isLongCountdown && (
                <p className="text-retro-dim text-[7px] text-center tracking-wide">
                  COMPARTE EL LINK · TODOS VEN EL MISMO RESULTADO
                </p>
              )}
            </div>

            <div className="border border-retro-border bg-retro-surface px-4 py-2 flex items-center gap-2">
              <span className="text-neon-pink text-xs animate-blink">◆</span>
              <p className="text-retro-dim text-[7px] tracking-wide">SUERTE A TODOS :)</p>
              <span className="text-neon-pink text-xs animate-blink">◆</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-neon-green text-[9px] tracking-widest animate-neon-pulse">
                {draw.numbers.length === 1 ? '★ NÚMERO GANADOR ★' : '★ NÚMEROS GANADORES ★'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center max-w-sm">
              {draw.numbers.map((n, i) => (
                <SlotNumber
                  key={n}
                  target={n}
                  min={draw.min}
                  max={draw.max}
                  delay={i * 200}
                  active={slotActive}
                />
              ))}
            </div>

            <p className="text-retro-dim text-[7px] tracking-widest">
              RANGO: {draw.min} — {draw.max}
            </p>
          </div>
        )}

        {/* New game */}
        <button
          onClick={() => navigate('/')}
          className="text-retro-dim hover:text-neon-green font-pixel text-[8px] border border-retro-border hover:border-neon-green/50 px-4 py-2 transition-all tracking-widest"
        >
          + NUEVO SORTEO
        </button>
      </main>

      <footer className="border-t-2 border-retro-border px-4 py-3">
        <p className="text-retro-dim text-[7px] text-center tracking-widest">
          © SORTEOLINK · SEED: {draw.uuid.slice(0, 8).toUpperCase()}
        </p>
      </footer>
    </div>
  )
}
