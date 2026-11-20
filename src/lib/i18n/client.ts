"use client";

import { createInstance } from "i18next";

import { defaultLocale, type SupportedLocale } from "@/lib/i18n/config";
import { translationNamespaces } from "@/lib/i18n/namespaces";
import { resources } from "@/lib/i18n/resources";

export function createClientI18n(initialLocale: SupportedLocale = defaultLocale) {
  const i18next = createInstance();
  void i18next.init({
    defaultNS: "common",
    fallbackLng: defaultLocale,
    initAsync: false,
    interpolation: {
      escapeValue: false,
    },
    lng: initialLocale,
    resources,
    ns: translationNamespaces,
    supportedLngs: Object.keys(resources),
  });
  return i18next;
}
