/**
 * Design Tokens Iqra
 * Sesuai Bagian 5: Fresh, Friendly, Modern Premium E-Commerce / Grocery Style
 * Lime-green gradient, soft shadows, large rounded corners, WCAG AA compliant
 */

export const colors = {
  light: {
    background: '#F6F8F5',
    surface: '#FFFFFF',
    surface2: '#F1F4EF',
    surfaceAlt: '#F1F4EF',
    border: '#E6EBE4',
    text: '#1A2118',
    textPrimary: '#1A2118',
    textMuted: '#6B7769',
    textSecondary: '#6B7769',
    primary: '#6CC51D',
    primaryLight: '#AEDC81',
    primaryGradient: 'linear-gradient(100deg, #AEDC81 0%, #6CC51D 100%)',
    primaryText: '#37800A',
    onPrimary: '#0B2A05',
    accent: '#F5A524',
    accentSoft: '#FFF4D6',
    success: '#1FA35C',
    warning: '#F5A524',
    danger: '#E5484D',
    info: '#3B82F6',
    pastel: {
      green: '#E8F6DA',
      orange: '#FFE9E4',
      yellow: '#FFF4D6',
      purple: '#EFE7FB',
      cyan: '#DDF4F8',
      pink: '#FFE4EE',
      blue: '#E1EEFF',
    },
  },
  dark: {
    background: '#0E140F',
    surface: '#161E17',
    surface2: '#1D271E',
    surfaceAlt: '#1D271E',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#EEF4EC',
    textPrimary: '#EEF4EC',
    textMuted: '#9BA99A',
    textSecondary: '#9BA99A',
    primary: '#7FD63A',
    primaryLight: '#8BD655',
    primaryGradient: 'linear-gradient(100deg, #8BD655 0%, #5DB81A 100%)',
    primaryText: '#9BE35B',
    onPrimary: '#08200A',
    accent: '#F5A524',
    accentSoft: 'rgba(245, 165, 36, 0.16)',
    success: '#1FA35C',
    warning: '#F5A524',
    danger: '#E5484D',
    info: '#3B82F6',
    pastel: {
      green: 'rgba(232, 246, 218, 0.16)',
      orange: 'rgba(255, 233, 228, 0.16)',
      yellow: 'rgba(255, 244, 214, 0.16)',
      purple: 'rgba(239, 231, 251, 0.16)',
      cyan: 'rgba(221, 244, 248, 0.16)',
      pink: 'rgba(255, 228, 238, 0.16)',
      blue: 'rgba(225, 238, 255, 0.16)',
    },
  },
} as const;

export const shadows = {
  light: {
    subtle: '0 2px 8px rgba(30, 60, 10, 0.04)',
    elevated: '0 8px 24px rgba(30, 60, 10, 0.08)',
    card: '0 8px 24px rgba(30, 60, 10, 0.08)',
    glow: '0 8px 20px rgba(108, 197, 29, 0.25)',
  },
  dark: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.35)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.5)',
    card: '0 4px 16px rgba(0, 0, 0, 0.45)',
    glow: '0 8px 20px rgba(127, 214, 58, 0.2)',
  },
} as const;

export const radii = {
  button: '14px',
  input: '14px',
  sm: '10px',
  card: '20px',
  sheet: '28px',
  pill: '9999px',
} as const;
