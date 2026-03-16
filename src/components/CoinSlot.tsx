import { useState, useEffect, useRef } from 'react'

/* ── Web Audio coin sound ─────────────────────────────────── */
function playCoinSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

    const tone = (freq: number, start: number, dur: number, type: OscillatorType = 'square') => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.18, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur + 0.01)
    }

    // Clásico sonido moneda arcade: dos notas ascendentes + brillo
    tone(659,  0,     0.08)  // E5  — golpe inicial
    tone(988,  0.08,  0.18)  // B5  — tono alto (Mario coin)
    tone(1318, 0.08,  0.06, 'sine') // brillo metálico superpuesto
  } catch {}
}

/* ── Pixel coin SVG ───────────────────────────────────────── */
function PixelCoin({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="28" height="28" viewBox="0 0 28 28"
      className={`transition-transform ${spinning ? 'animate-coin-spin' : ''}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Shadow */}
      <rect x="5" y="24" width="18" height="2" rx="1" fill="#000" fillOpacity="0.3" />
      {/* Coin body */}
      <circle cx="14" cy="13" r="11" fill="#ffe600" />
      <circle cx="14" cy="13" r="9"  fill="#ffd000" />
      {/* Pixel border */}
      <circle cx="14" cy="13" r="11" fill="none" stroke="#b8860b" strokeWidth="1.5" />
      {/* $ symbol */}
      <text x="14" y="17.5" textAnchor="middle" fontSize="11" fontWeight="bold"
        fill="#b8860b" fontFamily="monospace">$</text>
      {/* Shine */}
      <ellipse cx="10" cy="9" rx="3" ry="1.5" fill="#fff" fillOpacity="0.35" transform="rotate(-30 10 9)" />
    </svg>
  )
}

/* ── Pixel machine slot ───────────────────────────────────── */
function PixelMachine() {
  return (
    <svg width="64" height="36" viewBox="0 0 64 36" style={{ imageRendering: 'pixelated' }}>
      {/* Machine body */}
      <rect x="4"  y="8"  width="56" height="24" rx="2" fill="#1a1a3e" stroke="#00f5ff" strokeWidth="1.5" />
      {/* Screen / decoration */}
      <rect x="8"  y="12" width="20" height="14" rx="1" fill="#0d0d1a" stroke="#00f5ff88" strokeWidth="1" />
      <rect x="10" y="14" width="16" height="10" fill="#00f5ff11" />
      {/* Tiny neon lines on screen */}
      <line x1="11" y1="17" x2="25" y2="17" stroke="#00f5ff" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="11" y1="20" x2="22" y2="20" stroke="#00f5ff" strokeWidth="0.7" strokeOpacity="0.5" />
      {/* Coin slot label */}
      <text x="48" y="20" textAnchor="middle" fontSize="4" fill="#ffe600" fontFamily="monospace" fontWeight="bold">COIN</text>
      {/* Coin slot opening */}
      <rect x="38" y="22" width="20" height="3"  rx="0" fill="#0a0a1a" stroke="#ffe600" strokeWidth="1" />
      <rect x="42" y="23" width="12" height="1.5" fill="#000" />
      {/* Buttons */}
      <circle cx="34" cy="26" r="2.5" fill="#ff006e" stroke="#ff006e88" strokeWidth="1" />
      <circle cx="40" cy="26" r="2.5" fill="#00ff41" stroke="#00ff4188" strokeWidth="1" />
      {/* Legs */}
      <rect x="10" y="30" width="6" height="5" rx="1" fill="#0d0d1a" stroke="#1e1e4a" strokeWidth="1" />
      <rect x="48" y="30" width="6" height="5" rx="1" fill="#0d0d1a" stroke="#1e1e4a" strokeWidth="1" />
      {/* Neon top trim */}
      <rect x="4" y="6" width="56" height="4" rx="2" fill="#00f5ff22" stroke="#00f5ff" strokeWidth="1" />
      <text x="32" y="10" textAnchor="middle" fontSize="4" fill="#00f5ff" fontFamily="monospace">SORTEOLINK</text>
    </svg>
  )
}

/* ── Main component ───────────────────────────────────────── */
interface CoinSlotProps {
  children: React.ReactNode
}

export function CoinSlot({ children }: CoinSlotProps) {
  const [hovered,  setHovered]  = useState(false)
  const [phase,    setPhase]    = useState<'idle' | 'fall' | 'insert' | 'done'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = [] }

  useEffect(() => {
    if (hovered) {
      clear()
      setPhase('fall')
      playCoinSound()

      const t1 = setTimeout(() => setPhase('insert'), 500)
      const t2 = setTimeout(() => setPhase('done'),   800)
      const t3 = setTimeout(() => setPhase('idle'),  1400)
      timerRef.current = [t1, t2, t3]
    } else {
      clear()
      setPhase('idle')
    }
    return clear
  }, [hovered])

  // Coin transform based on phase
  const coinStyle: React.CSSProperties = (() => {
    switch (phase) {
      case 'idle':   return { opacity: 0,   transform: 'translateY(-30px) scaleX(1)',   transition: 'none' }
      case 'fall':   return { opacity: 1,   transform: 'translateY(0px) scaleX(1)',     transition: 'transform 0.45s cubic-bezier(0.55,0,1,0.45), opacity 0.1s' }
      case 'insert': return { opacity: 0.6, transform: 'translateY(8px) scaleX(0.15)', transition: 'transform 0.28s ease-in, opacity 0.28s' }
      case 'done':   return { opacity: 0,   transform: 'translateY(12px) scaleX(0)',   transition: 'opacity 0.15s' }
    }
  })()

  // Sparkles on insert
  const showSpark = phase === 'insert' || phase === 'done'

  return (
    <div
      className="relative inline-flex flex-col items-center cursor-default select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* The text */}
      <span className={`transition-colors duration-150 ${hovered ? 'text-neon-yellow' : ''}`}
        style={hovered ? { color: '#ffe600', textShadow: '0 0 8px #ffe60080' } : {}}>
        {children}
      </span>

      {/* Floating machine + coin popup */}
      {phase !== 'idle' && (
        <div className="absolute bottom-full mb-2 flex flex-col items-center pointer-events-none"
          style={{ filter: 'drop-shadow(0 0 6px #00f5ff66)' }}>

          {/* Sparkles */}
          {showSpark && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-1 text-neon-yellow text-xs animate-ping" style={{ animationDuration: '0.3s' }}>
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
          )}

          {/* Coin — positioned above the slot */}
          <div style={{ ...coinStyle, marginBottom: '-4px', zIndex: 10 }}>
            <PixelCoin spinning={phase === 'fall'} />
          </div>

          {/* Machine */}
          <PixelMachine />
        </div>
      )}
    </div>
  )
}
