/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196F3',
          dark: '#1976D2',
          light: '#E3F2FD',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        'text-primary': '#212121',
        'text-secondary': '#757575',
      },
      spacing: {
        'small': '8px',
        'medium': '16px',
        'large': '24px',
        'xlarge': '32px',
      },
    },
  },
  plugins: [],
}

