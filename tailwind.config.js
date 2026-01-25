/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          green: '#2d5016',
          line: '#ffffff',
        },
        team: {
          home: '#1e40af',
          away: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
