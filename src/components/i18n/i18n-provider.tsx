"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { I18nextProvider } from "react-i18next";

import {
  defaultLocale,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/config";
import { createClientI18n } from "@/lib/i18n/client";
import { localeCookieName } from "@/lib/i18n/detection";

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

const localeStorageKey = "mypaytag.locale.fixture";

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
}: I18nProviderProps) {
  const [i18n] = useState(() => createClientI18n(initialLocale));
  const [locale, setLocaleState] = useState(initialLocale);

  useEffect(() => {
    function onLanguageChanged(nextLocale: string) {
      if (isSupportedLocale(nextLocale)) {
        setLocaleState(nextLocale);
        document.documentElement.lang = nextLocale;
      }
    }

    i18n.on("languageChanged", onLanguageChanged);
    // Use the server locale through hydration, then apply any older local override.
    const storedLocale = readStoredFixtureLocale(initialLocale);
    if (storedLocale !== i18n.language) {
      void i18n.changeLanguage(storedLocale);
    }
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, [i18n, initialLocale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale(nextLocale) {
        window.localStorage.removeItem(localeStorageKey);
        document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
        void i18n.changeLanguage(nextLocale);
      },
    }),
    [i18n, locale],
  );

  return (
    <I18nextProvider i18n={i18n}>
      <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    </I18nextProvider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error("useLocale must be used inside I18nProvider.");
  }

  return value;
}

function readStoredFixtureLocale(fallbackLocale: SupportedLocale) {
  if (typeof window === "undefined") {
    return fallbackLocale;
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);

  return storedLocale && isSupportedLocale(storedLocale)
    ? storedLocale
    : fallbackLocale;
}
