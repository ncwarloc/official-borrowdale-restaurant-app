import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { GlassPanel, GoldButton } from '@/components/zone-garden';
import { F_BODY, F_DISPLAY, useZoneGardenTheme, type ZoneGardenTheme } from '@/constants/theme';
import { RESTAURANT_ADDRESS, RESTAURANT_PHONE_DISPLAY } from '@/constants/restaurant';
import { useOrders } from '@/context/orders-context';

const FULFILLMENT_LABEL: Record<string, string> = {
  delivery: 'Delivery',
  pickup: 'Pickup',
  dinein: 'Dine-In',
};

function backToHome() {
  router.dismissTo('/(tabs)/index');
}

export default function ConfirmationScreen() {
  const theme = useZoneGardenTheme();
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const { orders } = useOrders();
  const order = orders.find((o) => o.number === Number(orderNumber));

  if (!order) {
    return (
      <View style={[styles.flex, styles.centered, { backgroundColor: theme.bg }]}>
        <Text style={[F_BODY, styles.missingText, { color: theme.textMuted }]}>
          We couldn&apos;t find that order.
        </Text>
        <GoldButton full style={styles.backButton} onPress={backToHome}>
          <Text style={styles.goldButtonText}>Back to Home</Text>
        </GoldButton>
      </View>
    );
  }

  return (
    <View style={[styles.flex, styles.centered, { backgroundColor: theme.bg }]}>
      <View style={[styles.badge, { shadowColor: theme.gold }]}>
        <Check size={38} color="#FFFFFF" />
      </View>
      <Text style={[F_DISPLAY, styles.title, { color: theme.text }]}>Order Sent!</Text>
      <Text style={[F_BODY, styles.subtitle, { color: theme.textMuted }]}>
        We opened WhatsApp with your order ready to send to Zone Garden.
      </Text>

      <GlassPanel strong style={styles.summaryPanel}>
        <Text style={[F_DISPLAY, styles.orderNumber, { color: theme.gold }]}>#{order.number}</Text>
        <SummaryLine label="Estimated prep time" value={order.prepTime} theme={theme} />
        <SummaryLine
          label="Payment method"
          value={order.payment === 'ecocash' ? 'EcoCash' : 'Cash on Delivery'}
          theme={theme}
        />
        <SummaryLine
          label="Fulfillment"
          value={FULFILLMENT_LABEL[order.fulfillment] ?? order.fulfillment}
          theme={theme}
        />
        <View style={[styles.divider, { backgroundColor: theme.divider }]} />
        <View style={styles.totalRow}>
          <Text style={[F_BODY, styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={[F_BODY, styles.totalValue, { color: theme.ember }]}>
            ${order.total.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.divider }]} />
        <Text style={[F_BODY, styles.footerText, { color: theme.textMuted }]}>
          Zone Garden — {RESTAURANT_ADDRESS}
        </Text>
        <Text style={[F_BODY, styles.footerText, { color: theme.textMuted }]}>
          {RESTAURANT_PHONE_DISPLAY}
        </Text>
      </GlassPanel>

      <GoldButton full style={styles.backButton} onPress={backToHome}>
        <Text style={styles.goldButtonText}>Back to Home</Text>
      </GoldButton>
    </View>
  );
}

function SummaryLine({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ZoneGardenTheme;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[F_BODY, styles.summaryLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[F_BODY, styles.summaryValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  missingText: {
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: '#22B455',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  summaryPanel: {
    padding: 20,
    marginTop: 24,
    width: '100%',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 12,
  },
  backButton: {
    marginTop: 22,
    width: '100%',
  },
  goldButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
