"use client";

import {
  BadgeCheck,
  BanknoteArrowDown,
  Check,
  Code2,
  Gift,
  Landmark,
  Network,
  PlugZap,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Tags,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

type TrackId = "sending" | "receiving" | "users";

const tracks: Record<
  TrackId,
  {
    accent: string;
    audience: string;
    benefits: Array<{ icon: typeof Code2; title: string; text: string }>;
    eyebrow: string;
    features: string[];
    intro: string;
    title: string;
  }
> = {
  sending: {
    accent: "#176b46",
    audience: "For PayingDapp devs",
    eyebrow: "Expand what your app can send",
    title: "Send to any user by Paytag.",
    intro:
      "PayingDapps call MyPayTag with a user-approved Paytag, amount, and supported paths instead of collecting wallet details.",
    benefits: [
      {
        icon: Code2,
        title: "MVP resolver path",
        text: "Resolve a Paytag through MyPayTag, then use the selected PayToDapp provider intent.",
      },
      {
        icon: Network,
        title: "Clear boundaries",
        text: "Cubid handles identity and consent; MyPayTag handles route preference and provider intent orchestration.",
      },
      {
        icon: Repeat2,
        title: "Future optimization",
        text: "Solver fanout, bridging, and exchanging are execution-adapter extensions, not MVP requirements.",
      },
      {
        icon: BanknoteArrowDown,
        title: "Fee control",
        text: "You set your own fees. If you use our exchange service, MyPayTag takes a percentage of your fees.",
      },
    ],
    features: [
      "Reach users without storing their wallets",
      "Play nicely with every PayToDapp in the ecosystem",
      "Keep control over fees and user experience",
      "Reduce support caused by wrong-chain and wrong-address sends",
    ],
  },
  receiving: {
    accent: "#245c8d",
    audience: "For PayToDapps and wallets",
    eyebrow: "Turn users into distribution",
    title: "Let your users market your wallet for you.",
    intro:
      "Users share one globally recognized Paytag, and your app creates provider intents only when MyPayTag selects your route.",
    benefits: [
      {
        icon: Gift,
        title: "Inbound growth",
        text: "Every Paytag your users share can bring eligible payments back to your app-managed receive experience.",
      },
      {
        icon: WalletCards,
        title: "Less top-up friction",
        text: "Reduce reliance on on-ramps by letting other apps send value directly to your users.",
      },
      {
        icon: PlugZap,
        title: "Account abstraction",
        text: "Give users a simpler receive experience without asking every sender to understand your wallet stack.",
      },
      {
        icon: Landmark,
        title: "Zero inbound fees",
        text: "Pay nothing to set up and nothing for inbound transfers. Watch balances grow for your users.",
      },
    ],
    features: [
      "Register supported routes from inside your wallet flow",
      "Stay compatible with PayingDapps across the ecosystem",
      "Own the receive experience and route registration",
      "Keep users engaged without forcing manual address sharing",
    ],
  },
  users: {
    accent: "#6a5c1f",
    audience: "For users",
    eyebrow: "A simpler way to get paid",
    title: "Connect your apps and wallets with one Paytag.",
    intro:
      "Set up the tag from your favorite wallet, then tell other apps this is how you want to get paid.",
    benefits: [
      {
        icon: Tags,
        title: "One tag",
        text: "Use a globally recognized Paytag instead of copying addresses across every app.",
      },
      {
        icon: ShieldCheck,
        title: "Pre-approved receives",
        text: "Apps can send any token, but you only receive tokens and routes you have approved.",
      },
      {
        icon: Sparkles,
        title: "No routing hassle",
        text: "MyPayTag handles approved route selection, with NEAR 1Click covering MVP swap and bridge execution for the first SmarTrust path.",
      },
      {
        icon: BadgeCheck,
        title: "Free to receive",
        text: "You pay nothing to receive funds. Sender apps set their fees and pay the fees.",
      },
    ],
    features: [
      "Create identity and consent in Cubid-owned flows",
      "Share the same tag across apps",
      "Receive only through routes you approve",
      "Let optimized routing handle the messy parts",
    ],
  },
};

const trackOrder: TrackId[] = ["sending", "receiving", "users"];

export function MarketingTracks() {
  const [selectedTrack, setSelectedTrack] = useState<TrackId | null>(null);
  const visibleTracks = selectedTrack ? [selectedTrack] : trackOrder;

  return (
    <section className="border-b border-[#d9dfd1] bg-[#fbfcf8]" id="tracks">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176b46]">
            Choose a track
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">
            What role do you play?
          </h2>
          <p className="mt-4 text-base leading-7 text-[#586250]">
            MyPayTag connects three groups. All benefits are visible until
            you pick the role that matches your product.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {trackOrder.map((trackId) => {
            const option = tracks[trackId];
            const active = selectedTrack === trackId;

            return (
              <button
                className={`inline-flex h-11 items-center gap-3 rounded-md border px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                  active
                    ? "border-[#121612] bg-white text-[#121612] shadow-sm"
                    : "border-[#d9dfd1] bg-[#f6f7f2] hover:border-[#b9c7ad]"
                }`}
                key={trackId}
                onClick={() => setSelectedTrack(active ? null : trackId)}
                type="button"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: option.accent }}
                />
                <span>{option.audience}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-sm border ${
                    active
                      ? "border-[#121612] bg-[#121612] text-white"
                      : "border-[#b9c7ad] bg-white text-transparent"
                  }`}
                >
                  <Check size={14} aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-10 border-t border-[#d9dfd1] pt-10">
          {visibleTracks.map((trackId) => {
            const track = tracks[trackId];

            return (
              <section
                className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"
                key={trackId}
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#586250]">
                    {track.eyebrow}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold leading-tight text-[#121612] sm:text-4xl">
                    {track.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-[#586250]">
                    {track.intro}
                  </p>
                  <ul className="mt-8 grid gap-3">
                    {track.features.map((feature) => (
                      <li className="flex gap-3 text-sm leading-6 text-[#3f493a]" key={feature}>
                        <span
                          className="mt-2 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: track.accent }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {track.benefits.map((benefit) => {
                    const Icon = benefit.icon;

                    return (
                      <div className="rounded-md border border-[#d9dfd1] bg-white p-5" key={benefit.title}>
                        <Icon style={{ color: track.accent }} size={22} aria-hidden="true" />
                        <h4 className="mt-4 text-lg font-semibold text-[#121612]">
                          {benefit.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-[#586250]">{benefit.text}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
