/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform, useColorScheme, type TextStyle, type ViewStyle } from 'react-native';
import { useMemo } from 'react';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Zone Garden design system — ported from design-reference/ZoneGardensApp.jsx.
 * Kept separate from the Colors/Fonts scaffolding above so the default Expo
 * starter screens keep working untouched while the real app is built out.
 */

const ZG_FONT = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const F_DISPLAY: TextStyle = {
  fontFamily: ZG_FONT,
  fontWeight: '800',
  letterSpacing: -0.4,
};

export const F_BODY: TextStyle = {
  fontFamily: ZG_FONT,
};

export const F_LABEL: TextStyle = {
  fontFamily: ZG_FONT,
  fontWeight: '600',
  letterSpacing: 1.2,
  textTransform: 'uppercase',
};

type ZoneGardenPalette = {
  bg: string;
  bgGradientColors: [string, string, string];
  card: string;
  cardStrong: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  text2: string;
  gold: string;
  goldSoft: string;
  goldDeep: string;
  ember: string;
  onyx: string;
  divider: string;
  navBg: string;
  shadow: ViewStyle;
};

export const ZoneGardenColors: { light: ZoneGardenPalette; dark: ZoneGardenPalette } = {
  dark: {
    bg: '#111111',
    bgGradientColors: ['#173322', '#111111', '#111111'],
    card: 'rgba(27,27,27,0.62)',
    cardStrong: 'rgba(27,27,27,0.82)',
    cardBorder: 'rgba(255,255,255,0.10)',
    text: '#FFFFFF',
    textMuted: '#A6A6A6',
    text2: '#E3E3E3',
    gold: '#22B455',
    goldSoft: '#3ED676',
    goldDeep: '#17903F',
    ember: '#E0B84A',
    onyx: '#111111',
    divider: 'rgba(255,255,255,0.08)',
    navBg: 'rgba(17,17,17,0.72)',
    shadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 32,
      elevation: 12,
    },
  },
  light: {
    bg: '#F8F6F1',
    bgGradientColors: ['#EAF3EA', '#F8F6F1', '#F8F6F1'],
    card: 'rgba(255,255,255,0.18)',
    cardStrong: 'rgba(255,255,255,0.55)',
    cardBorder: 'rgba(255,255,255,0.45)',
    text: '#222222',
    textMuted: '#6B6B66',
    text2: '#3C3C38',
    gold: '#138A36',
    goldSoft: '#1FAE49',
    goldDeep: '#0E5F2A',
    ember: '#D8A12B',
    onyx: '#111111',
    divider: 'rgba(34,34,34,0.08)',
    navBg: 'rgba(255,255,255,0.55)',
    shadow: {
      shadowColor: '#222222',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 28,
      elevation: 6,
    },
  },
};

export type ZoneGardenTheme = ZoneGardenPalette & { isDark: boolean };

/**
 * Mirrors the web app's `useTheme(isDark)` — pass `isDark` explicitly to
 * control it from in-app state, or omit it to follow the system scheme.
 */
export function useZoneGardenTheme(isDark?: boolean): ZoneGardenTheme {
  const scheme = useColorScheme();
  const resolvedIsDark = isDark ?? scheme === 'dark';

  return useMemo(
    () => ({
      isDark: resolvedIsDark,
      ...(resolvedIsDark ? ZoneGardenColors.dark : ZoneGardenColors.light),
    }),
    [resolvedIsDark],
  );
}
