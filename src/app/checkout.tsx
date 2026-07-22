import { router } from 'expo-router';
import {
  Check,
  Clock,
  CreditCard,
  MapPin,
  MessageSquareText,
  Navigation,
  Phone,
  ShoppingBag,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { FieldInput, GlassPanel, GoldButton, ScreenHeader } from '@/components/zone-garden';
import { F_BODY, F_LABEL, useZoneGardenTheme } from '@/constants/theme';
import { RESTAURANT_ADDRESS, RESTAURANT_WHATSAPP } from '@/constants/restaurant';
import { useCart } from '@/context/cart-context';
import { useNotifications } from '@/context/notifications-context';
import { useOrders } from '@/context/orders-context';
import { useUser } from '@/context/user-context';
import { useAddressSearch } from '@/hooks/use-address-search';

const RESTAURANT_LAT = -17.7642;
const RESTAURANT_LNG = 31.0947;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const SAVED_ADDRESSES = [
  { label: 'Home', address: '14 Borrowdale Rd, Harare', lat: -17.7902, lng: 31.0812 },
  { label: 'Work', address: "Sam Levy's Village, Borrowdale", lat: -17.7745, lng: 31.0889 },
];

const DELIVERY_RATE_PER_KM = 0.5;

type Fulfillment = 'delivery' | 'pickup' | 'dinein';

const FULFILLMENT_OPTIONS: { id: Fulfillment; label: string; icon: LucideIcon }[] = [
  { id: 'delivery', label: 'Delivery', icon: Navigation },
  { id: 'pickup', label: 'Pickup', icon: ShoppingBag },
  { id: 'dinein', label: 'Dine-In', icon: Users },
];

const FUTURE_PAYMENTS = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'];

export default function CheckoutScreen() {
  const theme = useZoneGardenTheme();
  const { cart, subtotal, discount, tax, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addNotification } = useNotifications();
  const { user } = useUser();

  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery');
  const [phone, setPhone] = useState('');
  const [dnotes, setDnotes] = useState('');
  const [payment, setPayment] = useState<'ecocash' | 'cod'>('ecocash');
  const [reserveTime, setReserveTime] = useState('');

  const {
    text: address,
    coords,
    geoStatus,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    useCurrentLocation,
    handleTextChange: handleAddressChange,
    selectSuggestion,
    selectPreset,
  } = useAddressSearch();

  const distanceKm = coords ? haversineKm(coords.lat, coords.lng, RESTAURANT_LAT, RESTAURANT_LNG) : 5;
  const delivery = fulfillment === 'delivery' ? distanceKm * DELIVERY_RATE_PER_KM : 0;
  const total = subtotal - discount + delivery + tax;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const order = addOrder({ total, payment, fulfillment, items: cart });

    const itemLines = cart
      .map(
        (line) =>
          `• ${line.item.name} x${line.qty}${line.addons.length ? ` (${line.addons.map((a) => a.n).join(', ')})` : ''}`,
      )
      .join('\n');
    const fulfillmentLine =
      fulfillment === 'delivery'
        ? `Delivery — ${address || '-'}`
        : fulfillment === 'pickup'
          ? 'Pickup at Zone Garden'
          : `Dine-In — ${reserveTime || '-'}`;
    const message = `Order #${order.number}

Customer:
${user?.name || 'Guest'}

Phone:
${phone || '-'}

Fulfillment:
${fulfillmentLine}

Items
${itemLines}

Total:
US$${total.toFixed(2)}

Payment:
${payment === 'ecocash' ? 'EcoCash' : 'Cash on Delivery'}

Special Instructions:
${dnotes || 'None'}`;

    Linking.openURL(`https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`);

    addNotification(
      'Order sent',
      `Order #${order.number} has been sent to Zone Garden for $${total.toFixed(2)}.`,
      'order',
    );
    clearCart();
    router.push({ pathname: '/confirmation', params: { orderNumber: String(order.number) } });
  };

  const selectSavedAddress = (a: (typeof SAVED_ADDRESSES)[number]) => {
    selectPreset(a.address, { lat: a.lat, lng: a.lng });
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        <ScreenHeader title="Checkout" onBack={() => router.back()} />

        <View style={styles.content}>
          <Text style={[F_LABEL, styles.sectionLabel, { color: theme.textMuted }]}>
            Fulfillment
          </Text>
          <View style={styles.fulfillmentRow}>
            {FULFILLMENT_OPTIONS.map((f) => {
              const Icon = f.icon;
              const selected = fulfillment === f.id;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => setFulfillment(f.id)}
                  style={[
                    styles.fulfillmentTile,
                    {
                      backgroundColor: selected ? `${theme.gold}22` : theme.card,
                      borderColor: selected ? theme.gold : theme.cardBorder,
                    },
                  ]}>
                  <Icon size={17} color={selected ? theme.gold : theme.textMuted} />
                  <Text
                    style={[
                      F_BODY,
                      styles.fulfillmentLabel,
                      { color: selected ? theme.text : theme.textMuted },
                    ]}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {fulfillment === 'delivery' && (
            <GlassPanel style={styles.sectionPanel}>
              <Text style={[F_LABEL, styles.sectionInnerLabel, { color: theme.textMuted }]}>
                Delivery Information
              </Text>
              <View style={styles.fieldsGap}>
                <Pressable onPress={useCurrentLocation} style={styles.gpsRow}>
                  {geoStatus === 'locating' ? (
                    <ActivityIndicator size="small" color={theme.gold} />
                  ) : (
                    <Navigation size={12} color={theme.gold} />
                  )}
                  <Text style={[F_LABEL, styles.gpsText, { color: theme.gold }]}>
                    Use current GPS location
                  </Text>
                </Pressable>

                <View style={styles.savedAddressesRow}>
                  {SAVED_ADDRESSES.map((a) => (
                    <Pressable
                      key={a.label}
                      onPress={() => selectSavedAddress(a)}
                      style={[
                        styles.savedAddressChip,
                        {
                          backgroundColor: theme.isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)',
                          borderColor: theme.cardBorder,
                        },
                      ]}>
                      <Text style={[F_LABEL, styles.savedAddressText, { color: theme.text2 }]}>
                        {a.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.addressFieldWrap}>
                  <FieldInput
                    icon={MapPin}
                    placeholder="Delivery address"
                    value={address}
                    onChangeText={handleAddressChange}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <View
                      style={[
                        styles.suggestionsDropdown,
                        {
                          borderColor: theme.cardBorder,
                          backgroundColor: theme.isDark ? '#1B1B1B' : '#FFFFFF',
                        },
                      ]}>
                      {suggestions.map((s, i) => (
                        <Pressable
                          key={i}
                          onPress={() => selectSuggestion(s)}
                          style={[
                            styles.suggestionRow,
                            i < suggestions.length - 1 && {
                              borderBottomWidth: 1,
                              borderBottomColor: theme.cardBorder,
                            },
                          ]}>
                          <MapPin size={13} color={theme.gold} style={styles.suggestionIcon} />
                          <Text
                            style={[F_BODY, styles.suggestionText, { color: theme.text }]}
                            numberOfLines={2}>
                            {s.display_name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {geoStatus === 'resolved' && coords && (
                  <View style={styles.confirmedRow}>
                    <Check size={12} color={theme.gold} />
                    <Text style={[F_BODY, styles.confirmedText, { color: theme.gold }]}>
                      Location confirmed
                    </Text>
                  </View>
                )}

                {coords && (
                  <View style={[styles.mapWrap, { borderColor: theme.cardBorder }]}>
                    <MapView
                      style={styles.map}
                      region={{
                        latitude: coords.lat,
                        longitude: coords.lng,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}>
                      <Marker coordinate={{ latitude: coords.lat, longitude: coords.lng }} />
                    </MapView>
                  </View>
                )}

                <FieldInput icon={Phone} placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                <TextInput
                  value={dnotes}
                  onChangeText={setDnotes}
                  placeholder="Delivery notes (gate code, landmark…)"
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
              </View>
            </GlassPanel>
          )}

          {fulfillment === 'pickup' && (
            <GlassPanel style={styles.sectionPanel}>
              <Text style={[F_BODY, styles.pickupText, { color: theme.text2 }]}>
                Pickup at <Text style={styles.pickupStrong}>Zone Garden — {RESTAURANT_ADDRESS}</Text>
              </Text>
              <FieldInput
                icon={Phone}
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.pickupPhoneField}
              />
            </GlassPanel>
          )}

          {fulfillment === 'dinein' && (
            <GlassPanel style={styles.sectionPanel}>
              <Text style={[F_LABEL, styles.sectionInnerLabel, { color: theme.textMuted }]}>
                Reservation
              </Text>
              <View style={styles.fieldsGap}>
                <FieldInput
                  icon={Clock}
                  placeholder="Preferred date & time"
                  value={reserveTime}
                  onChangeText={setReserveTime}
                />
                <FieldInput
                  icon={Phone}
                  placeholder="Phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </GlassPanel>
          )}

          <Text style={[F_LABEL, styles.sectionLabel, { color: theme.textMuted }]}>
            Payment Method
          </Text>
          <View style={styles.paymentCol}>
            <PaymentRow
              id="ecocash"
              label="EcoCash"
              icon={Wallet}
              selected={payment === 'ecocash'}
              onSelect={setPayment}
            />
            <PaymentRow
              id="cod"
              label="Cash on Delivery"
              icon={CreditCard}
              selected={payment === 'cod'}
              onSelect={setPayment}
            />
          </View>

          <Text style={[F_LABEL, styles.comingSoonLabel, { color: theme.textMuted }]}>
            Coming soon
          </Text>
          <View style={styles.futurePaymentsGrid}>
            {FUTURE_PAYMENTS.map((label) => (
              <View
                key={label}
                style={[styles.futurePaymentTile, { borderColor: theme.cardBorder }]}>
                <Text style={[F_BODY, styles.futurePaymentText, { color: theme.textMuted }]}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <GlassPanel strong style={styles.summaryPanel}>
            <SummaryRow label="Subtotal" value={subtotal} />
            {discount > 0 && <SummaryRow label="Discount" value={-discount} accent />}
            <SummaryRow label="Tax (1%)" value={tax} />
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <SummaryRow label="Grand Total" value={total} bold />
          </GlassPanel>

          <GoldButton full onPress={handlePlaceOrder}>
            <View style={styles.placeOrderRow}>
              <MessageSquareText size={16} color="#FFFFFF" />
              <Text style={styles.placeOrderText}>Place Order via WhatsApp</Text>
            </View>
          </GoldButton>
        </View>
      </ScrollView>
    </View>
  );
}

function PaymentRow({
  id,
  label,
  icon: Icon,
  selected,
  onSelect,
}: {
  id: 'ecocash' | 'cod';
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (id: 'ecocash' | 'cod') => void;
}) {
  const theme = useZoneGardenTheme();

  return (
    <Pressable
      onPress={() => onSelect(id)}
      style={[
        styles.paymentRow,
        {
          backgroundColor: selected ? `${theme.gold}18` : theme.card,
          borderColor: selected ? theme.gold : theme.cardBorder,
        },
      ]}>
      <View style={styles.paymentRowLeft}>
        <Icon size={16} color={selected ? theme.gold : theme.textMuted} />
        <Text style={[F_BODY, styles.paymentLabel, { color: theme.text }]}>{label}</Text>
      </View>
      <View
        style={[
          styles.paymentRadio,
          {
            borderColor: selected ? theme.gold : theme.textMuted,
            backgroundColor: selected ? theme.gold : 'transparent',
          },
        ]}>
        {selected && <Check size={13} color="#FFFFFF" />}
      </View>
    </Pressable>
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
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 10.5,
    marginBottom: 8,
  },
  fulfillmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  fulfillmentTile: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  fulfillmentLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  sectionPanel: {
    padding: 16,
    marginBottom: 16,
  },
  sectionInnerLabel: {
    fontSize: 10,
    marginBottom: 10,
  },
  fieldsGap: {
    gap: 10,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  gpsText: {
    fontSize: 10,
  },
  savedAddressesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  savedAddressChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  savedAddressText: {
    fontSize: 10,
  },
  addressFieldWrap: {
    position: 'relative',
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 20,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  suggestionIcon: {
    marginTop: 2,
  },
  suggestionText: {
    flex: 1,
    fontSize: 12,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confirmedText: {
    fontSize: 10.5,
  },
  mapWrap: {
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  map: {
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
  pickupText: {
    fontSize: 13,
    lineHeight: 20,
  },
  pickupStrong: {
    fontWeight: '700',
  },
  pickupPhoneField: {
    marginTop: 10,
  },
  paymentCol: {
    gap: 8,
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  paymentRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentLabel: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonLabel: {
    fontSize: 9.5,
    marginBottom: 8,
  },
  futurePaymentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  futurePaymentTile: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  futurePaymentText: {
    fontSize: 11,
  },
  summaryPanel: {
    padding: 16,
    marginBottom: 16,
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
  placeOrderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeOrderText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
