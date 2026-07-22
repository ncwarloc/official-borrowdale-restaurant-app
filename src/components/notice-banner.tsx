import { StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/glass-panel';
import { BottomTabInset, F_BODY, useZoneGardenTheme } from '@/constants/theme';
import { useNotice } from '@/context/notice-context';

export function NoticeBanner() {
  const { notice } = useNotice();
  const theme = useZoneGardenTheme();

  if (!notice) return null;

  return (
    <View style={[styles.wrap, { bottom: BottomTabInset + 16 }]} pointerEvents="none">
      <GlassPanel strong style={styles.panel}>
        <Text style={[F_BODY, styles.text, { color: theme.text }]}>{notice}</Text>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 50,
  },
  panel: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 12.5,
  },
});
