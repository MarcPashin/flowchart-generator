/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#4F46E5', // Indigo for primary actions
            light: '#818CF8',
            dark: '#3730A3',
            50: '#EEF2FF',
            100: '#E0E7FF',
          },
          secondary: {
            DEFAULT: '#10B981', // Emerald for secondary actions
            light: '#34D399',
            dark: '#059669',
            50: '#ECFDF5',
            100: '#D1FAE5',
          },
          accent: {
            DEFAULT: '#F59E0B', // Amber for accent/highlight
            light: '#FBBF24',
            dark: '#D97706',
            50: '#FFFBEB',
            100: '#FEF3C7',
          },
          dark: {
            DEFAULT: '#1A1B1E',
            lighter: '#2C2E33',
            darker: '#18191C',
          },
          light: {
            DEFAULT: '#FFFFFF',
            darker: '#F1F3F5',
            lighter: '#FFFFFF',
          },
          gray: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
        },
        boxShadow: {
          'soft': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
          'hover': '0 8px 16px rgba(0, 0, 0, 0.1)',
          'pressed': '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
        },
      },
    },
    plugins: [],
  }