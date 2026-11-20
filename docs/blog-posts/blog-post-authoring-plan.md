# Blog Post Roadmap
Here’s an initial blog/content roadmap for the **MyPayTag** website, structured around three audiences: **wallet builders**, **dapp builders**, and **ecosystem/protocol thinkers**.

## Recommended blog categories

```text
1. Product / vision
2. Developer education
3. Wallet integration
4. Identity + privacy
5. Payment intent standards
6. Ecosystem commentary
7. Use cases
```

---

# Launch / Vision Posts

## 1. **Introducing MyPayTag: Pay Users, Not Wallet Addresses**

Core launch post.

**Angle:** Crypto payments are still too address-centric. Users should be payable by identity, while keeping control over where funds land.

**Key points:**

* Users have many wallets.
* Dapps do not know where to pay them.
* Public wallet addresses are bad UX and bad privacy.
* MyPayTag turns a user-approved pay-to identifier into a consented payment intent.
* Powered by Cubid, but separate from Cubid.

**CTA:** Join early PayToDapp / PayingDapp integration program.

---

## 2. **Why Crypto Needs a Pay-To Layer**

Bigger ecosystem thesis.

**Angle:** Identity, wallets, chains, and apps are fragmenting. A pay-to resolver is the missing layer between “who” and “where to send funds.”

**Key points:**

* ENS-style names are not enough.
* Wallet address books are not enough.
* Payment links are not enough.
* Payment resolution needs consent, preferences, route selection, and privacy.
* The user should be in control of how they receive funds.

---

## 3. **From Wallet Addresses to Payment Intents**

Explains the product’s key abstraction.

**Angle:** The right output of a resolver is not just an address. It should be a payment intent.

**Key points:**

* Address = static destination.
* Payment intent = structured, scoped, expiring instruction.
* Payment intents support memos, expiry, one-time routes, provider-specific logic, and auditability.
* Why MyPayTag is intent-first.

---

# Developer Education Posts

## 4. **How MyPayTag Works: The Five Roles**

Explains:

```text
User
MyPayTag
Cubid
PayToDapp
PayingDapp
```

**Angle:** Clear role separation avoids confusion.

**Key points:**

* Cubid handles identity.
* Resolver handles payment destination resolution.
* PayToDapps provide receive paths.
* PayingDapps request payment intents.
* Users control consent and preferences.

---

## 5. **PayToDapp vs PayingDapp: Which One Are You?**

Very practical integration post.

**Angle:** Most apps are one of two things: they either help users receive funds or they need to pay users.

**Examples:**

```text
SmarTrust Wallet = PayToDapp
ChainCrew payout flow = PayingDapp
Marketplace seller wallet = PayToDapp
Marketplace buyer payout flow = PayingDapp
Escrow release system = PayingDapp
```

Some apps can be both.

---

## 6. **Modality A vs Modality B: Two Ways to Integrate Wallets**

Important technical/product post.

Launch framing: explain both terms, but make clear that the MVP supports Modality B only. Modality A is roadmap context, not a launch integration path.

**Modality A:** Resolver receives accounts and builds payment intents.

Best for:

```text
MetaMask-style wallets
simple EOAs
externally connected wallets
basic receive addresses
```

**Modality B:** Resolver receives paths only; PayToDapp builds payment intent.

Best for:

```text
SmarTrust Wallet
embedded wallets
dynamic wallets
custodial/semi-custodial receive accounts
privacy-sensitive wallets
```

**Message:** Modality B is the MVP path because it is more private and better for dynamic wallets. Modality A is simpler, but later.

---

## 7. **The Minimal API for Identity-Based Crypto Payments**

Developer-facing post showing example requests.

**Include examples:**

Use contract-sourced snippets from the SDK docs or generated fixtures before publishing. Examples must include the structured amount object and required purpose/reference fields from the MVP API contract.

**CTA:** Try the SDK.

---

## 8. **Building a PayToDapp Integration**

Walkthrough for wallets.

**Sections:**

* Register app.
* Request user consent.
* Register supported routes.
* Handle Modality B intent callbacks.
* Revoke paths.
* Test with mock resolver.

---

## 9. **Building a PayingDapp Integration**

Walkthrough for apps that need to pay users.

**Sections:**

* Get recipient pay-to identifier.
* Request resolver authorization.
* Submit supported paths.
* Receive payment intent.
* Handle `no_route`, `user_action_required`, and `resolved`.
* Present payment to payer.

---

# Identity + Privacy Posts

## 10. **Why We Don’t Use a Universal CubidID**

This is important and differentiating.

**Angle:** Universal IDs are convenient but privacy-hostile.

**Key points:**

* Each dapp gets its own `DappUserId`.
* Cubid does not automatically expose a global user ID.
* Payment resolution works through user-approved pay-to identifiers.
* This prevents automatic cross-dapp tracking.

This post makes the system feel mature and intentional.

---

## 11. **Four Ways to Identify a User for Payment Resolution**

Explain the solution space:

```text
A. Verified stamp as pay-to identifier — preferred
B. PublicCubidPayToID
C. Cubid-brokered DappUserId sharing
D. Manual fallback identifier
```

**Angle:** Users should not be forced into one identity model.

**Recommended conclusion:** Verified stamps are likely the best v1 default; public IDs are useful but optional.

---

## 12. **Public Pay-To IDs vs Private Pay-To Identifiers**

Compare:

```text
john.cubid
UUID-style public pay-to ID
email as verified pay-to stamp
GitHub as verified pay-to stamp
manual pay-to code
```

**Angle:** Some users want a public payment identity. Others do not. The resolver should support both.

---

## 13. **How to Receive Payments Without Exposing Your Wallet Graph**

Privacy-focused post.

**Key points:**

* PayingDapp should not see all user wallets.
* PayToDapp should not know if it is preferred.
* Resolver should return only the selected intent.
* Modality B reduces wallet data held by the resolver.
* One-time intents are safer than durable raw addresses.

---

# Payment Intent Landscape Posts

## 14. **What Is a Payment Intent? Stripe, Solana Pay, ERC-681, and Crypto Wallets**

Educational post.

**Angle:** The phrase “payment intent” means different things in different ecosystems.

Cover:

```text
Stripe PaymentIntent
Circle payment intents
Solana Pay
ERC-681 payment URIs
hosted payment links
provider-built wallet intents
MyPayTag normalized intents
```

**Conclusion:** These formats are useful industry context. The MVP returns a MyPayTag-owned resolver envelope with provider JSON; it does not wrap Stripe, Solana Pay, ERC-681, hosted payment links, or payment processors.

---

## 15. **Why MyPayTag Uses Normalized Payment Intents**

Technical architecture post.

**Key point:** The resolver should start with one internal JSON envelope before adapters.

MVP normalizes:

```text
provider-opaque intents
MyPayTag resolver envelope
contracted amount, path, purpose, and reference fields
```

External protocol adapters, hosted payment links, and processor-specific renderers are Phase 2+ topics.

---

## 16. **Why Returning an Address Is Not Enough**

Good thought-leadership post.

**Angle:** Static addresses are too primitive for modern app payments.

**Payment intents can include:**

* amount,
* chain,
* asset,
* expiry,
* memo,
* reference,
* callback,
* one-time use,
* provider-specific metadata,
* compliance or account routing.

---

# Wallet / Ecosystem Posts

## 17. **Why Wallets Should Become PayToDapps**

Pitch to wallet builders.

**Angle:** Wallets are not just places users hold assets. They should become receiving endpoints in a broader payment ecosystem.

**Benefits to wallets:**

* more deposits,
* more app integrations,
* better user retention,
* easier payment discovery,
* support for app-specific receiving flows,
* no need to expose full wallet graph.

---

## 18. **Why Dapps Should Stop Asking Users for Wallet Addresses**

Pitch to PayingDapps.

**Angle:** Asking users for addresses creates UX failure, support burden, and payment risk.

**Resolver alternative:**

```text
Ask for pay-to identifier
Send supported paths
Receive payment intent
Execute payment
```

---

## 19. **What MyPayTag Means for Embedded Wallets**

Good for Privy/Openfort/Web3Auth-style ecosystem.

**Angle:** Embedded wallets need a way to become destinations for payments from outside their own app.

**Key point:** A wallet inside one app becomes more valuable when it can receive funds from many apps.

---

## 20. **Paying a User Across Apps: The Case for App-Scoped Consent**

A more advanced privacy/product post.

**Angle:** Cross-app payments do not require cross-app surveillance.

Explain:

* app-scoped `DappUserId`,
* verified pay-to identifiers,
* consented mapping,
* dapp-specific resolver scopes.

---

# Use Case Posts

## 21. **Use Case: Freelancer Escrow Payouts**

Tie to SmarTrust.

**Flow:**

```text
Buyer releases escrow
SmarTrust/escrow app requests recipient route
Resolver selects SmarTrust Wallet or preferred wallet
Payment intent is returned
Funds are sent
```

**Angle:** Freelancers should not need to paste wallet addresses into every work platform.

---

## 22. **Use Case: Marketplace Seller Payouts**

For broader product relevance.

**Angle:** Marketplaces need a simple way to pay sellers across wallets, chains, and stablecoins.

---

## 23. **Use Case: DAO Contributor Payments**

DAOs are a natural audience.

**Angle:** Paying contributors should not require collecting wallet addresses in spreadsheets.

**Message:** Use verified pay-to identifiers and payment intents.

---

## 24. **Use Case: Agent-to-Human Payments**

More future-facing.

**Angle:** AI agents and workflow apps will need to pay humans, apps, and other agents. They should not manage raw wallet-address routing themselves.

This could be a strong thought-leadership piece.

---

## 25. **Use Case: Stablecoin Payroll Without Wallet Address Spreadsheets**

Practical and SEO-friendly.

**Angle:** Address spreadsheets are dangerous. A resolver gives each recipient control over where they receive.

---

# Comparison / Landscape Posts

## 26. **ENS Is Not Enough: Names, Wallets, and Payment Routing**

Careful tone: not anti-ENS, just clarifying.

**Angle:** ENS is great for public names and address records. But payment routing also needs consent, app-scoped authorization, preferences, and payment intents.

---

## 27. **Payment Links Are Not Payment Resolution**

Compare with Request Network, Coinbase Commerce, Solana Pay, etc.

**Angle:** Payment links help once you know who and where. A resolver helps decide where to pay.

---

## 28. **Address Books, Naming Services, and Pay-To Resolvers: What’s the Difference?**

Useful explainer.

```text
Address book = saved contacts
Naming service = public name → records
Payment link = instruction for a specific payment
Pay-to resolver = identity/identifier → consented payment route/intent
```

---

# Build-in-Public / Product Updates

## 29. **Designing MyPayTag: Why We Chose API-First**

Explain product strategy.

**Key points:**

* No heavy v1 UI.
* PayToDapps broker setup.
* PayingDapps use API.
* Minimal hosted consent/selection pages only.
* Full user dashboard comes later.

---

## 30. **Designing for Two Wallet Models: Address-Holding vs Intent-Building**

Another product/architecture post.

**Angle:** Some wallets can give addresses. Others should build intents themselves.

This maps directly to Modality A and B.

---

## 31. **MyPayTag Roadmap: From API to User-Controlled Payment Preferences**

Phased roadmap post.

```text
Phase 1: API-first resolver
Phase 2: Cubid-owned grant discovery and revocation paths
Phase 3: provider-reported payment status callbacks
Phase 4: broader payment intent adapters
Phase 5: MyPayTag-owned dashboard, if user demand justifies it
```

---

## Best first 10 posts

I would start with these, in this order:

```text
1. Introducing MyPayTag: Pay Users, Not Wallet Addresses
2. Why Crypto Needs a Pay-To Layer
3. How MyPayTag Works: The Five Roles
4. PayToDapp vs PayingDapp: Which One Are You?
5. Modality A vs Modality B: Two Ways to Integrate Wallets
6. Why We Don’t Use a Universal CubidID
7. Four Ways to Identify a User for Payment Resolution
8. From Wallet Addresses to Payment Intents
9. Building a PayToDapp Integration
10. Building a PayingDapp Integration
```

That gives you a strong launch sequence:

```text
vision → concepts → privacy → integration → developer adoption
```

---

## Suggested blog navigation

On the site, I’d group them like this:

```text
Learn
  What is MyPayTag?
  Why crypto needs a pay-to layer
  Payment intents explained

Build
  Build a PayingDapp
  Build a PayToDapp
  Modality A vs B
  API reference

Privacy
  No universal CubidID
  Pay-to identifiers
  Wallet graph privacy

Use Cases
  Freelancer payouts
  Marketplace sellers
  DAO contributors
  Stablecoin payroll
```

---

## The strongest content angle

The most distinctive message is not “we resolve wallet addresses.”

That sounds like ENS/FIO/address book territory.

The sharper message is:

> **MyPayTag lets approved apps create consented payment intents for users through user-controlled pay-to identifiers, without exposing the user’s wallet graph.**

Almost every blog post should reinforce one of those words:

```text
approved
consented
payment intents
user-controlled identifiers
no wallet graph exposure
```
