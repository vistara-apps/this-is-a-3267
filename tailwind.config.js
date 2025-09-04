/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'hsl(215 20% 10%)',
          secondary: 'hsl(215 18% 12%)',
          tertiary: 'hsl(215 16% 14%)',
        },
        text: {
          DEFAULT: 'hsl(0 0% 95%)',
          secondary: 'hsl(0 0% 85%)',
          tertiary: 'hsl(0 0% 75%)',
        },
        muted: {
          DEFAULT: 'hsl(0 0% 65%)',
          light: 'hsl(0 0% 75%)',
          dark: 'hsl(0 0% 55%)',
        },
        accent: {
          DEFAULT: 'hsl(160 100% 40%)',
          light: 'hsl(160 100% 50%)',
          dark: 'hsl(160 100% 30%)',
          subtle: 'hsl(160 50% 20%)',
        },
        primary: {
          DEFAULT: 'hsl(210 95% 55%)',
          light: 'hsl(210 95% 65%)',
          dark: 'hsl(210 95% 45%)',
          subtle: 'hsl(210 50% 25%)',
        },
        surface: {
          DEFAULT: 'hsl(215 15% 15%)',
          elevated: 'hsl(215 15% 18%)',
          hover: 'hsl(215 15% 20%)',
        },
        border: {
          DEFAULT: 'hsl(215 15% 25%)',
          light: 'hsl(215 15% 30%)',
          dark: 'hsl(215 15% 20%)',
        },
        success: 'hsl(142 76% 36%)',
        warning: 'hsl(38 92% 50%)',
        error: 'hsl(0 84% 60%)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(0, 0%, 0%, 0.15)',
        'card-hover': '0 8px 24px hsla(0, 0%, 0%, 0.2)',
        'modal': '0 12px 36px hsla(0, 0%, 0%, 0.25)',
        'glow': '0 0 20px hsla(160, 100%, 40%, 0.3)',
        'glow-primary': '0 0 20px hsla(210, 95%, 55%, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}
