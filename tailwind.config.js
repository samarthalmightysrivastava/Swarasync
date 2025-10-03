/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Newsreader', 'Cormorant Garamond', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        // Moon/Idā palette
        moon: {
          900: '#0E2A36',
          700: '#0F5962', 
          500: '#3BB5AD',
          300: '#CFE6E2',
          100: '#E9F5F3'
        },
        // Sun/Piṅgalā palette
        sun: {
          900: '#2C1A00',
          700: '#8B4B00',
          500: '#F6A43A', 
          300: '#FFD79A',
          100: '#FFF3E1'
        },
        // Central/Suṣumnā palette
        central: {
          900: '#201532',
          700: '#5E46A6',
          500: '#A78BFA',
          300: '#EDE9FE',
          100: '#FFFFFF'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite alternate',
        'glow': 'glow 1.5s ease-in-out infinite alternate'
      },
      keyframes: {
        shimmer: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor' }
        }
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}