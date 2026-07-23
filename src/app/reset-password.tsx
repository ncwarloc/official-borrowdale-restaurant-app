import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoldButton, GlassPanel } from '@/components/zone-garden';
import { F_BODY, F_DISPLAY, F_LABEL } from '@/constants/theme';
import { completePasswordReset } from '@/lib/password-reset';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;

    if (!token || Array.isArray(token)) {
      setError('This reset link is invalid or expired.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await completePasswordReset(token, password);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.screen}>
        <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}>
          <Text style={[F_LABEL, styles.kicker]}>Zone Garden</Text>
          <Text style={[F_DISPLAY, styles.title]}>Reset Password</Text>
          <Text style={[F_BODY, styles.subtitle]}>
            Set a new password using the link from your email. The code expires after 5 minutes.
          </Text>

          <GlassPanel forceDark strong style={styles.panel}>
            {done ? (
              <View style={styles.doneBlock}>
                <Text style={[F_BODY, styles.doneText]}>
                  Your password has been updated. You can return to the login screen and sign in.
                </Text>
                <GoldButton full onPress={() => router.replace('/(auth)' as never)}>
                  <Text style={styles.goldButtonText}>Back to Login</Text>
                </GoldButton>
              </View>
            ) : (
              <View style={styles.formGap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="New password"
                  placeholderTextColor="rgba(232,206,138,0.45)"
                  secureTextEntry
                  autoCapitalize="none"
                  style={[F_BODY, styles.input]}
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="rgba(232,206,138,0.45)"
                  secureTextEntry
                  autoCapitalize="none"
                  style={[F_BODY, styles.input]}
                />
                {error ? <Text style={[F_BODY, styles.errorText]}>{error}</Text> : null}
                <GoldButton full disabled={submitting} onPress={handleSubmit}>
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.goldButtonText}>Update Password</Text>
                  )}
                </GoldButton>
                <Pressable onPress={() => router.replace('/(auth)' as never)}>
                  <Text style={[F_LABEL, styles.backLink]}>Back to Login</Text>
                </Pressable>
              </View>
            )}
          </GlassPanel>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#111111',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    gap: 12,
  },
  kicker: {
    color: '#E0B84A',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 38,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
  },
  panel: {
    gap: 16,
  },
  formGap: {
    gap: 12,
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(224,184,74,0.18)',
  },
  errorText: {
    color: '#FFB4B4',
  },
  doneBlock: {
    gap: 16,
  },
  doneText: {
    color: 'rgba(255,255,255,0.85)',
  },
  goldButtonText: {
    color: '#FFFFFF',
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
  },
  backLink: {
    color: '#E0B84A',
    textAlign: 'center',
    marginTop: 4,
  },
});
