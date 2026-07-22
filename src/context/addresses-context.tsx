import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Coords } from '@/hooks/use-address-search';

export type SavedAddress = {
  id: number;
  label: string;
  address: string;
  lat: number | null;
  lng: number | null;
};

type AddressesContextValue = {
  savedAddresses: SavedAddress[];
  addAddress: (label: string, address: string, coords: Coords | null) => void;
  deleteAddress: (id: number) => void;
};

const AddressesContext = createContext<AddressesContextValue | null>(null);

export function AddressesProvider({ children }: { children: ReactNode }) {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  const addAddress = useCallback((label: string, address: string, coords: Coords | null) => {
    if (!label.trim() || !address.trim()) return;
    setSavedAddresses((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        label: label.trim(),
        address: address.trim(),
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      },
    ]);
  }, []);

  const deleteAddress = useCallback((id: number) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

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
