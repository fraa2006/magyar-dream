/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hungarian: {
          red:   '#CE2939',
          green: '#477050',
          white: '#FFFFFF',
        },
        brand: {
          primary:   '#CE2939',
          secondary: '#477050',
          gold:      '#B45309',
          dark:      '#F1F5F9',
          card:      '#FFFFFF',
          border:    '#E2E8F0',
          muted:     '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'hungarian-flag': 'linear-gradient(180deg, #CE2939 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #477050 66.6%)',
      },
    },
  },
  plugins: [],
};
