import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { F_BODY, useZoneGardenTheme } from '@/constants/theme';

export type MetaChipProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  highlight?: boolean;
};

export function MetaChip({ icon: Icon, label, highlight = false }: MetaChipProps) {
  const theme = useZoneGardenTheme();

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}>
      <Icon size={13} color={highlight ? theme.ember : theme.text2} />
      <Text style={[F_BODY, styles.label, { color: highlight ? theme.ember : theme.text2 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 11.5,
  },
});
