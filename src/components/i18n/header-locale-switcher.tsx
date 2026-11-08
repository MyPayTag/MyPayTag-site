"use client";

import { ChevronDown, Languages } from "lucide-react";

import { useLocale } from "@/components/i18n/i18n-provider";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

export function HeaderLocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const { t } = useTypedTranslation("settings");

  return (
    <label className="relative inline-flex h-10 min-w-12 items-center justify-center gap-1.5 rounded-md border border-[#cbd4c3] bg-white px-2 text-[#33402f] hover:border-[#176b46] focus-within:ring-2 focus-within:ring-[#176b46]">
      {locale === "en" && <Flag language="en" />}
      {locale === "sv" && <Flag language="sv" />}
      {locale === "en-XA" && <Languages size={19} aria-hidden="true" />}
      <ChevronDown size={13} aria-hidden="true" />
      <select
        aria-label={t("localeLabel")}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        value={locale}
        onChange={(event) => {
          const next = event.currentTarget.value;
          if (next === "en" || next === "sv") setLocale(next);
        }}
      >
        <option value="en" lang="en">English</option>
        <option value="sv" lang="sv">Svenska</option>
        {locale === "en-XA" && <option value="en-XA" disabled>{t("localePseudo")}</option>}
      </select>
    </label>
  );
}

function Flag({ language }: { language: "en" | "sv" }) {
  return (
    <svg aria-hidden="true" className="h-4 w-6 rounded-[2px]" viewBox="0 0 30 20">
      {language === "sv" ? (
        <>
          <path fill="#006aa7" d="M0 0h30v20H0z" />
          <path fill="#fecc00" d="M9 0h4v20H9zM0 8h30v4H0z" />
        </>
      ) : (
        <>
          <path fill="#012169" d="M0 0h30v20H0z" />
          <path stroke="#fff" strokeWidth="4" d="m0 0 30 20m0-20L0 20" />
          <path stroke="#c8102e" strokeWidth="1.5" d="m0 0 30 20m0-20L0 20" />
          <path stroke="#fff" strokeWidth="6" d="M15 0v20M0 10h30" />
          <path stroke="#c8102e" strokeWidth="3.5" d="M15 0v20M0 10h30" />
        </>
      )}
    </svg>
  );
}
