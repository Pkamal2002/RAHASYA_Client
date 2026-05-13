/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0b10',
          dark: '#12141d',
          blue: '#00d2ff',
          neon: '#39ff14',
          purple: '#bc13fe',
          gray: '#1e2029',
          border: '#2a2d3d'
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #12141d 0%, #1e2029 100%)',
        'neon-glow': 'radial-gradient(circle, rgba(57, 255, 20, 0.2) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}
