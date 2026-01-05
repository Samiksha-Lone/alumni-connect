export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        primaryDark: '#1d4ed8',
        bgLight: '#f8fafc',
        bgDark: '#020617', // Matches the deeper black in the new CSS
        cardLight: '#ffffff',
        cardDark: '#0f172a',
        customBorder: 'rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      // Adding custom box shadows here allows you to use 'shadow-premium'
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};