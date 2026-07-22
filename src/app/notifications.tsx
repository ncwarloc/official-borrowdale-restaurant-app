import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useZoneGardenTheme } from '@/constants/theme';

export default function NotificationsScreen() {
  const theme = useZoneGardenTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
      <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
        <ChevronLeft size={22} color={theme.text} />
      </Pressable>
      <View style={styles.body}>
        <Text style={[styles.text, { color: theme.text }]}>Notifications coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
