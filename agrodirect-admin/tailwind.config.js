/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // AgroDirect design tokens — deep field-green + harvest-gold,
        // deliberately avoiding the generic cream/terracotta AI default.
        canopy: {
          950: '#0E2B22',
          900: '#123A2E',
          800: '#1B4D3C',
          700: '#236249',
          600: '#2C7A58',
          500: '#3B9469',
        },
        harvest: {
          400: '#E8B94A',
          500: '#D9A22E',
          600: '#B9821F',
        },
        soil: {
          50: '#FAF9F6',
          100: '#F2F0EA',
          200: '#E5E2D9',
          300: '#CFCABB',
          600: '#6B6455',
          700: '#4A4538',
          800: '#332F26',
          900: '#211E17',
        },
        signal: {
          success: '#2C7A58',
          warning: '#B9821F',
          danger: '#B3402C',
          info: '#2E6FB9',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(33,30,23,0.06), 0 1px 8px rgba(33,30,23,0.04)',
      },
    },
  },
  plugins: [],
}
