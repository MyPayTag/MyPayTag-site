import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";

import { AppAuthProvider } from "@/components/cubid/app-auth-provider";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { SiteHeader } from "@/components/navigation/site-header";
import { detectLocaleFromRequestHeaders } from "@/lib/i18n/detection";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyPayTag",
  description:
    "A Paytag layer for crypto apps, PayingDapps, PayToDapps, wallets, and users.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = detectLocaleFromRequestHeaders(await headers());

  return (
    <html
      lang={initialLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider initialLocale={initialLocale}>
          <AppAuthProvider>
            <SiteHeader />
            {children}
          </AppAuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
