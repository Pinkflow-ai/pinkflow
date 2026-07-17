/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff4da6',
          dark: '#ff70b8',
        },
        'bg-dark': '#120d1a',
        'bg-card': '#1a1226',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 28px rgb(255 77 166 / 0.18)',
        'pink-glow': '0 0 16px rgb(255 77 166 / 0.2)',
      },
    },
  },
  plugins: [],
};
