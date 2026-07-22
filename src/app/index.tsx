import { router } from 'expo-router';

import { Splash } from '@/components/splash';

export default function Index() {
  return <Splash onDone={() => router.replace('/(auth)')} />;
}
