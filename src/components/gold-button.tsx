import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useZoneGardenTheme } from '@/constants/theme';

export type GoldButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function GoldButton({ children, onPress, disabled = false, full = false, style }: GoldButtonProps) {
  const theme = useZoneGardenTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        full && styles.full,
        { transform: [{ scale: pressed && !disabled ? 0.97 : 1 }] },
        style,
      ]}
    >
      {disabled ? (
        <View
          style={[
            styles.pill,
            styles.row,
            { backgroundColor: theme.isDark ? '#3A362A' : '#DED6BB' },
          ]}
        >
          {children}
        </View>
      ) : (
        <LinearGradient
          colors={[theme.goldSoft, theme.gold, theme.goldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pill, styles.row, styles.shadow]}
        >
          {children}
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  full: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pill: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  shadow: {
    shadowColor: '#138A36',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 26,
    elevation: 8,
  },
});
