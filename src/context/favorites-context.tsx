import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useUser } from '@/context/user-context';
import { auth, db } from '@/lib/firebase';

type FavoritesContextValue = {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  // Guests never touch Firebase (no Auth session, no user doc) — their
  // favorites live only in memory for the current app session, same as before.
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);
  const [remoteFavorites, setRemoteFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!db || !user || user.guest) {
      setRemoteFavorites([]);
      return;
    }
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      setRemoteFavorites([]);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
      const favorites = snap.data()?.favorites;
      setRemoteFavorites(Array.isArray(favorites) ? favorites : []);
    });
    return unsubscribe;
  }, [user]);

  const favorites = user?.guest ? localFavorites : remoteFavorites;

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: string) => {
      if (user?.guest) {
        setLocalFavorites((prev) =>
          prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
        );
        return;
      }

      if (!db || !auth?.currentUser) return;
      const alreadyFavorite = remoteFavorites.includes(id);
      updateDoc(doc(db, 'users', auth.currentUser.uid), {
        favorites: alreadyFavorite ? arrayRemove(id) : arrayUnion(id),
      }).catch(() => {
        // Best-effort — the onSnapshot listener above is the source of truth,
        // so a failed write here just means the toggle silently doesn't stick.
      });
    },
    [user, remoteFavorites],
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
