
import { MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#174C3C',
  secondary: '#D9A86C',
  background: '#F8F6F0',
  surface: '#FFFFFF',
  text: '#202A25',
  muted: '#858C86',
  border: '#E8E6DF',
  danger: '#D9534F',
  success: '#39845D',
};

const nestoraTheme = {
  ...MD3LightTheme,
  roundness: 14,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    onSurface: COLORS.text,
    onBackground: COLORS.text,
    outline: COLORS.border,
    error: COLORS.danger,
  },
};

export default nestoraTheme;
