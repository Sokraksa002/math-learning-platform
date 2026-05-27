import { useEffect, useState, useSyncExternalStore } from "react";

type LocaleData = Record<string, unknown>;

const LOCALE_STORAGE_KEY = "locale";
const DEFAULT_LOCALE = "en";

let currentLocale =
  localStorage.getItem(LOCALE_STORAGE_KEY) || DEFAULT_LOCALE;

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getLocaleSnapshot = () => currentLocale;

const notifyLocaleChange = () => {
  listeners.forEach((listener) => listener());
};

export function useLocale() {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getLocaleSnapshot
  );

  const [messages, setMessages] = useState<LocaleData>({});

  useEffect(() => {
    const load = async () => {
      try {
        const mod = await import(`../locales/${locale}.json`);
        setMessages(mod.default ?? mod);
      } catch (e) {
        console.error("Failed to load locale", locale, e);
      }
    };

    load();
  }, [locale]);

  // ✅ SUPPORT NESTED KEYS (IMPORTANT)
  const t = (path: string, fallback?: string) => {
    const parts = path.split(".");
    let cur: unknown = messages;

    for (const p of parts) {
      if (typeof cur !== "object" || cur === null) {
        return fallback ?? path;
      }
      const obj = cur as Record<string, unknown>;
      cur = obj[p];
    }

    return typeof cur === "string" ? cur : fallback ?? path;
  };

  const setLocale = (l: string) => {
    currentLocale = l;
    localStorage.setItem(LOCALE_STORAGE_KEY, l);
    notifyLocaleChange();
  };

  return { locale, setLocale, t };
}