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
        pitch: {
          dark: '#0a0e17',
          card: '#111827',
          surface: '#182234',
          accent: '#10b981',      // Emerald Green
          accentHover: '#059669',
          gold: '#f59e0b',        // Draw / Gold accent
          cyan: '#06b6d4',        // Away / Stats accent
          danger: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
