import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Flame, Heart, Plus } from 'lucide-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { dishImg } from '@/constants/dish-images';
import { CATEGORIES, ITEMS, type MenuItem } from '@/constants/menu-data';
import { useFavorites } from '@/context/favorites-context';

const UNBUILT_CATEGORIES = new Set(['experience', 'kidcamp']);

export default function CategoryListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useZoneGardenTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const category = CATEGORIES.find((c) => c.id === id);
  const items = category ? ITEMS.filter((i) => i.cat === category.id) : [];

  if (!category) return null;

  if (UNBUILT_CATEGORIES.has(category.id)) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.bg }]}>
        <ScreenHeader title={category.name} onBack={() => router.back()} />
        <View style={styles.comingSoon}>
          <Text style={[F_BODY, { color: theme.textMuted }]}>Coming soon</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader
          title={category.name}
          subtitle={`${items.length} items`}
          onBack={() => router.back()}
        />
        <View style={styles.list}>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ItemRow({
  item,
  isFavorite,
  onToggleFavorite,
}: {
  item: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const theme = useZoneGardenTheme();
  const truncatedDesc = item.desc.length > 70 ? `${item.desc.slice(0, 70)}…` : item.desc;

  return (
    <GlassPanel onPress={() => router.push(`/item/${item.id}`)} style={styles.row}>
      <View style={styles.rowInner}>
        <View style={styles.thumbWrap}>
          <Image source={dishImg(item)} style={styles.thumb} resizeMode="cover" />
          <LinearGradient
            colors={
              theme.isDark
                ? ['rgba(0,0,0,0.28)', 'rgba(0,0,0,0)']
                : ['rgba(0,0,0,0.16)', 'rgba(0,0,0,0)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0.4, y: 1 }}
            locations={[0, 0.55]}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.thumbRing,
              { borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
            ]}
          />
        </View>
        <View style={styles.rowBody}>
          <View style={styles.rowTop}>
            <Text style={[F_BODY, styles.name, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Pressable onPress={onToggleFavorite} hitSlop={8}>
              <Heart
                size={16}
                color={isFavorite ? theme.gold : theme.textMuted}
                fill={isFavorite ? theme.gold : 'transparent'}
              />
            </Pressable>
          </View>
          <Text style={[F_BODY, styles.desc, { color: theme.textMuted }]}>{truncatedDesc}</Text>
          <View style={styles.rowFooter}>
            <Text style={[F_BODY, styles.price, { color: theme.ember }]}>
              ${item.price.toFixed(2)}
            </Text>
            <View style={styles.rowFooterRight}>
              {item.spice > 0 && (
                <View style={styles.flames}>
                  {Array.from({ length: item.spice }).map((_, i) => (
                    <Flame key={i} size={12} color={theme.ember} />
                  ))}
                </View>
              )}
              <Pressable style={styles.addButton}>
                <LinearGradient
                  colors={[theme.goldSoft, theme.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}>
                  <Plus size={14} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  row: {
    padding: 10,
  },
  rowInner: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbWrap: {
    width: 88,
    height: 88,
    borderRadius: 16,
    overflow: 'hidden',
    flexShrink: 0,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  rowBody: {
    flex: 1,
    paddingVertical: 2,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontWeight: '700',
    fontSize: 14,
  },
  desc: {
    fontSize: 11.5,
    marginTop: 3,
    lineHeight: 15,
  },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  rowFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flames: {
    flexDirection: 'row',
    gap: 2,
  },
  addButton: {
    width: 26,
    height: 26,
  },
  addButtonGradient: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
