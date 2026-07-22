import { router } from 'expo-router';
import {
  Check,
  Clock,
  MapPin,
  MessageSquareText,
  Navigation,
  PartyPopper,
  Phone,
  Star,
  Trophy,
  User,
  Users,
  UtensilsCrossed,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  FieldInput,
  FieldSelect,
  GhostButton,
  GlassPanel,
  GoldButton,
  ScreenHeader,
} from '@/components/zone-garden';
import { F_BODY, F_LABEL, useZoneGardenTheme } from '@/constants/theme';
import {
  RESTAURANT_ADDRESS,
  RESTAURANT_PHONE_DISPLAY,
  RESTAURANT_WHATSAPP,
} from '@/constants/restaurant';

const REXP_SLIDES: ImageSourcePropType[] = [
  require('@/assets/images/dishes/rexp-photo-1.jpg'),
  require('@/assets/images/dishes/rexp-photo-2.jpg'),
];
const REXP3_PHOTO_1 = require('@/assets/images/dishes/rexp3-photo-1.jpg');
const REXP3_PHOTO_2 = require('@/assets/images/dishes/rexp3-photo-2.jpg');
const REXP3_PHOTO_3 = require('@/assets/images/dishes/rexp3-photo-3.jpg');
const REXP3_PHOTO_4 = require('@/assets/images/dishes/rexp3-photo-4.jpg');

const SLIDE_INTERVAL = 4000;
const FADE_DURATION = 1200;
const ZOOM_DURATION = 5000;

const EVENT_TYPES = [
  'Casual Dining',
  'Birthday Celebration',
  'Corporate Event',
  'Anniversary',
  'Family Gathering',
  'Other',
];
const MEAL_PLANS = [
  'A La Carte (order from menu)',
  'Platter Package',
  'Set Menu',
  'Drinks & Mocktails Only',
  'Full Dining Experience',
];

const AWARDS = ['Best Garden Dining 2025', 'Green Kitchen Award'];

const REVIEWS: { name: string; rating: number; comment: string }[] = [
  { name: 'Rudo M.', rating: 5, comment: 'The platters are unmatched — worth every point of loyalty.' },
  { name: 'James T.', rating: 5, comment: 'Best cocktail bar in Harare, hands down.' },
];

function ExperienceSlide({ source, active }: { source: ImageSourcePropType; active: boolean }) {
  const opacity = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(active ? 1.04 : 1);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0, {
      duration: FADE_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
    scale.value = withTiming(active ? 1.04 : 1, {
      duration: ZOOM_DURATION,
      easing: Easing.out(Easing.ease),
    });
  }, [active, opacity, scale]);

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

type ReservationForm = {
  eventType: string;
  date: string;
  time: string;
  guests: string;
  mealPlan: string;
  name: string;
  phone: string;
  notes: string;
};

const INITIAL_RESERVATION: ReservationForm = {
  eventType: EVENT_TYPES[0],
  date: '',
  time: '',
  guests: '',
  mealPlan: MEAL_PLANS[0],
  name: '',
  phone: '',
  notes: '',
};

export default function RestaurantExperienceScreen() {
  const theme = useZoneGardenTheme();

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSlide((s) => (s + 1) % REXP_SLIDES.length), SLIDE_INTERVAL);
    return () => clearInterval(iv);
  }, []);

  const [showReserve, setShowReserve] = useState(false);
  const [resSent, setResSent] = useState(false);
  const [res, setRes] = useState<ReservationForm>(INITIAL_RESERVATION);
  const update = <K extends keyof ReservationForm>(key: K) => (value: string) =>
    setRes((r) => ({ ...r, [key]: value }));
  const resReady = !!(res.date && res.time && res.guests && res.name && res.phone);

  const sendReservation = () => {
    const message = `Reservation Request — Zone Garden

Name: ${res.name}
Phone: ${res.phone}
Event Type: ${res.eventType}
Date: ${res.date}
Time: ${res.time}
Number of People: ${res.guests}
Meal Plan: ${res.mealPlan}
Special Requests: ${res.notes || 'None'}`;
    Linking.openURL(`https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`);
    setResSent(true);
  };

  const openDirections = () => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(RESTAURANT_ADDRESS)}&travelmode=driving`,
    );
  };

  const closeReserve = () => {
    setShowReserve(false);
    setResSent(false);
  };

  if (showReserve) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.bg }]}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <ScreenHeader title="Book a Reservation" subtitle="Sent to us via WhatsApp" onBack={closeReserve} />
          <View style={styles.content}>
            {resSent ? (
              <GlassPanel strong style={styles.sentPanel}>
                <Check size={30} color={theme.gold} style={styles.sentIcon} />
                <Text style={[F_BODY, styles.sentTitle, { color: theme.text }]}>Request sent</Text>
                <Text style={[F_BODY, styles.sentSub, { color: theme.textMuted }]}>
                  Continue the conversation on WhatsApp — we&apos;ll confirm availability there.
                </Text>
                <GhostButton full style={styles.sentButton} onPress={closeReserve}>
                  <Text style={[F_BODY, styles.ghostButtonText, { color: theme.text }]}>
                    Back to Restaurant Experience
                  </Text>
                </GhostButton>
              </GlassPanel>
            ) : (
              <View style={styles.formCol}>
                <FieldSelect
                  icon={PartyPopper}
                  value={res.eventType}
                  onChange={update('eventType')}
                  options={EVENT_TYPES}
                />
                <View style={styles.formRow}>
                  <FieldInput
                    icon={Clock}
                    placeholder="Date"
                    value={res.date}
                    onChangeText={update('date')}
                    style={styles.formHalf}
                  />
                  <FieldInput
                    icon={Clock}
                    placeholder="Time"
                    value={res.time}
                    onChangeText={update('time')}
                    style={styles.formHalf}
                  />
                </View>
                <FieldInput
                  icon={Users}
                  placeholder="Number of people"
                  value={res.guests}
                  onChangeText={update('guests')}
                  keyboardType="number-pad"
                />
                <FieldSelect
                  icon={UtensilsCrossed}
                  value={res.mealPlan}
                  onChange={update('mealPlan')}
                  options={MEAL_PLANS}
                />
                <FieldInput icon={User} placeholder="Your name" value={res.name} onChangeText={update('name')} />
                <FieldInput
                  icon={Phone}
                  placeholder="Phone number"
                  value={res.phone}
                  onChangeText={update('phone')}
                  keyboardType="phone-pad"
                />
                <TextInput
                  value={res.notes}
                  onChangeText={update('notes')}
                  placeholder="Special requests (optional)"
                  placeholderTextColor={theme.textMuted}
                  multiline
                  numberOfLines={2}
                  style={[
                    F_BODY,
                    styles.notesInput,
                    {
                      backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    },
                  ]}
                />
                <GoldButton full disabled={!resReady} onPress={sendReservation}>
                  <View style={styles.goldButtonRow}>
                    <MessageSquareText size={16} color="#FFFFFF" />
                    <Text style={styles.goldButtonText}>Send via WhatsApp</Text>
                  </View>
                </GoldButton>
                <Text style={[F_BODY, styles.reserveFooter, { color: theme.textMuted }]}>
                  We&apos;ll confirm your reservation on WhatsApp — {RESTAURANT_PHONE_DISPLAY}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        <ScreenHeader title="Restaurant Experience" onBack={() => router.back()} />
        <View style={styles.content}>
          <View style={styles.slideshow}>
            {REXP_SLIDES.map((source, i) => (
              <ExperienceSlide key={i} source={source} active={i === slide} />
            ))}
            <View style={styles.dotsRow}>
              {REXP_SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { width: i === slide ? 14 : 5, backgroundColor: i === slide ? '#fff' : 'rgba(255,255,255,0.5)' },
                  ]}
                />
              ))}
            </View>
          </View>

          <View>
            <Text style={[F_LABEL, styles.sectionLabel, { color: theme.gold }]}>Our Story</Text>
            <Text style={[F_BODY, styles.storyText, { color: theme.text2 }]}>
              Zone Garden was born from a simple idea — bring the garden to the table. Grown-on-site
              herbs, glasshouse dining and honest, plant-forward technique meet bold Zimbabwean flavor.
              Since opening, we&apos;ve built a home for fresh ingredients, calm green spaces and warm
              hospitality.
            </Text>
          </View>

          <View style={styles.photoGrid}>
            {[REXP3_PHOTO_2, REXP3_PHOTO_3, REXP3_PHOTO_4].map((source, i) => (
              <Image key={i} source={source} style={styles.photoTile} resizeMode="cover" />
            ))}
          </View>

          <GlassPanel style={styles.chefPanel}>
            <View style={styles.chefRow}>
              <Image source={REXP3_PHOTO_1} style={styles.chefImage} resizeMode="cover" />
              <View style={styles.chefTextCol}>
                <Text style={[F_BODY, styles.chefName, { color: theme.text }]}>Chef Admirer Chingwa</Text>
                <Text style={[F_BODY, styles.chefTitle, { color: theme.textMuted }]}>
                  Executive Chef · 16 years of experience
                </Text>
              </View>
            </View>
          </GlassPanel>

          <View style={styles.awardsRow}>
            {AWARDS.map((award) => (
              <View
                key={award}
                style={[styles.awardChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <Trophy size={12} color={theme.gold} />
                <Text style={[F_BODY, styles.awardText, { color: theme.gold }]}>{award}</Text>
              </View>
            ))}
          </View>

          <GlassPanel style={styles.hoursPanel}>
            <Text style={[F_LABEL, styles.hoursLabel, { color: theme.textMuted }]}>Operating Hours</Text>
            <View style={styles.hoursRow}>
              <Text style={[F_BODY, styles.hoursDay, { color: theme.text2 }]}>Mon–Sun</Text>
              <Text style={[F_BODY, styles.hoursTime, { color: theme.text }]}>09:00 – 23:00</Text>
            </View>
          </GlassPanel>

          <GlassPanel onPress={openDirections} style={styles.directionsPanel}>
            <View style={styles.directionsRow}>
              <View style={styles.directionsLeft}>
                <MapPin size={16} color={theme.gold} />
                <Text style={[F_BODY, styles.directionsText, { color: theme.text2 }]} numberOfLines={1}>
                  {RESTAURANT_ADDRESS}
                </Text>
              </View>
              <View style={styles.directionsRight}>
                <Navigation size={12} color={theme.gold} />
                <Text style={[F_LABEL, styles.directionsLabel, { color: theme.gold }]}>Directions</Text>
              </View>
            </View>
          </GlassPanel>

          <GhostButton full onPress={() => setShowReserve(true)}>
            <View style={styles.goldButtonRow}>
              <Clock size={15} color={theme.text} />
              <Text style={[F_BODY, styles.ghostButtonText, { color: theme.text }]}>Book a Reservation</Text>
            </View>
          </GhostButton>

          <View>
            <Text style={[F_LABEL, styles.reviewsLabel, { color: theme.textMuted }]}>Customer Reviews</Text>
            {REVIEWS.map((review) => (
              <GlassPanel key={review.name} style={styles.reviewPanel}>
                <View style={styles.reviewHeader}>
                  <Text style={[F_BODY, styles.reviewName, { color: theme.text }]}>{review.name}</Text>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={11} color={theme.gold} fill={theme.gold} />
                    ))}
                  </View>
                </View>
                <Text style={[F_BODY, styles.reviewComment, { color: theme.textMuted }]}>{review.comment}</Text>
              </GlassPanel>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  slideshow: {
    position: 'relative',
    width: '100%',
    height: 160,
    borderRadius: 22,
    overflow: 'hidden',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 5,
    borderRadius: 999,
  },
  sectionLabel: {
    fontSize: 10,
  },
  storyText: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  photoTile: {
    flex: 1,
    height: 90,
    borderRadius: 16,
  },
  chefPanel: {
    padding: 14,
  },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chefImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  chefTextCol: {
    flex: 1,
  },
  chefName: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  chefTitle: {
    fontSize: 11.5,
    marginTop: 1,
  },
  awardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  awardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  awardText: {
    fontSize: 11,
  },
  hoursPanel: {
    padding: 14,
  },
  hoursLabel: {
    fontSize: 10,
    marginBottom: 6,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  hoursDay: {
    fontSize: 12.5,
  },
  hoursTime: {
    fontSize: 12.5,
  },
  directionsPanel: {
    padding: 14,
  },
  directionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  directionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  directionsText: {
    fontSize: 12.5,
    flexShrink: 1,
  },
  directionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  directionsLabel: {
    fontSize: 10,
  },
  reviewsLabel: {
    fontSize: 10,
    marginBottom: 8,
  },
  reviewPanel: {
    padding: 14,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewName: {
    fontWeight: '700',
    fontSize: 12.5,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewComment: {
    fontSize: 12,
    marginTop: 4,
  },
  goldButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goldButtonText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#FFFFFF',
  },
  ghostButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sentPanel: {
    padding: 24,
    alignItems: 'center',
  },
  sentIcon: {
    marginBottom: 8,
  },
  sentTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  sentSub: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  sentButton: {
    marginTop: 16,
  },
  formCol: {
    gap: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formHalf: {
    flex: 1,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  reserveFooter: {
    fontSize: 10.5,
    textAlign: 'center',
  },
});
