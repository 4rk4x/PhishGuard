/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#101827', // Deep navy primary background
          dark: '#0A0F1D',    // Deepest backdrop
          surface: '#152033', // Elevated surface/cards
          card: '#18243A',    // Card background
          border: '#24344D',  // Clean subtle borders
          muted: '#8192A9',   // Subdued secondary text
        },
        electric: {
          DEFAULT: '#27D17F', // Electric green primary accent
          hover: '#1FB86C',
          glow: 'rgba(39, 209, 127, 0.15)',
          subtle: '#123B2B',
        },
        offwhite: '#F8FAFC',  // Crisp white primary text/contrast
        threat: {
          safe: '#27D17F',
          suspicious: '#F59E0B',
          phishing: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'cyber': '0 0 25px -5px rgba(39, 209, 127, 0.25)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

