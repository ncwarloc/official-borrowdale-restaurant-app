import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { F_BODY, F_DISPLAY, useZoneGardenTheme } from '@/constants/theme';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  const theme = useZoneGardenTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: insets.top + 14 }]}>
      <View style={styles.left}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <ChevronLeft size={26} color={theme.text} />
          </Pressable>
        )}
        <View>
          <Text style={[F_DISPLAY, styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[F_BODY, styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
});
