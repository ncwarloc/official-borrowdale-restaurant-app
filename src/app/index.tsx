import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useUser } from '@/context/user-context';

import { Splash } from '@/components/splash';

export default function Index() {
  const { user, ready } = useUser();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Wait for both: Firebase telling us the real session state, AND the
    // splash animation actually finishing its ~3.3s intro. Skipping straight
    // to /(tabs) is correct when there's a genuinely resumed session — the
    // bug was that logging out never terminated the underlying Firebase
    // session (see handleLogout in profile/index.tsx), so a resumed session
    // could resurface even after the user explicitly logged out.
    if (!ready || !splashDone) return;
    router.replace((user ? '/(tabs)' : '/(auth)') as never);
  }, [ready, splashDone, user]);

  return <Splash onDone={() => setSplashDone(true)} />;
}
