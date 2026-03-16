import type { DrawConfig } from '../types'

/** Genera N números únicos aleatorios en [min, max] */
function randomNumbers(min: number, max: number, count: number): number[] {
  const range = max - min + 1
  if (count > range) count = range

  const pool = Array.from({ length: range }, (_, i) => min + i)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count).sort((a, b) => a - b)
}

export function createDraw(
  title: string,
  min: number,
  max: number,
  count: number,
  delayMinutes: number,
): DrawConfig {
  return {
    uuid: crypto.randomUUID(),
    title: title.trim(),
    min,
    max,
    count,
    drawAt: Date.now() + delayMinutes * 60 * 1000,
    numbers: randomNumbers(min, max, count),
  }
}

export function encodeDraw(draw: DrawConfig): string {
  return btoa(encodeURIComponent(JSON.stringify(draw)))
}

export function decodeDraw(hash: string): DrawConfig | null {
  try {
    return JSON.parse(decodeURIComponent(atob(hash))) as DrawConfig
  } catch {
    return null
  }
}

export function buildDrawURL(draw: DrawConfig): string {
  const base = `${window.location.origin}/draw/${draw.uuid}`
  return `${base}#${encodeDraw(draw)}`
}
