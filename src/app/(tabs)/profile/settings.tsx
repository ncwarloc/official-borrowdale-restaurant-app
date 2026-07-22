import { router } from 'expo-router';
import { Check, ChevronRight, Lock, Mail, User } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { FieldInput, GhostButton, GlassPanel, GoldButton, ScreenHeader } from '@/components/zone-garden';
import { F_BODY, useZoneGardenTheme } from '@/constants/theme';
import { useNotice } from '@/context/notice-context';
import { useUser } from '@/context/user-context';

type SettingId = 'profile' | 'password' | 'language' | 'privacy';

const LANGUAGES = ['English', 'Shona', 'Ndebele'];

function ExpandableRow({
  label,
  right,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  right?: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}) {
  const theme = useZoneGardenTheme();
  const rotation = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 1 : 0, { duration: 200 });
  }, [expanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 90}deg` }],
  }));

  return (
    <GlassPanel style={styles.settingCard}>
      <Pressable onPress={onToggle} style={styles.settingHeader}>
        <Text style={[F_BODY, styles.settingLabel, { color: theme.text }]}>{label}</Text>
        <View style={styles.settingHeaderRight}>
          {right}
          <Animated.View style={chevronStyle}>
            <ChevronRight size={16} color={theme.textMuted} />
          </Animated.View>
        </View>
      </Pressable>
      {expanded && <View style={styles.settingBody}>{children}</View>}
    </GlassPanel>
  );
}

export default function AccountSettingsScreen() {
  const theme = useZoneGardenTheme();
  const { user, setUser } = useUser();
  const { showNotice } = useNotice();

  const [expanded, setExpanded] = useState<SettingId | null>(null);
  const toggle = (id: SettingId) => setExpanded((current) => (current === id ? null : id));

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('English');

  const passwordMismatch =
    newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}>
        <ScreenHeader title="Account Settings" onBack={() => router.back()} />

        <View style={styles.content}>
          <ExpandableRow
            label="Edit Profile"
            expanded={expanded === 'profile'}
            onToggle={() => toggle('profile')}>
            <FieldInput icon={User} placeholder="Name" value={editName} onChangeText={setEditName} />
            <FieldInput
              icon={Mail}
              placeholder="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
            />
            <GoldButton
              full
              onPress={() => {
                setUser(user ? { ...user, name: editName, email: editEmail } : user);
                showNotice('Profile updated.');
              }}>
              <Text style={styles.goldButtonText}>Save Changes</Text>
            </GoldButton>
          </ExpandableRow>

          <ExpandableRow
            label="Change Password"
            expanded={expanded === 'password'}
            onToggle={() => toggle('password')}>
            <FieldInput
              icon={Lock}
              placeholder="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <FieldInput
              icon={Lock}
              placeholder="Confirm new password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <GoldButton
              full
              disabled={!newPassword || newPassword !== confirmPassword}
              onPress={() => {
                showNotice('Password updated.');
                setNewPassword('');
                setConfirmPassword('');
                setExpanded(null);
              }}>
              <Text style={styles.goldButtonText}>Update Password</Text>
            </GoldButton>
            {passwordMismatch && (
              <Text style={[F_BODY, styles.errorText]}>Passwords don&apos;t match.</Text>
            )}
          </ExpandableRow>

          <ExpandableRow
            label="Language"
            right={
              <Text style={[F_BODY, styles.languageValue, { color: theme.textMuted }]}>
                {language}
              </Text>
            }
            expanded={expanded === 'language'}
            onToggle={() => toggle('language')}>
            {LANGUAGES.map((l) => (
              <Pressable
                key={l}
                onPress={() => {
                  setLanguage(l);
                  showNotice(`Language set to ${l}.`);
                  setExpanded(null);
                }}
                style={[
                  styles.languageRow,
                  language === l && {
                    backgroundColor: theme.isDark
                      ? 'rgba(224,184,74,0.14)'
                      : 'rgba(216,161,43,0.12)',
                  },
                ]}>
                <Text style={[F_BODY, styles.languageText, { color: theme.text }]}>{l}</Text>
                {language === l && <Check size={15} color={theme.gold} />}
              </Pressable>
            ))}
          </ExpandableRow>

          <ExpandableRow
            label="Privacy & Data"
            expanded={expanded === 'privacy'}
            onToggle={() => toggle('privacy')}>
            <GhostButton
              full
              onPress={() => showNotice("We've emailed you a copy of your data.")}>
              <Text style={[F_BODY, styles.ghostButtonText, { color: theme.text }]}>
                Download My Data
              </Text>
            </GhostButton>
            <GhostButton
              full
              onPress={() =>
                showNotice('Contact us via Help & Support to delete your account.')
              }>
              <Text style={[F_BODY, styles.ghostButtonText, styles.dangerText]}>
                Delete My Account
              </Text>
            </GhostButton>
          </ExpandableRow>
        </View>
      </ScrollView>
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
    gap: 12,
  },
  settingCard: {
    padding: 14,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 13,
  },
  settingHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingBody: {
    gap: 10,
    marginTop: 12,
  },
  languageValue: {
    fontSize: 11.5,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  languageText: {
    fontSize: 13,
  },
  goldButtonText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#FFFFFF',
  },
  ghostButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dangerText: {
    color: '#E35B5B',
  },
  errorText: {
    fontSize: 11,
    color: '#E35B5B',
  },
});
