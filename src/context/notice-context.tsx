import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

type NoticeContextValue = {
  notice: string | null;
  showNotice: (message: string) => void;
};

const NoticeContext = createContext<NoticeContextValue | null>(null);

const NOTICE_DURATION_MS = 2800;

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotice((current) => (current === message ? null : current));
    }, NOTICE_DURATION_MS);
  }, []);

  const value = useMemo(() => ({ notice, showNotice }), [notice, showNotice]);

  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>;
}

export function useNotice(): NoticeContextValue {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error('useNotice must be used within a NoticeProvider');
  return ctx;
}
