import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          alt: 'var(--surface-alt)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          pressed: 'var(--primary-pressed)',
          soft: 'var(--primary-soft)',
          text: 'var(--primary-text)',
        },
        'on-primary': 'var(--on-primary)',
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        pastel: {
          green: 'var(--pastel-green)',
          orange: 'var(--pastel-orange)',
          yellow: 'var(--pastel-yellow)',
          purple: 'var(--pastel-purple)',
          cyan: 'var(--pastel-cyan)',
          pink: 'var(--pastel-pink)',
          blue: 'var(--pastel-blue)',
          'green-text': 'var(--pastel-green-text)',
          'orange-text': 'var(--pastel-orange-text)',
          'yellow-text': 'var(--pastel-yellow-text)',
          'purple-text': 'var(--pastel-purple-text)',
          'cyan-text': 'var(--pastel-cyan-text)',
          'pink-text': 'var(--pastel-pink-text)',
          'blue-text': 'var(--pastel-blue-text)',
        },
      },
      backgroundImage: {
        'primary-gradient': 'var(--primary-gradient)',
      },
      borderRadius: {
        button: 'var(--radius-button)',
        input: 'var(--radius-input)',
        sm: '10px',
        card: 'var(--radius-card)',
        sheet: 'var(--radius-sheet)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        elevated: 'var(--shadow-elevated)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'Amiri Quran', 'serif'],
      },
      maxWidth: {
        content: '1120px',
        reading: '760px',
      },
    },
  },
  plugins: [],
};

export default config;
