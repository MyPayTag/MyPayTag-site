export const defaultLocale = "en";

export const supportedLocales = ["en", "sv", "en-XA"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const productionLocales = ["en", "sv"] as const;

export type ProductionLocale = (typeof productionLocales)[number];

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export function normalizeLocale(value: string | null | undefined): SupportedLocale {
  if (!value) {
    return defaultLocale;
  }

  const normalized = value.trim();

  if (isSupportedLocale(normalized)) {
    return normalized;
  }

  const baseLanguage = normalized.split("-")[0];

  if (baseLanguage === "sv") {
    return "sv";
  }

  return defaultLocale;
}
