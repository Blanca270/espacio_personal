export const colors = {
  primary: { 50: '#f1f6f3', 100: '#dfeae3', 500: '#3d6353', 600: '#2f4f43', 700: '#1f3a31' },
  secondary: { 100: '#e1ebf4', 700: '#2e4a5f' },
  accent: { 100: '#f4ead0', 700: '#7a5d1e' },
  success: { 100: '#dcf1e3', 700: '#1f6236' },
  warning: { 100: '#fdf3dc', 300: '#f0dca6', 700: '#7a5c12' },
  error: { 100: '#fbe6e3', 700: '#9a2f23' },
  neutral: {
    0: '#ffffff',
    50: '#f6f7f5',
    100: '#eceff0',
    200: '#dde3de',
    300: '#c9d1ca',
    500: '#5f6e67',
    700: '#3e4c45',
    900: '#16201c',
  },
} as const;

export const fonts = {
  regular: 'Inter-Regular',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

export const spacing = { xs: 8, sm: 16, md: 24, lg: 32 } as const;

export const radius = { sm: 12, md: 16, lg: 20, pill: 999 } as const;

export const shadows = {
  card: '0px 1px 2px rgba(22, 32, 28, 0.04), 0px 8px 24px rgba(22, 32, 28, 0.05)',
  raised: '0px 16px 48px rgba(22, 32, 28, 0.2)',
  button: '0px 6px 16px rgba(31, 58, 49, 0.22)',
  focus: '0px 0px 0px 4px rgba(47, 79, 67, 0.14)',
} as const;
