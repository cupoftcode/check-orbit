---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/brainstorming/brainstorming-session-2026-03-25-1800.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-27'
project_name: 'Check Orbit'
user_name: 'Trish'
date: '2026-03-27'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

64 functional requirements across 11 categories, with architectural implications:

- **Core Search & Decomposition (FR1-FR13b):** The product's atomic interaction — medication input, compound decomposition, per-compound regulatory cross-reference, dosage-threshold classification, biosecurity overlay. Requires a compound-first data model (ATC/CAS identifiers), a brand-to-compound mapping layer, and a multi-dimensional regulatory lookup (compound + dosage + country → status). Supplement handling introduces ambiguity management for proprietary blends.
- **Layover & Transit (FR14-FR17a):** Multi-stop itinerary with sequential per-country compliance checks and transit conflict detection. Requires cross-referencing the same compound set against multiple countries in a single request and suggesting alternative transit hubs.
- **Coverage Transparency (FR18-FR20):** Explicit "not yet covered" and "unable to verify" messaging. Requires the database to distinguish between "checked and legal" vs. "not in our dataset" — absence of data is not a status.
- **Email Notifications (FR21-FR24):** Regulation-change alerts and permit deadline reminders keyed to anonymized search hashes — not stored medication names. Requires a notification trigger system that maps anonymized parameters to regulatory data changes without retaining health data.
- **SEO & Content (FR25-FR28):** Unique indexable pages per medication-country pair, structured data markup, dynamic sitemaps, canonical URL resolution (brand name ↔ compound name). SEO is infrastructure, not content — the page generation is programmatic from the regulatory database.
- **Social Sharing (FR60-FR64):** Risk card image generation, native share APIs, "save for my next trip" email capture, debunking landing pages. Requires server-side image generation and a lightweight email-only subscription model separate from user accounts.
- **Regulatory Data Management (FR29-FR35):** AI monitoring pipeline scanning government publications daily, confidence-scored change queue, human verification workflow with approve/reject/escalate, audit trail. This is effectively a second application (admin/curator tool) with its own data flows.
- **Data Integrity (FR36-FR39):** Multi-authority conflict resolution (most restrictive interpretation), data freshness indicators (Current/Aging/Stale), source citation chain, informational disclaimer. These are cross-cutting display and data quality concerns.
- **User Accounts & Saved Searches (FR40-FR47):** Optional accounts (email/password + Google OAuth), saved searches with snapshot comparison, regulation-change highlighting. Core search remains stateless for anonymous users.
- **Freemium & Monetization (FR48-FR52):** Free single-med/single-country search, free account with one permanently-consumed save slot, paid tier for multi-med/layover/unlimited saves. Stripe subscription management with feature gating.
- **Institutional Screening (FR53-FR57, Phase 2):** Privacy-safe self-service screening, confirmation codes, completion-rate dashboards without medication data exposure. Architecturally distinct from B2C — requires tenant-like isolation of institutional workflows.

**Non-Functional Requirements:**

35 NFRs that will drive architectural decisions:

- **Performance (NFR1-7):** Sub-20-second end-to-end for all search types. LCP < 2.5s, CLS < 0.1, FCP < 2s on 3G. Core Web Vitals passing on all indexed pages. These require server rendering, efficient database queries, and minimal client-side overhead.
- **Security (NFR8-15):** Bcrypt/argon2 password hashing, Stripe-only payment handling, TLS 1.2+, encryption at rest, anonymized notification hashes, RBAC for admin (admin + curator roles), immutable audit trail.
- **Scalability (NFR16-20):** 50K registered users in 3 months. Response times maintained at 3x peak traffic. New countries added via data entry only — no code changes. 50K email notifications delivered within 4 hours for widely-searched medication changes.
- **Reliability (NFR21-25):** 99.9% uptime. Zero user-facing downtime during regulatory database updates. Failed searches return error messaging, never incorrect data. 99%+ email deliverability.
- **Accessibility (NFR26-30):** WCAG 2.1 AA. Status conveyed through text + icons, not color alone. Full keyboard navigation. Screen reader compatible. High contrast mode.
- **Integration (NFR31-35):** Google OAuth, Stripe, transactional email provider, pharmaceutical databases (ATC, RxNorm, DrugBank), SEO infrastructure.

**Scale & Complexity:**

- Primary domain: Full-stack web application (consumer search + admin verification + regulatory data pipeline)
- Complexity level: High
- Estimated architectural components: 8-10 major subsystems (search engine, compound decomposition engine, regulatory database, AI monitoring pipeline, curator admin tool, user account/auth system, notification system, SEO/content generation, payment/subscription system, image generation service)

### Technical Constraints & Dependencies

- **Next.js App Router + shadcn/ui** specified in UX spec — this is a locked design system decision, not open for architectural debate
- **Stateless privacy** is a hard architectural constraint — shapes every data flow touching user medication information
- **Pharmaceutical database dependencies** (ATC, RxNorm, DrugBank) — external data sources for compound identification and mapping
- **AI monitoring** requires access to government publications across 50 countries in local languages — translation and extraction pipeline
- **Human verification bottleneck** — founder is the sole verifier at launch; architecture must support single-person verification workflow that scales to a team later
- **Solo founder + developer friends** — resource constraint favoring managed services over self-hosted infrastructure
- **Stripe** for all payment processing — no custom payment handling

### Cross-Cutting Concerns Identified

- **Stateless privacy model:** Touches session management, search execution, notification triggers, saved searches, institutional screening. Every feature must be evaluated against "does this accidentally store personal medication data?"
- **Source citation chain:** Every compliance result — in search, SEO pages, risk cards, notifications, saved search comparisons, admin verification — must link to its government source with a verification date. This is a data model concern, a display concern, and a trust concern simultaneously.
- **Four-status compliance model + biosecurity overlay:** Legal/Prescription-Only/Restricted/Banned plus biosecurity warning. Shared across every display surface — search results, SEO pages, risk cards, timeline dots, table rows, saved search comparisons, notification content. Must be defined once and consumed everywhere.
- **Data freshness management:** 90/180-day staleness tiers (Current/Aging/Stale) affect consumer display, curator prioritization, and notification credibility. A single freshness model consumed by multiple subsystems.
- **Compound decomposition:** The transformation from brand name → active compounds → per-compound regulatory status is the core engine. It's used in search, SEO page generation, risk card content, notification matching, and saved search comparison.
- **Zero-downtime data updates:** Regulatory database changes must never disrupt live search. Requires a publication model where curator-verified changes go live atomically without partial/corrupted states.

## Starter Template Evaluation

### Technical Preferences

- **User profile:** Non-technical solo founder, frontend-leaning, comfortable with TypeScript
- **Existing experience:** Supabase + PostgreSQL, Next.js
- **Priority:** Secure, structured backend that's manageable now and scalable when engineers join
- **Deployment:** Vercel (locked)
- **Frontend:** Next.js App Router + shadcn/ui + Tailwind CSS (locked from UX spec)

### Primary Technology Domain

Full-stack web application with separated concerns: consumer search frontend, structured backend API, regulatory data pipeline, and admin verification tool.

### Starter Options Considered

**Option A: Supabase (All-in-One)**
- Pros: User has experience, single dashboard, built-in auth + RLS + Edge Functions
- Cons: RLS policy complexity scales non-linearly for Check Orbit's multi-dimensional regulatory data model. Edge Functions are Deno-based with 150s timeout — insufficient for AI pipeline. Non-standard patterns create onboarding friction when engineers join. Supabase "magic" becomes a constraint rather than an accelerator at this project's complexity level.
- Verdict: **Not recommended** despite user familiarity

**Option B: Neon + Prisma + Clerk + Trigger.dev (Modular Best-in-Class)**
- Pros: Each layer is best-in-class and independently replaceable. Prisma provides the structured, type-safe backend the user explicitly requested. Clerk provides fastest-to-implement auth with pre-built components. Neon is Vercel's native PostgreSQL partner. Trigger.dev removes timeout constraints for AI pipeline. Standard tools — any engineer can contribute immediately.
- Cons: Multiple services to manage (mitigated by each having excellent Vercel integration and generous free tiers)
- Verdict: **Recommended**

**Option C: Convex (Reactive Backend)**
- Pros: Fast DX, real-time by default, TypeScript-native
- Cons: Proprietary database (not PostgreSQL), significant vendor lock-in, smaller ecosystem, not suited for regulatory data that needs standard SQL queries and relational integrity
- Verdict: **Not recommended** — lock-in risk unacceptable for a data infrastructure product

### Selected Stack

**Rationale:** Check Orbit is a data infrastructure product. The regulatory database IS the product. This demands standard, portable, well-understood tools — not proprietary platforms. Every layer must be replaceable without rewriting the data layer.

**Core Application:**

| Layer | Tool | Role |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server-rendered pages, API routes, SEO infrastructure |
| UI | shadcn/ui + Tailwind CSS | Component library + styling (locked from UX spec) |
| ORM | Prisma | Type-safe database access, schema management, migrations |
| Database | Neon (serverless PostgreSQL) | Primary data store — regulatory data, user accounts, audit trail |
| Auth | Clerk | Email/password + Google OAuth, pre-built components, user management |
| Payments | Stripe | Subscription management, payment processing |
| Email | Resend | Transactional notifications (regulation changes, permit reminders) |
| Hosting | Vercel | Frontend + API routes + SSR/ISR |

**Data Pipeline (AI — Background Only):**

| Layer | Tool | Role |
|---|---|---|
| Orchestration | Trigger.dev (Hobby, $10/mo) | Scheduled background jobs, no timeout limits, fan-out per country |
| PDF Extraction | LlamaParse | AI-powered parsing of government regulatory PDFs with table/layout understanding |
| Structured Extraction | Claude API (structured output) | Transforms raw regulatory text → structured JSON records |
| Compound Mapping | RxNorm + WHO ATC + OpenFDA | Brand name → active compounds → ATC/CAS identifiers (free, public domain) |
| Translation | Claude API | Government documents in local languages → English extraction |

**Data Flow Separation (Critical Architectural Decision):**

AI builds and maintains the database (background, via Trigger.dev). Prisma serves it (real-time, via Next.js API routes). These are completely separate systems:

- **Build path:** Trigger.dev → LlamaParse + Claude → staging tables → human verification → live tables
- **Serve path:** User search → Next.js API route → Prisma query → Neon PostgreSQL → structured result

The traveler never waits for AI. Compliance search is a sub-second database lookup, not an LLM inference call. This separation is what makes the product fast, deterministic, and trustworthy.

**Initialization Command:**

```bash
npx create-next-app@latest check-orbit --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Post-initialization setup:
```bash
npx shadcn@latest init
npm install prisma @prisma/client @clerk/nextjs @trigger.dev/sdk stripe resend
npx prisma init
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:** TypeScript (strict mode), Node.js runtime on Vercel

**Styling Solution:** Tailwind CSS with shadcn/ui component library (Radix UI primitives). Custom design tokens for compliance status colors and brand palette defined in `tailwind.config.ts`.

**Build Tooling:** Next.js built-in (Turbopack for dev, Webpack for production). Vercel handles deployment, CDN, edge caching, and ISR revalidation.

**Code Organization:** Next.js App Router file-based routing with `src/` directory. Server Components by default, Client Components only where interactivity requires it. API routes for backend logic. Prisma schema as single source of truth for database structure.

**Development Experience:** TypeScript type checking, ESLint, Prisma Studio for database browsing, Clerk dashboard for user management, Trigger.dev dashboard for pipeline monitoring, Vercel dashboard for deployment and analytics.

**Estimated Monthly Cost at Launch:**

| Service | Tier | Cost |
|---|---|---|
| Vercel | Pro | $20/mo |
| Neon | Free → Launch | $0-19/mo |
| Clerk | Free (10K users) | $0/mo |
| Trigger.dev | Hobby | $10/mo |
| Resend | Free (100/day) | $0/mo |
| Stripe | Pay-as-you-go | 2.9% + $0.30/txn |
| LlamaParse | Free tier | $0/mo |
| Claude API | Usage-based | ~$10-30/mo |
| **Total** | | **~$40-80/mo** |

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Separate tables for staging vs. live regulatory data (data safety)
- ISR with on-demand revalidation for SEO pages (performance + SEO)
- Clerk metadata + middleware for authorization (access control)
- Server Actions + Route Handlers for API layer (data flow)
- Structured error responses (frontend-backend contract)

**Important Decisions (Shape Architecture):**
- Upstash Ratelimit with tier-based limits (anti-scraping + freemium enforcement)
- React Server Components + URL state, no state library (frontend simplicity)
- Vercel OG for risk card image generation (social sharing)
- Sentry for error tracking (operational visibility)

**Deferred Decisions (Post-MVP):**
- Database roles table (defer until Phase 2 institutional screening needs granular permissions)
- Zustand or similar state library (add only if itinerary builder complexity demands it)
- Centralized secret management / Doppler (add when team grows)
- Comprehensive CI/E2E test pipeline (add when engineers join)
- Puppeteer image service (add only if Vercel OG proves insufficient for complex card designs)

### Data Architecture

**Staging/Live Table Separation:**
- Decision: Separate `staging_regulations` and `regulations` tables
- Rationale: In a compliance product where incorrect data can result in traveler detention, safety must be structural, not dependent on query discipline. Queries against the live `regulations` table can never accidentally return unverified data. Curator approval copies records atomically from staging to live.
- Affects: Prisma schema, curator admin workflow, Trigger.dev pipeline output, on-demand revalidation triggers

**Caching Strategy — ISR with On-Demand Revalidation:**
- Decision: All medication-country SEO pages (`/check/[med]/[country]`) use Incremental Static Regeneration cached at the CDN, revalidated on-demand when a curator approves a regulatory change
- Rationale: Regulatory data changes infrequently (curator-driven, not real-time). ISR delivers the fastest possible response to travelers (CDN-cached) while ensuring freshness through targeted revalidation. When a curator approves a change to sertraline + UAE, only `/check/sertraline/uae` and `/check/zoloft/uae` revalidate — not the entire site.
- Affects: Next.js page rendering strategy, curator approval workflow (must trigger revalidation), sitemap generation, Vercel caching configuration

**Database Schema Approach:**
- Prisma as single source of truth for schema definition
- Migrations managed via `prisma migrate` with version-controlled migration files
- Neon database branching for preview environments (each PR gets its own database branch)

### Authentication & Security

**Authorization — Clerk Metadata + Middleware:**
- Decision: User roles (`user`, `curator`, `admin`) stored in Clerk's `publicMetadata`. Next.js middleware checks role on every `/admin/*` request.
- Rationale: Three roles is simple enough for Clerk metadata. No database query per request. Roles managed via Clerk dashboard. Migrate to database roles table in Phase 2 if institutional screening needs granular permissions.
- Affects: Clerk configuration, Next.js middleware, admin route protection

**API Rate Limiting — Upstash Ratelimit:**
- Decision: Tier-based rate limiting using Upstash Ratelimit, integrated with Clerk user data
- Configuration:

| User Type | Rate Limit | Rationale |
|---|---|---|
| Anonymous (no account) | 30 searches/hour | Generous for travelers, blocks automated scraping |
| Free account | 60 searches/hour | Logged-in users less likely bots |
| Paid account | 200 searches/hour | Effectively unlimited for human use |
| Suspicious pattern (same IP, 100+ unique pairs rapidly) | Block + CAPTCHA | Anti-scraping escalation |

- Rationale: Protects the regulatory database (the core asset) from bulk extraction. Tier-based limits align with freemium model without restricting legitimate travelers. Upstash is serverless-native with near-zero latency.
- Affects: API route middleware, Clerk integration, abuse detection

**Data Encryption:**
- All data encrypted in transit (TLS 1.2+ via Vercel and Neon defaults)
- Encryption at rest provided by Neon (PostgreSQL encryption) and Clerk (user data)
- No personal medication data stored (stateless privacy architecture) — encryption at rest applies to user accounts, saved search parameters, and notification triggers only

### API & Communication Patterns

**API Design — Server Actions + Route Handlers:**
- Decision: Server Actions for mutations (save search, manage account, curator approve/reject). Route Handlers for data fetching APIs (`/api/check/[med]/[country]`, `/api/search/autocomplete`).
- Rationale: Everything lives in one Next.js app — no separate backend service, no extra deployment, no network hop. Route Handlers also serve as the foundation for the Phase 2 B2B2C API. Full type safety end-to-end with Prisma.
- Affects: Project file structure, API route organization, future B2B2C API layer

**Error Handling — Structured Error Responses:**
- Decision: All API responses follow a consistent shape:
  - Success: `{ success: true, data: { ... } }`
  - Error: `{ success: false, error: { code: string, message: string, details?: any } }`
- Standard error codes:

| Code | Meaning | Frontend Rendering |
|---|---|---|
| `MEDICATION_NOT_FOUND` | Medication not in database | "We don't have this yet" + email capture |
| `COUNTRY_NOT_COVERED` | Country not in database | "Not yet covered" + coverage map link |
| `UNABLE_TO_VERIFY` | Compound can't be fully mapped | "Unable to verify" + advisory messaging |
| `RATE_LIMITED` | Too many requests | "Please wait" + retry guidance |
| `SUBSCRIPTION_REQUIRED` | Paid feature attempted on free tier | Paywall modal |

- Rationale: PRD requires specific error states that the frontend renders differently. Structured responses make this clean and predictable. Every error code maps to a specific UX treatment.
- Affects: All API routes, frontend error handling, UX error states

### Frontend Architecture

**State Management — React Server Components + URL State:**
- Decision: No external state management library. Server Components handle data fetching. Client-side interactivity uses React `useState`/`useReducer` for local UI state. Search parameters live in the URL for shareability and bookmarkability.
- Rationale: Check Orbit's interactive features (itinerary builder, multi-med search, autocomplete) are localized to specific pages — not cross-cutting global state. URL-based search parameters (`/check/zoloft/uae?date=2026-04-15`) align with SEO requirements and the UX spec's shareable/bookmarkable result pages. Zero extra dependencies.
- Affects: Component architecture, URL structure, navigation behavior

**Image Generation — Vercel OG:**
- Decision: Risk card images generated using `@vercel/og` (Satori-based JSX-to-image at the edge)
- Rationale: Risk cards are visually simple (bold status + flag + medication name + CTA). Vercel OG handles this without extra infrastructure. Runs at the edge for fast generation. Produces OG images (1200x630) for link previews and can generate Instagram-sized variants (1080x1080).
- Affects: Risk card component design (must work within Satori CSS subset), OG meta tags, social sharing flow

### Infrastructure & Deployment

**Environment Configuration — Vercel Environment Variables:**
- Decision: All secrets and configuration stored in Vercel's environment variable system, organized by environment (Development, Preview, Production). `.env.local` for local development.
- Rationale: Single management point for a solo founder. Vercel encrypts at rest, auto-injects per environment, and integrates with Neon database branching for preview deployments.
- Affects: All service integrations (Clerk, Stripe, Neon, Trigger.dev, Resend, Upstash, Sentry, Claude API)

**Monitoring — Sentry:**
- Decision: Sentry for error tracking and alerting across frontend and backend. Vercel integration for automatic source map upload and deployment tracking.
- Rationale: Compliance product requires immediate visibility into errors — a broken search or pipeline failure directly impacts traveler safety. Sentry captures, groups, and alerts on errors. Free tier (5K errors/month) sufficient at launch.
- Affects: Next.js configuration, error boundary components, Trigger.dev error reporting, alert routing

**CI/CD — Vercel Preview Deployments + GitHub Actions:**
- Decision: Every PR gets automatic Vercel preview deployment. GitHub Actions workflow runs TypeScript type checking (`tsc --noEmit`), ESLint, and Prisma schema validation on every push.
- Rationale: Preview deployments let you test every change in a real environment. Type checking and linting catch errors before merge. Lightweight enough for a solo founder, extensible when engineers join.
- Affects: GitHub repository configuration, PR review workflow, deployment pipeline

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (Next.js + Prisma + Clerk + Tailwind + shadcn/ui)
2. Neon database + Prisma schema (staging + live tables, compound model)
3. Clerk auth integration + middleware (roles, route protection)
4. Core search API (Route Handlers + Prisma queries + structured errors)
5. SEO pages with ISR + on-demand revalidation
6. Upstash rate limiting
7. Sentry integration
8. Trigger.dev pipeline (regulatory data ingestion)
9. Vercel OG risk cards
10. Stripe freemium gating
11. Resend notifications

**Cross-Component Dependencies:**
- Curator approval (Server Action) must trigger ISR revalidation for affected medication-country pages
- Clerk user metadata (role + subscription tier) feeds into both middleware authorization and Upstash rate limit tiers
- Structured error codes must be consistent between Route Handlers and Server Actions, consumed by shared frontend error handling components
- Trigger.dev pipeline writes to staging tables; curator approval copies to live tables and triggers revalidation + notification checks
- Sentry must instrument both the Next.js app (Vercel) and Trigger.dev jobs to capture errors across both systems

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 28 areas where AI agents could make different choices, organized into 5 categories. These rules ensure any agent working on Check Orbit produces code that is compatible with every other agent's output.

### Naming Patterns

**Database Naming (Prisma Schema):**

| Element | Convention | Example |
|---|---|---|
| Model names | PascalCase, singular | `Medication`, `Regulation`, `StagingRegulation` |
| Field names | camelCase | `activeCompounds`, `lastVerifiedAt`, `permitLeadTimeDays` |
| Relation fields | camelCase, descriptive | `medication.compounds`, `regulation.sourceDocument` |
| Enums | PascalCase name, SCREAMING_SNAKE values | `enum ComplianceStatus { LEGAL, PRESCRIPTION_ONLY, RESTRICTED, BANNED }` |
| Table names | Auto-generated by Prisma (lowercase plural) | `medications`, `regulations`, `staging_regulations` |
| Indexes | Prisma `@@index` directive | `@@index([compoundId, countryId])` |

**API Naming:**

| Element | Convention | Example |
|---|---|---|
| Route paths | Kebab-case, plural resources | `/api/check/[medication]/[country]` |
| Query parameters | camelCase | `?departureDate=2026-04-15&includeTransit=true` |
| JSON response fields | camelCase | `{ complianceStatus, requiredDocuments, lastVerifiedAt }` |
| Error codes | SCREAMING_SNAKE | `MEDICATION_NOT_FOUND`, `COUNTRY_NOT_COVERED` |
| Route Handler files | `route.ts` (Next.js convention) | `src/app/api/check/[medication]/[country]/route.ts` |

**File Naming:**

| Element | Convention | Example |
|---|---|---|
| React components | PascalCase `.tsx` | `ComplianceStatusBadge.tsx`, `ComplianceResultCard.tsx` |
| Route directories | Kebab-case (Next.js convention) | `src/app/check/[medication]/[country]/page.tsx` |
| Utility modules | Kebab-case `.ts` | `compliance-check.ts`, `rate-limit.ts`, `compound-decomposition.ts` |
| Prisma schema | `schema.prisma` (convention) | `prisma/schema.prisma` |
| Type definition files | Kebab-case `.ts` | `compliance-types.ts`, `api-responses.ts` |
| Trigger.dev tasks | Kebab-case `.ts` | `scan-country.ts`, `extract-regulations.ts` |
| Test files | Co-located `.test.ts` / `.test.tsx` | `compliance-check.test.ts`, `ComplianceStatusBadge.test.tsx` |

**Code Naming:**

| Element | Convention | Example |
|---|---|---|
| Functions | camelCase, verb-first | `getComplianceResult()`, `decomposeCompounds()`, `validateMedication()` |
| Variables | camelCase | `complianceStatus`, `searchResult`, `permitLeadTime` |
| Constants | SCREAMING_SNAKE | `MAX_ITINERARY_STOPS`, `STALE_THRESHOLD_DAYS` |
| Types/Interfaces | PascalCase | `ComplianceStatus`, `MedicationSearchResult`, `RegulationRecord` |
| React hooks | camelCase, `use` prefix | `useComplianceSearch()`, `useItineraryBuilder()` |
| Server Actions | camelCase, verb-first | `saveSearch()`, `approveRegulation()`, `rejectChange()` |
| Environment variables | SCREAMING_SNAKE with prefix | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `DATABASE_URL` |

### Structure Patterns

**Project Organization — Feature-Based with Shared Core:**

```
src/
├── app/                          # Next.js App Router (pages + API routes)
│   ├── (marketing)/              # Route group: homepage, about, pricing
│   ├── check/                    # Compliance search pages
│   │   └── [medication]/
│   │       └── [country]/
│   │           └── page.tsx      # SEO-indexed compliance result (ISR)
│   ├── account/                  # User account pages
│   ├── admin/                    # Curator dashboard (role-gated)
│   ├── api/                      # Route Handlers
│   │   ├── check/                # Compliance search API
│   │   ├── search/               # Autocomplete API
│   │   ├── webhooks/             # Stripe, Clerk webhooks
│   │   └── og/                   # Vercel OG image generation
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui base components
│   ├── compliance/               # ComplianceStatusBadge, ComplianceResultCard, etc.
│   ├── search/                   # MedicationAutocomplete, CountrySelector
│   ├── itinerary/                # ItineraryTimeline, itinerary builder
│   ├── sharing/                  # RiskCard, share dialogs
│   └── admin/                    # ChangeQueueItem, VerificationDetailView
├── lib/                          # Core business logic + utilities
│   ├── db/                       # Prisma client, query helpers
│   ├── compliance/               # Compound decomposition, status resolution
│   ├── auth/                     # Clerk helpers, middleware utilities
│   ├── payments/                 # Stripe helpers
│   ├── email/                    # Resend templates and helpers
│   ├── rate-limit/               # Upstash rate limiting
│   └── utils/                    # Shared utilities (date formatting, etc.)
├── types/                        # Shared TypeScript type definitions
├── trigger/                      # Trigger.dev task definitions
│   ├── scan-country.ts
│   ├── extract-regulations.ts
│   └── compound-mapping.ts
└── config/                       # App configuration constants
```

**Organization Rules:**
- **Components** organized by domain (`compliance/`, `search/`, `admin/`), not by type (`buttons/`, `cards/`)
- **`lib/`** contains business logic that is NOT React-specific — pure TypeScript functions callable from Server Components, Route Handlers, Server Actions, and Trigger.dev tasks
- **`components/`** contains React components only — UI rendering, no business logic
- **`types/`** contains shared type definitions used across multiple domains
- **Tests co-located** next to the file they test: `compliance-check.ts` and `compliance-check.test.ts` in the same directory
- **No `utils/` dumping ground** — utilities belong in the domain they serve (`lib/compliance/`, `lib/auth/`). Only truly generic helpers go in `lib/utils/`

### Format Patterns

**API Response Format (already decided in Step 4, reinforced here):**

```typescript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: { code: string, message: string, details?: any } }
```

**All Route Handlers MUST use this wrapper.** No bare JSON responses. No mixing formats.

**Date/Time Format:**
- All dates in API responses: ISO 8601 strings (`"2026-03-27T14:30:00Z"`)
- All dates in Prisma: `DateTime` type (stored as UTC in PostgreSQL)
- Display formatting happens in components, never in API responses
- Relative time ("45 days ago", "verified 2 months ago") calculated at render time, not stored

**Data Freshness Calculation:**
- Current: verified within 90 days (`lastVerifiedAt` > now - 90 days)
- Aging: 91-180 days
- Stale: > 180 days
- This calculation lives in `lib/compliance/data-freshness.ts` and is consumed by both consumer display and admin dashboard — never duplicated

**Null Handling:**
- API responses: use `null` for absent values, never `undefined` or empty strings
- Prisma schema: fields are required by default. Optional fields explicitly marked with `?`
- Frontend: check for `null` explicitly, never rely on falsy checks for compliance data (a `permitLeadTimeDays` of `0` is meaningful, not absent)

**Compliance Status as Single Source of Truth:**

```typescript
// Defined ONCE in types/compliance.ts
enum ComplianceStatus {
  LEGAL = "LEGAL",
  PRESCRIPTION_ONLY = "PRESCRIPTION_ONLY",
  RESTRICTED = "RESTRICTED",
  BANNED = "BANNED",
}

// Status severity order (used for sorting, overall status resolution)
const STATUS_SEVERITY: Record<ComplianceStatus, number> = {
  LEGAL: 0,
  PRESCRIPTION_ONLY: 1,
  RESTRICTED: 2,
  BANNED: 3,
};
```

This enum is the canonical definition consumed by Prisma schema, API responses, frontend components, Trigger.dev tasks, and notification logic. No string literals for compliance status anywhere in the codebase.

### Communication Patterns

**Trigger.dev Task Naming:**
- Task IDs: kebab-case with domain prefix (`regulatory.scan-country`, `regulatory.extract-regulations`, `compound.map-medication`)
- Event payloads: typed TypeScript interfaces, camelCase fields

**ISR Revalidation Events:**
- When a curator approves a regulation change, the Server Action must call `revalidatePath()` for every affected medication-country URL
- Revalidation logic lives in `lib/compliance/revalidation.ts` — not duplicated in individual Server Actions
- Pattern: `approveRegulation()` → update live table → call `triggerRevalidation(compoundId, countryId)` → function resolves all affected URLs (brand names + compound names) → calls `revalidatePath()` for each

**Regulation Approval Event Pattern (Epic 7 / Epic 8 Decoupling):**
- When a curator approves a regulation change (Story 8.3), the Server Action emits a `regulation.approved` event via Trigger.dev (`trigger/events/regulation-approved.ts`)
- Event payload: `{ compoundId, countryId, previousStatus, newStatus, sourceCitation, approvedAt }`
- The event is fire-and-forget — it does not block the curator approval flow
- Epic 7 (Story 7.1) subscribes to `regulation.approved` events and dispatches notification emails
- If no notification subscribers exist, the event completes as a no-op
- This event-based pattern allows Epic 7 and Epic 8 to be built and deployed independently

**Notification Triggers:**
- When a `regulation.approved` event is received, check if any notification subscriptions match the affected compound-country pair
- Matching uses anonymized search hashes — never reverse-engineer to medication names
- Notification dispatch is async via Trigger.dev background task — does not block the curator approval flow

### Process Patterns

**Error Handling:**

```typescript
// All Route Handlers follow this pattern:
export async function GET(request: Request) {
  try {
    // ... business logic
    return Response.json({ success: true, data: result });
  } catch (error) {
    // Log full error to Sentry
    Sentry.captureException(error);
    // Return structured error to client
    return Response.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
```

- **Never expose internal error details to the client** — Sentry gets the full stack trace, the traveler gets a clean message
- **Domain-specific errors** (medication not found, country not covered) return appropriate codes and 200 status — these are expected outcomes, not server errors
- **Server errors** (database down, Prisma connection failed) return 500 with generic message
- **Rate limit errors** return 429 with `RATE_LIMITED` code and retry-after header

**Loading States:**
- Server Components: no loading states needed — page renders complete from the server
- Client Components: use React `Suspense` boundaries with skeleton components from `components/ui/skeleton`
- Autocomplete: show skeleton suggestions if response exceeds 300ms
- Server Actions (save, approve, share): button enters loading state (`aria-busy="true"`, spinner replaces text) — disabled until action completes

**Validation:**
- **Input validation at the API boundary** using Zod schemas — validate medication name, country code, departure date format before any database query
- **Zod schemas defined in `lib/validation/`** — shared between Route Handlers and Server Actions
- **Never trust client input** — re-validate on the server even if the frontend validates
- **Prisma schema constraints** as the final safety net — unique constraints, not-null constraints, enum values enforced at the database level

### Enforcement Guidelines

**All AI Agents MUST:**

1. Use the naming conventions defined above — no exceptions, no "creative" alternatives
2. Place files in the correct directory per the project structure — components in `components/`, business logic in `lib/`, types in `types/`
3. Use the `ComplianceStatus` enum from `types/compliance.ts` — never hardcode status strings
4. Wrap all API responses in the `{ success, data/error }` format — no bare responses
5. Co-locate tests next to source files — never create a separate `__tests__/` directory tree
6. Use Zod for input validation at API boundaries — never validate with manual if/else chains
7. Log errors to Sentry, return structured errors to clients — never expose stack traces
8. Calculate data freshness from `lib/compliance/data-freshness.ts` — never duplicate the 90/180 day logic
9. Trigger ISR revalidation through `lib/compliance/revalidation.ts` — never call `revalidatePath()` directly from Server Actions
10. Return dates as ISO 8601 strings in API responses — never formatted strings, never timestamps

**Pattern Enforcement:**
- TypeScript strict mode catches type violations at build time
- ESLint rules enforce naming conventions and import patterns
- Prisma schema validation runs in CI (GitHub Actions) — catches schema conflicts before merge
- PR preview deployments on Vercel allow visual verification of UI pattern compliance

### Pattern Examples

**Good:**
```typescript
// Correct: uses enum, structured response, camelCase fields
const result = await getComplianceResult(medicationSlug, countryCode);
return Response.json({
  success: true,
  data: {
    complianceStatus: ComplianceStatus.RESTRICTED,
    permitRequired: true,
    permitLeadTimeDays: 14,
    lastVerifiedAt: "2026-03-10T00:00:00Z",
    sourceDocument: { title: "UAE MOH Circular 2024", url: "https://..." },
  },
});
```

**Anti-Patterns:**
```typescript
// WRONG: string literal instead of enum
complianceStatus: "restricted"

// WRONG: snake_case in API response
permit_lead_time_days: 14

// WRONG: formatted date in API response
lastVerified: "March 10, 2026"

// WRONG: bare response without wrapper
return Response.json({ status: "banned", country: "Japan" });

// WRONG: business logic in a component
function ComplianceResultCard() {
  const isFresh = daysSinceVerified < 90; // Should use lib/compliance/data-freshness.ts
}

// WRONG: duplicated error handling without Sentry
catch (error) {
  console.log(error); // Should be Sentry.captureException(error)
  return Response.json({ error: error.message }); // Exposes internals, wrong format
}
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
check-orbit/
├── .github/
│   └── workflows/
│       └── ci.yml                          # TypeScript check, ESLint, Prisma validate
├── .env.local                              # Local dev environment variables
├── .env.example                            # Template for required env vars
├── .gitignore
├── next.config.ts                          # Next.js config (ISR, redirects, Sentry)
├── tailwind.config.ts                      # Tailwind + custom design tokens (status colors, brand)
├── tsconfig.json                           # TypeScript strict mode config
├── package.json
├── sentry.client.config.ts                 # Sentry browser SDK config
├── sentry.server.config.ts                 # Sentry server SDK config
├── sentry.edge.config.ts                   # Sentry edge runtime config
├── middleware.ts                            # Clerk auth + role-based route protection
│
├── prisma/
│   ├── schema.prisma                       # Complete database schema (single source of truth)
│   ├── migrations/                         # Version-controlled migration files
│   └── seed.ts                             # Seed script for dev data (sample medications, countries)
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── icons/                              # Status icons, brand assets
│       ├── legal.svg
│       ├── prescription-only.svg
│       ├── restricted.svg
│       └── banned.svg
│
├── trigger/                                # Trigger.dev task definitions
│   ├── regulatory/
│   │   ├── scan-country.ts                 # Scan one country's government publications
│   │   ├── scan-all-countries.ts           # Fan-out: trigger scan-country for all 50
│   │   ├── extract-regulations.ts          # LlamaParse + Claude extraction per document
│   │   └── process-change.ts              # Write extracted data to staging tables
│   ├── compound/
│   │   ├── map-medication.ts               # Map brand name → compounds via RxNorm/ATC
│   │   ├── sync-rxnorm.ts                  # Sync RxNorm database updates
│   │   └── sync-atc.ts                     # Sync WHO ATC classification updates
│   ├── events/
│   │   └── regulation-approved.ts           # Event emitted on curator approval (E7/E8 decoupling)
│   └── notifications/
│       ├── dispatch-regulation-change.ts    # Subscribe to regulation.approved, send emails
│       └── dispatch-permit-reminder.ts      # Send permit deadline reminders
│
└── src/
    ├── app/
    │   ├── globals.css                     # Tailwind base + custom CSS variables
    │   ├── layout.tsx                      # Root layout (Clerk provider, Sentry, fonts)
    │   ├── not-found.tsx                   # Custom 404
    │   ├── error.tsx                       # Global error boundary (Sentry reporting)
    │   ├── sitemap.ts                      # Dynamic sitemap generation from database
    │   │
    │   ├── (marketing)/                    # Route group: public marketing pages
    │   │   ├── page.tsx                    # Homepage — hero search
    │   │   ├── pricing/
    │   │   │   └── page.tsx                # Pricing page (free vs paid tier)
    │   │   ├── coverage/
    │   │   │   └── page.tsx                # Coverage map — which countries are covered
    │   │   └── debunking/
    │   │       └── [slug]/
    │   │           └── page.tsx            # Debunking landing pages (FR64)
    │   │
    │   ├── check/                          # Compliance search pages
    │   │   └── [medication]/
    │   │       └── [country]/
    │   │           ├── page.tsx            # ISR compliance result page (FR1-FR8, FR25-FR28)
    │   │           └── opengraph-image.tsx # Vercel OG risk card image (FR60)
    │   │
    │   ├── itinerary/                      # Layover trap pages
    │   │   └── page.tsx                    # Multi-stop itinerary builder + timeline (FR14-FR17a)
    │   │
    │   ├── account/                        # Authenticated user pages
    │   │   ├── layout.tsx                  # Account layout (requires auth)
    │   │   ├── page.tsx                    # Dashboard — saved searches list (FR42-FR46)
    │   │   ├── settings/
    │   │   │   └── page.tsx                # Notification preferences (FR23)
    │   │   └── subscription/
    │   │       └── page.tsx                # Stripe subscription management (FR51-FR52)
    │   │
    │   ├── admin/                          # Curator dashboard (role-gated)
    │   │   ├── layout.tsx                  # Admin layout (requires curator/admin role)
    │   │   ├── page.tsx                    # Queue overview — flagged changes (FR29-FR31)
    │   │   ├── review/
    │   │   │   └── [changeId]/
    │   │   │       └── page.tsx            # Verification detail view (FR30-FR34)
    │   │   ├── audit/
    │   │   │   └── page.tsx                # Immutable audit trail (FR35)
    │   │   └── freshness/
    │   │       └── page.tsx                # Data freshness dashboard (FR37)
    │   │
    │   ├── sign-in/[[...sign-in]]/
    │   │   └── page.tsx                    # Clerk sign-in page
    │   ├── sign-up/[[...sign-up]]/
    │   │   └── page.tsx                    # Clerk sign-up page
    │   │
    │   └── api/
    │       ├── check/
    │       │   └── [medication]/
    │       │       └── [country]/
    │       │           └── route.ts        # Compliance search API (FR1-FR13b)
    │       ├── search/
    │       │   ├── medications/
    │       │   │   └── route.ts            # Medication autocomplete (fuzzy match)
    │       │   └── countries/
    │       │       └── route.ts            # Country search (type-ahead)
    │       ├── itinerary/
    │       │   └── check/
    │       │       └── route.ts            # Multi-stop itinerary check (FR14-FR17a)
    │       ├── share/
    │       │   └── risk-card/
    │       │       └── route.ts            # Risk card data for sharing (FR60-FR61)
    │       ├── subscribe/
    │       │   ├── email/
    │       │   │   └── route.ts            # "Save for next trip" email capture (FR62-FR63)
    │       │   └── notifications/
    │       │       └── route.ts            # Regulation change notification opt-in (FR21-FR22)
    │       ├── webhooks/
    │       │   ├── stripe/
    │       │   │   └── route.ts            # Stripe subscription webhooks
    │       │   └── clerk/
    │       │       └── route.ts            # Clerk user event webhooks
    │       └── revalidate/
    │           └── route.ts                # On-demand ISR revalidation endpoint
    │
    ├── components/
    │   ├── ui/                             # shadcn/ui base components
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── command.tsx
    │   │   ├── dialog.tsx
    │   │   ├── input.tsx
    │   │   ├── separator.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── toast.tsx
    │   │   └── tooltip.tsx
    │   ├── compliance/                     # Compliance display components
    │   │   ├── ComplianceStatusBadge.tsx    # Atomic status badge (all variants)
    │   │   ├── ComplianceResultCard.tsx     # Full result card (single + stacked)
    │   │   ├── CompoundDecomposition.tsx    # Ingredient breakdown display
    │   │   ├── SourceCitation.tsx           # Government source + verification date
    │   │   ├── PermitLeadTimeAlert.tsx      # Time-sensitive permit warnings
    │   │   ├── ChangeComparisonBanner.tsx   # Saved search regulation change diff
    │   │   ├── BiosecurityWarning.tsx       # Biosecurity overlay warning
    │   │   └── DataFreshnessIndicator.tsx   # Current/Aging/Stale badge
    │   ├── search/                         # Search input components
    │   │   ├── MedicationAutocomplete.tsx   # Medication type-ahead (Command-based)
    │   │   ├── CountrySelector.tsx          # Country type-ahead with flags
    │   │   ├── DepartureDateInput.tsx       # Optional departure date
    │   │   ├── HeroSearch.tsx              # Homepage hero search composition
    │   │   └── CompactSearch.tsx           # Nav bar compact search (desktop)
    │   ├── itinerary/                      # Itinerary components
    │   │   ├── ItineraryTimeline.tsx        # Vertical timeline with status dots
    │   │   ├── ItineraryBuilder.tsx         # Add/remove/reorder stops
    │   │   └── TransitConflictAlert.tsx     # Transit country conflict box
    │   ├── sharing/                        # Social sharing components
    │   │   ├── RiskCard.tsx                # Risk card preview
    │   │   ├── ShareDialog.tsx             # Share modal/bottom sheet
    │   │   └── SaveForNextTrip.tsx         # Email capture for discovery users
    │   ├── account/                        # Account components
    │   │   ├── SavedSearchList.tsx          # List of saved searches with change badges
    │   │   ├── SavedSearchCard.tsx          # Individual saved search card
    │   │   └── NotificationPreferences.tsx  # Email notification settings
    │   ├── admin/                          # Curator admin components
    │   │   ├── ChangeQueueItem.tsx          # Single item in verification queue
    │   │   ├── ChangeQueueList.tsx          # Filterable queue list
    │   │   ├── VerificationDetailView.tsx   # Full change review workspace
    │   │   ├── AuditTrailTable.tsx          # Immutable audit log display
    │   │   └── FreshnessDashboard.tsx       # Country-by-country freshness overview
    │   ├── layout/                         # Layout components
    │   │   ├── Header.tsx                  # Global nav bar
    │   │   ├── Footer.tsx                  # Minimal footer with disclaimer
    │   │   └── PaywallModal.tsx            # Upgrade prompt modal
    │   └── errors/                         # Error state components
    │       ├── MedicationNotFound.tsx       # "We don't have this yet" + email capture
    │       ├── CountryNotCovered.tsx        # "Not yet covered" + coverage link
    │       └── UnableToVerify.tsx           # "Unable to verify" advisory
    │
    ├── lib/
    │   ├── db/
    │   │   ├── prisma.ts                   # Prisma client singleton
    │   │   ├── queries/
    │   │   │   ├── medications.ts          # Medication lookup + fuzzy search queries
    │   │   │   ├── regulations.ts          # Regulation lookup (live table only)
    │   │   │   ├── staging.ts              # Staging table queries (admin only)
    │   │   │   ├── saved-searches.ts       # User saved search CRUD
    │   │   │   └── audit.ts               # Audit trail queries
    │   │   └── mutations/
    │   │       ├── approve-regulation.ts   # Staging → live + revalidation + notifications
    │   │       ├── reject-change.ts        # Reject with reason + audit entry
    │   │       ├── escalate-change.ts      # Escalate with notes + conservative default
    │   │       └── save-search.ts          # Save search snapshot to user account
    │   ├── compliance/
    │   │   ├── compound-decomposition.ts   # Brand → compounds → per-compound status
    │   │   ├── status-resolution.ts        # Resolve overall status from compound statuses
    │   │   ├── data-freshness.ts           # 90/180 day freshness calculation
    │   │   ├── revalidation.ts             # ISR revalidation for affected URLs
    │   │   ├── itinerary-check.ts          # Multi-stop compliance check logic
    │   │   └── alternative-hubs.ts         # Suggest safe alternative transit countries
    │   ├── auth/
    │   │   ├── middleware.ts               # Clerk middleware helpers
    │   │   └── roles.ts                    # Role checking utilities
    │   ├── payments/
    │   │   ├── stripe.ts                   # Stripe client + helpers
    │   │   ├── subscription.ts             # Tier checking, feature gating logic
    │   │   └── webhook-handlers.ts         # Stripe webhook event handlers
    │   ├── email/
    │   │   ├── resend.ts                   # Resend client
    │   │   ├── templates/
    │   │   │   ├── regulation-change.tsx    # Regulation change notification email
    │   │   │   ├── permit-reminder.tsx      # Permit deadline reminder email
    │   │   │   ├── compliance-result.tsx    # Send compliance result to email (FR65)
    │   │   │   └── save-for-trip.tsx       # "Save for next trip" welcome email
    │   │   └── notification-matching.ts    # Match regulation changes to subscriptions
    │   ├── rate-limit/
    │   │   └── rate-limit.ts              # Upstash rate limiter with tier config
    │   ├── validation/
    │   │   ├── search-params.ts           # Zod: medication name, country code, date
    │   │   ├── itinerary-params.ts        # Zod: multi-stop itinerary input
    │   │   ├── account-params.ts          # Zod: email, notification preferences
    │   │   └── admin-params.ts            # Zod: approval/rejection/escalation inputs
    │   └── utils/
    │       ├── dates.ts                   # Date formatting for display
    │       ├── slugs.ts                   # Medication/country slug utilities
    │       └── response.ts               # API response wrapper helpers
    │
    ├── types/
    │   ├── compliance.ts                  # ComplianceStatus enum, severity map, core types
    │   ├── api-responses.ts               # Typed API response interfaces
    │   ├── medications.ts                 # Medication, Compound, DecompositionResult types
    │   ├── regulations.ts                 # Regulation, SourceDocument, FreshnessStatus types
    │   ├── itinerary.ts                   # ItineraryStop, TransitConflict types
    │   ├── admin.ts                       # ChangeQueueItem, VerificationAction types
    │   └── notifications.ts              # NotificationSubscription, trigger types
    │
    ├── actions/                           # Next.js Server Actions
    │   ├── save-search.ts                 # Save compliance search to account
    │   ├── delete-search.ts               # Remove saved search
    │   ├── approve-regulation.ts          # Curator approve (staging → live)
    │   ├── reject-change.ts               # Curator reject with reason
    │   ├── escalate-change.ts             # Curator escalate with notes
    │   ├── subscribe-notifications.ts     # Opt-in to regulation change alerts
    │   └── subscribe-trip.ts              # "Save for next trip" email capture
    │
    └── config/
        ├── constants.ts                   # MAX_ITINERARY_STOPS, STALE_THRESHOLD_DAYS, etc.
        ├── countries.ts                   # Covered countries list with metadata
        └── status-config.ts               # Status colors, icons, labels mapping
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Public/Protected | Auth Required | Rate Limited |
|---|---|---|---|
| `/api/check/[med]/[country]` | Public | No | Yes (tier-based) |
| `/api/search/medications` | Public | No | Yes (tier-based) |
| `/api/search/countries` | Public | No | Yes (tier-based) |
| `/api/itinerary/check` | Public | No (but paid feature) | Yes (tier-based) |
| `/api/share/risk-card` | Public | No | Yes |
| `/api/subscribe/email` | Public | No | Yes |
| `/api/share/send-result` | Public | No | Yes (max 5/email/hr) |
| `/api/subscribe/notifications` | Protected | Yes (paid tier) | Yes |
| `/api/webhooks/stripe` | Internal | Stripe signature verification | No |
| `/api/webhooks/clerk` | Internal | Clerk signature verification | No |
| `/api/revalidate` | Internal | Secret token | No |
| `/admin/*` pages | Protected | Yes (curator/admin role) | No |
| `/account/*` pages | Protected | Yes (any authenticated user) | No |

**Security Model (Layered Defense):**

```
Ring 0: Vercel WAF (bot blocking, DDoS protection — Vercel Pro built-in)
Ring 1: Rate Limiting (Upstash — tier-based per user type)
Ring 2: Input Validation (Zod — rejects malformed requests)
Ring 3: Prisma Parameterization (prevents SQL injection)
Ring 4: API Boundary (Route Handlers — only returns public-facing fields)
Ring 5: Auth + Role Checks (Clerk middleware — protects admin/account routes)
Ring 6: Separate Tables (staging vs. live — unverified data physically unreachable)
```

**Component Boundaries:**

- **Server Components** (default): all page-level components, ComplianceResultCard, SourceCitation, PermitLeadTimeAlert, ChangeComparisonBanner, all admin components
- **Client Components** ("use client"): MedicationAutocomplete, CountrySelector, DepartureDateInput, ItineraryBuilder, ShareDialog, PaywallModal, SaveForNextTrip, NotificationPreferences
- **Rule:** Client Components import from `components/ui/` and receive data via props from Server Components. Client Components never import from `lib/db/` — all database access happens in Server Components or Route Handlers.

**Data Boundaries:**

| Data Layer | Access Pattern | Who Can Access |
|---|---|---|
| `regulations` (live) | Read-only via Prisma queries in `lib/db/queries/` | Route Handlers, Server Components, Trigger.dev notifications |
| `staging_regulations` | Read/write via `lib/db/queries/staging.ts` and `lib/db/mutations/` | Admin pages, Trigger.dev pipeline, Server Actions |
| `medications` / `compounds` | Read-only for search, write via Trigger.dev compound sync | Route Handlers, Server Components, Trigger.dev |
| `users` / `saved_searches` | Read/write via `lib/db/queries/saved-searches.ts` | Account pages, Server Actions |
| `audit_trail` | Append-only via `lib/db/mutations/` | Admin pages (read), Server Actions (write) |
| `notification_subscriptions` | Read/write, anonymized hashes only | Route Handlers, Trigger.dev notifications |

### Requirements to Structure Mapping

| FR Category | Pages | API Routes | Components | Lib Modules |
|---|---|---|---|---|
| Core Search (FR1-FR8) | `check/[med]/[country]` | `api/check/` | `compliance/*`, `search/*` | `compliance/*`, `db/queries/` |
| Decomposition (FR9-FR13b) | (within check page) | (within check API) | `CompoundDecomposition`, `BiosecurityWarning`, `UnableToVerify` | `compliance/compound-decomposition.ts` |
| Layover (FR14-FR17a) | `itinerary/` | `api/itinerary/check` | `itinerary/*` | `compliance/itinerary-check.ts`, `compliance/alternative-hubs.ts` |
| Coverage (FR18-FR20) | `coverage/` | (within check API) | `MedicationNotFound`, `CountryNotCovered` | `lib/utils/response.ts` |
| Notifications (FR21-FR24) | `account/settings/` | `api/subscribe/notifications` | `NotificationPreferences` | `email/*`, `lib/db/queries/` |
| SEO (FR25-FR28) | `check/[med]/[country]`, `sitemap.ts` | — | — | `lib/utils/slugs.ts` |
| Social (FR60-FR65) | `debunking/[slug]` | `api/share/risk-card`, `api/share/send-result` | `sharing/*` | `email/templates/compliance-result.tsx` |
| Data Mgmt (FR29-FR35) | `admin/*` | — | `admin/*` | `db/queries/staging.ts`, `db/mutations/*` |
| Data Integrity (FR36-FR39) | (within check page) | (within check API) | `SourceCitation`, `DataFreshnessIndicator` | `compliance/data-freshness.ts` |
| Accounts (FR40-FR47) | `account/*`, `sign-in/`, `sign-up/` | — | `account/*` | `db/queries/saved-searches.ts`, `auth/*` |
| Freemium (FR48-FR52) | `pricing/`, `account/subscription/` | `api/webhooks/stripe` | `PaywallModal` | `payments/*` |

### Integration Points

**External Integrations:**

| Service | Integration Point | Config |
|---|---|---|
| Neon (PostgreSQL) | `lib/db/prisma.ts` | `DATABASE_URL` |
| Clerk | `middleware.ts`, `layout.tsx`, sign-in/up pages | `CLERK_*` env vars |
| Stripe | `lib/payments/stripe.ts`, `api/webhooks/stripe/` | `STRIPE_*` env vars |
| Resend | `lib/email/resend.ts` | `RESEND_API_KEY` |
| Upstash Redis | `lib/rate-limit/rate-limit.ts` | `UPSTASH_*` env vars |
| Sentry | `sentry.*.config.ts` | `SENTRY_DSN` |
| Trigger.dev | `trigger/*.ts` | `TRIGGER_*` env vars |
| Claude API | `trigger/regulatory/extract-regulations.ts` | `ANTHROPIC_API_KEY` |
| LlamaParse | `trigger/regulatory/extract-regulations.ts` | `LLAMA_PARSE_API_KEY` |
| RxNorm API | `trigger/compound/sync-rxnorm.ts` | Public API (no key) |
| OpenFDA API | `trigger/compound/map-medication.ts` | Public API (no key) |

**Data Flow — Compliance Search:**

```
Traveler types "Zoloft" + "UAE"
  → MedicationAutocomplete → GET /api/search/medications?q=zoloft
  → CountrySelector → GET /api/search/countries?q=uae
  → Check button → navigates to /check/zoloft/uae
  → ISR page renders (cached at CDN, or regenerated if stale)
  → Server Component calls lib/compliance/compound-decomposition.ts
    → Prisma query: medications → compounds (sertraline)
    → Prisma query: regulations WHERE compound=sertraline AND country=UAE
    → lib/compliance/status-resolution.ts → overall status: RESTRICTED
    → lib/compliance/data-freshness.ts → freshness: Current
  → ComplianceResultCard renders with all details
  → Vercel OG generates opengraph-image for social sharing
```

**Data Flow — Regulatory Pipeline:**

```
Trigger.dev cron (daily) → scan-all-countries.ts
  → Fan-out: 50x scan-country.ts (one per country)
    → Fetch government publication URLs
    → LlamaParse: extract text + tables from PDFs
    → Claude API: structured JSON extraction
    → Validate compounds against ATC/RxNorm
    → Write to staging_regulations via Prisma
    → Set confidence score (high/medium/low)
  → Curator opens /admin → sees change queue
  → Curator reviews → approves via Server Action
    → approve-regulation.ts:
      → Copy staging → live regulations table
      → Write audit trail entry
      → Call lib/compliance/revalidation.ts (ISR)
      → Check notification subscriptions
      → Dispatch emails via Trigger.dev notification tasks
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts. Next.js 15 (App Router) + Prisma + Neon + Clerk + Trigger.dev + Stripe + Resend + Upstash — each has documented Vercel integration and TypeScript support. No version incompatibilities identified. The ISR + on-demand revalidation strategy aligns perfectly with the curator approval workflow. Trigger.dev's background execution model cleanly separates the AI pipeline from the real-time serve path.

**Pattern Consistency:**
Naming conventions are consistent across all layers — PascalCase models, camelCase fields, SCREAMING_SNAKE enums, kebab-case files. The `ComplianceStatus` enum as single source of truth is properly referenced across Prisma schema, API responses, components, and Trigger.dev tasks. Error handling follows a single structured pattern throughout. The 90/180-day freshness calculation is centralized in one module.

**Structure Alignment:**
The project structure directly supports every architectural decision. Feature-based organization (`compliance/`, `search/`, `itinerary/`, `admin/`) mirrors the requirement categories. Server/Client Component boundaries are explicitly defined. The `lib/` layer correctly separates business logic from React components, making it callable from Route Handlers, Server Actions, Server Components, and Trigger.dev tasks alike.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| FR Category | FRs | Architectural Support | Status |
|---|---|---|---|
| Core Search | FR1-FR8 | ISR pages, `/api/check/`, compliance lib, Prisma queries | ✅ Fully covered |
| Decomposition | FR9-FR13b | `compound-decomposition.ts`, BiosecurityWarning, UnableToVerify | ✅ Fully covered |
| Layover | FR14-FR17a | Itinerary page, `/api/itinerary/check`, `alternative-hubs.ts` | ✅ Fully covered |
| Coverage | FR18-FR20 | MedicationNotFound, CountryNotCovered components, coverage page | ✅ Fully covered |
| Notifications | FR21-FR24 | Resend, `notification-matching.ts`, anonymized hashes, Trigger.dev dispatch | ✅ Fully covered |
| SEO | FR25-FR28 | ISR, `sitemap.ts`, `slugs.ts`, Vercel OG | ✅ Covered (see note 1) |
| Data Management | FR29-FR35 | Admin pages, Trigger.dev pipeline, `approve-regulation.ts`, audit trail | ✅ Fully covered |
| Data Integrity | FR36-FR39 | `data-freshness.ts`, SourceCitation, status-resolution (most restrictive) | ✅ Fully covered |
| Accounts | FR40-FR47 | Clerk, saved-searches CRUD, account pages, stateless anonymous search | ✅ Fully covered |
| Freemium | FR48-FR52 | Stripe, `subscription.ts`, PaywallModal, webhook handlers | ✅ Fully covered |
| Social | FR60-FR64 | Vercel OG, RiskCard, ShareDialog, SaveForNextTrip, debunking pages | ✅ Fully covered |
| Institutional (Phase 2) | FR53-FR57 | Correctly deferred | ✅ Deferred |
| Customs Card (Phase 2) | FR58-FR59 | Correctly deferred | ✅ Deferred |

**Non-Functional Requirements Coverage:**

| NFR Category | Coverage | Architectural Support |
|---|---|---|
| Performance (NFR1-7) | ✅ | ISR + CDN caching, sub-second Prisma queries, server rendering, Core Web Vitals via Next.js defaults |
| Security (NFR8-15) | ✅ | Clerk (bcrypt/argon2), Stripe (no CC storage), TLS via Vercel/Neon, anonymized hashes, RBAC (admin/curator), immutable audit trail, 7-ring layered defense |
| Scalability (NFR16-20) | ✅ | Serverless Vercel + Neon (auto-scaling), ISR caching (pages scale to CDN), data-only country additions (no code changes), Trigger.dev + Resend for bulk notifications |
| Reliability (NFR21-25) | ✅ | Separate staging/live tables (zero downtime updates), structured error responses (never incorrect data), Vercel SLA + Neon HA, Resend deliverability |
| Accessibility (NFR26-30) | ✅ | shadcn/ui (Radix primitives — built-in keyboard nav + ARIA), status conveyed via text + icons + color, design system locked in UX spec |
| Integration (NFR31-35) | ✅ | All 10 external integrations mapped with config points and environment variables |

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions documented with clear rationale and "Affects" impact statements. Implementation patterns cover 28 conflict points across 5 categories. Code examples provided for correct patterns AND anti-patterns. The initialization command and post-initialization setup are ready to execute.

**Structure Completeness:**
~100+ files mapped in the directory tree with FR annotations. Every file has a clear purpose comment. Integration points list all 10 services with their env var names and code entry points.

**Pattern Completeness:**
Naming, structure, format, communication, and process patterns are all specified. Enforcement guidelines give AI agents 10 explicit rules. The anti-pattern examples are particularly valuable — they show agents exactly what NOT to do.

### Gap Analysis Results

**Important Gaps (not blocking, but should be noted):**

1. **Schema.org structured data pattern (FR26):** The PRD requires "pages eligible for search engine rich results." The architecture references structured data markup but doesn't define a specific implementation pattern — where the JSON-LD goes, what schema types to use (e.g., `MedicalEntity`, `Drug`, `GovernmentService`). Address during SEO implementation stories — this is a rendering detail, not an architectural decision.

2. **Canonical URL resolution logic (FR28):** The architecture mentions "brand name ↔ compound name" canonical resolution, and the ISR page structure supports it, but the redirect/canonical logic isn't explicitly specified (does `/check/zoloft/uae` redirect to `/check/sertraline/uae`, or render with a `<link rel="canonical">`?). Define during SEO implementation story — both approaches are valid.

3. **"Save for my next trip" data model:** FR62-FR63 require storing email + destination list without medication data. The architecture has the route (`/api/subscribe/email`) and component (`SaveForNextTrip`) but doesn't specify the Prisma model for these subscriptions. Address during Prisma schema design — this is schema detail, not architectural.

4. **Performance monitoring / Real User Monitoring (RUM):** The architecture assumes Next.js defaults are sufficient for LCP/CLS/FCP targets but doesn't document RUM, bundle analysis, or performance budget enforcement. **Recommendation:** Add Vercel Analytics (built-in for Vercel Pro) or the `web-vitals` library to capture real user metrics. Define performance budgets (e.g., JS bundle < 150KB gzipped for core search) and enforce via Lighthouse CI in GitHub Actions before Epic 1 completion.

5. **`prefers-reduced-motion` support (UX-DR27):** The UX spec requires reduced-motion support but the architecture doesn't document the implementation approach. **Recommendation:** Add a global CSS media query pattern: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` in `src/app/globals.css`. Component-level animations should check this preference via the `useReducedMotion()` hook from Radix or a custom hook. Address before Story 1.7 (Compliance Result Display Components).

6. **ISR cache race condition:** No handling documented for the window between curator approval and ISR cache invalidation at the CDN edge. A traveler could briefly see stale data. **Assessment:** Low severity — regulatory data changes infrequently, and the stale window is bounded by CDN propagation time (typically seconds). The existing on-demand revalidation pattern (`revalidatePath()`) is sufficient. No additional architecture needed, but document this as an accepted trade-off.

7. **Send compliance result to email (FR65):** `/api/share/send-result` POST endpoint accepts email + compliance result data. Sends a transient email via Resend using `lib/email/templates/compliance-result.tsx`. No data persisted. Rate limited to 5 sends per email per hour. No authentication required.

**No Critical Gaps Found.** All blocking decisions are made. All requirement categories have architectural support. No contradictory decisions.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed (64 FRs, 35 NFRs mapped)
- [x] Scale and complexity assessed (High — 8-10 major subsystems)
- [x] Technical constraints identified (stateless privacy, locked UX stack, solo founder)
- [x] Cross-cutting concerns mapped (6 concerns: privacy, citations, compliance model, freshness, decomposition, zero-downtime updates)

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions and rationale
- [x] Technology stack fully specified (12 services with costs)
- [x] Integration patterns defined (10 external services mapped)
- [x] Performance considerations addressed (ISR, CDN, sub-second queries)

**✅ Implementation Patterns**

- [x] Naming conventions established (database, API, file, code — 4 domains)
- [x] Structure patterns defined (feature-based with shared core)
- [x] Communication patterns specified (ISR revalidation, notification triggers, Trigger.dev task naming)
- [x] Process patterns documented (error handling, loading states, validation)

**✅ Project Structure**

- [x] Complete directory structure defined (~100+ files)
- [x] Component boundaries established (Server vs. Client Components)
- [x] Integration points mapped (10 services with env vars)
- [x] Requirements to structure mapping complete (all FR categories → files)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — all 64 functional requirements and 35 non-functional requirements are architecturally supported, all decisions are coherent, and patterns are comprehensive enough for AI agents to implement consistently.

**Key Strengths:**
- Data flow separation (AI builds, Prisma serves) is the single most important architectural decision — it makes the product fast, deterministic, and trustworthy
- 7-ring layered security model provides defense-in-depth without complexity
- Separate staging/live tables make data safety structural, not dependent on query discipline
- Feature-based organization with centralized business logic in `lib/` means AI agents can work on independent features without conflicts
- Every pattern has both "good" and "anti-pattern" examples — reduces ambiguity for implementation agents

**Areas for Future Enhancement:**
- Database roles table (deferred to Phase 2 institutional screening)
- State management library (add only if itinerary builder complexity demands)
- Centralized secret management (add when team grows)
- Comprehensive CI/E2E test pipeline (add when engineers join)
- Schema.org structured data patterns (define during SEO stories)

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**

```bash
npx create-next-app@latest check-orbit --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```



