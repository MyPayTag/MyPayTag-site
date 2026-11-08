"use client";

import { Github } from "lucide-react";
import Link from "next/link";

import { HeaderLocaleSwitcher } from "@/components/i18n/header-locale-switcher";
import { CubidSessionControl } from "@/components/cubid/session-control";
import { useTypedTranslation } from "@/lib/i18n/use-typed-translation";

export function SiteHeader() {
  const { t: tNav } = useTypedTranslation("navigation");

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9dfd1] bg-[#fbfcf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link className="text-base font-semibold text-[#121612]" href="/">
          MyPayTag
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#4f5a49]">
          <Link className="hover:text-[#176b46]" href="/#tracks">
            {tNav("tracks")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/blog">
            {tNav("blog")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/enter-paytag">
            {tNav("enterPaytag")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/api-docs">
            {tNav("apiDocs")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/api-playground">
            {tNav("playground")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/reference">
            {tNav("reference")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/history">
            {tNav("history")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/settings">
            {tNav("settings")}
          </Link>
          <Link className="hover:text-[#176b46]" href="/developer">
            {tNav("developer")}
          </Link>
          <a
            className="inline-flex items-center gap-1.5 hover:text-[#176b46]"
            href="https://github.com/myPayTag"
            rel="noreferrer"
            target="_blank"
          >
            <Github size={15} aria-hidden="true" />
            {tNav("github")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <HeaderLocaleSwitcher />
          <CubidSessionControl />
        </div>
      </div>
    </header>
  );
}
