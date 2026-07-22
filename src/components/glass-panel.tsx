import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useZoneGardenTheme, ZoneGardenColors } from '@/constants/theme';

export type GlassPanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Use the stronger (less see-through) glass tint, e.g. for modals. */
  strong?: boolean;
  /** Force the dark glass treatment regardless of the current theme — used
   * for panels placed over photos/dark hero backgrounds. */
  forceDark?: boolean;
  intensity?: number;
  onPress?: () => void;
};

export function GlassPanel({ children, style, strong = false, forceDark = false, intensity = 40, onPress }: GlassPanelProps) {
  const theme = useZoneGardenTheme();
  const isDark = forceDark || theme.isDark;
  const palette = isDark ? ZoneGardenColors.dark : ZoneGardenColors.light;
  const flatStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
  const radius = typeof flatStyle?.borderRadius === 'number' ? flatStyle.borderRadius : 26;

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.base,
        { borderRadius: radius, borderColor: palette.cardBorder },
        palette.shadow,
        style,
      ]}
    >
      <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: strong ? palette.cardStrong : palette.card, borderRadius: radius },
        ]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={
          isDark
            ? ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0)']
            : ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 26,
    borderWidth: 1,
  },
});
