"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";
import { EarlyAccessForm } from "@/components/marketing/early-access-form";
import { audiencePages, MarketingHero, MarketingShell, PaymentJourney, PhotoSection } from "@/components/marketing/marketing-shell";

export function HomePage() {
  const { t } = useTypedTranslation("marketingPages");
  return <MarketingShell>
    <MarketingHero image="home-coast" eyebrow={t("homeEyebrow")} title={t("homeTitle")} description={t("homeIntro")} cta={t("homeCta")} href="#audiences" secondary={t("earlyAccess")} secondaryHref="#early-access" />
    <section className="mpt-paper mpt-section"><div className="mpt-wrap"><div className="mpt-section-heading mpt-reveal"><p className="mpt-eyebrow">{t("homePromiseEyebrow")}</p><h2>{t("homePromiseTitle")}</h2><p className="mpt-intro">{t("homePromiseText")}</p></div><div className="mpt-benefits">{([1, 2, 3] as const).map((n) => <div className="mpt-benefit mpt-reveal" key={n}><span className="mpt-index">0{n}</span><h3>{t(`benefit${n}Title`)}</h3><p>{t(`benefit${n}Text`)}</p></div>)}</div></div></section>
    <PhotoSection image="home-coast" eyebrow={t("brandLine")} title={t("homeSceneTitle")} text={t("homeSceneText")}><PaymentJourney /></PhotoSection>
    <section className="mpt-paper mpt-section" id="audiences"><div className="mpt-wrap"><div className="mpt-section-heading mpt-reveal"><p className="mpt-eyebrow">{t("roles")}</p><h2>{t("homeRolesTitle")}</h2><p className="mpt-intro">{t("homeRolesText")}</p></div><div className="mpt-audiences">{audiencePages.map((role, i) => <Link className="mpt-audience-link mpt-reveal" key={role.id} href={role.href}><span className="mpt-index">0{i + 1}</span><div><p>{t(role.label)}</p><h3>{t(role.short)}</h3></div><ArrowUpRight aria-hidden="true" /></Link>)}</div></div></section>
    <PhotoSection image="home-coast" eyebrow={t("earlyAccess")} title={t("homeFinalTitle")} text={t("homeFinalText")} id="early-access"><EarlyAccessForm /></PhotoSection>
  </MarketingShell>;
}
