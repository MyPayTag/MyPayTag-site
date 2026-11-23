"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

export const audiencePages = [
  { id: "payor", href: "/for/payor-apps", label: "payorLabel", short: "payorShort" },
  { id: "payee", href: "/for/payee-apps", label: "payeeLabel", short: "payeeShort" },
  { id: "user", href: "/for/users", label: "userLabel", short: "userShort" },
] as const;

export function MarketingShell({ children }: { children: ReactNode }) {
  const { t } = useTypedTranslation("marketingPages");
  const [paused, setPaused] = useState(false);
  return (
    <main className="mpt-marketing" data-motion={paused ? "paused" : "playing"}>
      {children}
      <footer className="mpt-footer">
        <div className="mpt-wrap mpt-footer-inner">
          <div><Link className="mpt-wordmark" href="/">MyPayTag<span>↗</span></Link><p>{t("allRights")}</p></div>
          <div className="mpt-footer-links">
            <Link href="/api-docs">{t("docs")}</Link>
            <Link href="/#audiences">{t("explore")}</Link>
            <button type="button" className="mpt-motion-control" onClick={() => setPaused(!paused)} aria-pressed={paused}>
              {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
              {t(paused ? "resume" : "pause")}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function Landscape({ name, priority = false }: { name: string; priority?: boolean }) {
  return <div className="mpt-landscape" aria-hidden="true"><Image src={`/images/marketing/${name}.webp`} alt="" fill sizes="100vw" priority={priority} className="mpt-landscape-image" /><div className="mpt-image-shade" /></div>;
}

export function MarketingHero({ image, eyebrow, title, description, cta, href, secondary, secondaryHref, children }: {
  image: string; eyebrow: string; title: string; description: string; cta: string; href: string; secondary: string; secondaryHref: string; children?: ReactNode;
}) {
  return <section className="mpt-hero mpt-photo-panel">
    <Landscape name={image} priority />
    <div className="mpt-wrap mpt-hero-inner">
      <div className="mpt-hero-copy"><p className="mpt-eyebrow mpt-entrance">MyPayTag / {eyebrow}</p><h1 className="mpt-entrance">{title}</h1><p className="mpt-lede mpt-entrance">{description}</p><div className="mpt-actions mpt-entrance"><Action href={href}>{cta}</Action><a href={secondaryHref} className="mpt-text-action">{secondary}<ArrowDown size={16} aria-hidden="true" /></a></div></div>
      {children}
      <span className="mpt-hero-bottom" aria-hidden="true">01 — MyPayTag <span>↘</span></span>
    </div>
  </section>;
}

export function Action({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return <Link href={href} className={`mpt-action${dark ? " mpt-action-dark" : ""}`}>{children}<ArrowUpRight size={18} aria-hidden="true" /></Link>;
}

export function PhotoSection({ image, eyebrow, title, text, children, id }: { image: string; eyebrow: string; title: string; text?: string; children?: ReactNode; id?: string }) {
  return <section id={id} className="mpt-photo-panel mpt-scene"><Landscape name={image} /><div className="mpt-wrap mpt-scene-inner"><div className="mpt-scene-copy mpt-reveal"><p className="mpt-eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="mpt-lede">{text}</p>}{children}</div></div></section>;
}

export function PaymentJourney({ compact = false }: { compact?: boolean }) {
  const { t } = useTypedTranslation("marketingPages");
  return <div className={compact ? "mpt-journey mpt-journey-compact" : "mpt-journey"}>
    <p className="mpt-eyebrow">{t("exampleNote")}</p>
    <div className="mpt-journey-route"><div><span>{t("sender")}</span><strong>{t("fromExample")}</strong></div><span className="mpt-route-arrow" aria-hidden="true">↗</span><div><span>{t("preferred")}</span><strong>{t("toExample")}</strong></div></div>
    <div className="mpt-tag-line"><span className="mpt-tag-mark" aria-hidden="true">↗</span><span>alex@cubid.mypaytag</span><span className="mpt-tag-caption">{t("paytag")}</span></div>
  </div>;
}
