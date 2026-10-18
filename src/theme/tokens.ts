/**
 * Design Tokens Iqra
 * Berdasarkan PRD Bagian 6.2 dan 6.3
 * 100% Flat Solid Colors
 */

export const colors = {
  light: {
    background: '#F6F4EE',
    surface: '#FFFFFF',
    surfaceAlt: '#EDEAE0',
    primary: '#1E6B57',
    primaryPressed: '#175846',
    primarySoft: '#DCEBE4',
    accent: '#B38B3A',
    textPrimary: '#17302A',
    textSecondary: '#5E726B',
    border: '#E1DDD0',
    success: '#2E8B57',
    warning: '#C98A1B',
    danger: '#C0483D',
  },
  dark: {
    background: '#0D1613',
    surface: '#15211D',
    surfaceAlt: '#1D2C27',
    primary: '#4FB596',
    primaryPressed: '#3E9A7E',
    primarySoft: '#1E3A31',
    accent: '#D2AE5E',
    textPrimary: '#E9F0ED',
    textSecondary: '#9DB0A9',
    border: '#26362F',
    success: '#4CC38A',
    warning: '#E0A93B',
    danger: '#E36B5F',
  },
} as const;

export const shadows = {
  light: {
    subtle: '0 2px 8px rgba(23,48,42,0.06)',
    elevated: '0 8px 24px rgba(23,48,42,0.10)',
  },
  dark: {
    subtle: '0 2px 6px rgba(0,0,0,0.25)',
    elevated: '0 4px 12px rgba(0,0,0,0.35)',
  },
} as const;

export const radii = {
  sm: '10px',
  card: '16px',
  sheet: '24px',
  pill: '9999px',
} as const;
