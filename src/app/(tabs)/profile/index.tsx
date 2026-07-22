import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Award,
  Bell,
  ChevronRight,
  HelpCircle,
  Heart,
  Lock,
  LogOut,
  MapPin,
  Settings,
  Sparkles,
  Tag,
  Trophy,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_DISPLAY, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { useFavorites } from '@/context/favorites-context';
import { useNotifications } from '@/context/notifications-context';
import { useOrders } from '@/context/orders-context';
import { useUser } from '@/context/user-context';

type ProfileRoute = 'addresses' | 'favorites' | 'loyalty' | 'coupons' | 'notifications' | 'settings';

type Row = {
  id: ProfileRoute | 'about' | 'support';
  label: string;
  icon: LucideIcon;
  badge?: number | null;
  locked?: boolean;
  dot?: boolean;
};

const LINKED_ROUTES = new Set<Row['id']>([
  'addresses',
  'favorites',
  'loyalty',
  'coupons',
  'notifications',
  'settings',
  'about',
  'support',
]);

export default function ProfileScreen() {
  const theme = useZoneGardenTheme();
  const { user, setUser } = useUser();
  const { points } = useOrders();
  const { favorites } = useFavorites();
  const { unreadCount } = useNotifications();

  const isGuest = !!user?.guest;

  const rows: Row[] = [
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'favorites', label: 'Favorite Meals', icon: Heart, badge: favorites.length },
    { id: 'loyalty', label: 'Loyalty Points', icon: Award, badge: isGuest ? null : points, locked: isGuest },
    { id: 'coupons', label: 'Coupons', icon: Tag, locked: isGuest },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      dot: unreadCount > 0,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'about', label: 'About Restaurant', icon: Sparkles },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const openRow = (id: Row['id']) => {
    if (!LINKED_ROUTES.has(id)) return;
    if (id === 'about') router.push('/experience');
    else router.push(`/(tabs)/profile/${id}`);
  };

  const handleLogout = () => {
    setUser(null);
    router.replace('/(auth)');
  };

  const vipProgress = Math.min(100, Math.round(points / 5));

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <View style={styles.headerRow}>
          <Text style={[F_DISPLAY, styles.title, { color: theme.text }]}>Profile</Text>
        </View>

        <View style={styles.content}>
          <GlassPanel strong style={styles.userPanel}>
            <View style={styles.userRow}>
              <LinearGradient
                colors={[theme.goldSoft, theme.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}>
                <Text style={styles.avatarText}>{(user?.name || 'G')[0]}</Text>
              </LinearGradient>
              <View style={styles.userTextCol}>
                <Text style={[F_BODY, styles.userName, { color: theme.text }]}>
                  {user?.name || 'Guest'}
                </Text>
                <Text style={[F_BODY, styles.userEmail, { color: theme.textMuted }]}>
                  {user?.email || 'Guest diner'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.vipRow,
                {
                  backgroundColor: theme.isDark ? 'rgba(224,184,74,0.14)' : 'rgba(216,161,43,0.12)',
                },
              ]}>
              <Trophy size={15} color={theme.gold} />
              <Text style={[F_BODY, styles.vipText, { color: theme.text2 }]}>
                <Text style={{ color: theme.gold, fontWeight: '700' }}>{points} pts</Text> · VIP
                progress {vipProgress}%
              </Text>
            </View>
          </GlassPanel>

          <View style={styles.rows}>
            {rows.map((r) => {
              const Icon = r.icon;
              const linked = LINKED_ROUTES.has(r.id);
              return (
                <Pressable
                  key={r.id}
                  onPress={() => openRow(r.id)}
                  disabled={!linked}
                  style={{ opacity: r.locked ? 0.6 : 1 }}>
                  <GlassPanel style={styles.row}>
                    <View style={styles.rowInner}>
                      <View style={styles.rowLeft}>
                        <View style={styles.iconWrap}>
                          <Icon size={17} color={r.locked ? theme.textMuted : theme.gold} />
                          {r.dot && (
                            <View style={[styles.dot, { borderColor: theme.card }]} />
                          )}
                        </View>
                        <Text style={[F_BODY, styles.rowLabel, { color: theme.text }]}>
                          {r.label}
                        </Text>
                      </View>
                      <View style={styles.rowRight}>
                        {r.locked && <Lock size={13} color={theme.textMuted} />}
                        {r.badge != null && (
                          <Text style={[F_BODY, styles.rowBadge, { color: theme.gold }]}>
                            {r.badge}
                          </Text>
                        )}
                        <ChevronRight size={16} color={theme.textMuted} />
                      </View>
                    </View>
                  </GlassPanel>
                </Pressable>
              );
            })}

            <Pressable onPress={handleLogout}>
              <GlassPanel style={styles.row}>
                <View style={styles.rowLeft}>
                  <LogOut size={17} color={theme.ember} />
                  <Text style={[F_BODY, styles.rowLabel, { color: theme.ember }]}>Log Out</Text>
                </View>
              </GlassPanel>
            </Pressable>
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
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
  },
  userPanel: {
    padding: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    fontSize: 15,
  },
  userEmail: {
    fontSize: 12,
    marginTop: 1,
  },
  vipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  vipText: {
    fontSize: 12.5,
  },
  rows: {
    marginTop: 16,
    gap: 10,
  },
  row: {
    padding: 14,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E35B5B',
    borderWidth: 1.5,
  },
  rowLabel: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowBadge: {
    fontSize: 11.5,
    fontWeight: '700',
  },
});
