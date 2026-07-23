import { router } from 'expo-router';
import { Bell, ShoppingBag, Trophy, User, type LucideIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_LABEL, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { useNotifications, type NotificationType } from '@/context/notifications-context';

const ICON_BY_TYPE: Record<NotificationType, LucideIcon> = {
  order: ShoppingBag,
  points: Trophy,
  account: User,
  general: Bell,
};

function formatNotificationDate(date: Date | null): string {
  if (!date) return 'Just now';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return 'Just now';
  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function NotificationsScreen() {
  const theme = useZoneGardenTheme();
  const { notifications, markAllRead } = useNotifications();

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader title="Notifications" onBack={() => router.back()} />

        <View style={styles.content}>
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              sub="Updates about your orders, points, and the app will show up here."
            />
          ) : (
            <View style={styles.list}>
              {notifications.map((n) => {
                const Icon = ICON_BY_TYPE[n.type];
                return (
                  <GlassPanel key={n.id} style={styles.card}>
                    <View style={styles.row}>
                      <Icon size={17} color={theme.gold} style={styles.icon} />
                      <View style={styles.textCol}>
                        <Text style={[F_BODY, styles.title, { color: theme.text }]}>
                          {n.title}
                        </Text>
                        <Text style={[F_BODY, styles.body, { color: theme.textMuted }]}>
                          {n.body}
                        </Text>
                        <Text style={[F_LABEL, styles.date, { color: theme.textMuted }]}>
                          {formatNotificationDate(n.createdAt)}
                        </Text>
                      </View>
                      {!n.read && <View style={styles.unreadDot} />}
                    </View>
                  </GlassPanel>
                );
              })}
            </View>
          )}
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
  list: {
    gap: 12,
  },
  card: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: {
    marginTop: 1,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
  },
  body: {
    fontSize: 12,
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E35B5B',
    marginTop: 4,
  },
});
