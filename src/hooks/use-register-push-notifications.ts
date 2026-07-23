import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useUser } from '@/context/user-context';
import { auth, db } from '@/lib/firebase';

/**
 * Remote push notifications were removed from Expo Go on Android in SDK 53
 * (iOS Expo Go never supported them either) — attempting registration there
 * just fails after expo-notifications logs its own warning. Skip entirely
 * and let a development build (`npx expo run:android` / `eas build`) do the
 * real registration instead.
 */
const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let notificationHandlerConfigured = false;

async function getNotificationsModule() {
  return await import('expo-notifications');
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (isExpoGo) {
    return null;
  }

  const Notifications = await getNotificationsModule();

  if (!notificationHandlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    notificationHandlerConfigured = true;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  if (!Device.isDevice) {
    // Push tokens aren't issued on simulators/emulators.
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    // Not linked to an EAS project yet (app.json `extra.eas.projectId`) —
    // Expo's push service requires one to issue a token.
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  return token;
}

/**
 * Requests notification permission and registers this device for push
 * notifications on first app open, saving the resulting Expo push token to
 * the signed-in user's Firestore document. Re-runs whenever the signed-in
 * user changes so the token always ends up on the *current* account.
 *
 * Guests have no Firestore document to save a token to, so the write is
 * skipped for them — but permission/registration themselves are device-level
 * (not Firebase-specific), so guests still get prompted like anyone else.
 */
export function useRegisterPushNotifications() {
  const { user } = useUser();

  useEffect(() => {
    let cancelled = false;

    registerForPushNotificationsAsync().then((token) => {
      if (cancelled || !token) return;
      if (!db || !auth?.currentUser || user?.guest) return;

      setDoc(doc(db, 'users', auth.currentUser.uid), { pushToken: token }, { merge: true }).catch(
        () => {
          // Best-effort — a failed write here just means this device won't
          // receive pushes until the next successful registration.
        },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [user]);
}
