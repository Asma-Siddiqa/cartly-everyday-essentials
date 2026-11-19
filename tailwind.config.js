/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#72AEFE',
          'blue-strong': '#1F5FAE',
          'blue-soft': '#EAF3FF',
          charcoal: '#2A2D34',
          ink: '#17191E',
          navy: '#16324F',
          cream: '#FAF7F2',
          coral: '#FF8A65',
          sun: '#FFD166',
          mint: '#58C9A3',
          rose: '#FBE4E7',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 18px 45px -28px rgba(42, 45, 52, 0.35)',
        lift: '0 24px 55px -24px rgba(42, 45, 52, 0.35)',
        focus: '0 0 0 4px rgba(114, 174, 254, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        shell: '80rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-up': 'fade-up 450ms ease-out both',
        'soft-pulse': 'soft-pulse 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
