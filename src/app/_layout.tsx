import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { NoticeBanner } from '@/components/notice-banner';
import { AddressesProvider } from '@/context/addresses-context';
import { CartProvider } from '@/context/cart-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { NoticeProvider } from '@/context/notice-context';
import { NotificationsProvider } from '@/context/notifications-context';
import { OrdersProvider } from '@/context/orders-context';
import { UserProvider } from '@/context/user-context';

SplashScreen.preventAutoHideAsync();

const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const PushNotificationsRegistrar = !isExpoGo
  ? require('@/components/push-notifications-registrar').PushNotificationsRegistrar
  : null;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <NoticeProvider>
          <NotificationsProvider>
            <CartProvider>
              <OrdersProvider>
                <FavoritesProvider>
                  <AddressesProvider>
                    {PushNotificationsRegistrar ? <PushNotificationsRegistrar /> : null}
                    <AnimatedSplashOverlay />
                    <Stack screenOptions={{ headerShown: false }} />
                    <NoticeBanner />
                  </AddressesProvider>
                </FavoritesProvider>
              </OrdersProvider>
            </CartProvider>
          </NotificationsProvider>
        </NoticeProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
