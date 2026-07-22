import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { F_BODY, F_DISPLAY, useZoneGardenTheme } from '@/constants/theme';

export type EmptyStateProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  sub: string;
};

export function EmptyState({ icon: Icon, title, sub }: EmptyStateProps) {
  const theme = useZoneGardenTheme();

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconBadge, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Icon size={28} color={theme.gold} />
      </View>
      <Text style={[F_DISPLAY, styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[F_BODY, styles.sub, { color: theme.textMuted }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  sub: {
    fontSize: 12.5,
    marginTop: 4,
    textAlign: 'center',
  },
});
