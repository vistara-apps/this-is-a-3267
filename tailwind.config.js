/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(215 20% 10%)',
        text: 'hsl(0 0% 95%)',
        muted: 'hsl(0 0% 65%)',
        accent: 'hsl(160 100% 40%)',
        primary: 'hsl(210 95% 55%)',
        surface: 'hsl(215 15% 15%)',
        border: 'hsl(215 15% 20%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(0, 0%, 0%, 0.1)',
        'modal': '0 12px 36px hsla(0, 0%, 0%, 0.16)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
    },
  },
  plugins: [],
}
