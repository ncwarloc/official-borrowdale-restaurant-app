import { router } from 'expo-router';
import { Award, Cake, Gift, Lock, Sparkles, Star, Trophy, Users, type LucideIcon } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_DISPLAY, F_LABEL, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { useOrders } from '@/context/orders-context';
import { useUser } from '@/context/user-context';

const PROGRAM_ROWS: { icon: LucideIcon; text: string }[] = [
  { icon: Star, text: 'Earn 1 point per $1 spent, credited once your order is confirmed delivered' },
  { icon: Gift, text: 'Redeem 100 points for a free meal' },
  { icon: Cake, text: 'Birthday reward — free dessert' },
  { icon: Sparkles, text: 'VIP membership unlocked at 500 pts' },
  { icon: Users, text: 'Referral bonus — 50 points per friend' },
  { icon: Award, text: 'Achievement badges for milestones' },
];

export default function LoyaltyScreen() {
  const theme = useZoneGardenTheme();
  const { user } = useUser();
  const { points } = useOrders();

  if (user?.guest) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.bg }]}>
        <ScreenHeader title="Loyalty & Rewards" onBack={() => router.back()} />
        <View style={styles.content}>
          <EmptyState
            icon={Lock}
            title="Loyalty & Rewards is locked"
            sub="Log in or sign up to unlock loyalty points and coupons."
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader title="Loyalty & Rewards" onBack={() => router.back()} />

        <View style={styles.content}>
          <GlassPanel strong style={styles.pointsPanel}>
            <Trophy size={30} color={theme.gold} style={styles.trophyIcon} />
            <Text style={[F_DISPLAY, styles.pointsValue, { color: theme.text }]}>{points}</Text>
            <Text style={[F_LABEL, styles.pointsLabel, { color: theme.textMuted }]}>
              Loyalty Points
            </Text>
          </GlassPanel>

          <View style={styles.rows}>
            {PROGRAM_ROWS.map((row) => (
              <GlassPanel key={row.text} style={styles.row}>
                <View style={styles.rowInner}>
                  <row.icon size={17} color={theme.gold} />
                  <Text style={[F_BODY, styles.rowText, { color: theme.text }]}>{row.text}</Text>
                </View>
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
  content: {
    paddingHorizontal: 20,
  },
  pointsPanel: {
    padding: 20,
    alignItems: 'center',
  },
  trophyIcon: {
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 30,
    fontWeight: '700',
  },
  pointsLabel: {
    fontSize: 10,
  },
  rows: {
    marginTop: 16,
    gap: 12,
  },
  row: {
    padding: 14,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 13,
  },
});
