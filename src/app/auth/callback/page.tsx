"use client";

import Link from "next/link";
import { CubidAuthCallback, useOptionalCubidAuth } from "@cubid/auth-react";

import { BackButton } from "@/components/navigation/back-button";
import { missingCubidPublicConfig } from "@/lib/cubid/public-config";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

export default function CubidCallbackPage() {
  const auth = useOptionalCubidAuth();
  const missing = missingCubidPublicConfig();
  const { t } = useTypedTranslation("auth");

  if (missing.length > 0 || !auth) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f7f4] px-6 py-6 text-[#141914]">
        <BackButton desktopPadding="0rem" maxWidth="32rem" />
        <section className="w-full max-w-lg rounded-lg border border-[#d9ddd2] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{t("callbackTitle")}</h1>
          <p className="mt-3 text-sm leading-6 text-[#596456]">
            {t("callbackMissingDescription")}
          </p>
          <p className="mt-4 rounded-md border border-[#e4d4a1] bg-[#fffbea] p-3 text-sm leading-6 text-[#665313]">
            {t("missingConfigDetail", { values: missing.join(", ") || "Cubid auth provider" })}
          </p>
          <Link
            className="mt-5 inline-flex h-10 items-center rounded-md bg-[#1f6f50] px-4 text-sm font-semibold text-white"
            href="/"
          >
            {t("callbackReturn")}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f7f4] px-6 py-6 text-[#141914]">
      <BackButton desktopPadding="0rem" maxWidth="32rem" />
      <section className="w-full max-w-lg rounded-lg border border-[#d9ddd2] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">{t("callbackCompleteTitle")}</h1>
        <div className="mt-4 rounded-md border border-[#dce2d6] bg-[#f8faf6] p-4 text-sm leading-6">
          <CubidAuthCallback
            loadingFallback={t("callbackLoading")}
            successFallback={
              <div>
                <p>{t("callbackSuccess")}</p>
                <Link
                  className="mt-3 inline-flex font-semibold text-[#1f6f50] underline-offset-4 hover:underline"
                  href="/"
                >
                  {t("callbackReturn")}
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </main>
  );
}
