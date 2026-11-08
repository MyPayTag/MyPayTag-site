"use client";

import { Languages } from "lucide-react";

import { useLocale } from "@/components/i18n/i18n-provider";
import { supportedLocales, type SupportedLocale } from "@/lib/i18n/config";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

const localeLabels: Record<SupportedLocale, "localeEnglish" | "localeSwedish" | "localePseudo"> = {
  en: "localeEnglish",
  sv: "localeSwedish",
  "en-XA": "localePseudo",
};

export function LocaleFixtureControl() {
  const { locale, setLocale } = useLocale();
  const { t: tDeveloper } = useTypedTranslation("developer");
  const { t: tSettings } = useTypedTranslation("settings");

  return (
    <section className="rounded-lg border border-[#d9dfd1] bg-white p-5">
      <div className="flex items-start gap-3">
        <Languages className="mt-0.5 text-[#245c8d]" size={22} aria-hidden="true" />
        <div>
          <h2 className="text-xl font-semibold">{tDeveloper("localeFixtureTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-[#586250]">
            {tDeveloper("localeFixtureDescription")}
          </p>
        </div>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-semibold text-[#33402f]" htmlFor="locale-fixture">
        {tSettings("localeLabel")}
        <select
          className="h-10 rounded-md border border-[#cbd4c3] bg-white px-3 text-sm font-normal outline-none focus:border-[#176b46] focus:ring-2 focus:ring-[#dcebdd]"
          id="locale-fixture"
          onChange={(event) => setLocale(event.target.value as SupportedLocale)}
          value={locale}
        >
          {supportedLocales.map((supportedLocale) => (
            <option key={supportedLocale} value={supportedLocale}>
              {tSettings(localeLabels[supportedLocale])}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-3 rounded-md border border-[#d9dfd1] bg-[#fbfcf8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#586250]">
        {tSettings(localeLabels[locale])}
      </p>
    </section>
  );
}
