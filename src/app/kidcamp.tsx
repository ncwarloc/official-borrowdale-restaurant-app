import { router } from 'expo-router';
import { Baby, Camera, PartyPopper, Users, type LucideIcon } from 'lucide-react-native';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { FieldInput, GhostButton, GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { F_BODY, F_LABEL, useZoneGardenTheme } from '@/constants/theme';

const KIDCAMP1_PHOTO_1 = require('@/assets/images/dishes/kidcamp1-photo-1.jpg');
const KIDCAMP1_PHOTO_2 = require('@/assets/images/dishes/kidcamp1-photo-2.jpg');
const KIDCAMP1_PHOTO_3 = require('@/assets/images/dishes/kidcamp1-photo-3.jpg');
const KIDCAMP1_PHOTO_4 = require('@/assets/images/dishes/kidcamp1-photo-4.jpg');

const COMING_SOON_CARDS = ['Kids Menu', 'Birthday Packages', 'Family Events'];

const FEATURE_CARDS: { icon: LucideIcon; label: string }[] = [
  { icon: Baby, label: 'Kids Menu' },
  { icon: PartyPopper, label: 'Birthday Packages' },
  { icon: Users, label: 'Play Area' },
  { icon: Camera, label: 'Family Events' },
];

const PLAY_AREA_PHOTOS: ImageSourcePropType[] = [KIDCAMP1_PHOTO_1, KIDCAMP1_PHOTO_3, KIDCAMP1_PHOTO_4];

export default function KidCampScreen() {
  const theme = useZoneGardenTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScreenHeader title="KidCamp" subtitle="Play, feast & celebrate" onBack={() => router.back()} />
      <View style={styles.content}>
        <Image source={KIDCAMP1_PHOTO_2} style={styles.heroImage} resizeMode="cover" />

        <View style={styles.featureGrid}>
          {FEATURE_CARDS.map((card) => {
            const soon = COMING_SOON_CARDS.includes(card.label);
            const Icon = card.icon;
            return (
              <GlassPanel key={card.label} style={[styles.featureCard, soon && styles.featureCardSoon]}>
                <Icon size={20} color={soon ? theme.textMuted : theme.gold} />
                <Text style={[F_BODY, styles.featureLabel, { color: theme.text }]}>{card.label}</Text>
                {soon && (
                  <Text style={[F_LABEL, styles.featureSoonLabel, { color: theme.gold }]}>Coming Soon</Text>
                )}
              </GlassPanel>
            );
          })}
        </View>

        <View>
          <Text style={[F_LABEL, styles.playAreaLabel, { color: theme.gold }]}>Play Area</Text>
          <View style={styles.photoGrid}>
            {PLAY_AREA_PHOTOS.map((source, i) => (
              <Image key={i} source={source} style={styles.photoTile} resizeMode="cover" />
            ))}
          </View>
        </View>

        <GlassPanel strong style={styles.bookingPanel}>
          <View style={styles.bookingHeader}>
            <Text style={[F_LABEL, styles.bookingLabel, { color: theme.gold }]}>
              Book a Birthday Package
            </Text>
            <View style={[styles.bookingBadge, { borderColor: theme.cardBorder }]}>
              <Text style={[F_LABEL, styles.bookingBadgeText, { color: theme.textMuted }]}>Coming Soon</Text>
            </View>
          </View>

          <View pointerEvents="none" style={styles.bookingForm}>
            <FieldInput icon={Baby} placeholder="Child's name" value="" onChangeText={() => {}} />
            <FieldInput icon={PartyPopper} placeholder="Preferred date" value="" onChangeText={() => {}} />
            <FieldInput icon={Users} placeholder="Number of guests" value="" onChangeText={() => {}} />
          </View>

          <GhostButton full disabled style={styles.bookingButton}>
            <Text style={[F_BODY, styles.ghostButtonText, { color: theme.text }]}>Booking Coming Soon</Text>
          </GhostButton>
        </GlassPanel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  heroImage: {
    width: '100%',
    height: 150,
    borderRadius: 22,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureCard: {
    width: '47%',
    flexGrow: 1,
    padding: 16,
  },
  featureCardSoon: {
    opacity: 0.55,
  },
  featureLabel: {
    fontWeight: '700',
    fontSize: 12.5,
    marginTop: 8,
  },
  featureSoonLabel: {
    fontSize: 8.5,
    marginTop: 4,
  },
  playAreaLabel: {
    fontSize: 10,
    marginBottom: 8,
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
  bookingPanel: {
    padding: 18,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bookingLabel: {
    fontSize: 10,
  },
  bookingBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  bookingBadgeText: {
    fontSize: 9,
  },
  bookingForm: {
    gap: 10,
    opacity: 0.5,
  },
  bookingButton: {
    marginTop: 14,
  },
  ghostButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
