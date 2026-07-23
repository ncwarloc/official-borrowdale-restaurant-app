import { useRegisterPushNotifications } from '@/hooks/use-register-push-notifications';

/** Invisible — just runs the push-notification registration effect. */
export function PushNotificationsRegistrar() {
  useRegisterPushNotifications();
  return null;
}
