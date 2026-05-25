import { useState, useEffect } from 'react';

type LocaleData = Record<string, any>;

export function useLocale() {
  const [locale, setLocale] = useState<string>(localStorage.getItem('locale') || 'en');
  const [messages, setMessages] = useState<LocaleData>({});

  useEffect(() => {
    const load = async () => {
      try {
        const mod = await import(`../locales/${locale}.json`);
        setMessages(mod.default ?? mod);
      } catch (e) {
        console.error('Failed to load locale', locale, e);
      }
    };

    load();
  }, [locale]);

  const t = (path: string, fallback?: string) => {
    const parts = path.split('.');
    let cur: any = messages;
    for (const p of parts) {
      if (!cur) return fallback ?? path;
      cur = cur[p];
    }
    return typeof cur === 'string' ? cur : fallback ?? path;
  };

  const set = (l: string) => {
    localStorage.setItem('locale', l);
    setLocale(l);
  };

  return { locale, setLocale: set, t };
}
