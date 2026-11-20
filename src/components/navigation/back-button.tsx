"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";

import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

interface BackButtonProps {
  desktopPadding?: string;
  fallbackHref?: string;
  mobilePadding?: string;
  maxWidth?: string;
}

export function BackButton({
  desktopPadding = "2rem",
  fallbackHref = "/",
  mobilePadding = "1.5rem",
  maxWidth = "80rem",
}: BackButtonProps) {
  const { t } = useTypedTranslation("buttons");
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <div
      className="content-back-button-shell"
      style={{
        "--back-desktop-padding": desktopPadding,
        "--back-max-width": maxWidth,
        "--back-mobile-padding": mobilePadding,
      } as CSSProperties}
    >
      <button
        aria-label={t("back")}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cbd4c3] bg-white px-4 text-sm font-semibold text-[#2c3429] shadow-sm transition hover:bg-[#f1f4ec] focus:outline-none focus:ring-2 focus:ring-[#176b46] focus:ring-offset-2"
        onClick={goBack}
        type="button"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        {t("back")}
      </button>
    </div>
  );
}
