"use client";

import type { TOptions } from "i18next";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type {
  TranslationKey,
  TranslationNamespace,
} from "@/lib/i18n/namespaces";

export function useTypedTranslation<N extends TranslationNamespace>(namespace: N) {
  const translation = useTranslation(namespace);
  const { t } = translation;
  const translate = useCallback(
    (key: TranslationKey<N>, options?: TOptions) => t(key as string, options),
    [t],
  );

  return {
    ...translation,
    t: translate,
  };
}
