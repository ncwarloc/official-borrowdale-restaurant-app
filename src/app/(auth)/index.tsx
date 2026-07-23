import * as Google from 'expo-auth-session/providers/google';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
  type KeyboardTypeOptions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { GhostButton, GlassPanel, GoldButton } from '@/components/zone-garden';
import { useNotice } from '@/context/notice-context';
import { useUser } from '@/context/user-context';
import { F_BODY, F_DISPLAY, F_LABEL } from '@/constants/theme';
import { requestPasswordReset } from '@/lib/password-reset';
import { auth, db } from '@/lib/firebase';

WebBrowser.maybeCompleteAuthSession();

const AUTH_BG_IMAGES: ImageSourcePropType[] = [
  require('@/assets/images/auth-bg-1.jpg'),
  require('@/assets/images/auth-bg-2.jpg'),
  require('@/assets/images/auth-bg-3.jpg'),
  require('@/assets/images/auth-bg-4.jpg'),
];
const BG_INTERVAL = 4500;
const BG_FADE_DURATION = 1600;
const BG_ZOOM_DURATION = 9000;

type Mode = 'login' | 'signup' | 'forgot';
type ForgotStep = 'details' | 'done';

function SlideshowLayer({ source, active }: { source: ImageSourcePropType; active: boolean }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0, {
      duration: BG_FADE_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
    scale.value = withTiming(active ? 1.06 : 1, {
      duration: BG_ZOOM_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
  }, [active, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" />
    </Animated.View>
  );
}

function AuthInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(232,206,138,0.45)"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      cursorColor="#E0B84A"
      style={[F_BODY, styles.authInput]}
    />
  );
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with that email already exists — try logging in instead.',
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts — please wait a moment and try again.',
  'auth/network-request-failed': 'Network error — check your connection and try again.',
};

function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  return 'Something went wrong — please try again.';
}

export default function AuthScreen() {
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [optIn, setOptIn] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);

  const [forgotStep, setForgotStep] = useState<ForgotStep>('details');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');

  const resetForgotFlow = () => {
    setForgotStep('details');
    setForgotEmail('');
    setResetEmailError('');
  };

  useEffect(() => {
    const iv = setInterval(
      () => setBgIndex((i) => (i + 1) % AUTH_BG_IMAGES.length),
      BG_INTERVAL,
    );
    return () => clearInterval(iv);
  }, []);

  const { setUser } = useUser();
  const { showNotice } = useNotice();
  const [submitting, setSubmitting] = useState(false);

  const hasGoogleConfig = Boolean(
    process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  );

  const isExpoGo =
    Constants.appOwnership === 'expo' ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  const [googleRequest, googleResponse, promptGoogleSignIn] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    androidClientId: isExpoGo ? undefined : process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: isExpoGo ? undefined : process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const syncUserProfile = async (
    uid: string,
    email: string,
    fallbackName: string,
    preferredName?: string,
  ) => {
    if (!db) return fallbackName;

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const nameToSave = preferredName || fallbackName;
      await setDoc(userRef, {
        name: nameToSave,
        email,
        points: 0,
        favorites: [],
      });
      return nameToSave;
    }

    const existingName = userSnap.data().name as string | undefined;
    return existingName || preferredName || fallbackName;
  };

  useEffect(() => {
    const signInFromGoogle = async () => {
      if (googleResponse?.type !== 'success') return;

      if (!auth || !db) {
        showNotice('Sign-in isn’t set up yet — add your Firebase project config to .env.');
        return;
      }

      const idToken = googleResponse.params.id_token;
      if (!idToken) {
        showNotice('Google sign-in did not return a valid token.');
        return;
      }

      setSubmitting(true);
      try {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);
        const email = result.user.email || '';
        const fallbackName = result.user.displayName || email || 'Member';
        const savedName = await syncUserProfile(
          result.user.uid,
          email,
          fallbackName,
          result.user.displayName || undefined,
        );

        setUser({
          name: savedName,
          email,
          guest: false,
        });
        router.replace('/(tabs)' as never);
      } catch (error) {
        showNotice(authErrorMessage(error));
      } finally {
        setSubmitting(false);
      }
    };

    signInFromGoogle();
  }, [googleResponse, setUser, showNotice]);

  const handleSubmit = async () => {
    if (submitting) return;

    if (!auth || !db) {
      showNotice('Sign-in isn’t set up yet — add your Firebase project config to .env.');
      return;
    }
    const firebaseAuth = auth;
    const firestore = db;

    const email = form.email.trim();
    const password = form.password;
    const name = form.name.trim();

    if (!email || !password) {
      showNotice('Enter an email and password to continue.');
      return;
    }
    if (mode === 'signup' && !name) {
      showNotice('Enter your name to create an account.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await setDoc(doc(firestore, 'users', credential.user.uid), {
          name,
          email,
          points: 0,
          favorites: [],
        });
        setUser({ name, email, guest: false });
      } else {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const savedName = await syncUserProfile(
          credential.user.uid,
          credential.user.email || email,
          credential.user.email || 'Member',
        );
        setUser({
          name: savedName || credential.user.email || 'Member',
          email: credential.user.email || email,
          guest: false,
        });
      }
      router.replace('/(tabs)' as never);
    } catch (error) {
      showNotice(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const enterAsGuest = () => {
    setUser({ name: 'Guest', email: '', guest: true });
    router.replace('/(tabs)' as never);
  };

  const handleForgotPassword = async () => {
    if (submitting) return;

    const email = forgotEmail.trim();
    if (!email) {
      setResetEmailError('Enter your email address to receive a reset link.');
      return;
    }

    if (!auth) {
      showNotice('Password reset is not set up yet — add your Firebase project config to .env.');
      return;
    }

    setSubmitting(true);
    setResetEmailError('');
    try {
      await requestPasswordReset(email);
      setForgotStep('done');
      showNotice('Password reset email sent. Check your inbox and spam folder.');
    } catch (error) {
      setResetEmailError(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (submitting) return;
    if (!hasGoogleConfig) {
      showNotice('Google sign-in is not configured yet. Add Google client IDs to your .env file.');
      return;
    }
    if (!googleRequest) {
      showNotice('Google sign-in is initializing. Please try again in a moment.');
      return;
    }

    try {
      await promptGoogleSignIn();
    } catch {
      showNotice('Unable to open Google sign-in right now. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.screen}>
        {AUTH_BG_IMAGES.map((src, i) => (
          <SlideshowLayer key={i} source={src} active={i === bgIndex} />
        ))}
        <LinearGradient
          colors={['rgba(17,17,17,0.25)', '#111111']}
          locations={[0, 0.78]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 24) + 16 },
          ]}>
          <View style={styles.header}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={[F_LABEL, styles.welcomeLabel]}>Welcome to</Text>
              <Text style={[F_DISPLAY, styles.title]}>Zone Garden</Text>
              <Text style={[F_BODY, styles.subtitle]}>Garden-to-Table Dining · Borrowdale</Text>
            </View>
          </View>

          <GlassPanel forceDark strong style={styles.panel}>
            {mode !== 'forgot' && (
              <View style={styles.modeToggleRow}>
                {(['login', 'signup'] as const).map((m) => (
                  <Pressable key={m} onPress={() => setMode(m)} style={styles.modeToggleWrap}>
                    {mode === m ? (
                      <LinearGradient
                        colors={['#3ED676', '#17903F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modeToggleBtn}>
                        <Text style={[F_LABEL, styles.modeToggleTextActive]}>
                          {m === 'login' ? 'Log In' : 'Sign Up'}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.modeToggleBtn}>
                        <Text style={[F_LABEL, styles.modeToggleTextInactive]}>
                          {m === 'login' ? 'Log In' : 'Sign Up'}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            {mode === 'forgot' ? (
              <View style={styles.formGap}>
                {forgotStep === 'details' && (
                  <>
                    <Text style={[F_BODY, styles.mutedText]}>
                      Enter your email address and we&apos;ll send a password reset link.
                    </Text>
                    <AuthInput
                      placeholder="Email address"
                      value={forgotEmail}
                      onChangeText={(v) => {
                        setForgotEmail(v);
                        setResetEmailError('');
                      }}
                      keyboardType="email-address"
                    />
                    {resetEmailError ? (
                      <Text style={[F_BODY, styles.errorText]}>{resetEmailError}</Text>
                    ) : null}
                    <GoldButton
                      full
                      disabled={submitting}
                      onPress={handleForgotPassword}>
                      {submitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={[F_LABEL, styles.goldButtonText]}>Send Reset Email</Text>
                      )}
                    </GoldButton>
                    <Pressable
                      onPress={() => {
                        setMode('login');
                        resetForgotFlow();
                      }}
                      style={styles.backLink}>
                      <Text style={[F_LABEL, styles.backLinkText]}>Back</Text>
                    </Pressable>
                  </>
                )}

                {forgotStep === 'done' && (
                  <View style={styles.doneBlock}>
                    <Check size={30} color="#3ED676" style={styles.doneIcon} />
                    <Text style={[F_BODY, styles.doneText]}>
                      Reset email sent. The link expires in 5 minutes, so open it right away.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setMode('login');
                        resetForgotFlow();
                      }}>
                      <Text style={[F_LABEL, styles.doneBackText]}>Back to Log In</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.formGap}>
                {mode === 'signup' && (
                  <AuthInput
                    placeholder="Full name"
                    value={form.name}
                    onChangeText={(v) => setForm({ ...form, name: v })}
                  />
                )}
                <AuthInput
                  placeholder="Email address"
                  value={form.email}
                  onChangeText={(v) => setForm({ ...form, email: v })}
                  keyboardType="email-address"
                />
                {mode === 'signup' && (
                  <AuthInput
                    placeholder="Phone number"
                    value={form.phone}
                    onChangeText={(v) => setForm({ ...form, phone: v })}
                    keyboardType="phone-pad"
                  />
                )}
                <AuthInput
                  placeholder="Password"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(v) => setForm({ ...form, password: v })}
                />

                {mode === 'signup' && (
                  <Pressable onPress={() => setOptIn((v) => !v)} style={styles.optInRow}>
                    <View style={[styles.checkbox, optIn && styles.checkboxChecked]}>
                      {optIn && <Check size={12} color="#111111" />}
                    </View>
                    <Text style={[F_BODY, styles.optInText]}>
                      Send me promotions, loyalty rewards, restaurant updates and birthday offers
                      by email.
                    </Text>
                  </Pressable>
                )}

                {mode === 'login' && (
                  <Pressable
                    onPress={() => {
                      setMode('forgot');
                      resetForgotFlow();
                    }}
                    style={styles.forgotLink}>
                    <Text style={[F_LABEL, styles.forgotLinkText]}>Forgot password?</Text>
                  </Pressable>
                )}

                <GoldButton
                  full
                  disabled={submitting}
                  style={styles.submitButton}
                  onPress={handleSubmit}>
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={[F_LABEL, styles.goldButtonText]}>
                      {mode === 'login' ? 'Log In' : 'Create Account'}
                    </Text>
                  )}
                </GoldButton>
                <GhostButton full disabled={submitting} onPress={enterAsGuest}>
                  <Text style={[F_LABEL, styles.ghostButtonText]}>Continue as Guest</Text>
                </GhostButton>
                <GhostButton full disabled={submitting} onPress={handleGoogleSignIn}>
                  <Text style={[F_LABEL, styles.ghostButtonText]}>Continue with Google</Text>
                </GhostButton>
                <Text style={[F_BODY, styles.guestDisclaimer]}>
                  Guest orders are limited to 1 item, with loyalty points and coupons locked.
                </Text>
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
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 32,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  headerText: {
    flexShrink: 1,
  },
  welcomeLabel: {
    fontSize: 11,
    color: '#3ED676',
  },
  title: {
    fontSize: 34,
    color: '#F3EFE6',
    fontWeight: '700',
    marginTop: 2,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#C8C3B6',
    marginTop: 3,
  },
  panel: {
    padding: 22,
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  modeToggleWrap: {
    flex: 1,
  },
  modeToggleBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggleTextActive: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  modeToggleTextInactive: {
    fontSize: 11,
    color: '#C8C3B6',
  },
  formGap: {
    gap: 12,
  },
  authInput: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(224,184,74,0.28)',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 15,
    color: '#E8CE8A',
    fontSize: 14,
  },
  mutedText: {
    fontSize: 13,
    color: '#C8C3B6',
  },
  strongText: {
    color: '#F3EFE6',
    fontWeight: '700',
  },
  demoPinText: {
    fontSize: 11,
    color: '#3ED676',
  },
  errorText: {
    fontSize: 11.5,
    color: '#FF8A80',
  },
  backLink: {
    marginTop: 4,
  },
  backLinkText: {
    fontSize: 11,
    color: '#C8C3B6',
  },
  resendLinkText: {
    fontSize: 10,
    color: '#3ED676',
  },
  doneBlock: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  doneIcon: {
    marginBottom: 8,
  },
  doneText: {
    color: '#F3EFE6',
    fontSize: 14,
  },
  doneBackText: {
    fontSize: 11,
    color: '#3ED676',
    marginTop: 14,
  },
  optInRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3ED676',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3ED676',
  },
  optInText: {
    flex: 1,
    fontSize: 12,
    color: '#C8C3B6',
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotLinkText: {
    fontSize: 10.5,
    color: '#3ED676',
  },
  submitButton: {
    marginTop: 6,
  },
  goldButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  ghostButtonText: {
    fontSize: 13,
    color: '#F3EFE6',
  },
  guestDisclaimer: {
    fontSize: 10.5,
    color: '#9A968B',
    textAlign: 'center',
    marginTop: 2,
  },
});
