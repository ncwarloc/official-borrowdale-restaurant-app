import { router } from 'expo-router';
import { ClipboardList } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, GhostButton, GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_LABEL, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { useCart } from '@/context/cart-context';
import { useOrders, type Order } from '@/context/orders-context';
import { useUser } from '@/context/user-context';

function formatOrderDate(date: Date | null): string {
  if (!date) return 'Just now';
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return 'Today';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function OrdersScreen() {
  const theme = useZoneGardenTheme();
  const { user } = useUser();
  const { orders, markDelivered } = useOrders();
  const { replaceCart } = useCart();

  const reorder = (order: Order) => {
    replaceCart(order.items);
    router.push('/(tabs)/cart');
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader
          title="Your Orders"
          subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''}`}
        />

        {orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders yet"
            sub="Your order history will appear here."
          />
        ) : (
          <View style={styles.list}>
            {orders.map((order) => {
              const delivered = order.status === 'delivered';
              return (
                <GlassPanel key={order.id} style={styles.card}>
                  <View style={styles.topRow}>
                    <View>
                      <Text style={[F_BODY, styles.orderNumber, { color: theme.text }]}>
                        Order #{order.number}
                      </Text>
                      <Text style={[F_BODY, styles.orderMeta, { color: theme.textMuted }]}>
                        {formatOrderDate(order.createdAt)} · {order.items.length} items
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: delivered
                            ? theme.isDark
                              ? 'rgba(34,180,85,0.18)'
                              : 'rgba(19,138,54,0.12)'
                            : theme.isDark
                              ? 'rgba(255,255,255,0.06)'
                              : 'rgba(0,0,0,0.04)',
                        },
                      ]}>
                      <Text
                        style={[F_LABEL, styles.badgeText, { color: delivered ? theme.gold : theme.textMuted }]}>
                        {delivered ? 'Delivered' : 'Sent'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bottomRow}>
                    <Text style={[F_BODY, styles.total, { color: theme.ember }]}>
                      ${order.total.toFixed(2)}
                    </Text>
                    <View style={styles.actions}>
                      {!delivered && (
                        <GhostButton
                          onPress={() => markDelivered(order.id)}
                          style={styles.actionButton}>
                          <Text style={[F_BODY, styles.actionText, { color: theme.text }]}>
                            Confirm Delivered
                          </Text>
                        </GhostButton>
                      )}
                      <GhostButton onPress={() => reorder(order)} style={styles.actionButton}>
                        <Text style={[F_BODY, styles.actionText, { color: theme.text }]}>
                          Reorder
                        </Text>
                      </GhostButton>
                    </View>
                  </View>

                  {!delivered && !user?.guest && (
                    <Text style={[F_BODY, styles.pointsHint, { color: theme.textMuted }]}>
                      Points are credited once delivery is confirmed.
                    </Text>
                  )}
                </GlassPanel>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontWeight: '700',
    fontSize: 14,
  },
  orderMeta: {
    fontSize: 11.5,
    marginTop: 2,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 9.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  total: {
    fontWeight: '700',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pointsHint: {
    fontSize: 10.5,
    marginTop: 8,
  },
});
