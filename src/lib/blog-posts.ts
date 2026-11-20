export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  body: BlogBlock[];
}

export type BlogBlock =
  | {
    type: "paragraph";
    text: string;
  }
  | {
    type: "heading";
    text: string;
  }
  | {
    type: "list";
    items: string[];
  }
  | {
    type: "code";
    code: string;
  };

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-mypaytag-pay-users-not-wallet-addresses",
    title: "Introducing MyPayTag: Pay Users, Not Wallet Addresses",
    description:
      "MyPayTag helps apps pay users through approved identity and consented payment intents instead of copied wallet addresses.",
    category: "Product / Vision",
    publishedAt: "2026-06-24",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "Crypto payments still ask too much of users and too little of apps. If an app needs to pay someone, the default answer is usually a wallet address: paste it, store it, hope it is current, and hope it belongs to the right person on the right chain.",
      },
      {
        type: "paragraph",
        text: "That address-centric model is brittle. Users have many wallets, many chains, rotating preferences, and different receive paths for different contexts. Apps should not have to guess where funds should land, and users should not have to expose more of their wallet graph just to get paid.",
      },
      {
        type: "heading",
        text: "A pay-to identifier is not a wallet address",
      },
      {
        type: "paragraph",
        text: "MyPayTag starts from a different question: what user-approved identifier can an app pay to? A verified email-like stamp, domain-like stamp, public pay-to handle, or other approved identifier can become the entry point for payment resolution without becoming a permanent public wallet endpoint.",
      },
      {
        type: "paragraph",
        text: "The resolver does not turn that identifier into a durable address book record. It turns the request into a scoped, consent-aware payment intent that fits the current app, user, asset, route, and authorization state.",
      },
      {
        type: "heading",
        text: "Powered by Cubid, separate from Cubid",
      },
      {
        type: "paragraph",
        text: "Cubid provides the identity and consent substrate: verified stamps, app-scoped user identity, and user-facing approval moments. MyPayTag is the payment-resolution layer that uses that identity context to decide what receive path can be used for a specific payment request.",
      },
      {
        type: "paragraph",
        text: "That separation matters. Cubid is not being treated as a universal payment address, and MyPayTag is not trying to become the identity provider. Each layer has a narrow job.",
      },
      {
        type: "heading",
        text: "For apps that pay and apps that receive",
      },
      {
        type: "list",
        items: [
          "PayingDapps ask the resolver for a payment intent for a user-approved identifier and supported payment paths.",
          "PayToDapps register receive capabilities and, in the MVP path, produce provider-specific payment intents when selected.",
          "Users approve setup, authorizations, and route choices through hosted actions that reveal only the current action context.",
        ],
      },
      {
        type: "paragraph",
        text: "The result is a cleaner primitive: pay the user, not an address copied from yesterday's wallet state.",
      },
      {
        type: "heading",
        text: "Early integrations",
      },
      {
        type: "paragraph",
        text: "We are building with early PayToDapp and PayingDapp partners now. Wallets, embedded wallet providers, payout products, marketplaces, and escrow systems are the first natural fits. If your app helps users receive funds or needs to pay users, MyPayTag is meant to give that workflow a safer default.",
      },
    ],
  },
  {
    slug: "why-crypto-needs-a-pay-to-layer",
    title: "Why Crypto Needs a Pay-To Layer",
    description:
      "Identity, wallets, chains, and apps are fragmented. A pay-to layer connects who should be paid with where funds should safely go.",
    category: "Product / Vision",
    publishedAt: "2026-06-24",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "Crypto has strong primitives for signing, custody, and settlement, but the everyday act of paying a person is still awkward. Apps often know who should receive funds, while payment rails ask where to send funds. That gap is where mistakes, privacy leaks, and abandoned flows appear.",
      },
      {
        type: "paragraph",
        text: "A pay-to layer is the missing connective tissue between identity, wallets, chains, and apps. It lets a user present an approved payment identity while retaining control over the actual receive path.",
      },
      {
        type: "heading",
        text: "Names and links are not enough",
      },
      {
        type: "list",
        items: [
          "ENS-style names are useful, but they usually resolve to durable public destinations or public profile records.",
          "Wallet address books help repeat senders, but they do not express user consent, route preference, or app-specific authorization.",
          "Payment links can start a payment flow, but they are usually created by the receiver or provider, not resolved from the payer's user context.",
        ],
      },
      {
        type: "paragraph",
        text: "Each tool solves part of the problem. None of them fully answers how an app should pay a user when that user may have several wallets, several verified identifiers, and different preferences depending on chain, asset, app, and purpose.",
      },
      {
        type: "heading",
        text: "Payment resolution is a product layer",
      },
      {
        type: "paragraph",
        text: "The hard part is not looking up a string. The hard part is combining consent, preference, route selection, privacy, expiry, and provider behavior into a result the paying app can actually use.",
      },
      {
        type: "paragraph",
        text: "MyPayTag treats those concerns as the product, not as edge cases. A user can authorize a PayingDapp, choose or confirm a PayToDapp route, and receive a scoped payment intent without exposing every eligible wallet or receive provider to the payer.",
      },
      {
        type: "heading",
        text: "User control is the center",
      },
      {
        type: "paragraph",
        text: "The pay-to layer should not become a universal directory of people and wallets. It should help the user decide how they are payable in a specific context. That means route defaults are scoped, action links are opaque, and negative outcomes avoid telling a payer whether an identifier exists, lacks a route, or needs setup.",
      },
      {
        type: "paragraph",
        text: "Crypto needs a pay-to layer because payment destinations are no longer simple. The safer default is to pay an approved user identifier and let the user's authorized receive path produce the payment intent.",
      },
    ],
  },
  {
    slug: "from-wallet-addresses-to-payment-intents",
    title: "From Wallet Addresses to Payment Intents",
    description:
      "A payment resolver should return a structured, scoped, expiring instruction instead of a static wallet address.",
    category: "Developer Education",
    publishedAt: "2026-06-24",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "A wallet address is a destination. A payment intent is a decision package. That difference is the heart of MyPayTag.",
      },
      {
        type: "paragraph",
        text: "When a PayingDapp asks where to send funds, the answer often needs more than a recipient string. It may need a chain, network, asset, amount, expiry, memo or reference, provider-specific instruction, and proof that the user actually authorized this receive path.",
      },
      {
        type: "heading",
        text: "Why static addresses break down",
      },
      {
        type: "list",
        items: [
          "Addresses are durable, so copied values can outlive the user's current preference.",
          "Addresses do not carry consent or route-selection context.",
          "Addresses do not explain whether the receiving provider needs a memo, reference, or hosted flow.",
          "Addresses can expose wallet relationships when reused across apps.",
        ],
      },
      {
        type: "heading",
        text: "What a payment intent adds",
      },
      {
        type: "paragraph",
        text: "The MyPayTag intent is a normalized resolver envelope. It gives the PayingDapp a consistent status, selected path, amount, expiry, single-use behavior, and references while allowing the selected PayToDapp to return the provider-specific instruction needed to execute the payment.",
      },
      {
        type: "paragraph",
        text: "That provider instruction is still constrained by the public contract. It must identify the provider intent, chain, network, asset, amount, expiry, and destination shape. It is not a free-form address blob hidden inside an otherwise normalized response.",
      },
      {
        type: "code",
        code: `{
  "status": "resolved",
  "intent": {
    "schema": "mypaytag.intent.v1",
    "status": "ready",
    "singleUse": true,
    "selectedRoute": {
      "chain": "eip155:8453",
      "network": "base-mainnet",
      "asset": "USDC"
    },
    "paymentInstruction": {
      "type": "provider_json",
      "provider": "example-paytodapp"
    }
  }
}`,
      },
      {
        type: "heading",
        text: "Scoped, expiring, auditable",
      },
      {
        type: "paragraph",
        text: "Payment intents can expire, bind to a specific amount, carry payer and provider references, and support one-time receive routes. They also create a clean audit boundary: the resolver can record that a scoped intent was created without teaching every PayingDapp about private wallet routing internals.",
      },
      {
        type: "paragraph",
        text: "That is why MyPayTag is intent-first. The product promise is not that every payment protocol becomes identical. The promise is that identity-based payment resolution returns a safer, structured instruction envelope instead of asking apps to store and replay raw destinations.",
      },
    ],
  },
  {
    slug: "how-mypaytag-works-the-five-roles",
    title: "How MyPayTag Works: The Five Roles",
    description:
      "A clear mental model for the user, Cubid, the resolver, PayToDapps, and PayingDapps in the MVP flow.",
    category: "Developer Education",
    publishedAt: "2026-06-24",
    readingMinutes: 6,
    body: [
      {
        type: "paragraph",
        text: "MyPayTag is easiest to understand when the roles stay separate. The system is not one giant wallet, identity provider, or payment processor. It is a resolution layer with five participants.",
      },
      {
        type: "heading",
        text: "1. User",
      },
      {
        type: "paragraph",
        text: "The user controls which identifiers can be used to pay them, which apps can request resolution, and which receive route should be preferred for a specific context. The user is not expected to expose every wallet or provider relationship to every payer.",
      },
      {
        type: "heading",
        text: "2. Cubid",
      },
      {
        type: "paragraph",
        text: "Cubid handles identity and consent primitives: verified stamps, app-scoped user identity, and user-facing approval surfaces. Cubid is not treated as a universal public payment id. Its job is to help prove and mediate identity context.",
      },
      {
        type: "heading",
        text: "3. MyPayTag",
      },
      {
        type: "paragraph",
        text: "The resolver connects a PayingDapp request to an authorized receive path. It checks the request, asks for user action when setup or route selection is required, and returns a payment intent when the current context is ready.",
      },
      {
        type: "heading",
        text: "4. PayToDapp",
      },
      {
        type: "paragraph",
        text: "A PayToDapp helps the user receive funds. It may be a wallet, embedded wallet provider, custodial receive account, or another app that can produce a payment instruction for a supported chain, network, and asset.",
      },
      {
        type: "paragraph",
        text: "In the MVP, PayToDapps use Modality B: they register supported routes, and when selected, they produce the provider-specific payment intent. That keeps private receive details closer to the provider that already manages them.",
      },
      {
        type: "heading",
        text: "5. PayingDapp",
      },
      {
        type: "paragraph",
        text: "A PayingDapp is an app that needs to pay a user. It might be a payout product, marketplace, escrow release system, grant tool, payroll flow, or any app where the product already knows who should receive funds.",
      },
      {
        type: "paragraph",
        text: "The PayingDapp submits the recipient identifier, supported payment paths, amount, intent mode, and reference. It receives either a resolved payment intent or a safe action status such as no route or user action required.",
      },
      {
        type: "heading",
        text: "Why the separation matters",
      },
      {
        type: "paragraph",
        text: "The role split prevents accidental overreach. Cubid does identity, PayToDapps provide receive paths, PayingDapps request intents, and the resolver coordinates payment resolution without turning itself into a public wallet graph.",
      },
    ],
  },
  {
    slug: "paytodapp-vs-payingdapp-which-one-are-you",
    title: "PayToDapp vs PayingDapp: Which One Are You?",
    description:
      "A practical guide for deciding whether your product provides receive paths, requests payment intents, or does both.",
    category: "Developer Education",
    publishedAt: "2026-06-24",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "MyPayTag uses two developer-facing roles because payment products tend to face one of two directions. Some apps help users receive funds. Other apps need to pay users. A few do both.",
      },
      {
        type: "heading",
        text: "You are a PayToDapp if you provide a receive path",
      },
      {
        type: "paragraph",
        text: "A PayToDapp is selected when a user wants funds to land through your product. Wallets, embedded wallet systems, provider-managed accounts, and receive-routing services are natural PayToDapps.",
      },
      {
        type: "list",
        items: [
          "SmarTrust Wallet acting as the user's selected receive wallet.",
          "A marketplace seller wallet that can accept seller proceeds.",
          "An embedded wallet provider that can create a one-time receive instruction.",
        ],
      },
      {
        type: "paragraph",
        text: "PayToDapps register supported receive routes and, in the MVP, build the provider-specific payment intent when selected. They should not submit raw wallet addresses as the integration contract.",
      },
      {
        type: "heading",
        text: "You are a PayingDapp if you need to pay a user",
      },
      {
        type: "paragraph",
        text: "A PayingDapp knows the product reason for a payment. It might owe a payout, release escrow, pay a contributor, send a reward, or settle a balance. It does not want to manage the user's wallet graph.",
      },
      {
        type: "list",
        items: [
          "ChainCrew payout flow paying a contributor.",
          "A marketplace payout flow paying a seller.",
          "An escrow release system paying the recipient after conditions are met.",
        ],
      },
      {
        type: "paragraph",
        text: "PayingDapps submit a recipient pay-to identifier, amount, supported paths, and reference. They handle public resolver statuses such as resolved, no route, and user action required.",
      },
      {
        type: "heading",
        text: "Some apps are both",
      },
      {
        type: "paragraph",
        text: "A marketplace could be a PayingDapp when releasing funds to sellers and a PayToDapp if it also hosts seller balances or seller wallets. The roles describe the direction of a specific integration, not a permanent label for the company.",
      },
      {
        type: "heading",
        text: "Which SDK path should you start with?",
      },
      {
        type: "paragraph",
        text: "If your product creates or manages receive instructions, start with the PayToDapp provider SDK path. If your product needs to request payment intents for users, start with the PayingDapp SDK path. If you do both, keep the two integrations separate so each side has its own auth, consent, callback, and testing boundary.",
      },
    ],
  },
  {
    slug: "modality-a-vs-modality-b-two-ways-to-integrate-wallets",
    title: "Modality A vs Modality B: Two Ways to Integrate Wallets",
    description:
      "MyPayTag can describe two wallet integration modes, but the MVP path is Modality B: route registration plus provider-built intents.",
    category: "Wallet Integration",
    publishedAt: "2026-06-24",
    readingMinutes: 6,
    body: [
      {
        type: "paragraph",
        text: "Wallet integrations can be simple or deeply provider-specific. MyPayTag uses the terms Modality A and Modality B to distinguish two ways a PayToDapp can participate in payment resolution.",
      },
      {
        type: "heading",
        text: "Modality A: resolver-built intents",
      },
      {
        type: "paragraph",
        text: "In Modality A, the PayToDapp gives the resolver enough account or address material for the resolver to build a payment instruction. This can work for simple externally owned accounts, basic receive addresses, and wallet patterns where the payment output is nearly static.",
      },
      {
        type: "paragraph",
        text: "Modality A is conceptually easy, but it asks the resolver to hold or process more destination detail. That is not the MVP integration path.",
      },
      {
        type: "heading",
        text: "Modality B: provider-built intents",
      },
      {
        type: "paragraph",
        text: "In Modality B, the PayToDapp registers supported receive routes without handing the resolver raw wallet destinations. When the route is selected, the PayToDapp builds the provider-specific payment intent and returns it through the callback contract.",
      },
      {
        type: "list",
        items: [
          "The resolver knows which chain, network, and asset routes are available.",
          "The PayToDapp keeps provider-specific receive logic close to its own system.",
          "The PayingDapp receives a normalized resolver envelope with a constrained provider instruction.",
        ],
      },
      {
        type: "heading",
        text: "Why MVP uses Modality B",
      },
      {
        type: "paragraph",
        text: "Modality B is better for embedded wallets, dynamic wallets, custodial or semi-custodial receive accounts, and privacy-sensitive wallet systems. It avoids turning the resolver into a durable address warehouse and gives PayToDapps room to enforce their own receive policies.",
      },
      {
        type: "paragraph",
        text: "It is also more powerful. A provider can return a payment intent that includes references, expiry, memos, or other provider-required fields while still satisfying the public MyPayTag contract.",
      },
      {
        type: "heading",
        text: "Where Modality A fits later",
      },
      {
        type: "paragraph",
        text: "Modality A may become useful for simple wallets or protocols that genuinely only need a static destination output. For launch, it remains roadmap context. Builders integrating now should use Modality B and the PayToDapp provider SDK path.",
      },
    ],
  },
  {
    slug: "the-minimal-api-for-identity-based-crypto-payments",
    title: "The Minimal API for Identity-Based Crypto Payments",
    description:
      "The resolver API starts with a verified recipient, supported paths, amount, purpose, and a one-time intent mode.",
    category: "Developer Education",
    publishedAt: "2026-06-24",
    readingMinutes: 6,
    body: [
      {
        type: "paragraph",
        text: "The smallest useful MyPayTag request says who the PayingDapp wants to pay, what payment paths it can support, and what amount should be resolved into a one-time payment intent.",
      },
      {
        type: "paragraph",
        text: "The API is deliberately not a wallet-address lookup. It is a request for a scoped resolver outcome: resolved, no route, user action required, authorization required, or another public status the app can safely handle.",
      },
      {
        type: "heading",
        text: "Example resolve request",
      },
      {
        type: "code",
        code: `{
  "recipient": {
    "identifierType": "paytag",
    "identifier": "abd123@cubid.mypaytag"
  },
  "supportedPaths": [
    {
      "chain": "eip155:8453",
      "network": "base-mainnet",
      "asset": "USDC"
    }
  ],
  "amount": {
    "value": "25.00",
    "currency": "USDC"
  },
  "purpose": "contributor_payout",
  "intentMode": "one_time",
  "payingDappReference": "payout_2026_0001"
}`,
      },
      {
        type: "heading",
        text: "What each field does",
      },
      {
        type: "list",
        items: [
          "recipient identifies the user through an approved Paytag, not a public wallet graph.",
          "supportedPaths tells the resolver what the PayingDapp can actually pay.",
          "amount binds the resulting intent to a concrete value and currency.",
          "purpose gives the user and resolver context for the authorization moment.",
          "intentMode is one_time for the MVP so the returned instruction is not a standing destination.",
          "payingDappReference lets the PayingDapp reconcile the result with its own payout or order record.",
        ],
      },
      {
        type: "heading",
        text: "Typical response handling",
      },
      {
        type: "paragraph",
        text: "If the response is resolved, the app receives a MyPayTag intent envelope with the selected path and provider payment instruction. If the response is no route or user action required, the app should present the hosted action URL or retry after the user completes setup.",
      },
      {
        type: "paragraph",
        text: "The public SDK helpers are meant to keep this boring: build the request, validate the response, narrow the status, and only hand execution code a payment instruction once the resolver has returned a ready intent.",
      },
    ],
  },
  {
    slug: "building-a-paytodapp-integration",
    title: "Building a PayToDapp Integration",
    description:
      "How wallets and receive-path providers can register capabilities, handle Modality B intent callbacks, and test against the resolver contract.",
    category: "Wallet Integration",
    publishedAt: "2026-06-24",
    readingMinutes: 7,
    body: [
      {
        type: "paragraph",
        text: "A PayToDapp integration lets a user receive funds through your product when another app wants to pay them. For the MVP, the recommended path is Modality B: register capabilities, then build the payment intent when your route is selected.",
      },
      {
        type: "heading",
        text: "1. Register the app",
      },
      {
        type: "paragraph",
        text: "Start by treating MyPayTag as an integration boundary with its own app identity, callback credentials, and environment separation. Your provider SDK integration should know which routes it can advertise and which callback requests it is willing to honor.",
      },
      {
        type: "heading",
        text: "2. Ask for user consent",
      },
      {
        type: "paragraph",
        text: "The user should explicitly allow your app to act as a receive path for the relevant pay-to identifier and payment context. Consent is not implied by the fact that your product already has a wallet or account for the user.",
      },
      {
        type: "heading",
        text: "3. Register supported routes",
      },
      {
        type: "paragraph",
        text: "Route registration should describe capability, not a raw address. A PayToDapp can say it supports Base mainnet USDC, for example, without handing the resolver a durable wallet destination.",
      },
      {
        type: "code",
        code: `{
  "recipient": {
    "identifierType": "paytag",
    "identifier": "abd123@cubid.mypaytag"
  },
  "supportedRoutes": [
    {
      "chain": "eip155:8453",
      "network": "base-mainnet",
      "asset": "USDC"
    }
  ]
}`,
      },
      {
        type: "heading",
        text: "4. Handle Modality B callbacks",
      },
      {
        type: "paragraph",
        text: "When your route is selected for a payment, the resolver calls your provider callback. Validate callback authentication, reject replay, check expiry, verify amount/path fields, and return a provider response that satisfies the public payment-instruction schema.",
      },
      {
        type: "heading",
        text: "5. Support revocation",
      },
      {
        type: "paragraph",
        text: "Users need a concrete path to disable a receive capability or revoke an authorization. Route availability and route preference are separate concepts: removing support for a route should not be confused with changing which eligible route is preferred.",
      },
      {
        type: "heading",
        text: "6. Test with mocks",
      },
      {
        type: "paragraph",
        text: "Use the provider SDK helpers and mock resolver fixtures to test registration, callback validation, provider failures, forbidden address fields, and payment_intent_created notification payloads before wiring live traffic.",
      },
      {
        type: "paragraph",
        text: "The PayToDapp's job is to protect the user's receive path while still producing a payment intent the payer can execute. Modality B keeps that responsibility in the right place.",
      },
    ],
  },
  {
    slug: "building-a-payingdapp-integration",
    title: "Building a PayingDapp Integration",
    description:
      "How apps that need to pay users can request a MyPayTag intent and handle resolver statuses safely.",
    category: "Developer Education",
    publishedAt: "2026-06-24",
    readingMinutes: 7,
    body: [
      {
        type: "paragraph",
        text: "A PayingDapp is any app that needs to pay a user. The app may know the recipient through its product context, but it should not need to collect, store, or maintain the user's current wallet destination.",
      },
      {
        type: "heading",
        text: "1. Collect a pay-to identifier",
      },
      {
        type: "paragraph",
        text: "The recipient should provide or approve a pay-to identifier that Cubid can validate. For the MVP, verified stamps are the likely default. Avoid treating public email, phone, or domain-like values as probeable payment endpoints; the resolver should keep setup and no-route outcomes safe.",
      },
      {
        type: "heading",
        text: "2. Request resolver authorization",
      },
      {
        type: "paragraph",
        text: "A PayingDapp needs authorization to resolve payments for a user and purpose. If authorization is missing or expired, the resolver returns a safe action response rather than exposing whether the recipient exists or has a route.",
      },
      {
        type: "heading",
        text: "3. Submit supported paths",
      },
      {
        type: "paragraph",
        text: "Tell the resolver what your app can pay: chain, network, asset, amount, purpose, intent mode, and a PayingDapp reference. This lets the resolver choose only receive routes that match what your app can actually execute.",
      },
      {
        type: "heading",
        text: "4. Handle public statuses",
      },
      {
        type: "list",
        items: [
          "resolved means the response contains a ready MyPayTag intent with a selected provider instruction.",
          "no_route means the user needs setup or no eligible route exists; present the action if one is returned.",
          "user_action_required means the user must complete a hosted action such as route selection.",
          "authorization_required means setup or consent is needed before the resolver can return an intent.",
        ],
      },
      {
        type: "heading",
        text: "5. Present the payment intent",
      },
      {
        type: "paragraph",
        text: "Once resolved, hand the payment instruction to the part of your product that executes or presents the payment. Keep the resolver reference and your PayingDapp reference for reconciliation, and respect expiry and single-use behavior.",
      },
      {
        type: "paragraph",
        text: "The PayingDapp integration should feel like asking for a payment intent, not maintaining a wallet database. That is the point: your product pays the right user while the user keeps control over how they receive.",
      },
    ],
  },
  {
    slug: "why-we-dont-use-a-universal-cubidid",
    title: "Why We Don't Use a Universal CubidID",
    description:
      "Universal identifiers are convenient, but MyPayTag avoids making Cubid identity a cross-app tracking handle.",
    category: "Identity + Privacy",
    publishedAt: "2026-06-24",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "A universal CubidID would be convenient. One identifier, everywhere, easy to recognize and easy to pay. It would also be a privacy trap.",
      },
      {
        type: "paragraph",
        text: "If every app saw the same global user id, payment resolution could become a cross-app tracking layer. The fact that an identifier is useful for identity does not mean it should become a public payment endpoint.",
      },
      {
        type: "heading",
        text: "App-scoped identity is intentional",
      },
      {
        type: "paragraph",
        text: "Cubid can give each app its own DappUserId. That means two apps do not automatically receive the same global user handle just because the user is verified through Cubid. This is a feature, not a limitation.",
      },
      {
        type: "paragraph",
        text: "MyPayTag builds on that idea. Paying a user should happen through approved pay-to identifiers and consented resolver flows, not by exposing a universal Cubid identity to every integration.",
      },
      {
        type: "heading",
        text: "Pay-to identifiers are user-approved",
      },
      {
        type: "paragraph",
        text: "A verified stamp, public pay-to id, or brokered identifier can be enabled for payment resolution when the user chooses it. The resolver should also avoid making email-like or domain-like identifiers probeable, because recognizability can become an enumeration risk.",
      },
      {
        type: "heading",
        text: "Less automatic linking, better defaults",
      },
      {
        type: "paragraph",
        text: "The goal is not to make payment identity hard. The goal is to make the easy path safer: scoped authorizations, opaque action links, masked displays, delayed setup disclosure, and status responses that do not reveal more than the payer needs.",
      },
      {
        type: "paragraph",
        text: "MyPayTag does not use a universal CubidID because the mature version of identity-based payments is not one id everywhere. It is user-approved payment resolution with privacy boundaries that hold up across apps.",
      },
    ],
  },
  {
    slug: "four-ways-to-identify-a-user-for-payment-resolution",
    title: "Four Ways to Identify a User for Payment Resolution",
    description:
      "Verified stamps, public pay-to IDs, brokered DappUserId sharing, and manual fallback identifiers each fit different payment-resolution needs.",
    category: "Identity + Privacy",
    publishedAt: "2026-06-24",
    readingMinutes: 6,
    body: [
      {
        type: "paragraph",
        text: "Identity-based payment resolution should not force every user into one public identity model. Different products need different ways to say who should be paid, and users need control over which identifiers become payable.",
      },
      {
        type: "heading",
        text: "1. Verified stamps as pay-to identifiers",
      },
      {
        type: "paragraph",
        text: "A verified stamp is the likely MVP default. The user proves control of an identifier through Cubid, approves its use for payment resolution, and can be nudged toward less revealing identifiers when email-like, phone-like, or domain-like values would create enumeration risk.",
      },
      {
        type: "heading",
        text: "2. PublicCubidPayToID",
      },
      {
        type: "paragraph",
        text: "Some users and creators may want a public payment identity. A public pay-to id can be useful when discoverability is intentional, but it should be optional rather than required for payment resolution.",
      },
      {
        type: "heading",
        text: "3. Cubid-brokered DappUserId sharing",
      },
      {
        type: "paragraph",
        text: "In some partnerships, Cubid can broker a scoped way for one app's user context to be recognized by another app without exposing a universal CubidID. This is useful when the product relationship is app-to-app rather than public-to-anyone.",
      },
      {
        type: "heading",
        text: "4. Manual fallback identifiers",
      },
      {
        type: "paragraph",
        text: "Manual fallback identifiers can help early integrations or support workflows, but they should not become the main payment identity model. They need clear consent, careful display masking, and revocation paths.",
      },
      {
        type: "heading",
        text: "Recommended MVP default",
      },
      {
        type: "paragraph",
        text: "Verified stamps are the best starting point because they balance familiarity, Cubid-backed verification, and user approval. Public IDs remain useful for people who want them, brokered DappUserId sharing can support deeper app relationships, and manual fallbacks can fill gaps while the ecosystem matures.",
      },
      {
        type: "paragraph",
        text: "The principle is simple: payment resolution should identify enough to pay the right user, and no more than the current context requires.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
