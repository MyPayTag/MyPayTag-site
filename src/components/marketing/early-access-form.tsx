"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useLocale } from "@/components/i18n/i18n-provider";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

export function EarlyAccessForm({ audience = "general" }: { audience?: "general" | "user" | "payor" | "payee" }) {
  const { t } = useTypedTranslation("marketingPages");
  const { locale } = useLocale();
  const id = useId();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error" | "unavailable" | "rate">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "saving") return;
    const form = new FormData(event.currentTarget);
    setStatus("saving");
    try {
      const response = await fetch("/api/early-access", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), consent: form.get("consent") === "on", website: form.get("website"), audience, locale }) });
      setStatus(response.ok ? "success" : response.status === 429 ? "rate" : response.status === 503 ? "unavailable" : "error");
    } catch { setStatus("error"); }
  }
  return <div className="mpt-signup">
    {status === "success" ? <div className="mpt-signup-success" role="status"><Check size={25} aria-hidden="true" /><p>{t("signupSuccess")}</p></div> : <form onSubmit={submit}>
      <label htmlFor={`${id}-email`} className="mpt-form-label">{t("email")}</label>
      <div className="mpt-email-row"><input id={`${id}-email`} name="email" type="email" autoComplete="email" data-lpignore="true" data-1p-ignore="true" aria-describedby={`${id}-privacy`} placeholder={t("emailPlaceholder")} maxLength={254} required disabled={status === "saving"} /><button type="submit" disabled={status === "saving"}>{t(status === "saving" ? "joining" : "join")}<ArrowUpRight size={19} aria-hidden="true" /></button></div>
      <div className="mpt-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Website<input id={`${id}-website`} type="text" name="website" autoComplete="off" tabIndex={-1} /></label></div>
      <label className="mpt-consent"><input type="checkbox" name="consent" required disabled={status === "saving"} />{t("consent")}</label>
      <p className="mpt-privacy" id={`${id}-privacy`}>{t("privacyLine")}</p>
      {(status === "error" || status === "unavailable" || status === "rate") && <p role="alert" className="mpt-signup-error">{t(status === "rate" ? "signupRate" : status === "unavailable" ? "signupUnavailable" : "signupError")}</p>}
    </form>}
  </div>;
}
