// src/constants/theme.ts
export const Colors = {
  // Brand
  brand: {
    50:  '#eff8ff',
    100: '#dbeffe',
    300: '#93d0fc',
    400: '#5fb4f8',
    500: '#3b94f4',
    600: '#1e6fe8',
    700: '#1657d5',
  },
  teal: {
    400: '#1be3cc',
    500: '#02c9b3',
    600: '#01a193',
  },
  // Neutral
  slate: {
    50:  '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Semantic
  green:  { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  red:    { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626' },
  amber:  { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706' },
  violet: { 50: '#f5f3ff', 100: '#ede9fe', 500: '#8b5cf6', 600: '#7c3aed' },
  rose:   { 50: '#fff1f2', 100: '#ffe4e6', 500: '#f43f5e', 600: '#e11d48' },

  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const Gradients = {
  brand:    ['#1e6fe8', '#02c9b3'] as const,
  dark:     ['#0f172a', '#1e293b'] as const,
  card:     ['#ffffff', '#f8fafc'] as const,
  teal:     ['#02c9b3', '#1e6fe8'] as const,
  premium:  ['#7c3aed', '#1e6fe8'] as const,
  sunrise:  ['#f59e0b', '#ef4444'] as const,
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
} as const;

export const FontSize = {
  xs:   11,
  sm:   13,
  base: 14,
  md:   15,
  lg:   16,
  xl:   18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 38,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  brand: {
    shadowColor: '#1e6fe8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  teal: {
    shadowColor: '#02c9b3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
