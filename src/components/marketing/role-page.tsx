"use client";

import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";
import { EarlyAccessForm } from "./early-access-form";
import { Action, MarketingHero, MarketingShell, PaymentJourney, PhotoSection } from "./marketing-shell";

type Audience = "payor" | "payee" | "user";
const configurations = {
  payor: { image: "payor-road", cta: "payorCta", href: "/api-docs", prefix: "payor" },
  payee: { image: "payee-coast", cta: "payeeCta", href: "/reference", prefix: "payee" },
  user: { image: "user-road", cta: "earlyAccess", href: "#early-access", prefix: "user" },
} as const;

export function RolePage({ audience }: { audience: Audience }) {
  const { t } = useTypedTranslation("marketingPages");
  const config = configurations[audience];
  const p = config.prefix;
  return <MarketingShell>
    <MarketingHero image={config.image} eyebrow={t(`${p}Eyebrow`)} title={t(`${p}Title`)} description={t(`${p}Intro`)} cta={t(config.cta)} href={config.href} secondary={t("how")} secondaryHref="#how-it-works" />
    <section className="mpt-paper mpt-section"><div className="mpt-wrap"><div className="mpt-section-heading mpt-reveal"><p className="mpt-eyebrow">{t(`${p}Eyebrow`)}</p><h2>{t(`${p}BenefitTitle`)}</h2><p className="mpt-intro">{t(`${p}BenefitText`)}</p></div><div className="mpt-benefits">{([1, 2, 3] as const).map((n) => <div className="mpt-benefit mpt-reveal" key={n}><span className="mpt-index">0{n}</span><h3>{t(`${p}B${n}Title`)}</h3><p>{t(`${p}B${n}Text`)}</p></div>)}</div></div></section>
    <PhotoSection image={config.image} eyebrow={t("example")} title={t(`${p}SceneTitle`)} text={t(`${p}SceneText`)}><PaymentJourney /></PhotoSection>
    <section className="mpt-paper mpt-section" id="how-it-works"><div className="mpt-wrap mpt-process"><div className="mpt-process-heading mpt-reveal"><p className="mpt-eyebrow">{t("how")}</p><h2>{t(`${p}ProcessTitle`)}</h2>{audience !== "user" && <Action href={config.href} dark>{t(config.cta)}</Action>}</div><ol className="mpt-steps">{([1, 2, 3, 4] as const).map((n) => <li key={n} className="mpt-reveal"><span className="mpt-index">0{n}</span><div><h3>{t(`${p}S${n}Title`)}</h3><p>{t(`${p}S${n}Text`)}</p></div></li>)}</ol></div></section>
    <PhotoSection image={config.image} eyebrow={t(config.cta)} title={t(`${p}FinalTitle`)} text={t(`${p}FinalText`)} id="early-access">{audience === "user" ? <EarlyAccessForm audience="user" /> : <div className="mpt-actions"><Action href={config.href}>{t(config.cta)}</Action></div>}</PhotoSection>
  </MarketingShell>;
}
