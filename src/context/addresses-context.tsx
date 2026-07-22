import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
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
import type { Coords } from '@/hooks/use-address-search';
import { auth, db } from '@/lib/firebase';

export type SavedAddress = {
  /** Firestore document id for member addresses; a local-only id for guest addresses. */
  id: string;
  label: string;
  address: string;
  lat: number | null;
  lng: number | null;
};

type AddressesContextValue = {
  savedAddresses: SavedAddress[];
  addAddress: (label: string, address: string, coords: Coords | null) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
};

const AddressesContext = createContext<AddressesContextValue | null>(null);

function docToAddress(snap: QueryDocumentSnapshot<DocumentData>): SavedAddress {
  const data = snap.data();
  return {
    id: snap.id,
    label: data.label,
    address: data.address,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
  };
}

export function AddressesProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  // Guests never touch Firebase (no Auth session to key a subcollection on) —
  // their saved addresses live only in memory for the current app session,
  // same as before.
  const [localAddresses, setLocalAddresses] = useState<SavedAddress[]>([]);
  const [remoteAddresses, setRemoteAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    if (!db || !user || user.guest) {
      setRemoteAddresses([]);
      return;
    }
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      setRemoteAddresses([]);
      return;
    }
    const addressesQuery = query(
      collection(db, 'users', uid, 'addresses'),
      orderBy('createdAt', 'asc'),
    );
    const unsubscribe = onSnapshot(addressesQuery, (snapshot) => {
      setRemoteAddresses(snapshot.docs.map(docToAddress));
    });
    return unsubscribe;
  }, [user]);

  const savedAddresses = user?.guest ? localAddresses : remoteAddresses;

  const addAddress = useCallback(
    async (label: string, address: string, coords: Coords | null) => {
      const trimmedLabel = label.trim();
      const trimmedAddress = address.trim();
      if (!trimmedLabel || !trimmedAddress) return;

      if (user?.guest) {
        setLocalAddresses((prev) => [
          ...prev,
          {
            id: `guest-${Date.now()}-${Math.random()}`,
            label: trimmedLabel,
            address: trimmedAddress,
            lat: coords?.lat ?? null,
            lng: coords?.lng ?? null,
          },
        ]);
        return;
      }

      if (!db || !auth?.currentUser) {
        throw new Error('You must be logged in to save an address.');
      }
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'addresses'), {
        label: trimmedLabel,
        address: trimmedAddress,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        createdAt: serverTimestamp(),
      });
    },
    [user],
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      if (user?.guest) {
        setLocalAddresses((prev) => prev.filter((a) => a.id !== id));
        return;
      }

      if (!db || !auth?.currentUser) return;
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'addresses', id));
    },
    [user],
  );

  const value = useMemo(
    () => ({ savedAddresses, addAddress, deleteAddress }),
    [savedAddresses, addAddress, deleteAddress],
  );

  return <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>;
}

export function useAddresses(): AddressesContextValue {
  const ctx = useContext(AddressesContext);
  if (!ctx) throw new Error('useAddresses must be used within an AddressesProvider');
  return ctx;
}
