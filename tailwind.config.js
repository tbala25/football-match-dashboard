/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Pitch colors
        pitch: {
          green: '#2d5016',
          dark: '#1a3009',
          line: '#ffffff',
        },
        // Team defaults
        team: {
          home: '#1e40af',
          away: '#dc2626',
        },
        // Semantic colors for match status
        live: '#ef4444',
        win: '#22c55e',
        draw: '#6b7280',
        loss: '#ef4444',
        // Card colors
        card: {
          yellow: '#fbbf24',
          red: '#ef4444',
        },
      },
      animation: {
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        'ping-slow': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fill-bar': 'fillBar 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'goal-pulse': 'goalPulse 0.6s ease-out',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        goalPulse: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '50%': { transform: 'scale(1.1)', boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 16px -4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px -8px rgba(0, 0, 0, 0.15), 0 12px 32px -12px rgba(0, 0, 0, 0.15)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'pitch-texture': 'linear-gradient(135deg, #2d5016 0%, #1a3009 50%, #2d5016 100%)',
      },
    },
  },
  plugins: [],
}
