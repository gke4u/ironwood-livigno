import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          DEFAULT: '#4A3728',
          light: '#6B5140',
          dark: '#332619'
        },
        cream: '#EFE6D8',
        brick: '#A8462F',
        gold: '#C9A059',
        ink: '#241C15',
        mist: '#F7F3EC'
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-poppins)', 'sans-serif']
      },
      maxWidth: {
        content: '1280px'
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(36, 28, 21, 0.35)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.12) translate(-1.2%, -1%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeIn: 'fadeIn 0.8s ease forwards',
        kenburns: 'kenburns 22s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
export default config;
