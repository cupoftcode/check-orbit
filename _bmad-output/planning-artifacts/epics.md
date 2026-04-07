---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# Check Orbit - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Check Orbit, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Traveler can search for a medication by brand name, generic name, or compound name
FR2: Traveler can select a destination country from a list of covered countries
FR3: Traveler can view a compliance status (Legal, Prescription-Only, Restricted, or Banned) for each active compound in their searched medication against their selected destination
FR4: Traveler can view required documentation, quantity limits, and permit requirements for Prescription-Only and Restricted medications
FR5: Traveler can view permit lead time requirements including the issuing authority name, application URL or process, and minimum lead time in days
FR5a: Traveler can optionally enter a departure date to enable time-sensitive alerts
FR6: System can display a "you're already too late" warning when a traveler's departure date is provided and the remaining days before departure are fewer than the permit's required lead time
FR7: Traveler can search up to 10 medications against one or more destinations in a single session (paid tier)
FR8: Traveler can view the government source document, source link, and last verified date for every compliance result
FR9: System can decompose a brand-name medication or named supplement into its individual active compounds and ingredients using established pharmaceutical and supplement compound classification data
FR10: System can independently check each active compound against destination country regulations
FR11: System can apply dosage-threshold classification where country regulations differentiate by dosage level
FR12: System can flag any combination medication or supplement containing at least one controlled or restricted ingredient, regardless of product name or brand perception
FR13: System can display "unable to verify" for unmapped medications, supplements with undisclosed proprietary blends, or products whose full ingredient list cannot be determined
FR13a: System can identify when a supplement declares a proprietary blend without full ingredient disclosure and display a specific warning
FR13b: System can display a biosecurity warning flag on compliance results for products containing plant-derived, animal-derived, or soil-contact ingredients when the destination country enforces agricultural biosecurity import restrictions
FR14: Traveler can enter a multi-stop itinerary with origin, destination, and transit/layover countries (paid tier)
FR15: System can check medication compliance for every country in the itinerary sequence, including transit stops
FR16: Traveler can view a per-country compliance status across their full itinerary in sequence
FR17: System can flag transit country conflicts where medication is legal at origin and destination but banned at a layover
FR17a: When a transit country conflict is detected, system can display a list of common alternative transit hubs for the same origin-destination pair where the medication is legal (paid tier)
FR18: Traveler can see which countries are covered and which are not yet covered
FR19: System can display explicit "not yet covered" messaging for uncovered countries rather than returning no result
FR20: Traveler can see explicit "unable to verify" messaging for medications that cannot be mapped to known compounds
FR21: Traveler can opt in to receive email notifications when a regulation changes for a medication-country pair they previously searched (paid tier)
FR22: Traveler can opt in to receive permit deadline reminders at configurable intervals for restricted medications (paid tier)
FR23: Traveler can manage notification preferences and unsubscribe
FR24: System can send notifications without storing the traveler's medication data — notification triggers keyed to anonymized search parameters
FR25: System can generate a unique, search-engine-indexable page for each medication-country compliance pair
FR26: System can produce pages eligible for search engine rich results displaying medication name, compliance status, and destination country
FR27: System can generate dynamic sitemaps as medication and country coverage expands
FR28: System can resolve brand name and compound name URL variations to a single authoritative page per medication-country pair
FR29: Data curator can view a dashboard of automatically flagged potential regulatory changes categorized by confidence level with source links
FR30: Data curator can review AI-extracted regulatory updates with links to source documents
FR31: Data curator can approve, reject, or escalate flagged regulatory changes
FR32: Data curator can add notes and annotations to regulatory records
FR33: System can monitor government publications across covered countries for regulatory changes on a daily cycle
FR34: System can produce draft regulatory updates from monitored government publications for human review before publication
FR35: System can maintain an audit trail for all database changes including verifier identity, date, and source citation
FR36: System can detect when two or more regulatory authorities within a country publish conflicting rules for the same compound and apply the most restrictive interpretation
FR37: System can display a data freshness indicator on every compliance result showing the last-verified date, verification source, and a staleness badge
FR38: System can display an informational disclaimer on all compliance results
FR39: System can link every regulation record to its government source document with a verification date
FR40: Traveler can create an account using email/password or third-party authentication and sign in
FR41: Traveler can save a compliance search (medication + destination/itinerary) to their account
FR42: Traveler can view a list of their saved searches
FR43: Traveler can revisit a saved search and see current compliance results regenerated from the latest database
FR44: System can display the previous compliance result snapshot alongside current results when a traveler revisits a saved search
FR45: System can highlight changes between the saved snapshot and current results
FR46: Traveler can delete saved searches from their account
FR47: Traveler can use Check Orbit without creating an account — accounts are optional, core search remains stateless
FR48: Traveler can use core single-medication, single-country compliance search for free without an account
FR49: Traveler can create a free account with one saved search slot
FR50: System can permanently consume a free save slot when used — deleting the saved search does not restore the slot
FR51: Traveler can upgrade to a paid tier to unlock additional saved searches, multi-medication search, and layover trap
FR52: System can manage subscription tiers with feature gating based on plan level
FR60: System can generate a shareable risk card from any compliance result — a visually formatted, exportable graphic optimized for social sharing
FR61: Traveler can export a risk card as an image file or share it directly to social platforms via native share APIs
FR62: Traveler who is not planning an immediate trip can enter an email address and one or more destination countries to receive automated alerts ("save for my next trip")
FR63: "Save for my next trip" subscriptions require only an email and destination list — no medication data is stored
FR64: System can serve editorially authored debunking landing pages that address specific dangerous travel trends

### NonFunctional Requirements

NFR1: Core single-medication, single-country compliance search returns complete results within 20 seconds end-to-end
NFR2: Multi-medication search returns results for up to 10 medications against a single destination within 20 seconds
NFR3: Layover trap itinerary analysis returns per-country results for up to 10 transit stops within 20 seconds
NFR4: Server-rendered medication-country pages achieve LCP < 2.5 seconds
NFR5: CLS < 0.1 on all pages
NFR6: FCP < 2 seconds on simulated 3G connections
NFR7: All indexed pages pass Core Web Vitals assessment
NFR8: Authentication supported via email/password and Google sign-in with industry-standard password hashing
NFR9: Payment processing handled entirely by Stripe — no credit card data stored
NFR10: All data encrypted in transit (TLS 1.2+) and at rest
NFR11: User account data stored with encryption at rest
NFR12: Anonymous search sessions generate no persistent user-identifiable data
NFR13: Email notification triggers stored as anonymized search hashes
NFR14: Data curator admin access restricted with role-based access control (admin, curator roles)
NFR15: Regulatory database change audit trail is immutable
NFR16: System supports 50,000 registered users within 3 months of launch
NFR17: System maintains response time targets at 3x average daily traffic
NFR18: Adding a new country to the regulatory database requires only data entry — no code changes
NFR19: Medication-country page response times remain within target when total page count doubles
NFR20: Email notification system can deliver up to 50,000 notifications within 4 hours
NFR21: 99.9% uptime for the core compliance search service
NFR22: Regulatory database maintains data integrity during update operations
NFR23: Failed search queries return clear error messaging rather than incorrect data
NFR24: Email notification delivery achieves 99%+ deliverability rate
NFR25: Core compliance search and saved search retrieval remain available during regulatory database update operations
NFR26: WCAG 2.1 AA compliance across all user-facing pages
NFR27: Compliance status conveyed through text and icons, not color alone
NFR28: All interactive elements fully keyboard navigable
NFR29: Screen reader compatible with properly labeled elements
NFR30: High contrast mode support for compliance status displays
NFR31: Google OAuth 2.0 integration for user authentication
NFR32: Stripe integration for subscription management and payment processing
NFR33: Transactional email provider integration for notification delivery
NFR34: Pharmaceutical and supplement database integration (ATC, RxNorm, DrugBank) for compound identification
NFR35: SEO infrastructure — search engine crawler compatibility, structured data validation, sitemap protocol compliance

### Additional Requirements

- Architecture specifies a starter template: `npx create-next-app@latest check-orbit --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` with post-init setup for shadcn/ui, Prisma, Clerk, Trigger.dev, Stripe, and Resend
- Neon serverless PostgreSQL as primary database with Prisma ORM
- Separate staging_regulations and regulations (live) tables for data safety — curator approval copies atomically from staging to live
- ISR (Incremental Static Regeneration) with on-demand revalidation for SEO pages — curator approval triggers revalidation
- Clerk for authentication with role metadata (user, curator, admin) stored in publicMetadata and enforced via Next.js middleware
- Upstash Ratelimit for tier-based rate limiting (anonymous: 30/hr, free: 60/hr, paid: 200/hr, suspicious pattern: block + CAPTCHA)
- Server Actions for mutations, Route Handlers for data fetching APIs
- Structured error responses: `{ success: true, data }` or `{ success: false, error: { code, message } }` with standard error codes (MEDICATION_NOT_FOUND, COUNTRY_NOT_COVERED, UNABLE_TO_VERIFY, RATE_LIMITED, SUBSCRIPTION_REQUIRED)
- React Server Components + URL state for frontend (no external state management library)
- Vercel OG (Satori) for risk card image generation at the edge
- Trigger.dev for background AI pipeline: daily regulatory scanning, PDF extraction (LlamaParse), structured extraction (Claude API), compound mapping (RxNorm + WHO ATC + OpenFDA)
- Data flow separation: AI builds database (background via Trigger.dev), Prisma serves it (real-time via Next.js API routes) — traveler never waits for AI
- Sentry for error tracking and monitoring
- GitHub Actions CI: TypeScript type checking, ESLint, Prisma schema validation
- Vercel Preview Deployments for every PR with Neon database branching
- Feature-based project organization with shared core: components organized by domain (compliance/, search/, admin/), business logic in lib/, types in types/
- ComplianceStatus enum as single source of truth defined in types/compliance.ts
- Zod for input validation at API boundaries
- Data freshness calculation centralized in lib/compliance/data-freshness.ts (Current: <90 days, Aging: 91-180 days, Stale: >180 days)
- ISR revalidation logic centralized in lib/compliance/revalidation.ts
- All dates in API responses as ISO 8601 strings
- Tests co-located next to source files

### UX Design Requirements

UX-DR1: Hero Search as the homepage entry point — centered search bar immediately visible, no onboarding walls, value proposition communicates purpose in under 3 seconds
UX-DR2: Two-field progressive search input — MedicationAutocomplete (brand name, generic, fuzzy matching) followed by CountrySelector (type-ahead with flags, popular destinations weighted higher), with optional inline departure date prompt after country selection
UX-DR3: Intentional submission via "Check" button — search executes only on explicit button press (not auto-submit), button labeled "Check" (not "Search" or "Submit")
UX-DR4: Four-status compliance color system — Legal (sage green: bg-emerald-50, border-emerald-200, text-emerald-700), Prescription-Only (sky blue: bg-sky-50, border-sky-200, text-sky-700), Restricted (warm amber: bg-amber-50, border-amber-200, text-amber-700), Banned (soft rose: bg-rose-50, border-rose-200, text-rose-700) — all with triple-encoding (color + icon + text label)
UX-DR5: Brand color palette implementation — Primary burnt orange (#DE6438), Primary Light soft apricot (#E8A972), Secondary steel blue (#5B9BC5), Secondary Light ice blue (#BDD9F0), Accent marigold gold (#DDB943) — as Tailwind custom tokens
UX-DR6: ComplianceStatusBadge component — atomic status badge with Legal/Prescription-Only/Restricted/Banned states, variants (default, compact, large, biosecurity overlay), distinct icons per status (checkmark, document, warning triangle, prohibition), ARIA role="status"
UX-DR7: ComplianceResultCard component — full result card showing medication name, compound breakdown, overall status badge, required documents, quantity limits, permit details, lead time, source citation, and action buttons — with variants (full, stacked for multi-med, condensed for table view)
UX-DR8: CompoundDecomposition display — transparent ingredient breakdown showing each compound with individual status when medication has multiple active ingredients (e.g., "Nurofen Plus → ibuprofen [Legal] + codeine [Banned]")
UX-DR9: SourceCitation component — government authority name, document title, verification date, link to original, data freshness indicator (Current/Aging/Stale) — as primary UI element, not footnote
UX-DR10: PermitLeadTimeAlert component — three states: enough time ("Apply by [date]"), too late ("You're already too late — minimum [N] days required. Your departure is in [X] days"), no date provided ("Minimum [N] days lead time required") — with role="alert" for too-late state
UX-DR11: ItineraryTimeline component — vertical timeline with colored status dots per country, transit conflict alert boxes inline, "View safe alternative transit hubs" link, drag-to-reorder with keyboard alternatives
UX-DR12: RiskCard component — shareable social graphic with medication name, country flag, compliance status, branded CTA — optimized for Instagram Stories (1080x1080) and TikTok greenscreen, must survive screenshot compression
UX-DR13: ChangeComparisonBanner component — regulation change banner for returning users showing previous vs. current status side-by-side, change date, source — not dismissible until acknowledged
UX-DR14: MedicationAutocomplete component — built on shadcn/ui Command, fuzzy matching after 1 character (debounced 150ms), shows brand name + generic/compound, skeleton rows if >300ms response, "We don't have this yet" with email capture for no-match, hero and compact variants
UX-DR15: CountrySelector component — type-ahead with flag emojis, popular destinations weighted, single and multi (itinerary builder) variants, 48px tap targets on mobile
UX-DR16: Contextual view adaptation — single result: hero card (Direction 1), multi-med 2+: card stack (Direction 3), 3+ meds: card stack with table toggle (Direction 5), itinerary: timeline (Direction 4)
UX-DR17: Button hierarchy system — Primary "Check" (burnt orange), Secondary post-result (steel blue outline), Tertiary save/share (ghost), Destructive admin-only (rose outline with confirmation), Paywall CTA (accent gold) — maximum one primary button visible at a time
UX-DR18: Typography system — Inter (or system font stack), type scale from 32px h1 to 12px caption, tabular figures for permit lead times and dates, line height 1.5-1.6 for body text
UX-DR19: Spacing system — 4px base unit, compact information-dense layout, mobile-first responsive design with breakpoints at sm(640px), md(768px), lg(1024px), xl(1280px)
UX-DR20: Mobile-first responsive strategy — single column mobile (320-767px), wider single column tablet (768-1023px), max-width 1200px centered desktop (1024px+) with nav search bar. Content parity: no information hidden on mobile
UX-DR21: Toast notifications for system feedback — bottom-right, auto-dismiss 4s, max 3 stacked. Inline errors (rose text) near affected elements. Amber inline warnings for biosecurity/freshness. Steel blue info notes for contextual help
UX-DR22: Form patterns — core search as progressive input (not traditional form), email capture as single-field inline forms, account creation progressive (email → password → done with social login), itinerary builder with add/remove/reorder stops (max 6 stops)
UX-DR23: Navigation — fixed top bar (56px desktop, 48px mobile), compact search in nav after first search (desktop only), hamburger mobile menu for account actions, no bottom tab bar
UX-DR24: Modal patterns — paywall as centered modal (full-screen on mobile), share as bottom sheet on mobile / modal on desktop, account creation as modal triggered by save action, admin confirmations with no backdrop-click-dismiss. Maximum one modal at a time
UX-DR25: Empty states — "We don't have [medication]" with email capture, "We don't cover [country]" with coverage map link, "No saved searches" with search CTA, "No pending changes" positive empty state for admin
UX-DR26: Loading states — server-rendered compliance results (no skeleton needed), skeleton autocomplete rows if >300ms, skeleton timeline for itinerary check, button loading spinners for save/email actions
UX-DR27: WCAG 2.1 AA accessibility — all status color combinations pass AA contrast, triple-encoded status (color + icon + text), 2px steel blue focus rings, 48px minimum touch targets on mobile, skip-to-content links, WAI-ARIA combobox pattern for search inputs, prefers-reduced-motion support, semantic HTML throughout
UX-DR28: Admin ChangeQueueItem component — confidence badge (High/Medium/Low), country + compounds summary, AI-extracted change summary, quick-approve (high confidence only), quick-reject
UX-DR29: Admin VerificationDetailView component — full verification workspace with AI summary, source document (viewable inline), translation, affected compounds, editable AI draft, current record comparison, approve/reject/escalate actions
UX-DR30: Admin DataFreshnessIndicator component — per-country freshness status (Current/Aging/Stale) with last verification date and re-verification flags
UX-DR31: Compact search bar in nav — appears on desktop after first search, pre-filled with current search, editable for quick re-search
UX-DR32: Biosecurity warning as overlay pattern — dashed border + secondary leaf/plant icon layered on any status, independent of pharmaceutical compliance status
UX-DR33: Medication Not Found lead capture — unrecognized medications convert to notification signup ("We'll let you know when we add this")
UX-DR34: "Add another medication" progressive search pattern — after first result, invite adding more medications against the same destination, building a per-trip compliance profile
UX-DR35: Post-result action row — "Add another medication," "Check another country," "Add transit countries" (paid), "Share risk card," "Save search," "Send to email," "Save for my next trip"
UX-DR36: Bad news escalation pattern — UI intensity escalates with status severity: Legal (no special treatment) → Prescription-Only (required docs shown) → Restricted (permit details + lead time + "too late" warning) → Banned (consequence + no workaround + factual language)
UX-DR37: Clinical emotional design tone — direct, factual, no softening language for compliance results. No "unfortunately" or "we're sorry." Source citations as primary trust mechanism. No personality or warmth in result delivery.
UX-DR38: Dark mode deferred to post-MVP — ensure Tailwind config supports future addition without redesign
UX-DR39: Paywall placement principle — paywall gates capability (multi-med, layover trap, saved searches), never information (compliance status, source citations, required documents). First search always free.

### FR Coverage Map

FR1: Epic 1 - Medication search by brand/generic/compound name
FR2: Epic 1 - Destination country selection
FR3: Epic 1 - Compliance status display (Legal/Prescription-Only/Restricted/Banned)
FR4: Epic 1 - Required documentation, quantity limits, permit requirements
FR5: Epic 1 - Permit lead time requirements display
FR5a: Epic 1 - Optional departure date input
FR6: Epic 1 - "You're already too late" warning
FR7: Epic 5 - Multi-medication search (paid tier)
FR8: Epic 1 - Source document, link, and verified date display
FR9: Epic 1 - Brand-name decomposition to active compounds
FR10: Epic 1 - Per-compound regulatory check
FR11: Epic 1 - Dosage-threshold classification
FR12: Epic 1 - Flag combination medications with controlled ingredients
FR13: Epic 1 - "Unable to verify" for unmapped medications
FR13a: Epic 1 - Proprietary blend warning
FR13b: Epic 1 - Biosecurity warning flag
FR14: Epic 6 - Multi-stop itinerary entry (paid tier)
FR15: Epic 6 - Per-country compliance check across itinerary
FR16: Epic 6 - Per-country status display in sequence
FR17: Epic 6 - Transit country conflict flagging
FR17a: Epic 6 - Alternative transit hub suggestions (paid tier)
FR18: Epic 1 - Country coverage visibility
FR19: Epic 1 - "Not yet covered" messaging
FR20: Epic 1 - "Unable to verify" messaging for unmapped medications
FR21: Epic 7 - Regulation change email notifications (paid tier)
FR22: Epic 7 - Permit deadline reminders (paid tier)
FR23: Epic 7 - Notification preference management and unsubscribe
FR24: Epic 7 - Anonymized notification triggers
FR25: Epic 2 - Unique indexable page per medication-country pair
FR26: Epic 2 - Structured data for rich search results
FR27: Epic 2 - Dynamic sitemap generation
FR28: Epic 2 - Brand/compound canonical URL resolution
FR29: Epic 8 - Curator dashboard with flagged changes by confidence
FR30: Epic 8 - AI-extracted regulatory update review
FR31: Epic 8 - Approve/reject/escalate regulatory changes
FR32: Epic 8 - Notes and annotations on regulatory records
FR33: Epic 8 - Daily government publication monitoring
FR34: Epic 8 - Draft regulatory updates for human review
FR35: Epic 8 - Immutable audit trail
FR36: Epic 1 - Multi-authority conflict resolution (most restrictive)
FR37: Epic 1 - Data freshness indicator (Current/Aging/Stale)
FR38: Epic 1 - Informational disclaimer on all results
FR39: Epic 1 - Source document linking with verification date
FR40: Epic 4 - Account creation (email/password + Google OAuth)
FR41: Epic 4 - Save compliance search to account
FR42: Epic 4 - View saved searches list
FR43: Epic 4 - Revisit saved search with current results
FR44: Epic 4 - Previous snapshot alongside current results
FR45: Epic 4 - Change highlighting between saved and current
FR46: Epic 4 - Delete saved searches
FR47: Epic 1 - Anonymous stateless search (no account required)
FR48: Epic 1 - Free single-medication, single-country search
FR49: Epic 5 - Free account with one saved search slot
FR50: Epic 5 - Permanently consumed free save slot
FR51: Epic 5 - Paid tier upgrade
FR52: Epic 5 - Subscription tier management and feature gating
FR60: Epic 3 - Shareable risk card generation
FR61: Epic 3 - Risk card export and social sharing
FR62: Epic 3 - "Save for my next trip" email capture
FR63: Epic 3 - Destination-only email subscriptions (no medication data)
FR64: Epic 2 - Debunking landing pages
FR65: Epic 3 - Send compliance result to email

## Epic List

### Epic 1: Travelers Get Instant Medication Safety Answers
A traveler can search any medication + destination country and receive a complete, verified compliance result with compound decomposition, status, required documents, permit details, source citations, and data freshness indicators — all without an account.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR5a, FR6, FR8, FR9, FR10, FR11, FR12, FR13, FR13a, FR13b, FR18, FR19, FR20, FR36, FR37, FR38, FR39, FR47, FR48

### Epic 2: Travelers Discover Check Orbit Through Search Engines
Travelers discover Check Orbit through Google search — each medication-country pair has a unique, server-rendered, indexable page with structured data, appearing in search results with compliance status.
**FRs covered:** FR25, FR26, FR27, FR28, FR64

### Epic 3: Travelers Share Medication Warnings and Capture Interest
Travelers can share surprising compliance facts as visually striking risk cards on social media, and discovery-mode users can save destinations for future trip alerts — driving viral growth.
**FRs covered:** FR60, FR61, FR62, FR63, FR65

### Epic 4: Travelers Track and Revisit Their Medication Checks
Travelers can create accounts, save compliance searches, revisit them to see updated results, and see exactly what regulations changed since their last check.
**FRs covered:** FR40, FR41, FR42, FR43, FR44, FR45, FR46

### Epic 5: Travelers Unlock Advanced Features with Pro
Travelers can access tiered features — free single-med search for all, free account with one save slot, paid tier unlocking multi-medication search, layover trap, unlimited saves, and notifications.
**FRs covered:** FR7, FR49, FR50, FR51, FR52

### Epic 6: Travelers Discover Hidden Risks at Layover Countries
Travelers can enter their full travel route (origin, transit stops, destination) and discover medication conflicts at layover countries — with alternative transit hub suggestions.
**FRs covered:** FR14, FR15, FR16, FR17, FR17a

### Epic 7: Travelers Stay Informed When Regulations Change
Travelers receive proactive email alerts when regulations change for their saved medication-country pairs, and permit deadline reminders before travel.
**FRs covered:** FR21, FR22, FR23, FR24

### Epic 8: Curators Keep the Regulatory Database Accurate and Current
Data curators can efficiently review AI-flagged regulatory changes, verify against source documents, approve/reject/escalate with full audit trail — keeping the database accurate and current.
**FRs covered:** FR29, FR30, FR31, FR32, FR33, FR34, FR35

---

## Epic 1: Travelers Get Instant Medication Safety Answers

A traveler can search any medication + destination country and receive a complete, verified compliance result with compound decomposition, status, required documents, permit details, source citations, and data freshness indicators — all without an account.

### Story 1.1a: Project Scaffold & Design System Foundation

As a developer,
I want the base Next.js project with design tokens so I can begin building components.

**Acceptance Criteria:**

**Given** no existing project directory
**When** the project is initialized using `npx create-next-app@latest check-orbit --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
**Then** the project compiles and runs locally without errors
**And** shadcn/ui is initialized with the base component set (Button, Input, Badge, Card, Command, Dialog, Table, Tabs, Toast, Separator, Tooltip, Skeleton)
**And** `tailwind.config.ts` includes custom design tokens: brand palette (brand-500: #DE6438, brand-200: #E8A972, brand-blue: #5B9BC5, brand-blue-100: #BDD9F0, accent-gold: #DDB943) and status colors (emerald, sky, amber, rose per UX-DR4)
**And** TypeScript strict mode is enabled in `tsconfig.json`
**And** the project directory structure follows the architecture spec: `src/app/`, `src/components/ui/`, `src/lib/`, `src/types/`, `src/actions/`, `src/config/`, `trigger/`, `prisma/`
**And** `types/compliance.ts` defines the `ComplianceStatus` enum (LEGAL, PRESCRIPTION_ONLY, RESTRICTED, BANNED) and `STATUS_SEVERITY` map as single source of truth
**And** `lib/utils/response.ts` provides API response wrapper helpers (`{ success: true, data }` and `{ success: false, error: { code, message } }`)
**And** `.env.example` documents all required environment variables with descriptions

### Story 1.1b: Third-Party Service Integration

As a developer,
I want all external SDKs configured so API integrations are ready to use.

**Acceptance Criteria:**

**Given** the scaffolded project from Story 1.1a
**When** third-party SDKs are installed and configured
**Then** Prisma is installed with an initial `schema.prisma` pointing to Neon DATABASE_URL
**And** Clerk SDK is installed and ClerkProvider is added to root layout (full configuration in Story 1.3)
**And** Stripe SDK is installed with API key configuration
**And** Resend SDK is installed with API key configuration
**And** Upstash Ratelimit SDK is installed with Redis URL configuration
**And** Sentry SDK is installed with `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`
**And** Trigger.dev SDK is installed with project configuration
**And** `.env.local` template is updated with all service-specific environment variables
**And** all SDKs verified: imports resolve and TypeScript types are available

### Story 1.1c: CI/CD Pipeline & Deployment

As a developer,
I want automated checks and deployment so every PR is validated and deployable.

**Acceptance Criteria:**

**Given** the project with all SDKs from Story 1.1b
**When** CI/CD is configured
**Then** a GitHub Actions CI workflow runs TypeScript check (`tsc --noEmit`), ESLint, and Prisma schema validation on every push and PR
**And** the project deploys successfully to Vercel
**And** Vercel Preview Deployments are enabled for every PR
**And** Neon database branching is configured for preview deployments
**And** a global error boundary (`src/app/error.tsx`) reports errors to Sentry and displays a user-friendly error message

### Story 1.2a: Core Regulatory Data Model

As a developer,
I want the core database schema so compliance search queries can be built.

**Acceptance Criteria:**

**Given** the initialized project from Story 1.1a/1.1b
**When** the Prisma schema is defined and migrations are run
**Then** a `Country` model exists with fields: id, name, code (ISO 3166-1 alpha-2), isCovered (boolean), flagEmoji, popularityRank
**And** a `Medication` model exists with fields: id, brandName, genericName, slug, proprietaryBlend (Boolean, default false), disclosureLevel (enum: FULL, PARTIAL, UNDISCLOSED), and a relation to compounds
**And** a `Compound` model exists with fields: id, name, atcCode, casNumber, and relations to medications (many-to-many)
**And** a `Regulation` model (live table) exists with fields: id, compoundId, countryId, status (ComplianceStatus enum), regulatoryAuthority, requiredDocuments, quantityLimits, permitAuthority, permitApplicationUrl, permitLeadTimeDays, dosageThreshold, biosecurityFlag, biosecurityDetails, sourceDocumentTitle, sourceDocumentUrl, lastVerifiedAt, verifiedBy, notes
**And** a composite unique index exists on `[compoundId, countryId, regulatoryAuthority]` for the Regulation table (supports multiple authorities per compound-country pair)
**And** the ComplianceStatus enum is defined in Prisma matching the TypeScript enum (LEGAL, PRESCRIPTION_ONLY, RESTRICTED, BANNED)
**And** a seed script (`prisma/seed.ts`) populates sample data: at least 10 medications (including supplements with proprietary blends) with compound mappings, 10 countries (mix of covered and uncovered), regulatory records covering all four compliance statuses, and at least one multi-authority conflict example
**And** `lib/db/prisma.ts` exports a singleton Prisma client
**And** Neon database branching is configured for Vercel preview deployments

### Story 1.2b: Staging & Audit Schema [DEFERRED TO EPIC 8]

> **NOTE:** The StagingRegulation and AuditTrail tables are created in Story 8.1c when the curator pipeline is built. These tables are not needed until Epic 8 implementation begins. This avoids creating unused schema upfront.
>
> **Deferred models:**
> - **StagingRegulation:** identical fields to Regulation plus aiConfidence (HIGH/MEDIUM/LOW), aiExtractedText, aiTranslation, flaggedAt, reviewStatus (PENDING/APPROVED/REJECTED/ESCALATED)
> - **AuditTrail:** id, regulationId, action, previousData (JSON), newData (JSON), performedBy, performedAt, sourceCitation (append-only — no UPDATE/DELETE for application roles)

### Story 1.3: Authentication & Rate Limiting Foundation

As a traveler,
I want to optionally sign in with email/password or Google so I can access account features later,
So that anonymous search remains frictionless while authenticated features are available when I choose.

**Acceptance Criteria:**

**Given** the project with database schema from Story 1.2
**When** Clerk is integrated into the application
**Then** the root layout wraps the app in ClerkProvider
**And** sign-in page exists at `/sign-in/[[...sign-in]]` with email/password and Google OAuth options
**And** sign-up page exists at `/sign-up/[[...sign-up]]` with email/password and Google OAuth options
**And** Next.js middleware protects `/admin/*` routes (requires curator or admin role) and `/account/*` routes (requires any authenticated user)
**And** public routes (`/`, `/check/*`, `/api/check/*`, `/api/search/*`, `/coverage`) are accessible without authentication
**And** Clerk publicMetadata stores user role (defaulting to "user" on creation)
**And** `lib/auth/roles.ts` exports role-checking utilities (isCurator, isAdmin)
**And** Upstash Ratelimit is configured in `lib/rate-limit/rate-limit.ts` with tier-based limits: anonymous 30/hour, free account 60/hour, paid account 200/hour
**And** rate limiting middleware is applied to `/api/check/*` and `/api/search/*` routes
**And** rate-limited requests return `{ success: false, error: { code: "RATE_LIMITED", message: "..." } }` with 429 status and retry-after header
**And** Sentry is configured with `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` for error tracking
**And** a global error boundary (`src/app/error.tsx`) reports errors to Sentry and displays a user-friendly error message

### Story 1.4: Medication Search API with Autocomplete

As a traveler,
I want to type a medication name and see matching suggestions including brand names and generic/compound names,
So that I can quickly find my medication even if I misspell it or only know the brand name.

**Acceptance Criteria:**

**Given** the database contains medications with compound mappings
**When** a traveler types at least 1 character into the medication search field
**Then** an autocomplete dropdown appears after a 150ms debounce showing up to 8 matching medications
**And** each suggestion displays brand name with generic/compound name in parentheses (e.g., "Zoloft (sertraline)")
**And** fuzzy matching handles common misspellings (e.g., "adivl" matches "Advil (ibuprofen)")
**And** the `/api/search/medications?q=[query]` route returns matching medications with brand name, generic name, slug, and compound names
**And** the API response follows the structured format `{ success: true, data: { medications: [...] } }`
**And** the MedicationAutocomplete component exists in `src/components/search/MedicationAutocomplete.tsx` with hero and compact variants
**And** selecting a medication locks the input and displays a clear button to reset
**And** when no match is found, the dropdown shows "We don't have [input] in our database yet. Want to be notified when we add it?" with an inline email input field (UI only — visual placeholder without backend submission; backend email capture is connected in Story 3.3 when Resend integration is available)
**And** skeleton suggestion rows (3 rows) appear if the API response exceeds 300ms
**And** API response exceeding 5 seconds replaces skeleton with "Search is taking longer than expected. Please try again." with a retry button
**And** API 500 response shows "Something went wrong. Please try again." with a retry button; error is logged to Sentry
**And** the component follows WAI-ARIA combobox pattern: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-autocomplete="list"`
**And** keyboard navigation works: arrow keys through suggestions, Enter to select, Escape to close dropdown
**And** screen reader announces suggestion count: "N medications found"
**And** input validation uses Zod schema from `lib/validation/search-params.ts`

### Story 1.5: Country Selection with Coverage Transparency

As a traveler,
I want to select my destination country from a searchable list with flags and see clearly which countries are covered,
So that I know whether Check Orbit has data for my destination before searching.

**Acceptance Criteria:**

**Given** the database contains countries with coverage status and popularity ranking
**When** a traveler types into the country selector
**Then** a type-ahead dropdown appears showing matching countries with flag emojis and country names
**And** popular travel destinations appear weighted higher in the default list
**And** the `/api/search/countries?q=[query]` route returns matching countries with name, code, flag, and isCovered status
**And** the CountrySelector component exists in `src/components/search/CountrySelector.tsx` with single and multi (itinerary) variants
**And** selecting a country locks the input with country name + flag displayed, and a clear button to reset
**And** the component follows the same WAI-ARIA combobox pattern as MedicationAutocomplete
**And** flag emojis are decorative (`aria-hidden="true"`) — country name carries the information
**And** minimum 48px row height on mobile for touch targets
**And** a coverage page exists at `/coverage` showing all covered countries and listing uncovered countries
**And** when a traveler selects an uncovered country, the system displays inline: "We don't cover [country] yet. We currently have data for [N] countries." with a link to the coverage map and an email capture for notification when coverage is added (FR19)

### Story 1.6: Compliance Check API with Compound Decomposition

As a traveler,
I want to check a medication against a destination country and get a per-compound compliance result with the overall most-restrictive status,
So that I know exactly which ingredients are problematic and why.

**Acceptance Criteria:**

**Given** a valid medication and covered country are provided
**When** the `/api/check/[medication]/[country]` route is called
**Then** the system decomposes the medication into its active compounds (FR9)
**And** each compound is independently checked against the destination country's regulations (FR10)
**And** dosage-threshold classification is applied where the country differentiates by dosage level (FR11)
**And** if any compound is controlled or restricted, the overall medication is flagged regardless of brand perception (FR12)
**And** the overall compliance status reflects the most restrictive compound status using STATUS_SEVERITY ordering (FR36)
**And** when two or more regulatory authorities within a country publish conflicting rules for the same compound, the most restrictive interpretation is applied and both sources are displayed (FR36)
**And** the response includes: overallStatus, compounds array with individual statuses, requiredDocuments, quantityLimits, permitAuthority, permitApplicationUrl, permitLeadTimeDays, sourceDocumentTitle, sourceDocumentUrl, lastVerifiedAt, dataFreshness, biosecurityFlag, biosecurityDetails, disclaimer
**And** the response follows structured format `{ success: true, data: { ... } }` with all dates as ISO 8601 strings
**And** when the medication is not found, the response returns `{ success: false, error: { code: "MEDICATION_NOT_FOUND" } }`
**And** when the country is not covered, the response returns `{ success: false, error: { code: "COUNTRY_NOT_COVERED" } }`
**And** when a compound cannot be fully mapped, the response returns `{ success: false, error: { code: "UNABLE_TO_VERIFY" } }` (FR13)
**And** data freshness is calculated via `lib/compliance/data-freshness.ts` (Current: <90 days, Aging: 91-180, Stale: >180)
**And** business logic lives in `lib/compliance/compound-decomposition.ts` and `lib/compliance/status-resolution.ts`
**And** all errors are logged to Sentry; clients receive structured error responses without internal details
**And** end-to-end response time is under 20 seconds (NFR1)

### Story 1.7: Compliance Result Display Components

As a traveler,
I want to see my compliance result displayed with clear status badges, compound breakdown, required documents, source citations, and data freshness,
So that I understand my medication's legal status instantly and trust the information.

**Acceptance Criteria:**

**Given** a compliance check API returns a successful result
**When** the result is rendered on the page
**Then** a ComplianceStatusBadge displays the overall status with correct color, icon, and text label:
  - Legal: sage green (bg-emerald-50, border-emerald-200, text-emerald-700) + checkmark icon
  - Prescription-Only: sky blue (bg-sky-50, border-sky-200, text-sky-700) + document icon
  - Restricted: warm amber (bg-amber-50, border-amber-200, text-amber-700) + warning triangle icon
  - Banned: soft rose (bg-rose-50, border-rose-200, text-rose-700) + prohibition icon
**And** the badge has variants: default (inline), compact (table rows), large (single result page hero)
**And** the badge uses `role="status"` and `aria-label="Compliance status: [status]"`
**And** a ComplianceResultCard displays: medication name (brand + generic), compound decomposition section, overall status badge, required documents list, quantity limits, permit details with authority and lead time, source citation, and action button placeholders
**And** the card has a colored status bar on its top edge matching the overall status
**And** a CompoundDecomposition component shows each compound with its individual status badge when the medication has multiple active ingredients
**And** a SourceCitation component displays government authority name, document title, verification date, and link to original document (opening in new tab with `rel="noopener noreferrer"`)
**And** a DataFreshnessIndicator shows Current/Aging/Stale status with text label (not color alone)
**And** an informational disclaimer appears on every result (FR38)
**And** all status color combinations pass WCAG AA contrast ratios
**And** status is triple-encoded: color + icon + text label (NFR27)
**And** all display components are Server Components organized in `src/components/compliance/`

### Story 1.8: Homepage Hero Search & Result Page

As a traveler,
I want to land on a homepage with an immediately visible search bar and get results on a dedicated page,
So that I can go from uncertainty to a compliance answer in seconds with zero friction.

**Acceptance Criteria:**

**Given** a traveler navigates to the homepage
**When** the page loads
**Then** a centered hero search bar is immediately visible without scrolling, with a clear value proposition
**And** no onboarding walls, signup prompts, or marketing copy block access to the search
**And** the search flow is progressive: medication input first, then country input gains focus automatically after medication is selected
**And** a DepartureDateInput component renders inline after country selection as an optional, non-blocking prompt. This component is the single owner of departure date input across the application — no duplicate date input exists elsewhere.
**And** the departure date is stored in the URL as a query parameter (`?departureDate=YYYY-MM-DD`) for shareability and consumption by downstream components (Story 1.9 consumes this value for permit lead time calculations)
**And** a "Check" button (burnt orange brand-500, white text, bold) appears once both medication and country are selected
**And** the button is labeled "Check" (not "Search" or "Submit") per UX-DR3
**And** clicking Check navigates to `/check/[medication-slug]/[country-code]` — a server-rendered result page
**And** the result page renders the ComplianceResultCard with full compliance details from the API
**And** a fixed navigation header (56px desktop, 48px mobile) includes the Check Orbit logo linking to `/`
**And** on desktop, a compact search bar appears in the nav on result pages, pre-filled with the current search
**And** on mobile, search fields appear at the top of the result page (not in nav)
**And** a minimal footer includes the legal disclaimer, privacy policy link, terms link, and contact
**And** the layout is mobile-first responsive: single column on mobile (320-767px), wider padding on tablet (768-1023px), max-width 1200px centered on desktop (1024px+)
**And** the Check button is full-width on mobile, auto-width on desktop, minimum height 48px
**And** skip-to-content link is the first focusable element on every page
**And** tab order follows: medication input → country input → date → Check button → result content
**And** the page achieves LCP < 2.5 seconds and CLS < 0.1 (NFR4, NFR5)

### Story 1.9: Permit Lead Time Alerts & Departure Date

As a traveler,
I want to see time-sensitive permit warnings based on my departure date,
So that I know whether I have enough time to apply for a required permit or if I'm already too late.

**Acceptance Criteria:**

**Given** a compliance result with status Restricted and a permit lead time requirement
**When** the traveler has provided a departure date
**Then** the system calculates the remaining days and compares against the permit's required lead time
**And** if enough time remains, a PermitLeadTimeAlert displays: "Apply by [calculated date] — minimum [N] days required. Authority: [name]" with a link to the application URL
**And** if the traveler is already too late, the alert displays: "You're already too late — minimum [N] days required. Your departure is in [X] days." in the banner variant at the top of the result
**And** the "too late" state uses `role="alert"` with `aria-live="assertive"`

**Given** a compliance result with status Restricted and a permit lead time requirement
**When** the traveler has NOT provided a departure date
**Then** the alert displays: "Minimum [N] days lead time required. Add your departure date for a deadline calculation." using `role="note"`

**Given** a compliance result with status Legal or Banned
**When** the result is displayed
**Then** no PermitLeadTimeAlert is shown

**Given** the departure date value in the URL
**When** Story 1.9 components render
**Then** the departure date is read from the URL query parameter (`?departureDate=YYYY-MM-DD`) as set by Story 1.8's DepartureDateInput component — this story does NOT create its own date input, it consumes the value from URL state
**And** the tone is factual, not judgmental — "too late" never implies blame (UX-DR37)

### Story 1.10: Biosecurity Warnings & Verification Gap Handling

As a traveler carrying supplements or plant-derived products,
I want to see biosecurity warnings and clear messaging when ingredients can't be fully verified,
So that I understand all potential import risks beyond pharmaceutical compliance.

**Acceptance Criteria:**

**Given** a compliance result for a product containing plant-derived, animal-derived, or soil-contact ingredients
**When** the destination country enforces agricultural biosecurity import restrictions
**Then** a BiosecurityWarning component displays as an overlay on the compliance result with a dashed border and leaf/plant icon
**And** the warning is independent of pharmaceutical compliance status (FR13b)
**And** the warning includes the specific biosecurity concern and the enforcing authority
**And** the warning uses `role="alert"` with `aria-live="polite"`

**Given** a supplement with a proprietary blend that does not fully disclose ingredients
**When** the compliance check is performed
**Then** the system displays a specific warning: compliance cannot be guaranteed for undisclosed ingredients (FR13a)
**And** the warning advises the traveler to consult destination customs authorities

**Given** a medication that cannot be mapped to known compounds
**When** the compliance check is performed
**Then** an UnableToVerify component displays with an explanation of the verification gap
**And** advisory messaging recommends consulting destination customs authorities
**And** no false compliance status is returned (FR20)

**Given** a medication not found in the database
**When** the search is performed
**Then** a MedicationNotFound component displays inline: "We don't have [medication name] in our database yet."
**And** an email capture field offers: "Want to be notified when we add it?" (UX-DR33)
**And** submitting the email shows confirmation text replacing the input

---

## Epic 2: Travelers Discover Check Orbit Through Search Engines

Travelers discover Check Orbit through Google search — each medication-country pair has a unique, server-rendered, indexable page with structured data, appearing in search results with compliance status.

### Story 2.1: ISR Compliance Result Pages with SEO URLs

As a traveler searching Google for medication compliance,
I want to find a dedicated, fast-loading Check Orbit page for my specific medication-country query,
So that I get an authoritative answer directly from search results without navigating through a generic homepage.

**Acceptance Criteria:**

**Given** a medication-country pair exists in the database
**When** a search engine crawler or traveler visits `/check/[medication-slug]/[country-code]`
**Then** the page is server-rendered with the full compliance result pre-populated (no client-side fetch required)
**And** the page uses ISR (Incremental Static Regeneration) with a revalidation strategy — pages are cached at the CDN and served instantly
**And** on-demand revalidation is supported via `lib/compliance/revalidation.ts` so that when a curator approves a regulation change, only affected pages revalidate
**And** the revalidation function resolves all affected URLs for a compound-country change (both brand name and compound name slugs)
**And** an internal revalidation endpoint exists at `/api/revalidate` protected by a secret token
**And** the page includes the pre-filled, editable search bar at the top so travelers can modify their search
**And** the page URL is shareable and bookmarkable
**And** the page renders the same ComplianceResultCard, SourceCitation, and all display components from Epic 1
**And** Core Web Vitals targets are met: LCP < 2.5s, CLS < 0.1, FCP < 2s (NFR4-6)
**And** the page works without JavaScript (progressive enhancement — core result is server-rendered HTML)

### Story 2.2: Structured Data & Rich Search Results

As a traveler searching Google,
I want Check Orbit results to appear with rich information (medication name, status, country) directly in search results,
So that I can see the compliance answer before even clicking through.

**Acceptance Criteria:**

**Given** a compliance result page at `/check/[medication]/[country]`
**When** the page is rendered
**Then** a JSON-LD script tag is included with Schema.org structured data appropriate for the content (medication name, compliance status, destination country, last verified date)
**And** Open Graph meta tags are set: `og:title` (medication + country + status), `og:description` (auto-generated from compliance result), `og:image` (risk card image via Vercel OG), `og:url` (canonical URL)
**And** Twitter Card meta tags are set for summary_large_image format
**And** the `<title>` tag follows the pattern: "[Medication] in [Country] — [Status] | Check Orbit"
**And** the meta description is auto-generated from the compliance status and key details (e.g., "Sertraline (Zoloft) is Restricted in UAE. Permit required — minimum 14 days. Verified March 2026.")
**And** structured data passes Google's Rich Results Test validation
**And** each page includes `<link rel="canonical">` pointing to the authoritative URL for that medication-country pair (FR28)

### Story 2.3: Dynamic Sitemap & Canonical URL Resolution

As a search engine,
I want a complete, current sitemap of all compliance pages and clear canonical signals,
So that I can efficiently index all medication-country pairs without duplicate content issues.

**Acceptance Criteria:**

**Given** the regulatory database contains medication-country compliance records
**When** `/sitemap.xml` is requested
**Then** a dynamic sitemap is generated from `src/app/sitemap.ts` listing all medication-country pair URLs with lastmod dates based on lastVerifiedAt (FR27)
**And** the sitemap updates automatically as new medications and countries are added — no manual maintenance required
**And** brand name URLs (e.g., `/check/zoloft/uae`) and compound name URLs (e.g., `/check/sertraline/uae`) are resolved to a single canonical page via `<link rel="canonical">` (FR28)
**And** the non-canonical URL either redirects (301) to the canonical URL or renders with the canonical tag — the approach is consistent across all pairs
**And** `robots.txt` is configured at `/public/robots.txt` allowing search engine crawling of `/check/*` pages and blocking `/admin/*`, `/account/*`, and `/api/*` routes
**And** the sitemap conforms to the sitemap protocol specification
**And** adding a new country to the database (NFR18) automatically includes its medication-country pages in the next sitemap generation without code changes

### Story 2.4: Debunking Landing Pages

As a traveler who encountered dangerous travel advice online,
I want to find authoritative content that corrects specific myths about traveling with medications,
So that I can make safe decisions instead of following risky viral trends.

**Acceptance Criteria:**

**Given** editorially authored debunking content exists
**When** a traveler visits `/debunking/[slug]`
**Then** the page renders a server-rendered article addressing a specific dangerous travel trend (e.g., "removing prescription labels," "carrying pills in unlabeled containers")
**And** the page includes links to relevant compliance searches (e.g., "Check if your medication is legal in [country]") that navigate to `/check/[medication]/[country]`
**And** the page is SEO-indexed with appropriate meta tags and structured data
**And** the page is included in the dynamic sitemap
**And** the page follows the same layout (nav header, footer with disclaimer) as compliance result pages
**And** the content is stored in a format that allows editorial updates without code deployments (e.g., MDX files or database-driven content)
**And** debunking pages can be created and published by adding content — no new routes or code changes required (FR64)

---

## Epic 3: Travelers Share Medication Warnings and Capture Interest

Travelers can share surprising compliance facts as visually striking risk cards on social media, and discovery-mode users can save destinations for future trip alerts — driving viral growth.

### Story 3.1: Risk Card Generation

As a traveler who discovered a surprising compliance fact,
I want a visually striking graphic generated from my compliance result,
So that I can share it on social media and warn friends about medication risks.

**Acceptance Criteria:**

**Given** a compliance result exists for a medication-country pair
**When** the page at `/check/[medication]/[country]` is rendered
**Then** an OG image is automatically generated via `src/app/check/[medication]/[country]/opengraph-image.tsx` using Vercel OG (Satori)
**And** the risk card displays: medication name (bold), country flag, compliance status badge (large, with status color), one-line key detail (e.g., "Permit required — 14 days" or "Prohibited regardless of prescription"), and a branded Check Orbit CTA with URL
**And** the card is generated in standard OG dimensions (1200x630) for link previews
**And** an additional Instagram-optimized variant (1080x1080) is available via `/api/share/risk-card?med=[slug]&country=[code]&format=square`
**And** the card uses bold status colors, large text, and high contrast that survives screenshot compression
**And** the card renders at the edge for fast generation
**And** the generated image includes `alt` text with full compliance summary (e.g., "Melatonin is Prescription-Only in Germany. Source: BfArM, verified 2026-01-15.")
**And** the card works within the Satori CSS subset (no unsupported CSS properties)

### Story 3.2: Risk Card Export & Social Sharing

As a traveler,
I want to share a risk card to social platforms or download it with one tap,
So that I can warn friends and family about medication risks with zero friction.

**Acceptance Criteria:**

**Given** a compliance result is displayed on the result page
**When** the traveler taps the "Share risk card" action button
**Then** a ShareDialog opens as a bottom sheet on mobile or centered modal on desktop
**And** the dialog shows a preview of how the risk card will look when shared
**And** share options include: copy link (copies the `/check/[medication]/[country]` URL), share via native Web Share API (on supported devices), and download as image file
**And** the native share API opens the device's share sheet with the risk card image and URL pre-populated
**And** on devices without Web Share API support, only copy link and download options are shown
**And** copying the link shows a toast confirmation: "Link copied"
**And** downloading the image saves a PNG file to the device
**And** no account is required to share — sharing is available to all users including anonymous
**And** the ShareDialog uses `role="dialog"`, `aria-modal="true"`, focus is trapped within the dialog, Escape closes it, and focus returns to the trigger button on close
**And** maximum one modal visible at a time — opening share closes any other open dialog
**And** the RiskCard component exists in `src/components/sharing/RiskCard.tsx` and ShareDialog in `src/components/sharing/ShareDialog.tsx`

### Story 3.3: "Save for My Next Trip" Email Capture

As a discovery-mode traveler not planning an immediate trip,
I want to save destination countries with my email to get alerted if regulations change,
So that I'm prepared when I eventually book travel to those destinations.

**Acceptance Criteria:**

**Given** a traveler is viewing a compliance result or browsing the site
**When** they interact with the "Save for my next trip" prompt
**Then** a SaveForNextTrip component displays with an email input field and a multi-select for destination countries
**And** the form requires only an email address and at least one destination country — no medication data is collected or stored (FR63)
**And** submitting the form calls `/api/subscribe/email` which stores the email and destination country list
**And** a Prisma model for destination subscriptions stores: id, email, countryCodes (array), subscribedAt, unsubscribeToken
**And** the API validates the email format and country codes using Zod schemas
**And** on successful submission, the form is replaced with confirmation text: "We'll alert you if regulations change for [countries]"
**And** a toast notification confirms the save
**And** a welcome email is sent via Resend confirming the subscription with an unsubscribe link
**And** the unsubscribe link allows one-click removal without authentication
**And** no account creation is required — this is the lightest possible conversion (FR62)
**And** the component appears as a post-result action on compliance result pages and as a standalone section on the homepage below the hero search
**And** the component is organized in `src/components/sharing/SaveForNextTrip.tsx`

### Story 3.4: Send Compliance Result via Email

As a traveler,
I want to email myself a compliance result so I have it in my inbox for reference.

**Acceptance Criteria:**

**Given** a traveler is viewing a compliance result
**When** they click the "Send to my email" ghost-style tertiary action button
**Then** an inline email input appears (single field + "Send" button on same row)
**And** a `/api/share/send-result` POST endpoint accepts email address and current compliance result data
**And** input is validated using Zod for email format
**And** the email is sent via Resend using a React email template (`lib/email/templates/compliance-result.tsx`)
**And** the email contains: medication name, country, compliance status, key details (required docs, permit info), source citation with verification date, link to full result page, and informational disclaimer
**And** no medication data is persisted — this is a transient send only (FR65)
**And** on success, the input is replaced with confirmation text: "Sent to your@email.com" and a toast confirmation
**And** the endpoint is rate limited: max 5 sends per email address per hour to prevent abuse
**And** no account is required to use this feature
**And** the component is organized in `src/components/sharing/SendResultEmail.tsx`

---

## Epic 4: Travelers Track and Revisit Their Medication Checks

Travelers can create accounts, save compliance searches, revisit them to see updated results, and see exactly what regulations changed since their last check.

### Story 4.1: Save & Delete Compliance Searches

As a traveler viewing a compliance result,
I want to save this search to my account so I can track it over time,
So that I'm alerted to regulation changes before my next trip.

**Acceptance Criteria:**

**Given** a traveler is viewing a compliance result
**When** they click "Save search"
**Then** if authenticated, a Server Action (`src/actions/save-search.ts`) saves the search to their account including: medication slug, country code, current compliance result as a JSON snapshot (status, compounds, documents, source citation, verification date), and the save timestamp
**And** the Prisma model `SavedSearch` stores: id, userId, medicationSlug, countryCode, resultSnapshot (JSON), savedAt, lastCheckedAt
**And** on successful save, a toast confirms: "Search saved"
**And** the save button transitions to a "Saved" state (disabled, checkmark icon)

**Given** a traveler is viewing a compliance result and is NOT authenticated
**When** they click "Save search"
**Then** an account creation modal appears (centered modal, not full-page redirect)
**And** the modal offers Google OAuth and email/password signup (progressive: email → password → done)
**And** after successful account creation, the modal closes and the search is automatically saved
**And** focus returns to the result page with a toast: "Account created and search saved"

**Given** an authenticated traveler is on the `/account` dashboard
**When** they click delete on a saved search
**Then** a Server Action (`src/actions/delete-search.ts`) removes the saved search from their account (FR46)
**And** the search disappears from the list with a toast: "Search removed"

> **NOTE:** Save action has no tier awareness. Any authenticated user can save searches. Tier-based save limits (free slot consumption, paywall triggers) are implemented in Story 5.2 (Paywall & Feature Gating).

### Story 4.2: User Account Dashboard & Saved Search List

As a registered traveler,
I want a dashboard showing all my saved searches with indicators for regulation changes,
So that I can quickly see which of my medications have updated compliance status.

**Acceptance Criteria:**

**Given** an authenticated traveler navigates to `/account`
**When** the page loads
**Then** a SavedSearchList component displays all saved searches ordered by most recently saved
**And** each SavedSearchCard shows: medication name, destination country with flag, compliance status badge, date saved, and a change indicator badge if regulations have changed since the snapshot was taken
**And** the change indicator badge shows "Updated" with the change date when the current regulatory data differs from the saved snapshot
**And** saved searches with no changes show "Current — no changes since your last check"
**And** clicking a saved search card navigates to `/check/[medication]/[country]` with the snapshot comparison view
**And** the account layout at `/account/layout.tsx` requires authentication (redirects to sign-in if unauthenticated)
**And** an empty state displays when no searches are saved: "No saved searches yet. Run a search and save it to track regulation changes." with a "Search now" button linking to the homepage (UX-DR25)
**And** the page includes navigation to account settings and subscription management
**And** components are organized in `src/components/account/SavedSearchList.tsx` and `src/components/account/SavedSearchCard.tsx`
**And** saved search data is fetched via `lib/db/queries/saved-searches.ts`
**And** the SavedSearch model (defined in Story 4.1) is used to query saved searches

### Story 4.3: Saved Search Re-Check with Change Detection

As a returning traveler,
I want to revisit a saved search and see what regulations have changed since my last check,
So that I can update my travel preparation if requirements have shifted.

**Acceptance Criteria:**

**Given** an authenticated traveler revisits a saved search by clicking it from the dashboard or via a direct link
**When** the compliance result page loads
**Then** the system regenerates the current compliance result from the latest database (FR43)
**And** the system compares the current result against the saved snapshot
**And** if regulations have changed, a ChangeComparisonBanner displays at the top of the result — prominent, not dismissible until acknowledged (UX-DR13)
**And** the banner shows: "Regulation Updated" header with change date, side-by-side comparison of previous status vs. current status, highlighted differences in requirements (e.g., "Previous: No permit needed → Current: Prescription translation required"), source of change with government gazette reference and verification date
**And** action buttons on the banner include: "Update snapshot" (refreshes the saved baseline to current), "Dismiss" (acknowledges the change), and "Share updated risk card"
**And** clicking "Update snapshot" triggers a Server Action that replaces the saved snapshot with the current result and updates `lastCheckedAt`
**And** if no changes are detected, the result page displays normally with a subtle indicator: "Current — verified [date], no changes since your last check"
**And** the comparison is described textually for screen readers: "Previous: [status/details]. Current: [status/details]. Changed: [date]."
**And** the ChangeComparisonBanner uses `role="alert"` when a change is detected
**And** the component is organized in `src/components/compliance/ChangeComparisonBanner.tsx`

---

## Epic 5: Travelers Unlock Advanced Features with Pro

Travelers can access tiered features — free single-med search for all, free account with one save slot, paid tier unlocking multi-medication search, layover trap, unlimited saves, and notifications.

### Story 5.1: Travelers Can Upgrade to Pro for Advanced Features

As a traveler,
I want to upgrade to a paid plan so I can unlock multi-medication search, layover trap, and unlimited saved searches.

**Acceptance Criteria:**

**Given** the application with Clerk authentication from Epic 1
**When** Stripe is integrated
**Then** `lib/payments/stripe.ts` exports a configured Stripe client
**And** two subscription tiers are configured in Stripe: Free (default, no payment) and Pro (paid monthly)
**And** a Stripe webhook endpoint exists at `/api/webhooks/stripe/route.ts` handling events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
**And** webhook signature verification ensures only authentic Stripe events are processed
**And** Clerk user publicMetadata is updated with subscription tier (`free` or `pro`) when subscription status changes via webhook
**And** `lib/payments/subscription.ts` exports tier-checking utilities: `getUserTier(userId)`, `canAccessFeature(userId, feature)`, `isProUser(userId)`
**And** feature gating covers: multi-medication search (FR7), layover trap (Epic 6), unlimited saved searches, email notifications
**And** the Upstash rate limiter from Story 1.3 reads the user's tier to apply correct rate limits (free: 60/hr, paid: 200/hr)
**And** Stripe handles all payment processing — no credit card data is stored or processed by Check Orbit (NFR9)
**And** webhook handlers are organized in `lib/payments/webhook-handlers.ts`
**And** all Stripe errors are logged to Sentry with structured error responses to the client
**And** if `getUserTier()` fails (Clerk unavailable, network error), the system defaults to free tier and logs the error to Sentry — the user is not blocked from using the application; they see free-tier behavior until the issue resolves

### Story 5.2: Paywall & Feature Gating

As a free-tier traveler,
I want to see what premium features are available when I try to use them,
So that I understand the value of upgrading without being blocked from critical safety information.

**Acceptance Criteria:**

**Given** a free-tier traveler views a compliance result
**When** they click "Add another medication"
**Then** a PaywallModal appears explaining multi-medication search is a Pro feature
**And** the modal uses accent gold (`accent-gold`) CTA button with dark text, visually distinct from the primary Check button
**And** the modal content includes: what the upgrade unlocks, price, CTA button, and a dismiss option: "Or search individually for free" (UX-DR39)
**And** the modal never blocks access to the current result — dismissing returns to the visible compliance result
**And** no countdown timers, urgency tricks, or "limited time offer" language

**Given** a free-tier traveler clicks "Add transit countries"
**When** the paywall triggers
**Then** the same PaywallModal appears explaining layover trap is a Pro feature
**And** the bypass note reads: "Or search each country individually for free"

**Given** a free-tier traveler with a consumed save slot tries to save a second search
**When** the save action triggers
**Then** the PaywallModal appears explaining unlimited saves require Pro

**Given** a free-tier account with one saved search slot
**When** the traveler saves a search (via Story 4.1)
**Then** the free save slot is permanently consumed — deleting the saved search does NOT restore the slot (FR50)
**And** attempting to save a second search on free tier shows the PaywallModal for unlimited saves
**And** this paywall follows the same pattern as multi-medication and layover trap paywalls

**Given** the PaywallModal
**When** it renders
**Then** it is a centered modal on desktop with backdrop overlay (60% black), full-screen takeover on mobile
**And** dismiss options: click backdrop, click X, press Escape
**And** the CTA button initiates a Stripe Checkout session and redirects to Stripe's hosted payment page
**And** after successful payment, the traveler is redirected back to their original page with the feature now unlocked
**And** the modal uses `role="dialog"`, `aria-modal="true"`, focus is trapped within, Escape closes it
**And** the PaywallModal component is organized in `src/components/layout/PaywallModal.tsx`

### Story 5.3: Subscription Management & Pricing Page

As a traveler,
I want to see pricing details and manage my subscription,
So that I can upgrade, downgrade, or cancel my plan as needed.

**Acceptance Criteria:**

**Given** any visitor navigates to `/pricing`
**When** the page loads
**Then** a pricing page displays a clear comparison of Free vs. Pro tiers
**And** Free tier shows: single-medication search, single-country search, one saved search slot, shareable risk cards
**And** Pro tier shows: multi-medication search (up to 10), layover trap with transit conflict detection, unlimited saved searches, email notifications for regulation changes, permit deadline reminders, alternative transit hub suggestions
**And** the Pro tier price is clearly displayed with a "Start Pro" CTA (accent gold button)
**And** the page is server-rendered and accessible without authentication

**Given** an authenticated traveler navigates to `/account/subscription`
**When** the page loads
**Then** the page displays current plan (Free or Pro), subscription status, and next billing date (if Pro)
**And** free users see an upgrade CTA linking to Stripe Checkout
**And** Pro users see a "Manage subscription" button that opens the Stripe Customer Portal for billing history, payment method updates, and cancellation
**And** the Stripe Customer Portal is configured via Stripe dashboard — no custom billing UI built in Check Orbit
**And** if a subscription is cancelled, the user retains Pro access until the end of the billing period, then reverts to Free tier
**And** the page is protected by authentication middleware (redirects to sign-in if unauthenticated)

---

## Epic 6: Travelers Discover Hidden Risks at Layover Countries

Travelers can enter their full travel route (origin, transit stops, destination) and discover medication conflicts at layover countries — with alternative transit hub suggestions.

### Story 6.1: Itinerary Builder & Multi-Stop Input

As a traveler planning a multi-stop trip,
I want to enter my full route including transit countries,
So that I can check medication compliance across my entire itinerary.

**Acceptance Criteria:**

**Given** a paid-tier traveler navigates to `/itinerary` or clicks "Add transit countries" from a result page
**When** the itinerary builder loads
**Then** an ItineraryBuilder component displays sequential country inputs: Origin → [Transit stops] → Destination
**And** if arriving from a result page, the destination is pre-filled from the current search
**And** each country input uses the CountrySelector component in multi variant
**And** an "Add transit stop" button inserts a new CountrySelector between origin and destination
**And** each transit stop has a remove button (X) — origin and destination cannot be removed
**And** on desktop, stops can be reordered via drag-and-drop
**And** on mobile, stops can be reordered via up/down arrow buttons (accessible alternative to drag)
**And** minimum itinerary: origin + destination (2 stops)
**And** maximum itinerary: origin + 4 transit stops + destination (6 stops total)
**And** a "Check itinerary" button (burnt orange primary) appears once origin and destination are both selected
**And** itinerary state persists in URL query parameters for shareability and bookmarkability
**And** all interactive elements meet 48px minimum touch targets on mobile
**And** keyboard navigation supports: Tab between stops, Enter to open/select country, arrow keys within selectors
**And** the component is organized in `src/components/itinerary/ItineraryBuilder.tsx`
**And** free-tier users who navigate to `/itinerary` see the PaywallModal explaining this is a Pro feature

### Story 6.2: Multi-Stop Compliance Check API

As a traveler,
I want my medications checked against every country in my itinerary including transit stops,
So that I discover any conflicts before I travel.

**Acceptance Criteria:**

**Given** a valid itinerary with origin, transit stops, and destination, plus one or more medications
**When** the `/api/itinerary/check` route is called
**Then** the system checks medication compliance for every country in the itinerary sequence (FR15)
**And** the response includes per-country compliance results in itinerary order: country name, code, flag, stopType (origin/transit/destination), compliance status, compounds with individual statuses, required documents, permit details, source citations
**And** the system detects transit country conflicts: medication is Legal at origin and destination but Banned or Restricted at a transit stop (FR17)
**And** transit conflicts are flagged explicitly in the response with a `transitConflict: true` field on the affected stop
**And** when a transit conflict is detected, the response includes a list of common alternative transit hubs for the same origin-destination pair where the medication is Legal (FR17a)
**And** alternative hubs are sourced from `lib/compliance/alternative-hubs.ts` based on common airline routing data
**And** input validation uses Zod schema from `lib/validation/itinerary-params.ts` enforcing: minimum 2 stops, maximum 6 stops, valid country codes, at least one medication
**And** the response follows structured format `{ success: true, data: { itinerary: [...], conflicts: [...], alternatives: [...] } }`
**And** end-to-end response time is under 20 seconds for up to 10 transit stops (NFR3)
**And** business logic lives in `lib/compliance/itinerary-check.ts`
**And** the API requires paid tier — free-tier requests return `{ success: false, error: { code: "SUBSCRIPTION_REQUIRED" } }`
**And** invalid itinerary input (fewer than 2 stops, invalid country codes) returns a Zod validation error with a clear message listing specific validation failures
**And** medication not found in itinerary check returns `{ success: false, error: { code: "MEDICATION_NOT_FOUND" } }` with guidance
**And** rate-limited requests return `{ success: false, error: { code: "RATE_LIMITED" } }` with 429 status and retry-after header

### Story 6.3: Itinerary Timeline Display & Transit Conflict Alerts

As a traveler viewing itinerary results,
I want to see a visual timeline of my route with status indicators at each stop,
So that I can immediately spot where medication conflicts exist in my journey.

**Acceptance Criteria:**

**Given** a multi-stop compliance check returns results
**When** the itinerary results page renders
**Then** the view switches to an ItineraryTimeline component — a vertical timeline with colored status dots at each stop
**And** each stop shows: country name, flag, stop type label (Origin/Transit/Destination), ComplianceStatusBadge dot, and expandable compliance detail
**And** a vertical line connects all stops with status-colored dots at each node
**And** stops with no conflicts show green/blue/amber dots matching their status
**And** transit conflict stops show a red dot with a prominent TransitConflictAlert box appearing inline between the conflicting stop and adjacent stops
**And** the TransitConflictAlert displays: "Your medication is legal at origin and destination but BANNED at this layover" with red border and warning icon
**And** below the conflict alert, a "View safe alternative transit hubs" link shows alternative stops inline (e.g., "Singapore — Legal with prescription / Bangkok — Legal")
**And** the compact timeline variant shows dots + country names on the vertical line; the expanded variant shows full compliance details and source citations per stop
**And** the timeline uses `role="list"` with `role="listitem"` for each stop in order
**And** `aria-live="polite"` is set on the conflict alert region
**And** screen reader announces each stop: "Stop [N] of [total]: [country], [stop type] — [status]" and "transit conflict detected" where applicable
**And** keyboard support allows navigation between stops and expanding/collapsing details
**And** the timeline is fully responsive: full-width vertical on mobile and tablet, vertical with wider side detail panels on desktop
**And** components are organized in `src/components/itinerary/ItineraryTimeline.tsx` and `src/components/itinerary/TransitConflictAlert.tsx`

---

## Epic 7: Travelers Stay Informed When Regulations Change

Travelers receive proactive email alerts when regulations change for their saved medication-country pairs, and permit deadline reminders before travel.

### Story 7.1: Regulation Change Notification System

As a traveler with saved searches,
I want to be automatically notified when a regulation changes for a medication-country pair I've saved,
So that I learn about changes that affect my travel without having to manually re-check.

**Acceptance Criteria:**

**Given** a paid-tier traveler has opted in to regulation change notifications for a saved search
**When** a `regulation.approved` event is received (emitted by Story 8.3's approval flow via `trigger/events/regulation-approved.ts`) for a compound-country pair matching the saved search
**Then** the system subscribes to `regulation.approved` events and identifies all notification subscriptions matching the affected compound-country pair
**And** matching uses anonymized search hashes — the system never reverse-engineers hashes to medication names (FR24)
**And** a Prisma model `NotificationSubscription` stores: id, userId, searchHash (anonymized), compoundCountryPairs (hashed array), isActive, createdAt
**And** the notification dispatch is handled by a Trigger.dev background task (`trigger/notifications/dispatch-regulation-change.ts`) so it does not block the curator approval flow
**And** the email is sent via Resend using a React email template (`lib/email/templates/regulation-change.tsx`) that includes: medication name, country, previous status, new status, change date, source citation, and a direct link to the updated compliance result page
**And** the email does not store or include the traveler's personal medication context beyond what they explicitly saved
**And** the system can deliver up to 50,000 notifications within 4 hours for widely-searched medication-country pair changes (NFR20)
**And** email deliverability targets 99%+ (NFR24)
**And** `lib/email/notification-matching.ts` handles the matching logic between regulation changes and subscriptions
**And** failed email deliveries are logged to Sentry with bounce/complaint handling via Resend webhooks

### Story 7.2: Permit Deadline Reminders

As a traveler with a saved search for a restricted medication,
I want to receive reminders before my departure date about permit application deadlines,
So that I don't miss the window to apply for required travel permits.

**Acceptance Criteria:**

**Given** a paid-tier traveler has a saved search with a departure date for a medication with Restricted status and a permit lead time requirement
**When** they opt in to permit deadline reminders
**Then** the system schedules reminder emails at configurable intervals: 4 weeks, 2 weeks, and 1 week before departure (FR22)
**And** reminders are dispatched by a Trigger.dev scheduled task (`trigger/notifications/dispatch-permit-reminder.ts`) that runs daily and checks for upcoming deadlines
**And** each reminder email (via `lib/email/templates/permit-reminder.tsx`) includes: medication name, destination country, permit authority name, application URL, remaining days until departure, and required lead time
**And** if the traveler is already past the permit application deadline, the reminder states this factually without blame: "The minimum lead time of [N] days has passed. Your departure is in [X] days."
**And** reminders stop after the departure date passes
**And** reminders stop if the traveler cancels the reminder or deletes the saved search
**And** only one reminder per interval is sent — no duplicate emails for the same deadline
**And** the departure date is stored on the SavedSearch model (optional field added) — not as personal medication data

### Story 7.3: Notification Preferences & Unsubscribe

As a traveler,
I want to manage which notifications I receive and easily unsubscribe,
So that I control my email communication with Check Orbit.

**Acceptance Criteria:**

**Given** an authenticated traveler navigates to `/account/settings`
**When** the page loads
**Then** a NotificationPreferences component displays toggles for: regulation change alerts (per saved search), permit deadline reminders (per saved search with departure date), and a global "pause all notifications" toggle
**And** each saved search shows its individual notification settings (regulation alerts on/off, permit reminders on/off)
**And** toggling a preference triggers a Server Action (`src/actions/subscribe-notifications.ts`) that updates the subscription in the database
**And** changes take effect immediately with a toast confirmation: "Preferences updated"

**Given** a traveler receives any notification email
**When** they click the unsubscribe link in the email footer
**Then** a one-click unsubscribe page processes the request without requiring authentication (FR23)
**And** the unsubscribe token is validated and the specific notification subscription is deactivated
**And** a confirmation page displays: "You've been unsubscribed from [notification type] for [medication + country]"
**And** the traveler can re-enable notifications from `/account/settings` if they change their mind

**Given** the email notification system
**When** any email is sent
**Then** the email includes: Check Orbit branding, clear subject line, unsubscribe link in footer, and complies with CAN-SPAM requirements
**And** the NotificationPreferences component is organized in `src/components/account/NotificationPreferences.tsx`

---

## Epic 8: Curators Keep the Regulatory Database Accurate and Current

Data curators can efficiently review AI-flagged regulatory changes, verify against source documents, approve/reject/escalate with full audit trail — keeping the database accurate and current.

### Story 8.1a: Pipeline Scaffold & Single-Country Scan

As a data curator,
I want the AI pipeline to scan one country's regulatory publications so I can validate the extraction approach.

**Acceptance Criteria:**

**Given** the Trigger.dev orchestration is configured
**When** the daily scheduled cron job runs
**Then** `trigger/regulatory/scan-country.ts` processes a single country
**And** the scan fetches government publication URLs (health ministry announcements, customs authority bulletins, gazette publications) for the target country
**And** PDF documents are extracted using LlamaParse (`trigger/regulatory/extract-regulations.ts`) with table and layout understanding
**And** extracted text is stored with source URL and extraction timestamp
**And** non-English source documents are translated by Claude API with the original text preserved alongside the translation
**And** pipeline errors are logged to Sentry with the country and source document context
**And** the pipeline completes for a single country without timeout issues
**And** a manual trigger is available for testing (not just cron)

### Story 8.1b: Multi-Country Orchestration & Confidence Scoring

As a data curator,
I want the pipeline to scan all 50 countries with confidence-scored results so I can prioritize my review.

**Acceptance Criteria:**

**Given** the single-country scan from Story 8.1a is working
**When** the daily scheduled cron job runs
**Then** `trigger/regulatory/scan-all-countries.ts` fans out to `trigger/regulatory/scan-country.ts` for each of the 50 covered countries
**And** fan-out handles partial failures gracefully — one country failure does not block others
**And** confidence scoring is applied to each extracted change: HIGH (clear regulatory text + reliable source), MEDIUM (ambiguous language or secondary source), LOW (indirect reference or low-confidence translation)
**And** confidence factors include: source authority reliability, extraction clarity, translation confidence, and whether the change aligns with known regulatory patterns
**And** the pipeline completes for all 50 countries without timeout issues (Trigger.dev removes timeout constraints)
**And** aggregate pipeline status is logged: countries scanned, changes found, errors encountered
**And** errors for individual countries are logged to Sentry with context

### Story 8.1c: Compound Mapping, Staging Writes & Data Model

As a data curator,
I want extracted regulatory changes mapped to compounds and written to the staging table so I can review them in the dashboard.

**Acceptance Criteria:**

**Given** extracted regulatory text from Stories 8.1a/8.1b
**When** the compound mapping and staging pipeline runs
**Then** Claude API structured output transforms raw text to JSON: affected compounds, status changes, effective dates, dosage thresholds, documentation requirements
**And** extracted compounds are validated against ATC/RxNorm identifiers via `trigger/compound/map-medication.ts`
**And** compound database sync tasks exist: `trigger/compound/sync-rxnorm.ts` and `trigger/compound/sync-atc.ts` for periodic updates to compound mapping data
**And** a `StagingRegulation` Prisma model is created with fields: id, compoundId, countryId, proposedStatus, requiredDocuments, quantityLimits, permitAuthority, permitApplicationUrl, permitLeadTimeDays, dosageThreshold, biosecurityFlag, biosecurityDetails, sourceDocumentTitle, sourceDocumentUrl, aiConfidence (HIGH/MEDIUM/LOW), aiExtractedText, aiTranslation, flaggedAt, reviewStatus (PENDING/APPROVED/REJECTED/ESCALATED)
**And** an `AuditTrail` Prisma model is created with fields: id, regulationId, action, previousData (JSON), newData (JSON), performedBy, performedAt, sourceCitation — with append-only constraint (no UPDATE/DELETE on audit table for application roles)
**And** composite index exists on `[compoundId, countryId]` for StagingRegulation
**And** flagged changes are written to the `StagingRegulation` table with all extracted data
**And** the pipeline writes to staging tables only — no changes reach the live `Regulation` table without human verification

### Story 8.2: Curator Change Queue & Dashboard

As a data curator,
I want a dashboard showing all AI-flagged regulatory changes organized by confidence level,
So that I can efficiently triage changes starting with the highest-confidence items.

**Acceptance Criteria:**

**Given** an authenticated user with curator or admin role navigates to `/admin`
**When** the dashboard loads
**Then** a ChangeQueueList displays all pending flagged changes from the StagingRegulation table (defined in Story 8.1c) sorted by confidence level (High first, Low last) (FR29)
**And** each ChangeQueueItem shows: AI confidence badge (High/Medium/Low with text label, not color alone), country name + flag, affected compounds summary, one-line AI-extracted change summary, source document link, and timestamp of when it was flagged
**And** high-confidence items offer a quick-approve button for efficient processing
**And** all items offer a quick-reject button
**And** clicking an item opens the full VerificationDetailView (Story 8.3)
**And** a filter bar above the queue allows filtering by: confidence level (High/Medium/Low), country (searchable dropdown), compound type
**And** filters are additive (AND logic) with active filters shown as removable chips
**And** filter state persists in URL query parameters for shareability
**And** a "Clear all" link resets to the unfiltered view
**And** the admin layout at `/admin/layout.tsx` includes sidebar navigation (desktop) with links to: Change Queue, Audit Trail, Data Freshness
**And** a DataFreshnessIndicator section shows per-country freshness status: Current (<90 days, green), Aging (91-180 days, amber), Stale (>180 days, red with "re-verification needed" flag) — with text labels alongside color indicators (UX-DR30)
**And** empty queue state displays: "No pending changes. All regulatory data is current." with last verification timestamp (UX-DR25)
**And** admin server errors show error code and timestamp: "Error 500 at 14:32 UTC — contact engineering if this persists"
**And** the queue uses `role="list"` with `role="listitem"` for each item, keyboard-navigable with Enter to open detail
**And** components are organized in `src/components/admin/ChangeQueueList.tsx`, `src/components/admin/ChangeQueueItem.tsx`, and `src/components/admin/FreshnessDashboard.tsx`

### Story 8.3: Verification Detail View & Approve/Reject/Escalate

As a data curator,
I want a complete verification workspace showing the AI draft alongside the source document,
So that I can make informed approve/reject/escalate decisions with full context.

**Acceptance Criteria:**

**Given** a curator clicks on a ChangeQueueItem
**When** the VerificationDetailView loads at `/admin/review/[changeId]`
**Then** the workspace displays: AI-extracted summary of the change, original source document (linked and viewable inline), AI translation (if non-English source), list of affected compounds with current vs. proposed status, AI-drafted database update (editable by curator), and the current live database record for side-by-side comparison (FR30)

**Given** the curator reviews the change and clicks Approve
**When** the confirmation dialog appears (required for all approvals)
**Then** confirming triggers a Server Action (`src/actions/approve-regulation.ts`) that:
  - Copies the verified record from staging_regulations to the live regulations table atomically
  - Writes an audit trail entry with: verifier identity, date, source citation, previous data, new data
  - Calls `lib/compliance/revalidation.ts` to trigger ISR revalidation for all affected medication-country URLs (both brand and compound name slugs)
  - Emits a `regulation.approved` event via Trigger.dev (`trigger/events/regulation-approved.ts`) containing: affected compoundId, countryId, previousStatus, newStatus, sourceCitation, approvedAt. The event is fire-and-forget and does not block the approval flow. If no notification subscriber exists, the event completes as a no-op. Notification dispatch is handled by Epic 7 (Story 7.1).
  - Removes the item from the staging queue
**And** the curator sees a success confirmation and returns to the queue
**And** zero user-facing downtime occurs during the update — live search continues serving correct results (NFR25)

**Given** the curator clicks Reject
**When** the rejection dialog appears
**Then** a reason is required (dropdown + optional text) to prevent accidental rejections
**And** confirming triggers a Server Action (`src/actions/reject-change.ts`) that marks the staging record as REJECTED, writes an audit trail entry with the rejection reason, and removes it from the active queue (FR31)

**Given** the curator clicks Escalate
**When** the escalation dialog appears
**Then** notes are required (textarea, minimum 20 characters) to force thoughtful escalation
**And** confirming triggers a Server Action (`src/actions/escalate-change.ts`) that marks the staging record as ESCALATED, adds the curator's notes, applies the conservative (most restrictive) interpretation to the traveler-facing data immediately, and moves the item to an escalation queue (FR32)
**And** the conservative interpretation note is visible to travelers alongside the compliance result until the escalation is resolved

**Given** the curator wants to edit the AI draft before approving
**When** they modify the draft inline within the VerificationDetailView
**Then** editable fields include: proposed status, affected compounds, required documents, quantity limits, permit details, effective date
**And** if the draft was modified, the approval confirmation dialog notes: "You've edited the AI draft — please confirm your changes"
**And** the edited version is what gets copied to the live table on approval

**Given** the confirmation dialogs
**When** they render
**Then** confirm button color matches the action: green for approve, rose for reject, amber for escalate
**And** cancel is always a ghost button — never visually competes with the action
**And** no backdrop-click-dismiss (prevents accidental confirmation)
**And** landmark regions label each content section for screen reader navigation
**And** the component is organized in `src/components/admin/VerificationDetailView.tsx`

### Story 8.4: Immutable Audit Trail

As a data curator or administrator,
I want a complete, tamper-proof record of every regulatory database change,
So that every compliance result can be traced to its verification source and verifier.

**Acceptance Criteria:**

**Given** an authenticated user with curator or admin role navigates to `/admin/audit`
**When** the page loads
**Then** an AuditTrailTable displays all database changes in reverse chronological order
**And** each entry shows: timestamp, verifier identity (name/email), action taken (Approved/Rejected/Escalated), affected compound + country, previous status, new status, source citation (document title + URL), and verification notes
**And** the table supports filtering by: date range, verifier, country, action type
**And** the table supports sorting by: date (default, newest first), country, verifier

**Given** any regulatory database change occurs (approve, reject, escalate)
**When** the Server Action completes
**Then** an audit trail entry is written to the `AuditTrail` table with all required fields
**And** the entry is append-only — no API, Server Action, or database query allows editing or deleting audit trail entries (NFR15)
**And** the immutability is enforced at the database level (no UPDATE or DELETE permissions on the audit table for application roles)

**Given** the audit trail
**When** queried
**Then** every entry links to the government source document with verification date (FR35)
**And** the full change history for any compound-country pair can be reconstructed from the audit trail
**And** the AuditTrailTable component is organized in `src/components/admin/AuditTrailTable.tsx`
**And** queries are handled by `lib/db/queries/audit.ts`
