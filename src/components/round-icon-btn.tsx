import type { ComponentType } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useZoneGardenTheme } from '@/constants/theme';

export type RoundIconBtnProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress?: () => void;
};

export function RoundIconBtn({ icon: Icon, onPress }: RoundIconBtnProps) {
  const theme = useZoneGardenTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
        { transform: [{ scale: pressed ? 0.9 : 1 }] },
      ]}>
      <Icon size={15} color={theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
