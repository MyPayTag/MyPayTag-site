import type {
  TranslationKey,
  TranslationNamespace,
} from "@/lib/i18n/namespaces";
import { translationKeys, translationNamespaces } from "@/lib/i18n/namespaces";

export type NamespaceResource<N extends TranslationNamespace> = Record<
  TranslationKey<N>,
  string
>;

export type TranslationResources = {
  [N in TranslationNamespace]: NamespaceResource<N>;
};

const en = {
  common: {
    brandName: "MyPayTag",
    loading: "Loading",
    mockMode: "Development fixture",
    users: "{{count}} users",
    mainnet: "Mainnet",
    testnet: "Testnet",
    notAvailableYet: "Not available yet",
  },
  navigation: {
    tracks: "Tracks",
    blog: "Blog",
    enterPaytag: "Enter Paytag",
    apiDocs: "API Docs",
    playground: "Playground",
    reference: "Reference",
    history: "History",
    settings: "Settings",
    github: "GitHub",
    developer: "Developer",
    signedInAs: "Signed in as {{credential}}",
    loginUser: "Log in as user",
    loginDeveloper: "Log in as developer",
    loginUserDescription: "Access route choices and incoming history.",
    loginDeveloperDescription: "Manage API access, team invites, and app history.",
  },
  buttons: {
    back: "Back",
    cancel: "Cancel",
    chooseTrack: "Choose your track",
    connect: "Connect",
    continue: "Continue",
    copy: "Copy",
    disconnect: "Disconnect",
    readApiDocs: "Read API docs",
    retry: "Retry",
    rotate: "Rotate",
    save: "Save",
    signIn: "Sign in",
    signOut: "Sign out",
    submit: "Submit",
  },
  auth: {
    checkingTitle: "Checking sign-in",
    checkingDescription: "Checking your Cubid session before showing this page.",
    missingConfigTitle: "Cubid sign-in is not configured",
    missingConfigDescription:
      "Protected MyPayTag surfaces require browser-safe Cubid OIDC configuration.",
    missingConfigDetail: "Missing browser-safe config: {{values}}",
    signInDetail: "Use the Cubid sign-in control to continue.",
    signedInWithCubid: "Signed in with Cubid",
    sessionMissingConfig: "Sign in with Cubid needs browser-safe config.",
    sessionChecking: "Checking Cubid session",
    sessionLaunchError:
      "Cubid sign-in could not start. Check the browser-safe Cubid OIDC configuration and try again.",
    callbackTitle: "Cubid callback",
    callbackMissingDescription:
      "Add the browser-safe OIDC values from `.env.example` before using the callback route.",
    callbackCompleteTitle: "Completing Cubid sign-in",
    callbackLoading: "Reading the Cubid callback...",
    callbackSuccess: "Cubid sign-in is complete.",
    callbackReturn: "Return to MyPayTag",
  },
  settings: {
    localeLabel: "Locale",
    localeEnglish: "English",
    localeSwedish: "Swedish",
    localePseudo: "Pseudo-locale",
    receivePathsEyebrow: "Receive paths",
    receivePathsTitle: "Prioritize where payments land",
    receivePathsDescription:
      "Reorder active PayToDapps for each Paytag, asset, network, and PayingDapp context.",
    receivePathsSignInTitle: "Sign in to manage receive paths",
    receivePathsSignInDescription:
      "Receive-path priorities are available after Cubid sign-in.",
    savePriority: "Save priority",
    saveSuccess: "Receive-path priority saved.",
    loadingTitle: "Loading receive paths",
    loadingDescription: "Reading backend-backed receive path preferences.",
    savingTitle: "Saving receive paths",
    emptyTitle: "No registered receive paths",
    emptyDescription:
      "Register receive paths from a PayToDapp before setting priorities.",
    errorTitle: "Receive paths unavailable",
    payingDappLabel: "PayingDapp: {{name}}",
    anyPayingApp: "Any paying app",
    defaultRoute: "default",
    moveUp: "Move {{name}} up",
    moveDown: "Move {{name}} down",
    errorUnauthorized: "Sign in again before managing receive paths.",
    errorUnavailable: "Backend preferences API is not configured for this environment.",
    errorGeneric: "Receive-path preferences could not be loaded.",
  },
  history: {
    title: "Incoming transaction history",
    description:
      "Review questions, answers, exact quotes, selected quotes, payment intents, and receipts returned by MyPayTag.",
    signInTitle: "Sign in to view incoming history",
    signInDescription: "Incoming transaction history is available after Cubid sign-in.",
    groupByLabel: "History group by",
    typeLabel: "History type",
    groupPayingApp: "Paying app",
    groupPayToApp: "PayToDapp",
    groupToken: "Token",
    groupChain: "Chain",
    typeQuestions: "Questions",
    typeAnswers: "Answers",
    typeQuotes: "Quotes",
    typeIntents: "Intents",
    typeReceipts: "Receipts",
    typeAll: "All",
    loadingTitle: "Loading history",
    latestActivity: "Latest activity",
    olderActivity: "Older activity",
    loadingDescription: "Reading backend-backed transaction history.",
    emptyTitle: "No history yet",
    emptyDescription:
      "MyPayTag has not recorded matching questions, answers, quotes, intents, or receipts for this account yet.",
    errorTitle: "History unavailable",
    errorUnauthorized: "Sign in again before viewing history.",
    errorUnavailable: "Backend history API is not configured for this environment.",
    errorGeneric: "Incoming transaction history could not be loaded.",
    kindQuestion: "Question",
    kindAnswer: "Answer",
    kindQuote: "Quote",
    kindSelectedQuote: "Selected quote",
    kindPaymentIntent: "Payment intent",
    kindReceipt: "Receipt",
    questionFallback: "Question asked",
    answerFor: "Answer for",
    selectedQuoteFor: "Selected quote for",
    receiptFallback: "Receipt summary",
    payingDapp: "PayingDapp",
    payToDapp: "PayToDapp",
    paytag: "Paytag",
    amount: "Amount",
    purpose: "Purpose",
    reference: "Reference",
    requestedPaths: "Requested paths",
    questionId: "Question ID",
    answerStatus: "Answer status",
    provider: "Provider",
    from: "From",
    to: "To",
    expiresAt: "Expires",
    fees: "Fees",
    noFees: "No fees",
    routeSteps: "Route steps",
    quoteId: "Quote ID",
    selectedAt: "Selected",
    payableInstruction: "Payable instruction",
    paymentIntentId: "Payment intent ID",
    selectedQuoteId: "Selected quote ID",
    transactionHash: "Transaction hash",
    pendingReceipt: "Pending receipt",
    chain: "Chain",
    explorer: "Explorer",
    notProvided: "Not provided",
  },
  onboarding: {
    heroEyebrow: "Pay users, not wallet addresses",
    heroTitle: "A Paytag layer for crypto apps.",
    heroDescription:
      "MyPayTag lets PayingDapps reach any user through a Paytag while PayToDapps stay in control of the provider intent they create.",
    networkEyebrow: "The network layer",
    networkTitle: "Three audiences. One MVP payment path.",
    paytagId: "Paytag ID",
    ecosystemStepPayingDapp: "PayingDapp submits a Paytag",
    ecosystemStepRoute: "MyPayTag selects a route",
    ecosystemStepPayToDapp: "PayToDapp creates the intent",
    ecosystemStepInstructions: "PayingDapp receives one-time instructions",
  },
  developer: {
    metadataTitle: "Register your app",
    metadataDescription:
      "Add app metadata before issuing a browser-visible API key.",
    appNameLabel: "Marketing name",
    appUrlLabel: "App URL",
    environmentLabel: "Environment",
    apiKeyTitle: "API key",
    apiKeyIssued: "API key issued",
    localeFixtureTitle: "Locale fixture",
    localeFixtureDescription:
      "Switch UI language locally to inspect translations and layout.",
  },
  playground: {
    title: "API playground",
    description: "Try resolver payloads against mock or configured backend flows.",
    localMockLabel: "Local mock response",
    realBackendLabel: "Real backend response",
    quoteTitle: "NEAR 1Click quote",
    selectedQuoteTitle: "Selected quote",
  },
  hostedAction: {
    routeSelectionTitle: "Choose a receive route",
    routeSelectionDescription:
      "Select which PayToDapp should receive this payment route.",
    expiredTitle: "This action link has expired",
    invalidTitle: "This action link cannot be used",
    completedTitle: "Route selection complete",
    deniedTitle: "Route selection declined",
    selectDefaultRoute: "Select as default route",
  },
  pay: {
    enterPaytagTitle: "Enter a Paytag",
    enterPaytagDescription:
      "Connect a wallet, enter a destination Paytag, and compare direct or quoted payment options.",
    paytagLabel: "Destination Paytag",
    amountLabel: "Amount",
    tokenLabel: "Token",
    directOptionsTitle: "Direct payment options",
    quoteOptionsTitle: "Quote options",
    registeredWalletsEyebrow: "Registered PayTo wallets",
    registeredWalletsTitle: "Wallets with active mainnet receive registrations.",
    registeredWalletsDescription:
      "This directory shows public app metadata only. It does not expose users, wallet addresses, balances, route preferences, provider internals, or testnet-only registrations.",
    mainnetWalletDescription:
      "Mainnet PayTo wallet with active registered users.",
    emptyWalletDirectory:
      "No public mainnet PayTo wallet entries are available yet.",
  },
  marketing: {
    onePaytagTitle: "One Paytag",
    onePaytagText:
      "A MyPayTag-branded payment identity gives paying apps one user-approved handle to start from.",
    mvpRouteSelectionTitle: "MVP route selection",
    mvpRouteSelectionText:
      "MyPayTag selects an approved PayToDapp route for the current paytag, asset, network, and paying app.",
    cubidIdentityTitle: "Cubid stays identity-only",
    cubidIdentityText:
      "Cubid powers verified identity, consent, and aliases without receiving wallet, route, or payment details.",
    solverEyebrow: "Execution adapter",
    solverTitle: "NEAR 1Click first, broader solver fanout later.",
    phaseOneAdapter: "Phase 1 MVP adapter",
    phaseTwoAdapter: "Phase 2 adapter",
  },
} satisfies TranslationResources;

const sv = {
  common: {
    brandName: "MyPayTag",
    loading: "Laddar",
    mockMode: "Utvecklingsfixtur",
    users: "{{count}} användare",
    mainnet: "Mainnet",
    testnet: "Testnet",
    notAvailableYet: "Inte tillgängligt än",
  },
  navigation: {
    tracks: "Spår",
    blog: "Blogg",
    enterPaytag: "Ange Paytag",
    apiDocs: "API-dokumentation",
    playground: "Testyta",
    reference: "Referens",
    history: "Historik",
    settings: "Inställningar",
    github: "GitHub",
    developer: "Utvecklare",
    signedInAs: "Inloggad som {{credential}}",
    loginUser: "Logga in som användare",
    loginDeveloper: "Logga in som utvecklare",
    loginUserDescription: "Öppna ruttval och inkommande historik.",
    loginDeveloperDescription:
      "Hantera API-åtkomst, teaminbjudningar och apphistorik.",
  },
  buttons: {
    back: "Tillbaka",
    cancel: "Avbryt",
    chooseTrack: "Välj spår",
    connect: "Anslut",
    continue: "Fortsätt",
    copy: "Kopiera",
    disconnect: "Koppla från",
    readApiDocs: "Läs API-dokumentation",
    retry: "Försök igen",
    rotate: "Rotera",
    save: "Spara",
    signIn: "Logga in",
    signOut: "Logga ut",
    submit: "Skicka",
  },
  auth: {
    checkingTitle: "Kontrollerar inloggning",
    checkingDescription: "Kontrollerar din Cubid-session innan sidan visas.",
    missingConfigTitle: "Cubid-inloggning är inte konfigurerad",
    missingConfigDescription:
      "Skyddade MyPayTag-ytor kräver webbläsarsäker Cubid OIDC-konfiguration.",
    missingConfigDetail: "Saknar webbläsarsäker konfiguration: {{values}}",
    signInDetail: "Använd Cubid-inloggningen för att fortsätta.",
    signedInWithCubid: "Inloggad med Cubid",
    sessionMissingConfig:
      "Inloggning med Cubid behöver webbläsarsäker konfiguration.",
    sessionChecking: "Kontrollerar Cubid-session",
    sessionLaunchError:
      "Cubid-inloggningen kunde inte starta. Kontrollera den webbläsarsäkra Cubid OIDC-konfigurationen och försök igen.",
    callbackTitle: "Cubid-callback",
    callbackMissingDescription:
      "Lägg till webbläsarsäkra OIDC-värden från `.env.example` innan callback-rutten används.",
    callbackCompleteTitle: "Slutför Cubid-inloggning",
    callbackLoading: "Läser Cubid-callback...",
    callbackSuccess: "Cubid-inloggningen är klar.",
    callbackReturn: "Tillbaka till MyPayTag",
  },
  settings: {
    localeLabel: "Språk",
    localeEnglish: "Engelska",
    localeSwedish: "Svenska",
    localePseudo: "Pseudospråk",
    receivePathsEyebrow: "Mottagningsvägar",
    receivePathsTitle: "Prioritera var betalningar landar",
    receivePathsDescription:
      "Ändra ordning på aktiva PayToDapps för varje Paytag, tillgång, nätverk och PayingDapp-kontext.",
    receivePathsSignInTitle: "Logga in för att hantera mottagningsvägar",
    receivePathsSignInDescription:
      "Prioritering av mottagningsvägar är tillgänglig efter Cubid-inloggning.",
    savePriority: "Spara prioritet",
    saveSuccess: "Prioriteten för mottagningsvägar sparades.",
    loadingTitle: "Laddar mottagningsvägar",
    loadingDescription: "Läser backendbaserade inställningar för mottagningsvägar.",
    savingTitle: "Sparar mottagningsvägar",
    emptyTitle: "Inga registrerade mottagningsvägar",
    emptyDescription:
      "Registrera mottagningsvägar från en PayToDapp innan prioriteringar anges.",
    errorTitle: "Mottagningsvägar är inte tillgängliga",
    payingDappLabel: "PayingDapp: {{name}}",
    anyPayingApp: "Alla betalappar",
    defaultRoute: "standard",
    moveUp: "Flytta {{name}} upp",
    moveDown: "Flytta {{name}} ned",
    errorUnauthorized: "Logga in igen innan du hanterar mottagningsvägar.",
    errorUnavailable:
      "Backend-API:t för inställningar är inte konfigurerat för den här miljön.",
    errorGeneric: "Inställningar för mottagningsvägar kunde inte laddas.",
  },
  history: {
    title: "Inkommande transaktionshistorik",
    description:
      "Granska frågor, svar, exakta offerter, valda offerter, betalningsintenter och kvitton som MyPayTag har returnerat.",
    signInTitle: "Logga in för att se inkommande historik",
    signInDescription:
      "Inkommande transaktionshistorik är tillgänglig efter Cubid-inloggning.",
    groupByLabel: "Gruppera historik efter",
    typeLabel: "Historiktyp",
    groupPayingApp: "Betalapp",
    groupPayToApp: "PayToDapp",
    groupToken: "Token",
    groupChain: "Kedja",
    typeQuestions: "Frågor",
    typeAnswers: "Svar",
    typeQuotes: "Offerter",
    typeIntents: "Intenter",
    typeReceipts: "Kvitton",
    typeAll: "Alla",
    loadingTitle: "Laddar historik",
    latestActivity: "Senaste aktivitet",
    olderActivity: "Äldre aktivitet",
    loadingDescription: "Läser backendbaserad transaktionshistorik.",
    emptyTitle: "Ingen historik än",
    emptyDescription:
      "MyPayTag har inte registrerat matchande frågor, svar, offerter, intenter eller kvitton för det här kontot än.",
    errorTitle: "Historik är inte tillgänglig",
    errorUnauthorized: "Logga in igen innan du visar historik.",
    errorUnavailable:
      "Backend-API:t för historik är inte konfigurerat för den här miljön.",
    errorGeneric: "Inkommande transaktionshistorik kunde inte laddas.",
    kindQuestion: "Fråga",
    kindAnswer: "Svar",
    kindQuote: "Offert",
    kindSelectedQuote: "Vald offert",
    kindPaymentIntent: "Betalningsintent",
    kindReceipt: "Kvitto",
    questionFallback: "Fråga skickad",
    answerFor: "Svar för",
    selectedQuoteFor: "Vald offert för",
    receiptFallback: "Kvittosammanfattning",
    payingDapp: "PayingDapp",
    payToDapp: "PayToDapp",
    paytag: "Paytag",
    amount: "Belopp",
    purpose: "Syfte",
    reference: "Referens",
    requestedPaths: "Efterfrågade vägar",
    questionId: "Fråge-ID",
    answerStatus: "Svarstatus",
    provider: "Provider",
    from: "Från",
    to: "Till",
    expiresAt: "Går ut",
    fees: "Avgifter",
    noFees: "Inga avgifter",
    routeSteps: "Ruttsteg",
    quoteId: "Offert-ID",
    selectedAt: "Vald",
    payableInstruction: "Betalningsinstruktion",
    paymentIntentId: "Betalningsintent-ID",
    selectedQuoteId: "Vald offert-ID",
    transactionHash: "Transaktionshash",
    pendingReceipt: "Väntar på kvitto",
    chain: "Kedja",
    explorer: "Explorer",
    notProvided: "Inte angivet",
  },
  onboarding: {
    heroEyebrow: "Betala användare, inte plånboksadresser",
    heroTitle: "Ett Paytag-lager för kryptoappar.",
    heroDescription:
      "MyPayTag låter PayingDapps nå en användare via en Paytag medan PayToDapps behåller kontrollen över den provider-intent de skapar.",
    networkEyebrow: "Nätverkslagret",
    networkTitle: "Tre målgrupper. En MVP-betalningsväg.",
    paytagId: "Paytag-ID",
    ecosystemStepPayingDapp: "PayingDapp skickar en Paytag",
    ecosystemStepRoute: "MyPayTag väljer en rutt",
    ecosystemStepPayToDapp: "PayToDapp skapar intenten",
    ecosystemStepInstructions: "PayingDapp får engångsinstruktioner",
  },
  developer: {
    metadataTitle: "Registrera din app",
    metadataDescription:
      "Lägg till appmetadata innan en API-nyckel som syns i webbläsaren skapas.",
    appNameLabel: "Marknadsnamn",
    appUrlLabel: "App-URL",
    environmentLabel: "Miljö",
    apiKeyTitle: "API-nyckel",
    apiKeyIssued: "API-nyckel skapad",
    localeFixtureTitle: "Språkfixtur",
    localeFixtureDescription:
      "Byt språk lokalt för att granska översättningar och layout.",
  },
  playground: {
    title: "API-testyta",
    description:
      "Prova resolver-payloads mot mockade eller konfigurerade backendflöden.",
    localMockLabel: "Lokalt mockat svar",
    realBackendLabel: "Riktigt backendsvar",
    quoteTitle: "NEAR 1Click-offert",
    selectedQuoteTitle: "Vald offert",
  },
  hostedAction: {
    routeSelectionTitle: "Välj mottagningsrutt",
    routeSelectionDescription:
      "Välj vilken PayToDapp som ska ta emot den här betalningsrutten.",
    expiredTitle: "Den här åtgärdslänken har löpt ut",
    invalidTitle: "Den här åtgärdslänken kan inte användas",
    completedTitle: "Ruttvalet är klart",
    deniedTitle: "Ruttvalet avböjdes",
    selectDefaultRoute: "Välj som standardrutt",
  },
  pay: {
    enterPaytagTitle: "Ange en Paytag",
    enterPaytagDescription:
      "Anslut en plånbok, ange en mottagande Paytag och jämför direkta eller offererade betalningsalternativ.",
    paytagLabel: "Mottagande Paytag",
    amountLabel: "Belopp",
    tokenLabel: "Token",
    directOptionsTitle: "Direkta betalningsalternativ",
    quoteOptionsTitle: "Offertalternativ",
    registeredWalletsEyebrow: "Registrerade PayTo-plånböcker",
    registeredWalletsTitle:
      "Plånböcker med aktiva mottagningsregistreringar på mainnet.",
    registeredWalletsDescription:
      "Den här katalogen visar bara offentlig appmetadata. Den exponerar inte användare, plånboksadresser, saldon, ruttpreferenser, provider-internals eller testnet-only-registreringar.",
    mainnetWalletDescription:
      "Mainnet PayTo-plånbok med aktiva registrerade användare.",
    emptyWalletDirectory:
      "Det finns inga offentliga mainnet-poster för PayTo-plånböcker än.",
  },
  marketing: {
    onePaytagTitle: "En Paytag",
    onePaytagText:
      "En MyPayTag-märkt betalningsidentitet ger betalande appar ett användargodkänt handtag att börja från.",
    mvpRouteSelectionTitle: "MVP-ruttval",
    mvpRouteSelectionText:
      "MyPayTag väljer en godkänd PayToDapp-rutt för aktuell paytag, tillgång, nätverk och betalande app.",
    cubidIdentityTitle: "Cubid är bara identitet",
    cubidIdentityText:
      "Cubid hanterar verifierad identitet, samtycke och alias utan att ta emot plånboks-, rutt- eller betalningsdetaljer.",
    solverEyebrow: "Exekveringsadapter",
    solverTitle: "NEAR 1Click först, bredare solver-fanout senare.",
    phaseOneAdapter: "Fas 1 MVP-adapter",
    phaseTwoAdapter: "Fas 2-adapter",
  },
} satisfies TranslationResources;

function pseudoLocalize(value: string) {
  const placeholders = value.match(/{{\s*[\w.]+\s*}}/g) ?? [];
  const placeholderToken = "\u0000I18N_PLACEHOLDER_";
  let protectedValue = value;

  placeholders.forEach((placeholder, index) => {
    protectedValue = protectedValue.replace(
      placeholder,
      `${placeholderToken}${index}\u0000`,
    );
  });

  let expanded = protectedValue.replace(/[A-Za-zÅÄÖåäö]/g, (character) => {
    const map: Record<string, string> = {
      A: "Ȧ",
      a: "ȧ",
      E: "Ḗ",
      e: "ḗ",
      I: "Ī",
      i: "ī",
      O: "Ǿ",
      o: "ǿ",
      U: "Ū",
      u: "ū",
    };

    return map[character] ?? character;
  });

  placeholders.forEach((placeholder, index) => {
    expanded = expanded.replace(`${placeholderToken}${index}\u0000`, placeholder);
  });

  return `[!! ${expanded} ${expanded} !!]`;
}

function createPseudoResources(source: TranslationResources): TranslationResources {
  const nextResources = {} as TranslationResources;

  for (const namespace of translationNamespaces) {
    const namespaceResources = {} as NamespaceResource<typeof namespace>;
    const sourceNamespace = source[namespace] as NamespaceResource<typeof namespace>;
    const keys = translationKeys[namespace] as readonly TranslationKey<
      typeof namespace
    >[];

    for (const key of keys) {
      namespaceResources[key] = pseudoLocalize(sourceNamespace[key]);
    }

    nextResources[namespace] = namespaceResources;
  }

  return nextResources;
}

const enXA = createPseudoResources(en);

export const resources = {
  en,
  sv,
  "en-XA": enXA,
} as const satisfies Record<string, TranslationResources>;
