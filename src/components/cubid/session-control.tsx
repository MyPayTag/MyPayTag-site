"use client";

import {
  CubidSignInButton,
  CubidSignOutButton,
  useOptionalCubidAuth,
} from "@cubid/auth-react";
import { CheckCircle2, LoaderCircle, LogIn } from "lucide-react";
import { useState } from "react";

import { missingCubidPublicConfig } from "@/lib/cubid/public-config";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

export function CubidSessionControl() {
  const auth = useOptionalCubidAuth();
  const missing = missingCubidPublicConfig();
  const { t } = useTypedTranslation("auth");
  const { t: tButton } = useTypedTranslation("buttons");
  const [signInError, setSignInError] = useState(false);

  if (missing.length > 0 || !auth) {
    return (
      <div className="rounded-md border border-[#e4d4a1] bg-[#fffbea] px-4 py-3 text-sm text-[#665313]">
        {t("sessionMissingConfig")}
      </div>
    );
  }

  if (auth.status === "idle" || auth.status === "loading") {
    return (
      <div className="inline-flex h-11 items-center gap-2 rounded-md border border-[#cbd4c3] bg-white px-4 text-sm font-semibold text-[#586250]">
        <LoaderCircle className="animate-spin" size={17} aria-hidden="true" />
        {t("sessionChecking")}
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-11 items-center gap-2 rounded-md border border-[#b9c7ad] bg-[#eef7ef] px-4 text-sm font-semibold text-[#176b46]">
          <CheckCircle2 size={17} aria-hidden="true" />
          {t("signedInWithCubid")}
        </span>
        <CubidSignOutButton className="inline-flex h-11 items-center justify-center rounded-md border border-[#cbd4c3] bg-white px-4 text-sm font-semibold text-[#2c3429] transition hover:bg-[#f1f4ec]">
          {tButton("signOut")}
        </CubidSignOutButton>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <CubidSignInButton
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#176b46] px-5 text-sm font-semibold text-white transition hover:bg-[#12583a] disabled:bg-[#aeb8a6]"
        onError={() => setSignInError(true)}
        onLaunched={() => setSignInError(false)}
      >
        <LogIn size={17} aria-hidden="true" />
        {tButton("signIn")}
      </CubidSignInButton>
      {signInError || auth.status === "error" ? (
        <p className="rounded-md border border-[#e4d4a1] bg-[#fffbea] p-3 text-sm leading-6 text-[#665313]">
          {t("sessionLaunchError")}
        </p>
      ) : null}
    </div>
  );
}
