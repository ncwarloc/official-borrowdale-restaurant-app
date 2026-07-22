import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Award, Check, ChevronLeft, Clock, Flame, Heart, Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassPanel, GoldButton, MetaChip, RoundIconBtn } from '@/components/zone-garden';
import { F_BODY, F_DISPLAY, F_LABEL, useZoneGardenTheme } from '@/constants/theme';
import { dishImg } from '@/constants/dish-images';
import { ITEMS, type MenuItemAddon } from '@/constants/menu-data';
import { useCart } from '@/context/cart-context';
import { useFavorites } from '@/context/favorites-context';

function spiceLabel(spice: number): string {
  if (spice === 0) return 'Mild';
  if (spice === 1) return 'Light spice';
  if (spice === 2) return 'Medium spice';
  return 'Very spicy';
}

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useZoneGardenTheme();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const item = ITEMS.find((i) => i.id === id);

  const [qty, setQty] = useState(1);
  const [addons, setAddons] = useState<MenuItemAddon[]>([]);
  const [instructions, setInstructions] = useState('');

  if (!item) return null;

  const handleAddToCart = () => {
    if (addToCart(item, qty, addons, instructions)) {
      router.dismissTo('/(tabs)/cart');
    }
  };

  const addonTotal = addons.reduce((s, a) => s + a.p, 0);
  const total = (item.price + addonTotal) * qty;

  const toggleAddon = (a: MenuItemAddon) => {
    setAddons((prev) =>
      prev.find((x) => x.n === a.n) ? prev.filter((x) => x.n !== a.n) : [...prev, a],
    );
  };

  const pairings = ITEMS.filter((i) => item.pairings.includes(i.id));

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.heroWrap}>
          <Image source={dishImg(item)} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.05)']}
            locations={[0, 0.3, 1]}
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            onPress={() => router.back()}
            style={[styles.heroButton, { top: insets.top + 12, left: 20 }]}>
            <ChevronLeft size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(item.id)}
            style={[styles.heroButton, { top: insets.top + 12, right: 20 }]}>
            <Heart
              size={19}
              color={isFavorite(item.id) ? '#3ED676' : '#FFFFFF'}
              fill={isFavorite(item.id) ? '#3ED676' : 'transparent'}
            />
          </Pressable>
        </View>

        <GlassPanel strong style={styles.infoPanel}>
          <View style={styles.titleRow}>
            <Text style={[F_DISPLAY, styles.name, { color: theme.text }]}>{item.name}</Text>
            <Text style={[F_DISPLAY, styles.price, { color: theme.ember }]}>
              ${item.price.toFixed(2)}
            </Text>
          </View>
          <Text style={[F_BODY, styles.desc, { color: theme.text2 }]}>{item.desc}</Text>

          <View style={styles.metaRow}>
            <MetaChip icon={Clock} label={item.prep} />
            {item.cal > 0 && <MetaChip icon={Award} label={`${item.cal} kcal`} />}
            <MetaChip icon={Flame} label={spiceLabel(item.spice)} highlight={item.spice >= 2} />
          </View>

          <View style={styles.section}>
            <Text style={[F_LABEL, styles.sectionLabel, { color: theme.textMuted }]}>
              Ingredients
            </Text>
            <View style={styles.ingredientsRow}>
              {item.ingredients.map((ing) => (
                <View
                  key={ing}
                  style={[
                    styles.ingredientPill,
                    { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  ]}>
                  <Text style={[F_BODY, styles.ingredientText, { color: theme.text2 }]}>
                    {ing}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {item.addons.length > 0 && (
            <View style={styles.section}>
              <Text style={[F_LABEL, styles.sectionLabel, { color: theme.textMuted }]}>
                Add-ons
              </Text>
              <View style={styles.addonsCol}>
                {item.addons.map((a) => {
                  const selected = addons.some((x) => x.n === a.n);
                  return (
                    <Pressable
                      key={a.n}
                      onPress={() => toggleAddon(a)}
                      style={[
                        styles.addonRow,
                        {
                          backgroundColor: selected
                            ? theme.isDark
                              ? 'rgba(34,180,85,0.16)'
                              : 'rgba(19,138,54,0.12)'
                            : theme.card,
                          borderColor: selected ? theme.gold : theme.cardBorder,
                        },
                      ]}>
                      <Text style={[F_BODY, styles.addonName, { color: theme.text }]}>{a.n}</Text>
                      <View style={styles.addonRight}>
                        <Text style={[F_BODY, styles.addonPrice, { color: theme.ember }]}>
                          {a.p > 0 ? `+$${a.p.toFixed(2)}` : 'Free'}
                        </Text>
                        <View
                          style={[
                            styles.addonCheckbox,
                            {
                              borderColor: selected ? theme.gold : theme.textMuted,
                              backgroundColor: selected ? theme.gold : 'transparent',
                            },
                          ]}>
                          {selected && <Check size={13} color="#FFFFFF" />}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[F_LABEL, styles.sectionLabel, { color: theme.textMuted }]}>
              Special instructions
            </Text>
            <TextInput
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. no onions, extra sauce…"
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={2}
              style={[
                F_BODY,
                styles.instructions,
                { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text },
              ]}
            />
          </View>

          <View style={styles.qtyRow}>
            <Text style={[F_LABEL, styles.sectionLabel, { color: theme.textMuted }]}>
              Quantity
            </Text>
            <View style={styles.qtyControls}>
              <RoundIconBtn icon={Minus} onPress={() => setQty((v) => Math.max(1, v - 1))} />
              <Text style={[F_BODY, styles.qtyValue, { color: theme.text }]}>{qty}</Text>
              <RoundIconBtn icon={Plus} onPress={() => setQty((v) => v + 1)} />
            </View>
          </View>

          {pairings.length > 0 && (
            <View style={styles.pairingsSection}>
              <Text style={[F_LABEL, styles.sectionLabel, { color: theme.textMuted }]}>
                Suggested pairings
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pairingsRow}>
                  {pairings.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => router.push(`/item/${p.id}`)}
                      style={[
                        styles.pairingCard,
                        { backgroundColor: theme.card, borderColor: theme.cardBorder },
                      ]}>
                      <Image source={dishImg(p)} style={styles.pairingImage} resizeMode="cover" />
                      <View>
                        <Text
                          style={[F_BODY, styles.pairingName, { color: theme.text }]}
                          numberOfLines={1}>
                          {p.name}
                        </Text>
                        <Text style={[F_BODY, styles.pairingPrice, { color: theme.ember }]}>
                          ${p.price.toFixed(2)}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </GlassPanel>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <LinearGradient
          colors={['transparent', theme.bg]}
          locations={[0, 0.3]}
          style={StyleSheet.absoluteFill}
        />
        <GoldButton full onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart · ${total.toFixed(2)}</Text>
        </GoldButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  heroWrap: {
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(10,10,12,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPanel: {
    marginTop: -28,
    marginHorizontal: 14,
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  desc: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 10.5,
    marginBottom: 8,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  ingredientText: {
    fontSize: 11.5,
  },
  addonsCol: {
    gap: 8,
  },
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  addonName: {
    fontSize: 13,
  },
  addonRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addonPrice: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  addonCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    minHeight: 56,
    textAlignVertical: 'top',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyValue: {
    fontWeight: '700',
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  pairingsSection: {
    marginTop: 24,
  },
  pairingsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pairingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  pairingImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  pairingName: {
    fontSize: 12,
    fontWeight: '700',
  },
  pairingPrice: {
    fontSize: 11,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  addToCartText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
