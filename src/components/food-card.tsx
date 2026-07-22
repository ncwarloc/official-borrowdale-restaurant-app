import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Plus } from 'lucide-react-native';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { GlassPanel } from '@/components/glass-panel';
import { F_BODY, useZoneGardenTheme } from '@/constants/theme';

export type FoodCardItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
};

export type FoodCardProps = {
  item: FoodCardItem;
  image: ImageSourcePropType;
  onOpen?: (item: FoodCardItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onQuickAdd?: (item: FoodCardItem) => void;
  wide?: boolean;
};

export function FoodCard({
  item,
  image,
  onOpen,
  isFavorite = false,
  onToggleFavorite,
  onQuickAdd,
  wide = false,
}: FoodCardProps) {
  const theme = useZoneGardenTheme();

  return (
    <GlassPanel
      onPress={() => onOpen?.(item)}
      style={[styles.card, wide ? styles.wide : styles.fixed]}>
      <View style={styles.imageWrap}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <Pressable
          onPress={() => onToggleFavorite?.(item.id)}
          hitSlop={8}
          style={styles.favButton}>
          <Heart
            size={15}
            color={isFavorite ? '#3ED676' : '#FFFFFF'}
            fill={isFavorite ? '#3ED676' : 'transparent'}
          />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={[F_BODY, styles.name, { color: theme.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[F_BODY, styles.desc, { color: theme.textMuted }]} numberOfLines={2}>
          {item.desc}
        </Text>
        <View style={styles.footer}>
          <Text style={[F_BODY, styles.price, { color: theme.ember }]}>
            ${item.price.toFixed(2)}
          </Text>
          <Pressable onPress={() => onQuickAdd?.(item)} hitSlop={8}>
            <LinearGradient
              colors={[theme.goldSoft, theme.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButton}>
              <Plus size={14} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  fixed: {
    width: 168,
  },
  wide: {
    width: '100%',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 118,
    borderRadius: 18,
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(10,10,12,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 4,
  },
  name: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  desc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14.5,
    height: 28,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  addButton: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
