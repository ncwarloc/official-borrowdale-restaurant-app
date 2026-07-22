import { router } from 'expo-router';
import { CircleQuestionMark, Mail, MessageCircle, MessageSquareText, Phone } from 'lucide-react-native';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel, ScreenHeader } from '@/components/zone-garden';
import { BottomTabInset, F_BODY, F_LABEL, Spacing, useZoneGardenTheme } from '@/constants/theme';
import {
  RESTAURANT_FACEBOOK,
  RESTAURANT_INSTAGRAM,
  RESTAURANT_PHONE_DISPLAY,
  RESTAURANT_TIKTOK,
  RESTAURANT_WHATSAPP,
} from '@/constants/restaurant';

const FAQS = [
  { q: 'What are your delivery areas?', a: 'We currently deliver within Harare only.' },
  { q: 'Do you cater private events?', a: 'Yes.' },
  { q: 'Is there parking on site?', a: 'Yes.' },
];

const SOCIALS = [
  { label: 'Facebook', url: `https://facebook.com/${RESTAURANT_FACEBOOK}` },
  { label: 'Instagram', url: `https://instagram.com/${RESTAURANT_INSTAGRAM}` },
  { label: 'TikTok', url: `https://tiktok.com/@${RESTAURANT_TIKTOK}` },
];

export default function SupportScreen() {
  const theme = useZoneGardenTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
        <ScreenHeader title="Help & Support" onBack={() => router.back()} />

        <View style={styles.content}>
          <GlassPanel onPress={() => Linking.openURL(`https://wa.me/${RESTAURANT_WHATSAPP}`)} style={styles.row}>
            <View style={styles.rowInner}>
              <MessageCircle size={17} color={theme.gold} />
              <Text style={[F_BODY, styles.rowText, { color: theme.text }]}>WhatsApp Chat</Text>
            </View>
          </GlassPanel>

          <GlassPanel style={[styles.row, styles.rowDisabled]}>
            <View style={styles.rowBetween}>
              <View style={styles.rowInner}>
                <MessageSquareText size={17} color={theme.textMuted} />
                <Text style={[F_BODY, styles.rowText, { color: theme.text }]}>Live Chat</Text>
              </View>
              <View style={[styles.soonBadge, { borderColor: theme.cardBorder }]}>
                <Text style={[F_LABEL, styles.soonText, { color: theme.textMuted }]}>Coming Soon</Text>
              </View>
            </View>
          </GlassPanel>

          <GlassPanel onPress={() => Linking.openURL(`tel:${RESTAURANT_WHATSAPP}`)} style={styles.row}>
            <View style={styles.rowInner}>
              <Phone size={17} color={theme.gold} />
              <Text style={[F_BODY, styles.rowText, { color: theme.text }]}>
                Call Restaurant — {RESTAURANT_PHONE_DISPLAY}
              </Text>
            </View>
          </GlassPanel>

          <GlassPanel style={[styles.row, styles.rowDisabled]}>
            <View style={styles.rowBetween}>
              <View style={styles.rowInner}>
                <Mail size={17} color={theme.textMuted} />
                <Text style={[F_BODY, styles.rowText, { color: theme.text }]}>Email Restaurant</Text>
              </View>
              <View style={[styles.soonBadge, { borderColor: theme.cardBorder }]}>
                <Text style={[F_LABEL, styles.soonText, { color: theme.textMuted }]}>Coming Soon</Text>
              </View>
            </View>
          </GlassPanel>

          <GlassPanel style={styles.socialPanel}>
            <Text style={[F_LABEL, styles.socialLabel, { color: theme.textMuted }]}>Follow Us</Text>
            <View style={styles.socialRow}>
              {SOCIALS.map((s) => (
                <GlassPanel key={s.label} onPress={() => Linking.openURL(s.url)} style={styles.socialChip}>
                  <Text style={[F_BODY, styles.socialChipText, { color: theme.text }]}>{s.label}</Text>
                </GlassPanel>
              ))}
            </View>
          </GlassPanel>

          <GlassPanel style={styles.faqPanel}>
            <Text style={[F_LABEL, styles.faqLabel, { color: theme.textMuted }]}>FAQs</Text>
            {FAQS.map((f, i) => (
              <View
                key={f.q}
                style={[
                  styles.faqRow,
                  i > 0 && { borderTopWidth: 1, borderTopColor: theme.divider },
                ]}>
                <CircleQuestionMark size={14} color={theme.gold} style={styles.faqIcon} />
                <View style={styles.faqTextCol}>
                  <Text style={[F_BODY, styles.faqQuestion, { color: theme.text }]}>{f.q}</Text>
                  <Text style={[F_BODY, styles.faqAnswer, { color: theme.textMuted }]}>{f.a}</Text>
                </View>
              </View>
            ))}
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
  row: {
    padding: 14,
  },
  rowDisabled: {
    opacity: 0.55,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: 13,
    flexShrink: 1,
  },
  soonBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  soonText: {
    fontSize: 9,
  },
  socialPanel: {
    padding: 16,
  },
  socialLabel: {
    fontSize: 10,
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  socialChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  faqPanel: {
    padding: 14,
  },
  faqLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 10,
  },
  faqIcon: {
    marginTop: 2,
  },
  faqTextCol: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  faqAnswer: {
    fontSize: 12,
    marginTop: 2,
  },
});
