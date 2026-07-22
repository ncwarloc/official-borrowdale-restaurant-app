import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { F_DISPLAY, F_LABEL, useZoneGardenTheme } from '@/constants/theme';

export type RowProps = {
  title: string;
  onSeeAll?: () => void;
  children: ReactNode;
};

export function Row({ title, onSeeAll, children }: RowProps) {
  const theme = useZoneGardenTheme();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[F_DISPLAY, styles.title, { color: theme.text }]}>{title}</Text>
        <Pressable onPress={onSeeAll}>
          <Text style={[F_LABEL, styles.seeAll, { color: theme.gold }]}>See all</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 10,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
});
