import { router } from 'expo-router';
import { Heart, UtensilsCrossed } from 'lucide-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, GhostButton, GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { dishImg } from '@/constants/dish-images';
import { ITEMS } from '@/constants/menu-data';
import { useFavorites } from '@/context/favorites-context';

export default function FavoriteMealsScreen() {
  const theme = useZoneGardenTheme();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteItems = ITEMS.filter((i) => favorites.includes(i.id));

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader title="Favorite Meals" onBack={() => router.back()} />

        <View style={styles.content}>
          {favoriteItems.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              sub="Tap the heart on any dish to save it here."
            />
          ) : (
            <View style={styles.list}>
              {favoriteItems.map((item) => (
                <GlassPanel key={item.id} style={styles.card}>
                  <View style={styles.row}>
                    <Pressable
                      onPress={() => router.push(`/item/${item.id}`)}
                      style={styles.itemPressable}>
                      <Image source={dishImg(item)} style={styles.image} resizeMode="cover" />
                      <View style={styles.textCol}>
                        <Text
                          style={[F_BODY, styles.name, { color: theme.text }]}
                          numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={[F_BODY, styles.price, { color: theme.ember }]}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => toggleFavorite(item.id)} hitSlop={8}>
                      <Heart size={18} color={theme.ember} fill={theme.ember} />
                    </Pressable>
                  </View>
                </GlassPanel>
              ))}
            </View>
          )}

          <GhostButton full onPress={() => router.push('/(tabs)/menu')} style={styles.browseButton}>
            <View style={styles.browseRow}>
              <UtensilsCrossed size={15} color={theme.text} />
              <Text style={[F_BODY, styles.browseText, { color: theme.text }]}>
                Browse Menu to Add Favorites
              </Text>
            </View>
          </GhostButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  price: {
    fontSize: 12,
    marginTop: 2,
  },
  browseButton: {
    marginTop: 4,
  },
  browseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  browseText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
