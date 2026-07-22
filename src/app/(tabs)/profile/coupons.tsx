import { router } from 'expo-router';
import { Lock, Tag } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { EmptyState, ScreenHeader } from '@/components/zone-garden';
import { useZoneGardenTheme } from '@/constants/theme';
import { useUser } from '@/context/user-context';

export default function CouponsScreen() {
  const theme = useZoneGardenTheme();
  const { user } = useUser();

  return (
    <View style={[styles.flex, { backgroundColor: theme.bg }]}>
      <ScreenHeader title="Coupons" onBack={() => router.back()} />
      <View style={styles.content}>
        {user?.guest ? (
          <EmptyState
            icon={Lock}
            title="Coupons is locked"
            sub="Log in or sign up to unlock loyalty points and coupons."
          />
        ) : (
          <EmptyState
            icon={Tag}
            title="No coupons right now"
            sub="New coupons are added here whenever we push offers and updates to the app."
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
});
