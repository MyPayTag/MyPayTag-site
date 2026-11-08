"use client";

import { useOptionalCubidAuth } from "@cubid/auth-react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { CubidSessionControl } from "@/components/cubid/session-control";
import { missingCubidPublicConfig } from "@/lib/cubid/public-config";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

interface SignedInOnlyProps {
  children: ReactNode;
  description: string;
  title: string;
}

export function SignedInOnly({ children, description, title }: SignedInOnlyProps) {
  const auth = useOptionalCubidAuth();
  const missing = missingCubidPublicConfig();
  const { t } = useTypedTranslation("auth");

  if (missing.length > 0 || !auth) {
    return (
      <AccessPanel
        description={t("missingConfigDescription")}
        detail={t("missingConfigDetail", { values: missing.join(", ") || "Cubid auth provider" })}
        title={t("missingConfigTitle")}
      />
    );
  }

  if (auth.status === "idle" || auth.status === "loading") {
    return (
      <AccessPanel
        description={t("checkingDescription")}
        title={t("checkingTitle")}
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#586250]">
          <LoaderCircle className="animate-spin" size={17} aria-hidden="true" />
          {t("checkingTitle")}
        </span>
      </AccessPanel>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <AccessPanel
        description={description}
        title={title}
        detail={t("signInDetail")}
      >
        <CubidSessionControl />
      </AccessPanel>
    );
  }

  return (
    <>
      <div className="sr-only">{t("signedInWithCubid")}</div>
      {children}
    </>
  );
}

function AccessPanel({
  children,
  description,
  detail,
  title,
}: {
  children?: ReactNode;
  description: string;
  detail?: string;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-6 py-12 text-[#151713]">
      <section className="mx-auto max-w-lg rounded-lg border border-[#d9dfd1] bg-white p-6 shadow-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e4f2e6] text-[#176b46]">
          <ShieldCheck size={23} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold leading-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#586250]">{description}</p>
        {detail ? (
          <p className="mt-4 rounded-md border border-[#e4d4a1] bg-[#fffbea] p-3 text-sm leading-6 text-[#665313]">
            {detail}
          </p>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
      </section>
    </main>
  );
}
