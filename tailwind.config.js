/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono:  ['"VT323"', 'monospace'],
      },
      colors: {
        retro: {
          bg:      '#070710',
          surface: '#0d0d1a',
          card:    '#111128',
          border:  '#1e1e4a',
          dim:     '#3a3a6a',
        },
        neon: {
          green:  '#00ff41',
          pink:   '#ff006e',
          cyan:   '#00f5ff',
          yellow: '#ffe600',
          purple: '#bf00ff',
        },
      },
      animation: {
        'blink':      'blink 1s step-end infinite',
        'glitch':     'glitch 3s infinite',
        'scanline':   'scanline 8s linear infinite',
        'slot-spin':  'slot-spin 0.08s linear infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'pop-in':     'pop-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        'flicker':    'flicker 0.15s infinite',
      },
      keyframes: {
        blink:      { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        glitch: {
          '0%,90%,100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-3px, 1px)', filter: 'hue-rotate(90deg)' },
          '94%': { transform: 'translate(3px, -1px)', filter: 'hue-rotate(-90deg)' },
          '96%': { transform: 'translate(0)', filter: 'none' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'neon-pulse': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.7' },
        },
        'pop-in': {
          '0%':   { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)',   opacity: '1' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.85' },
        },
      },
      boxShadow: {
        'neon-green':  '0 0 8px #00ff41, 0 0 20px #00ff4140',
        'neon-pink':   '0 0 8px #ff006e, 0 0 20px #ff006e40',
        'neon-cyan':   '0 0 8px #00f5ff, 0 0 20px #00f5ff40',
        'neon-yellow': '0 0 8px #ffe600, 0 0 20px #ffe60040',
        'pixel':       '4px 4px 0 #000',
      },
    },
  },
  plugins: [],
}
