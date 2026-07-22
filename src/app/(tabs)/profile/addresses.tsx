import { router } from 'expo-router';
import { Check, MapPin, Navigation, Plus, Tag, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { EmptyState, FieldInput, GhostButton, GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_LABEL, Spacing, useZoneGardenTheme } from '@/constants/theme';
import { useAddresses } from '@/context/addresses-context';
import { useNotice } from '@/context/notice-context';
import { useAddressSearch } from '@/hooks/use-address-search';

export default function SavedAddressesScreen() {
  const theme = useZoneGardenTheme();
  const { savedAddresses, addAddress, deleteAddress } = useAddresses();
  const { showNotice } = useNotice();

  const [label, setLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {
    text: address,
    coords,
    geoStatus,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    useCurrentLocation,
    handleTextChange,
    selectSuggestion,
    reset,
  } = useAddressSearch();

  const canSubmit = label.trim().length > 0 && address.trim().length > 0;

  const handleAdd = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await addAddress(label, address, coords);
      setLabel('');
      reset();
      showNotice('Address saved.');
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Could not save address — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteAddress(id).catch((error) => {
      showNotice(error instanceof Error ? error.message : 'Could not delete address — please try again.');
    });
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader title="Saved Addresses" onBack={() => router.back()} />

        <View style={styles.content}>
          {savedAddresses.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No saved addresses"
              sub="Add an address below for faster checkout."
            />
          ) : (
            <View style={styles.list}>
              {savedAddresses.map((a) => (
                <GlassPanel key={a.id} style={styles.addressCard}>
                  <View style={styles.addressRow}>
                    <View style={styles.addressLeft}>
                      <MapPin size={16} color={theme.gold} />
                      <Text style={[F_BODY, styles.addressText, { color: theme.text }]}>
                        <Text style={styles.addressLabel}>{a.label}</Text> — {a.address}
                      </Text>
                    </View>
                    <Pressable onPress={() => handleDelete(a.id)} hitSlop={8}>
                      <X size={16} color={theme.textMuted} />
                    </Pressable>
                  </View>
                </GlassPanel>
              ))}
            </View>
          )}

          <GlassPanel style={styles.formPanel}>
            <Text style={[F_LABEL, styles.formLabel, { color: theme.textMuted }]}>
              Add New Address
            </Text>
            <View style={styles.formGap}>
              <FieldInput
                icon={Tag}
                placeholder="Label (e.g. Home, Work)"
                value={label}
                onChangeText={setLabel}
              />
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

              <View style={styles.addressFieldWrap}>
                <FieldInput
                  icon={MapPin}
                  placeholder="Search address"
                  value={address}
                  onChangeText={handleTextChange}
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
              {geoStatus === 'error' && (
                <Text style={[F_BODY, styles.errorText]}>
                  Couldn&apos;t find that address — check spelling or use GPS.
                </Text>
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
            </View>

            <GhostButton
              full
              disabled={!canSubmit || submitting}
              onPress={handleAdd}
              style={styles.addButton}>
              <View style={styles.addButtonRow}>
                {submitting ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : (
                  <>
                    <Plus size={15} color={theme.text} />
                    <Text style={[F_BODY, styles.addButtonText, { color: theme.text }]}>
                      Add Address
                    </Text>
                  </>
                )}
              </View>
            </GhostButton>
          </GlassPanel>
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
    gap: 12,
  },
  list: {
    gap: 12,
  },
  addressCard: {
    padding: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
  },
  addressLabel: {
    fontWeight: '700',
  },
  formPanel: {
    padding: 14,
  },
  formLabel: {
    fontSize: 10,
    marginBottom: 10,
  },
  formGap: {
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
  errorText: {
    fontSize: 10.5,
    color: '#E06060',
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
  addButton: {
    marginTop: 10,
  },
  addButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
