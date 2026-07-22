import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Session = {
  name: string;
  email: string;
  guest: boolean;
};

type UserContextValue = {
  user: Session | null;
  setUser: (user: Session | null) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
