import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, ChevronRight, Search, Sparkles, Tag, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { FoodCard, GlassPanel, Pill, Row } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_DISPLAY, F_LABEL, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { dishImg } from '@/constants/dish-images';
import { CATEGORIES, CHEF_RECOMMENDATION, ITEMS, type MenuItem } from '@/constants/menu-data';

const HERO_SLIDES: { source: ImageSourcePropType; sub: string }[] = [
  { source: require('@/assets/images/dishes/home-photo-1.jpg'), sub: 'An evening at Zone Garden' },
  { source: require('@/assets/images/dishes/home-photo-2.jpg'), sub: 'Chicken, fries & garden salad' },
  { source: require('@/assets/images/dishes/home-photo-3.jpg'), sub: 'Sadza, stewed meat & greens' },
  { source: require('@/assets/images/dishes/home-photo-4.jpg'), sub: 'Smoothies, juices & mocktails' },
  { source: require('@/assets/images/dishes/home-photo-5.jpg'), sub: 'Handcrafted, made to order' },
  { source: require('@/assets/images/dishes/home-photo-6.jpg'), sub: 'Built for sharing' },
  { source: require('@/assets/images/dishes/home-photo-7.jpg'), sub: 'The people behind Zone Garden' },
  { source: require('@/assets/images/dishes/photo-img-025.jpg'), sub: 'Garden-to-table dining in Borrowdale' },
  { source: require('@/assets/images/dishes/photo-img-002.jpg'), sub: 'Fresh off the grill, every day' },
  { source: require('@/assets/images/dishes/photo-img-012.jpg'), sub: 'Authentic Zimbabwean dishes' },
];

const HERO_SLIDE_INTERVAL = 4000;
const HERO_FADE_DURATION = 1400;
const HERO_ZOOM_DURATION = 9000;

const SPECIALS_IDS = ['m3', 't2', 'sa1', 'pl2', 'ps6'];
const POPULAR_IDS = ['m16', 'm4', 'm22', 'pl1'];
const ARRIVALS_IDS = ['t1', 't5', 't8'];

const specials = ITEMS.filter((i) => SPECIALS_IDS.includes(i.id));
const popular = ITEMS.filter((i) => POPULAR_IDS.includes(i.id));
const arrivals = ITEMS.filter((i) => ARRIVALS_IDS.includes(i.id));
const quickChips = CATEGORIES.filter((c) => c.id !== 'experience' && c.id !== 'kidcamp');

function HeroSlide({ source, active }: { source: ImageSourcePropType; active: boolean }) {
  const opacity = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0, {
      duration: HERO_FADE_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
  }, [active, opacity]);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.09, { duration: HERO_ZOOM_DURATION, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const theme = useZoneGardenTheme();
  const insets = useSafeAreaInsets();

  const catHour = (new Date().getUTCHours() + 2) % 24; // Central Africa Time (UTC+2)
  const greeting = catHour < 12 ? 'Good morning' : 'Good evening';

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), HERO_SLIDE_INTERVAL);
    return () => clearInterval(iv);
  }, []);

  const [favorites, setFavorites] = useState<string[]>([]);
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const q = searchQuery.trim().toLowerCase();
  const searchResults =
    q.length > 0
      ? ITEMS.filter(
          (i) => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q),
        ).slice(0, 8)
      : [];

  const closeSearch = () => setSearchQuery('');

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: insets.bottom + BottomTabInset + Spacing.three,
        }}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 14 }]}>
          <View style={styles.headerLeft}>
            <Image source={require('@/assets/images/logo.png')} style={styles.headerLogo} />
            <View>
              <Text style={[F_LABEL, styles.greeting, { color: theme.gold }]}>{greeting}</Text>
              <Text style={[F_DISPLAY, styles.brand, { color: theme.text }]}>Zone Garden</Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            style={[
              styles.bellButton,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Bell size={18} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Search size={17} color={theme.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search dishes, drinks, platters…"
              placeholderTextColor={theme.textMuted}
              style={[F_BODY, styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={closeSearch} hitSlop={8}>
                <X size={16} color={theme.textMuted} />
              </Pressable>
            )}
          </View>

          {q.length > 0 && (
            <View
              style={[
                styles.searchDropdown,
                {
                  borderColor: theme.cardBorder,
                  backgroundColor: theme.isDark ? '#1B1B1B' : '#FFFFFF',
                },
              ]}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {searchResults.length === 0 ? (
                  <Text style={[F_BODY, styles.noResults, { color: theme.textMuted }]}>
                    No dishes match &quot;{searchQuery}&quot;
                  </Text>
                ) : (
                  searchResults.map((item, i) => (
                    <Pressable
                      key={item.id}
                      onPress={closeSearch}
                      style={[
                        styles.resultRow,
                        i < searchResults.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: theme.cardBorder,
                        },
                      ]}>
                      <Image source={dishImg(item)} style={styles.resultThumb} resizeMode="cover" />
                      <Text
                        style={[F_BODY, styles.resultName, { color: theme.text }]}
                        numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={[F_BODY, styles.resultPrice, { color: theme.ember }]}>
                        ${item.price.toFixed(2)}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.hero}>
            {HERO_SLIDES.map((s, i) => (
              <HeroSlide key={i} source={s.source} active={i === slide} />
            ))}
            <LinearGradient
              colors={['rgba(0,0,0,0.10)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.72)']}
              locations={[0, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroDots}>
              {HERO_SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.heroDot,
                    {
                      width: i === slide ? 16 : 6,
                      backgroundColor: i === slide ? '#3ED676' : 'rgba(255,255,255,0.5)',
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.heroContent}>
              <Text style={[F_LABEL, styles.heroSub]}>{HERO_SLIDES[slide].sub}</Text>
              <Text style={[F_DISPLAY, styles.heroTitle]}>
                Experience Luxury Dining{'\n'}in Borrowdale.
              </Text>
              <Pressable style={styles.orderButton}>
                <LinearGradient
                  colors={[theme.goldSoft, theme.gold, theme.goldDeep]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.orderButtonGradient}>
                  <Sparkles size={15} color="#FFFFFF" />
                  <Text style={[F_BODY, styles.orderButtonText]}>Order Now</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          {quickChips.map((c) => (
            <Pill key={c.id} style={styles.chip}>
              {c.name}
            </Pill>
          ))}
        </ScrollView>

        <Row title="Today's Specials">
          {specials.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              image={dishImg(item)}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </Row>

        {CHEF_RECOMMENDATION && (
          <View style={styles.chefWrap}>
            <ChefRecommendationCard item={CHEF_RECOMMENDATION} />
          </View>
        )}

        <Row title="Most Popular">
          {popular.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              image={dishImg(item)}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </Row>

        <Row title="New Arrivals">
          {arrivals.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              image={dishImg(item)}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </Row>

        <View style={styles.promoWrap}>
          <GlassPanel style={styles.promoPanel}>
            <LinearGradient
              colors={
                theme.isDark
                  ? ['rgba(34,180,85,0.16)', 'rgba(224,184,74,0.10)']
                  : ['rgba(19,138,54,0.14)', 'rgba(216,161,43,0.10)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.promoHeader}>
              <Tag size={15} color={theme.gold} />
              <Text style={[F_LABEL, styles.promoLabel, { color: theme.gold }]}>
                Saturday Promotion
              </Text>
            </View>
            <Text style={[F_DISPLAY, styles.promoTitle, { color: theme.text }]}>
              Free Car Wash with Any $10+ Order
            </Text>
            <Text style={[F_BODY, styles.promoBody, { color: theme.textMuted }]}>
              Every Saturday — buy any food item from $10 and get a free carwash package. No code
              needed.
            </Text>
          </GlassPanel>
        </View>
      </ScrollView>
    </View>
  );
}

function ChefRecommendationCard({ item }: { item: MenuItem }) {
  const theme = useZoneGardenTheme();

  return (
    <GlassPanel style={styles.chefPanel}>
      <View style={styles.chefRow}>
        <Image source={dishImg(item)} style={styles.chefImage} resizeMode="cover" />
        <View style={styles.chefTextCol}>
          <Text style={[F_LABEL, styles.chefLabel, { color: theme.gold }]}>
            Chef&apos;s Recommendation
          </Text>
          <Text style={[F_BODY, styles.chefName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[F_BODY, styles.chefDesc, { color: theme.textMuted }]} numberOfLines={1}>
            {item.desc}
          </Text>
        </View>
        <View style={styles.chefRight}>
          <Text style={[F_BODY, styles.chefPrice, { color: theme.ember }]}>
            ${item.price.toFixed(2)}
          </Text>
          <ChevronRight size={18} color={theme.textMuted} />
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 10.5,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    padding: 0,
  },
  searchDropdown: {
    position: 'absolute',
    top: 54,
    left: 20,
    right: 20,
    zIndex: 30,
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: 320,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
  },
  noResults: {
    fontSize: 12.5,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resultThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  resultName: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
  },
  resultPrice: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroWrap: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  hero: {
    height: 300,
    borderRadius: 28,
    overflow: 'hidden',
  },
  heroDots: {
    position: 'absolute',
    top: 16,
    right: 20,
    flexDirection: 'row',
    gap: 6,
  },
  heroDot: {
    height: 6,
    borderRadius: 999,
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  heroSub: {
    fontSize: 10,
    color: '#3ED676',
  },
  heroTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 4,
    lineHeight: 25,
  },
  orderButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  orderButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 999,
    shadowColor: '#138A36',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  orderButtonText: {
    fontWeight: '700',
    fontSize: 13.5,
    color: '#FFFFFF',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  chip: {
    flexShrink: 0,
  },
  chefWrap: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  chefPanel: {
    padding: 16,
  },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chefImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  chefTextCol: {
    flex: 1,
  },
  chefLabel: {
    fontSize: 10,
  },
  chefName: {
    fontWeight: '700',
    fontSize: 14,
  },
  chefDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  chefRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  chefPrice: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  promoWrap: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  promoPanel: {
    padding: 18,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  promoLabel: {
    fontSize: 10.5,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  promoBody: {
    fontSize: 12.5,
    marginTop: 2,
  },
});
