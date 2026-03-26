/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#1A1A2E', 50:'#f0f0ff', 100:'#e0e0fe', 500:'#1A1A2E', 600:'#16213E', 700:'#0F3460' },
        accent:   { DEFAULT: '#E94560', 50:'#fff0f3', 500:'#E94560', 600:'#c73350' },
        surface:  { DEFAULT: '#16213E', light:'#1A1A2E', card:'#0F3460' },
        neon:     { green:'#00D68F', blue:'#00B4D8', amber:'#FFB703' },
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
      boxShadow: { card: '0 4px 24px rgba(0,0,0,0.4)', glow: '0 0 20px rgba(233,69,96,0.3)' }
    }
  },
  plugins: []
}
