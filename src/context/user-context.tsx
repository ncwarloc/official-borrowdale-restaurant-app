import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { auth, db } from '@/lib/firebase';

export type Session = {
  name: string;
  email: string;
  guest: boolean;
};

type UserContextValue = {
  user: Session | null;
  setUser: (user: Session | null) => void;
  ready: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          return;
        }

        if (firebaseUser.isAnonymous) {
          setUser({
            name: firebaseUser.displayName || 'Guest',
            email: firebaseUser.email || '',
            guest: true,
          });
          return;
        }

        if (!db) {
          setUser({
            name: firebaseUser.displayName || firebaseUser.email || 'Member',
            email: firebaseUser.email || '',
            guest: false,
          });
          return;
        }

        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        const data = snap.exists() ? snap.data() : null;

        setUser({
          name:
            (data?.name as string | undefined) ||
            firebaseUser.displayName ||
            firebaseUser.email ||
            'Member',
          email: firebaseUser.email || (data?.email as string | undefined) || '',
          guest: false,
        });
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    });
  }, []);

  const value = useMemo(() => ({ user, setUser, ready }), [user, ready]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
