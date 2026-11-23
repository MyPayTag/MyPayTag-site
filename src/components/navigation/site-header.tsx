"use client";

import Link from "next/link";
import { CubidSessionControl } from "@/components/cubid/session-control";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { HeaderLocaleSwitcher } from "@/components/i18n/header-locale-switcher";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";
import { audiencePages } from "@/components/marketing/marketing-shell";

export function SiteHeader() {
  const { t } = useTypedTranslation("marketingPages");
  const { t: nav } = useTypedTranslation("navigation");
  const path = usePathname();
  const close = (event: React.MouseEvent<HTMLAnchorElement>) => event.currentTarget.closest("details")?.removeAttribute("open");
  return <header className="mpt-header">
    <a className="mpt-skip" href="#page-content">{t("skip")}</a>
    <div className="mpt-header-inner">
      <Link className="mpt-wordmark" href="/" aria-label="MyPayTag">MyPayTag<span aria-hidden="true">↗</span></Link>
      <nav className="mpt-main-nav" aria-label={t("explore")}>
        <details className="mpt-nav-dropdown" onKeyDown={(event) => { if (event.key === "Escape") { event.currentTarget.removeAttribute("open"); event.currentTarget.querySelector("summary")?.focus(); } }}>
          <summary>{t("roles")}<ChevronDown size={14} aria-hidden="true" /></summary>
          <div className="mpt-role-menu">{audiencePages.map((role) => <Link key={role.id} href={role.href} onClick={close} aria-current={path === role.href ? "page" : undefined}><span>{t(role.label)}<ArrowUpRight size={17} aria-hidden="true" /></span><small>{t(role.short)}</small></Link>)}</div>
        </details>
        <Link className="mpt-nav-secondary" href="/api-docs">{t("docs")}</Link>
        <Link className="mpt-nav-secondary" href="/blog">{nav("blog")}</Link>
        <details className="mpt-nav-dropdown mpt-account-dropdown" onKeyDown={(event) => { if (event.key === "Escape") event.currentTarget.removeAttribute("open"); }}><summary>{t("account")}<ChevronDown size={14} aria-hidden="true" /></summary><div className="mpt-account-menu">{([['/settings', 'settings'], ['/history', 'history'], ['/enter-paytag', 'enterPaytag'], ['/developer', 'developer'], ['/api-playground', 'playground']] as const).map(([href,key]) => <Link href={href} onClick={close} key={href}>{nav(key)}</Link>)}<div className="mpt-account-session"><CubidSessionControl /></div></div></details>
      </nav>
      <div className="mpt-header-actions">

        <HeaderLocaleSwitcher />
        <Link className="mpt-header-cta" href="/#early-access">{t("earlyAccess")}<ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </div>
  </header>;
}
