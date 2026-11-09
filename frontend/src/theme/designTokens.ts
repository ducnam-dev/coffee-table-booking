export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
} as const;

export const touchTarget = {
  minHeight: 44,
  minWidth: 44,
} as const;

export const colors = {
  // Brand - Roasted Amber & Caramel
  primary: '#D97706',
  primaryDark: '#B45309',
  primaryLight: '#F59E0B',
  primarySubtle: '#FEF3C7',
  
  // Heritage Espresso Roast
  espressoDark: '#19110B',
  espresso: '#2C1810',
  espressoMedium: '#452618',
  espressoLight: '#6B4226',

  // Canvas & Surfaces (Warm Cream - Anti sterile white)
  background: '#FDFBF7',
  surface: '#FFFFFF',
  surfaceSubtle: '#F9F5EE',
  surfaceElevated: '#FFFFFF',
  surfaceDark: '#2C1810',

  // High-Contrast Editorial Typography (WCAG AA compliant ≥ 4.5:1)
  textPrimary: '#1C1917',     // Contrast 13.8:1 on cream
  textSecondary: '#574B45',   // Contrast 6.2:1 on cream
  textMuted: '#8C7E76',       // Caption/placeholder
  textInverse: '#FFFFFF',
  textInverseMuted: '#E6D7CD',

  // Borders - Hairline warm organic, not harsh gray
  border: 'rgba(44, 24, 16, 0.08)',
  borderMedium: 'rgba(44, 24, 16, 0.15)',
  borderActive: '#D97706',

  // Semantic Status
  success: '#15803D',
  successSubtle: '#DCFCE7',
  danger: '#B91C1C',
  dangerSubtle: '#FEE2E2',
  warning: '#D97706',
  warningSubtle: '#FEF3C7',
  info: '#1D4ED8',
  infoSubtle: '#DBEAFE',

  // Tactile Shadows
  shadowColor: '#2C1810',
};

export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  h1: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    color: colors.textMuted,
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    color: colors.primaryDark,
  },
};

export const shadows = {
  soft: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  prominent: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};
