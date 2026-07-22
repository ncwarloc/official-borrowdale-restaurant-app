import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { catImg } from '@/constants/dish-images';
import { CATEGORIES, ITEMS } from '@/constants/menu-data';

export default function MenuScreen() {
  const theme = useZoneGardenTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader title="Menu" subtitle="Browse by category" />
        <View style={styles.grid}>
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const count = ITEMS.filter((i) => i.cat === c.id).length;
            return (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/category/${c.id}`)}
                style={styles.tileWrap}>
                <GlassPanel style={styles.tile}>
                  <View style={styles.tileImageWrap}>
                    <Image source={catImg(c)} style={styles.tileImage} resizeMode="cover" />
                    <View style={styles.tileImageScrim} />
                    <View style={styles.tileIconBadge}>
                      <Icon size={15} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.tileBody}>
                    <Text
                      style={[F_BODY, styles.tileName, { color: theme.text }]}
                      numberOfLines={2}>
                      {c.name}
                    </Text>
                    <Text style={[F_BODY, styles.tileCount, { color: theme.textMuted }]}>
                      {count ? `${count} items` : 'Explore'}
                    </Text>
                  </View>
                </GlassPanel>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  tileWrap: {
    width: '46%',
    flexGrow: 1,
  },
  tile: {
    padding: 0,
    overflow: 'hidden',
  },
  tileImageWrap: {
    position: 'relative',
    height: 100,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileImageScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  tileIconBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileBody: {
    padding: 12,
  },
  tileName: {
    fontWeight: '700',
    fontSize: 12.5,
    lineHeight: 16,
  },
  tileCount: {
    fontSize: 11,
    marginTop: 2,
  },
});
