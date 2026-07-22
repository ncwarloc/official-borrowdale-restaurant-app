import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { F_LABEL, useZoneGardenTheme } from '@/constants/theme';

export type PillProps = {
  children: ReactNode;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Pill({ children, active = false, onPress, style }: PillProps) {
  const theme = useZoneGardenTheme();

  if (active) {
    return (
      <Pressable onPress={onPress} style={style}>
        <LinearGradient
          colors={[theme.goldSoft, theme.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pill}>
          <Text style={[F_LABEL, styles.text, { color: '#FFFFFF' }]}>{children}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder },
        style,
      ]}>
      <Text style={[F_LABEL, styles.text, { color: theme.text2 }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
  },
});
