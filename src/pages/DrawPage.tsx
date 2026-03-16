import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check, Plus, Shuffle } from 'lucide-react'
import { decodeDraw, buildDrawURL } from '../services/drawService'
import type { DrawConfig } from '../types'

function useCountdown(drawAt: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, drawAt - Date.now()))

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => {
      const r = Math.max(0, drawAt - Date.now())
      setRemaining(r)
    }, 250)
    return () => clearInterval(id)
  }, [drawAt])

  return remaining
}

function pad(n: number) { return String(Math.floor(n)).padStart(2, '0') }

function CountdownDisplay({ ms }: { ms: number }) {
  const totalSecs = ms / 1000
  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)
  const s = Math.floor(totalSecs % 60)

  return (
    <div className="flex items-end justify-center gap-1 font-mono">
      {h > 0 && (
        <>
          <Unit value={pad(h)} label="h" />
          <span className="text-slate-600 text-3xl mb-4">:</span>
        </>
      )}
      <Unit value={pad(m)} label="min" />
      <span className="text-slate-600 text-3xl mb-4">:</span>
      <Unit value={pad(s)} label="seg" />
    </div>
  )
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl font-bold text-white tabular-nums leading-none">{value}</span>
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </div>
  )
}

function NumberBall({ n, delay = 0 }: { n: number; delay?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-brand-600 text-white font-bold shadow-lg shadow-brand-900/50 animate-pop-in"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        width: n > 999 ? '5.5rem' : n > 99 ? '4.5rem' : '4rem',
        height: n > 999 ? '5.5rem' : n > 99 ? '4.5rem' : '4rem',
        fontSize: n > 9999 ? '1.1rem' : n > 999 ? '1.25rem' : n > 99 ? '1.5rem' : '1.75rem',
      }}
    >
      {n}
    </div>
  )
}

function CopyButton({ draw }: { draw: DrawConfig }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildDrawURL(draw))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
    >
      {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
      {copied ? 'Copiado' : 'Copiar link'}
    </button>
  )
}

export function DrawPage() {
  const navigate = useNavigate()
  const hash = window.location.hash.slice(1)
  const draw = useRef<DrawConfig | null>(decodeDraw(hash)).current
  const remaining = useCountdown(draw?.drawAt ?? 0)
  const revealed = remaining <= 0

  if (!draw) {
    return (
      <div className="min-h-screen bg-surface text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Link inválido o caducado.</p>
        <button onClick={() => navigate('/')} className="text-brand-400 hover:underline text-sm">Crear nuevo sorteo</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col">
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <Shuffle size={18} className="text-brand-400" />
            <span className="font-bold">SorteoLink</span>
          </button>
          <CopyButton draw={draw} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-10">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{draw.title}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {draw.count === 1
              ? `1 número entre ${draw.min} y ${draw.max}`
              : `${draw.count} números entre ${draw.min} y ${draw.max}`}
          </p>
        </div>

        {/* Countdown / Result */}
        {!revealed ? (
          <div className="flex flex-col items-center gap-6">
            <div className="bg-surface-card border border-slate-700 rounded-3xl px-10 py-8 flex flex-col items-center gap-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest">Revelando en</p>
              <CountdownDisplay ms={remaining} />
            </div>
            <p className="text-slate-600 text-xs">Los números ya están generados — sellados hasta el momento del sorteo</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              {draw.numbers.length === 1 ? 'Número ganador' : 'Números ganadores'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {draw.numbers.map((n, i) => (
                <NumberBall key={n} n={n} delay={i * 150} />
              ))}
            </div>
            <p className="text-slate-600 text-xs">
              Rango: {draw.min} – {draw.max}
            </p>
          </div>
        )}

        {/* New draw */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-400 transition-colors text-sm"
        >
          <Plus size={15} />
          Crear otro sorteo
        </button>
      </main>
    </div>
  )
}
