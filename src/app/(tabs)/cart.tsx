import { router } from 'expo-router';
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  EmptyState,
  GhostButton,
  GlassPanel,
  GoldButton,
  RoundIconBtn,
  ScreenHeader,
} from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_LABEL, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { dishImg } from '@/constants/dish-images';
import {
  PROMO_CODE,
  PROMO_DISCOUNT_RATE,
  useCart,
  type CartLine,
} from '@/context/cart-context';
import { useUser } from '@/context/user-context';

function lineTotal(line: CartLine): number {
  const addonsTotal = line.addons.reduce((s, a) => s + a.p, 0);
  return (line.item.price + addonsTotal) * line.qty;
}

export default function CartScreen() {
  const theme = useZoneGardenTheme();
  const { user } = useUser();
  const {
    cart,
    updateQty,
    removeItem,
    promo,
    setPromo,
    promoApplied,
    applyPromo,
    subtotal,
    discount,
    tax,
  } = useCart();

  const [notes, setNotes] = useState('');

  const total = subtotal - discount + tax;

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader
          title="Your Cart"
          subtitle={`${cart.length} item${cart.length !== 1 ? 's' : ''}`}
        />

        {user?.guest && cart.length > 0 && (
          <View style={styles.guestBannerWrap}>
            <GlassPanel style={styles.guestBanner}>
              <Lock size={13} color={theme.textMuted} />
              <Text style={[F_BODY, styles.guestBannerText, { color: theme.textMuted }]}>
                Ordering as guest — 0 loyalty points will be earned.
              </Text>
            </GlassPanel>
          </View>
        )}

        {cart.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            sub="Add dishes from the menu to get started."
          />
        ) : (
          <>
            <View style={styles.list}>
              {cart.map((line, idx) => (
                <GlassPanel key={idx} style={styles.lineCard}>
                  <View style={styles.lineRow}>
                    <Image
                      source={dishImg(line.item)}
                      style={styles.lineImage}
                      resizeMode="cover"
                    />
                    <View style={styles.lineBody}>
                      <View style={styles.lineTop}>
                        <Text
                          style={[F_BODY, styles.lineName, { color: theme.text }]}
                          numberOfLines={1}>
                          {line.item.name}
                        </Text>
                        <Pressable onPress={() => removeItem(idx)} hitSlop={8}>
                          <X size={16} color={theme.textMuted} />
                        </Pressable>
                      </View>
                      {line.addons.length > 0 && (
                        <Text style={[F_BODY, styles.lineAddons, { color: theme.textMuted }]}>
                          {line.addons.map((a) => a.n).join(', ')}
                        </Text>
                      )}
                      <View style={styles.lineFooter}>
                        <Text style={[F_BODY, styles.linePrice, { color: theme.ember }]}>
                          ${lineTotal(line).toFixed(2)}
                        </Text>
                        <View style={styles.qtyControls}>
                          <RoundIconBtn icon={Minus} onPress={() => updateQty(idx, -1)} />
                          <Text style={[F_BODY, styles.qtyValue, { color: theme.text }]}>
                            {line.qty}
                          </Text>
                          <RoundIconBtn icon={Plus} onPress={() => updateQty(idx, 1)} />
                        </View>
                      </View>
                    </View>
                  </View>
                </GlassPanel>
              ))}
            </View>

            <View style={styles.notesWrap}>
              <GlassPanel style={styles.notesPanel}>
                <Text style={[F_LABEL, styles.notesLabel, { color: theme.textMuted }]}>
                  Cooking instructions
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any notes for the kitchen…"
                  placeholderTextColor={theme.textMuted}
                  multiline
                  numberOfLines={2}
                  style={[F_BODY, styles.notesInput, { color: theme.text }]}
                />
              </GlassPanel>
            </View>

            <View style={styles.promoWrap}>
              <View style={styles.promoRow}>
                <TextInput
                  value={promo}
                  onChangeText={setPromo}
                  placeholder="Promo code"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="characters"
                  style={[
                    F_BODY,
                    styles.promoInput,
                    { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text },
                  ]}
                />
                <GhostButton onPress={applyPromo} style={styles.promoApplyButton}>
                  <Text style={[F_BODY, styles.promoApplyText, { color: theme.text }]}>
                    Apply
                  </Text>
                </GhostButton>
              </View>
              {promoApplied && (
                <Text style={[F_BODY, styles.promoAppliedText, { color: theme.gold }]}>
                  ✓ {PROMO_CODE} applied — {PROMO_DISCOUNT_RATE * 100}% off
                </Text>
              )}
            </View>

            <View style={styles.summaryWrap}>
              <GlassPanel strong style={styles.summaryPanel}>
                <SummaryRow label="Subtotal" value={subtotal} />
                {promoApplied && (
                  <SummaryRow label={`Discount (${PROMO_CODE})`} value={-discount} accent />
                )}
                <SummaryRow label="Tax (1%)" value={tax} />
                <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                <SummaryRow label="Total (before delivery)" value={total} bold />
              </GlassPanel>
            </View>

            <View style={styles.checkoutWrap}>
              <GoldButton full onPress={() => router.push('/checkout')}>
                <View style={styles.checkoutRow}>
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </View>
              </GoldButton>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
  accent = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
  accent?: boolean;
}) {
  const theme = useZoneGardenTheme();

  return (
    <View style={styles.summaryRow}>
      <Text
        style={[
          F_BODY,
          { fontSize: bold ? 15 : 13, fontWeight: bold ? '700' : '500' },
          { color: bold ? theme.text : theme.textMuted },
        ]}>
        {label}
      </Text>
      <Text
        style={[
          F_BODY,
          { fontSize: bold ? 17 : 13, fontWeight: '700' },
          { color: bold ? theme.ember : accent ? theme.ember : theme.text2 },
        ]}>
        {value < 0 ? '-' : ''}${Math.abs(value).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  guestBannerWrap: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  guestBannerText: {
    fontSize: 11.5,
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  lineCard: {
    padding: 12,
  },
  lineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  lineImage: {
    width: 66,
    height: 66,
    borderRadius: 14,
  },
  lineBody: {
    flex: 1,
  },
  lineTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  lineName: {
    flex: 1,
    fontWeight: '700',
    fontSize: 13.5,
  },
  lineAddons: {
    fontSize: 11,
    marginTop: 2,
  },
  lineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  linePrice: {
    fontWeight: '700',
    fontSize: 13,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyValue: {
    fontWeight: '700',
    fontSize: 13,
  },
  notesWrap: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  notesPanel: {
    padding: 14,
  },
  notesLabel: {
    fontSize: 10,
    marginBottom: 8,
  },
  notesInput: {
    fontSize: 13,
    minHeight: 40,
    textAlignVertical: 'top',
    padding: 0,
  },
  promoWrap: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  promoApplyButton: {
    paddingHorizontal: 4,
  },
  promoApplyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  promoAppliedText: {
    fontSize: 11.5,
    marginTop: 6,
  },
  summaryWrap: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  summaryPanel: {
    padding: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  checkoutWrap: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  checkoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
