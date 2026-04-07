# Sprint Change Proposal

**Date:** 2026-04-02
**Project:** Check Orbit
**Triggered By:** Implementation Readiness Assessment Report (2026-04-02)
**Change Scope:** Moderate
**Mode:** Batch

---

## Section 1: Issue Summary

### Problem Statement

The Implementation Readiness Assessment (2026-04-02) evaluated all four core planning artifacts (PRD, Epics, Architecture, UX Design Specification) and found **33 structural issues** that will cause implementation friction if not addressed before development begins.

The issues are **not** gaps in what needs to be built — MVP requirements coverage is 100% (61/61 FRs mapped to 8 epics). The problems are in **how work is organized**: circular dependencies between epics, oversized stories spanning 3-5 days each, forward dependencies that break implementation ordering, scope contradictions between the UX spec and other documents, and schema definitions scattered across feature stories instead of centralized.

### Context

- **When discovered:** Pre-implementation readiness review, before any code was written
- **How discovered:** Systematic cross-document validation checking dependency ordering, story sizing, acceptance criteria completeness, and inter-document alignment
- **Severity:** 4 critical violations, 9 major issues, 8 minor concerns, 12 UX/architecture alignment warnings
- **Overall readiness status:** NEEDS WORK

### Evidence Summary

| Category | Count | Key Examples |
|----------|-------|-------------|
| Critical Violations | 4 | E7-E8 circular dependency, 3 oversized stories (1.1, 1.2, 8.1), non-user-value epic titles |
| Major Issues | 9 | 5 forward dependency pairs, dev-focused story framing, scattered schema definitions, missing error ACs |
| UX Scope Contradictions | 3 | Auto-submit vs "Check" button, "Send results to email" without FR, Apple sign-in without architecture |
| Architecture Gaps | 7 | Missing event pattern, unspecified structured data, undecided canonical URL strategy, no RUM strategy |

---

## Section 2: Impact Analysis

### Epic Impact

| Epic | Impact Level | Issues |
|------|-------------|--------|
| Epic 1 | **High** | Stories 1.1, 1.2 oversized; 1.4 forward-deps on 3.3; 1.8/1.9 circular; 1.10 missing schema fields; 1.6 underspecified; title not user-focused |
| Epic 2 | **Low** | Title rename; Schema.org types and canonical URL strategy undecided (non-blocking) |
| Epic 3 | **Low** | Title rename; "Save for my next trip" data model exists in story but missing from architecture doc |
| Epic 4 | **High** | Stories 4.1/4.2 circular dependency; forward dependency on Epic 5 tier logic; title rename |
| Epic 5 | **Medium** | Story 5.1 dev-focused framing; title rename |
| Epic 6 | **Low** | Missing error ACs in Story 6.2; title rename |
| Epic 7 | **Critical** | Circular dependency with Epic 8; schema embedded in ACs; title rename |
| Epic 8 | **Critical** | Circular dependency with Epic 7; Story 8.1 epic-sized; admin UX deferred to Phase 3 but workflow is MVP; title rename |

### Story Impact

| Story | Issue | Change Type |
|-------|-------|-------------|
| 1.1 | Oversized (13 tasks, 3-5 days) | Split into 1.1a, 1.1b, 1.1c |
| 1.2 | All tables upfront; missing fields for 1.10 and 1.6 | Split into 1.2a (core) + 1.2b (staging/audit deferred to E8); add missing fields |
| 1.4 | Forward dependency on email service (Story 3.3) | Stub email capture as UI-only |
| 1.6 | Multi-authority conflict underspecified | Add regulatoryAuthority support to schema |
| 1.8 | Unclear ownership of departure date input vs 1.9 | Clarify 1.8 as owner, 1.9 as consumer |
| 1.10 | References schema fields not in 1.2 | Fields added to 1.2a |
| 4.1/4.2 | Circular: 4.1 displays model 4.2 creates | Reorder: save action first, then dashboard |
| 4.2 | Contains tier logic belonging to Epic 5 | Move tier/paywall ACs to Story 5.2 |
| 5.1 | Written from developer perspective | Reframe as user story |
| 6.2 | Missing error condition ACs | Add validation, timeout, rate limit ACs |
| 7.1 | Circular dependency with 8.3; schema in ACs | Decouple via event pattern; centralize schema |
| 8.1 | Epic-sized (5+ days, 5 concerns) | Split into 8.1a, 8.1b, 8.1c |
| 8.3 | Circular dependency with 7.1 | Emit event instead of directly dispatching notifications |

### Artifact Conflicts

**PRD:**
- No core conflicts with PRD goals or MVP scope
- Minor: "Send results to my email" exists in UX but has no FR — needs decision (add FR65 or remove from UX)

**Architecture:**
- Missing: Event-based pattern for E7/E8 decoupling
- Missing: Performance monitoring / RUM strategy
- Missing: `prefers-reduced-motion` pattern
- Minor: Schema.org types not fully specified (pre-Epic 2 decision)
- Minor: Canonical URL resolution strategy undecided (pre-Epic 2 decision)
- Minor: ISR cache race condition between curator approval and CDN invalidation

**UX Design Specification:**
- Search submission behavior contradiction (line 316 auto-submit vs lines 534/1201 "Check" button)
- "Send results to my email" in journey flows but no FR backing
- Apple sign-in mentioned in account creation but not in PRD/architecture
- Admin components (ChangeQueueItem, VerificationDetailView, DataFreshnessIndicator) placed in Phase 3 but curator workflow (FR29-35) is MVP
- Journey 1 flow diagram shows customs card (Phase 2 feature)

### Technical Impact

- No code changes required (pre-implementation)
- No infrastructure or deployment implications
- No schema changes needed beyond what's already planned (fields added to existing planned models)
- Dependency map becomes clean after changes — no remaining circular dependencies

**Corrected Dependency Map:**

```
Epic 1 (Core Search) <- Independent foundation
  |-- Epic 2 (SEO Pages) <- Depends on E1
  |-- Epic 3 (Social Sharing) <- Stories 3.1-3.2 depend on E1; 3.3 independent
  |-- Epic 4 (Accounts & Saves) <- Depends on E1 (tier logic removed)
  |     '-- Epic 5 (Freemium) <- Depends on E1, E4
  |-- Epic 6 (Layover Trap) <- Depends on E1
  |-- Epic 7 (Notifications) <- Depends on E4; subscribes to E8 events
  '-- Epic 8 (Data Pipeline) <- Independent; emits events consumed by E7
```

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment

Modify and reorganize stories within the existing epic structure. No rollback needed (no implementation has started). No MVP scope reduction needed (all issues are structural, not scope-related).

### Rationale

- All 33 issues are about **how work is organized**, not **what needs to be built**
- Requirements coverage is already 100% — splitting, reordering, and clarifying stories preserves all functionality
- The epic structure itself is sound — the 8 epics map cleanly to the product's feature domains
- Estimated effort: **4-5 hours of document revision**
- Risk level: **Low** — changes are additive (splitting, reordering, adding missing ACs) not subtractive

### Trade-offs Considered

| Option | Verdict | Reason |
|--------|---------|--------|
| Direct Adjustment | **Selected** | All issues are structural, not scope-related. Fix the organization, keep the scope. |
| Rollback | Not viable | No implementation to roll back. |
| MVP Scope Reduction | Not needed | MVP is well-scoped. Issues are in story structure, not feature definition. |

### Effort & Timeline

- **Document revision:** 4-5 hours
- **Risk:** Low
- **Timeline impact:** None — fixes prevent future implementation friction rather than adding new work

---

## Section 4: Detailed Change Proposals

### Change Group 1: Break Epic 7 <-> Epic 8 Circular Dependency

**Priority: Highest**

This is the single most impactful fix. Epic 7 (Notifications) and Epic 8 (Data Pipeline) are mutually blocked: Story 7.1 needs curator approval from Story 8.3, and Story 8.3 dispatches emails via Story 7.1.

**Solution:** Introduce an event-based decoupling pattern. Epic 8 emits a `regulation.approved` event. Epic 7 subscribes to it.

---

**Story 8.3: Verification Detail View & Approve/Reject/Escalate**
Section: Approve action acceptance criteria

OLD:
```
- Checks notification subscriptions, dispatches regulation change emails via Trigger.dev (from Story 7.1)
```

NEW:
```
- Emits a regulation.approved event via Trigger.dev (trigger/events/regulation-approved.ts) containing: affected compoundId, countryId, previousStatus, newStatus, sourceCitation, approvedAt. Event is fire-and-forget — does not block the approval flow.
- If no notification subscriber exists for the event, the event completes as a no-op.
```

Rationale: Decouples Epic 8 from Epic 7. Epic 8 can be fully built and tested independently. The event emission is a clean contract that Epic 7 subscribes to when implemented.

---

**Story 7.1: Regulation Change Notification System**
Section: Trigger acceptance criteria

OLD:
```
- When curator approves regulation change affecting compound-country pair
```

NEW:
```
- Subscribes to regulation.approved events emitted by Story 8.3's approval flow (trigger/events/regulation-approved.ts)
- When a regulation.approved event is received, system identifies matching notification subscriptions
```

Rationale: Epic 7 becomes a subscriber to events rather than being directly called by Epic 8. Either epic can be built first.

---

### Change Group 2: Split Oversized Stories

**Priority: High**

Three stories each bundle 3-5 days of work spanning multiple concerns. Splitting them into independently completable units.

---

#### Split Story 1.1 -> 1.1a, 1.1b, 1.1c

**Story 1.1: Project Initialization & Development Environment**

OLD (single story with 13 setup tasks):
```
Story 1.1: Project Initialization & Development Environment
- Project initializes via npx create-next-app@latest...
- shadcn/ui initialized with base components...
- Prisma installed with DATABASE_URL pointing to Neon
- Clerk, Stripe, Resend, Upstash, Sentry, Trigger.dev SDKs installed
- Tailwind config includes custom design tokens...
- .env.example and .env.local templates created
- TypeScript strict mode enabled
- Directory structure created...
- types/compliance.ts defines ComplianceStatus enum...
- lib/utils/response.ts provides API response wrapper helpers
- GitHub Actions CI runs TypeScript check, ESLint, Prisma validate
- Project deploys successfully to Vercel with preview deployments
```

NEW (three focused stories):

```
Story 1.1a: Project Scaffold & Design System Foundation
As a developer, I want the base Next.js project with design tokens so I can begin building components.

Acceptance Criteria:
- Project initializes via npx create-next-app@latest check-orbit --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
- shadcn/ui initialized with base components (Button, Input, Badge, Card, Command, Dialog, Table, Tabs, Toast, Separator, Tooltip, Skeleton)
- Tailwind config includes custom design tokens (brand palette: burnt orange #DE6438, soft apricot #E8A972, steel blue #5B9BC5, ice blue #BDD9F0, marigold gold #DDB943; status colors: emerald, sky, amber, rose)
- TypeScript strict mode enabled
- Directory structure: src/app/, src/components/ui/, src/lib/, src/types/, src/actions/, src/config/, trigger/, prisma/
- types/compliance.ts defines ComplianceStatus enum (LEGAL, PRESCRIPTION_ONLY, RESTRICTED, BANNED) and STATUS_SEVERITY map
- lib/utils/response.ts provides API response wrapper helpers (success/error format)
- .env.example template created with all required variable names
```

```
Story 1.1b: Third-Party Service Integration
As a developer, I want all external SDKs configured so API integrations are ready to use.

Acceptance Criteria:
- Prisma installed with DATABASE_URL pointing to Neon serverless PostgreSQL
- Clerk SDK installed and ClerkProvider added to root layout (configured in Story 1.3)
- Stripe SDK installed with API key configuration
- Resend SDK installed with API key configuration
- Upstash Ratelimit SDK installed with Redis URL configuration
- Sentry SDK installed with sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts
- Trigger.dev SDK installed with project configuration
- .env.local template updated with all service-specific environment variables
- All SDKs verified: import resolves, TypeScript types available
```

```
Story 1.1c: CI/CD Pipeline & Deployment
As a developer, I want automated checks and deployment so every PR is validated and deployable.

Acceptance Criteria:
- GitHub Actions CI workflow runs: TypeScript type check (tsc --noEmit), ESLint, Prisma schema validation
- CI runs on every PR and push to main
- Project deploys successfully to Vercel
- Vercel Preview Deployments enabled for every PR
- Neon database branching configured for preview deployments
- Global error boundary (src/app/error.tsx) reports to Sentry
```

Rationale: Each sub-story is independently completable in 1-2 days. 1.1a can be tested without external services. 1.1b can proceed in parallel once 1.1a's directory structure exists. 1.1c depends on both but is a distinct concern.

---

#### Split Story 1.2 -> 1.2a, 1.2b

**Story 1.2: Database Schema & Regulatory Data Model**

OLD (all tables upfront):
```
Story 1.2: Database Schema & Regulatory Data Model
- Country, Medication, Compound, Regulation models
- StagingRegulation model (identical to Regulation plus AI fields)
- AuditTrail model (append-only)
- Composite indexes, seed script, Prisma client singleton, Neon branching
```

NEW (core schema now, staging/audit deferred to Epic 8):

```
Story 1.2a: Core Regulatory Data Model
As a developer, I want the core database schema so compliance search queries can be built.

Acceptance Criteria:
- Country model: id, name, code (ISO 3166-1 alpha-2), isCovered, flagEmoji, popularityRank
- Medication model: id, brandName, genericName, slug, proprietaryBlend (Boolean, default false), disclosureLevel (enum: FULL, PARTIAL, UNDISCLOSED), relations to compounds
- Compound model: id, name, atcCode, casNumber, relations to medications
- Regulation model (live table): id, compoundId, countryId, status (ComplianceStatus enum), regulatoryAuthority, requiredDocuments, quantityLimits, permitAuthority, permitApplicationUrl, permitLeadTimeDays, dosageThreshold, biosecurityFlag, biosecurityDetails, sourceDocumentTitle, sourceDocumentUrl, lastVerifiedAt, verifiedBy, notes
- Composite unique index on [compoundId, countryId, regulatoryAuthority] for Regulation (supports multiple authorities per compound-country pair)
- Seed script (prisma/seed.ts) populates sample data: 10 medications (including supplements with proprietary blends), 10 countries, all 4 compliance statuses represented, at least one multi-authority conflict example
- lib/db/prisma.ts exports singleton Prisma client
- Neon database branching configured for Vercel preview deployments
```

```
Story 1.2b: Staging & Audit Schema [MOVED TO EPIC 8]
NOTE: StagingRegulation and AuditTrail tables are created in Story 8.1c when the curator pipeline is built. These tables are not needed until Epic 8 implementation begins.

Deferred models:
- StagingRegulation: identical fields to Regulation plus aiConfidence, aiExtractedText, aiTranslation, flaggedAt, reviewStatus
- AuditTrail: id, regulationId, action, previousData (JSON), newData (JSON), performedBy, performedAt, sourceCitation (append-only, no UPDATE/DELETE)
```

Rationale: Core schema (1.2a) is needed immediately for Epic 1. Staging and audit tables are only consumed by Epic 8's curator pipeline. Creating them upfront violates "create tables when first needed" and adds unused schema to early PRs. The `proprietaryBlend`, `disclosureLevel`, and `regulatoryAuthority` fields are added to 1.2a to resolve the Story 1.10 and Story 1.6 forward dependencies.

---

#### Split Story 8.1 -> 8.1a, 8.1b, 8.1c

**Story 8.1: AI Regulatory Monitoring Pipeline**

OLD (epic-sized, 5+ concerns):
```
Story 8.1: AI Regulatory Monitoring Pipeline
- Trigger.dev cron, fan-out to 50 countries, PDF extraction, Claude API extraction,
  compound mapping, staging writes, confidence scoring, error handling
```

NEW (three focused stories):

```
Story 8.1a: Pipeline Scaffold & Single-Country Scan
As a data curator, I want the AI pipeline to scan one country's regulatory publications so I can validate the extraction approach.

Acceptance Criteria:
- Trigger.dev configured with daily scheduled cron job
- trigger/regulatory/scan-country.ts processes a single country
- Fetches government publication URLs (health ministry, customs authority, gazette) for the target country
- PDF extraction via LlamaParse (trigger/regulatory/extract-regulations.ts) with table and layout understanding
- Extracted text stored with source URL and extraction timestamp
- Non-English sources translated by Claude API (original text preserved alongside translation)
- Errors logged to Sentry with country context
- Pipeline completes for a single country without timeout issues
- Manual trigger available for testing (not just cron)
```

```
Story 8.1b: Multi-Country Orchestration & Confidence Scoring
As a data curator, I want the pipeline to scan all 50 countries with confidence-scored results so I can prioritize my review.

Acceptance Criteria:
- trigger/regulatory/scan-all-countries.ts fans out to trigger/regulatory/scan-country.ts for all 50 covered countries
- Fan-out handles partial failures gracefully (one country failure doesn't block others)
- Confidence scoring applied to each extracted change: HIGH (clear regulatory text + reliable source), MEDIUM (ambiguous language or secondary source), LOW (indirect reference or low-confidence translation)
- Confidence factors: source reliability, extraction clarity, translation confidence, regulatory pattern alignment
- Pipeline completes for all 50 countries without timeout issues
- Aggregate pipeline status logged (countries scanned, changes found, errors encountered)
- Errors for individual countries logged to Sentry with context
```

```
Story 8.1c: Compound Mapping, Staging Writes & Data Model
As a data curator, I want extracted regulatory changes mapped to compounds and written to the staging table so I can review them in the dashboard.

Acceptance Criteria:
- Claude API structured output transforms raw text to JSON: compounds, status changes, effective dates, dosage thresholds, documentation requirements
- Compounds validated against ATC/RxNorm via trigger/compound/map-medication.ts
- Compound sync tasks: trigger/compound/sync-rxnorm.ts and trigger/compound/sync-atc.ts
- StagingRegulation Prisma model created: id, compoundId, countryId, proposedStatus, requiredDocuments, quantityLimits, permitAuthority, permitApplicationUrl, permitLeadTimeDays, dosageThreshold, biosecurityFlag, biosecurityDetails, sourceDocumentTitle, sourceDocumentUrl, aiConfidence (HIGH/MEDIUM/LOW), aiExtractedText, aiTranslation, flaggedAt, reviewStatus (PENDING/APPROVED/REJECTED/ESCALATED)
- AuditTrail Prisma model created: id, regulationId, action, previousData (JSON), newData (JSON), performedBy, performedAt, sourceCitation (append-only — no UPDATE/DELETE on audit table for app roles)
- Flagged changes written to StagingRegulation table with all extracted data
- Staging only — no live table changes without human verification
- Composite index on [compoundId, countryId] for StagingRegulation
```

Rationale: Each sub-story is testable independently. 8.1a validates the extraction approach with one country. 8.1b scales to 50 countries. 8.1c handles the data transformation and creates the staging/audit schema (moved from Story 1.2b).

---

### Change Group 3: Resolve Forward Dependencies

**Priority: High**

Five story pairs have circular or forward dependencies that break implementation ordering.

---

#### Fix 3a: Story 1.4 Email Capture -> Story 3.3 Dependency

**Story 1.4: Medication Search API with Autocomplete**
Section: No-match acceptance criteria

OLD:
```
- No match shows: "We don't have [input] in our database yet. Want to be notified when we add it?" with email capture
```

NEW:
```
- No match shows: "We don't have [input] in our database yet. Want to be notified when we add it?" with email input field (UI only — visual placeholder without backend submission. Backend email capture connected in Story 3.3 when Resend integration is available.)
```

Rationale: Story 1.4 (Epic 1) cannot call Resend because email infrastructure isn't built until Story 3.3 (Epic 3). The UI can exist immediately; the backend wiring comes later.

---

#### Fix 3b: Stories 1.8 / 1.9 Departure Date Ownership

**Story 1.8: Homepage Hero Search & Result Page**
Section: Departure date acceptance criteria

OLD:
```
- Optional departure date prompt inline after country selection
```

NEW:
```
- DepartureDateInput component renders inline after country selection (optional, never blocking). This component is the single owner of departure date input across the application.
- Date stored in URL query parameter (?departureDate=YYYY-MM-DD) for shareability and consumption by downstream components
- Story 1.9 consumes this URL parameter for permit lead time calculations — no duplicate date input exists elsewhere
```

**Story 1.9: Permit Lead Time Alerts & Departure Date**
Section: DepartureDateInput acceptance criteria

OLD:
```
- DepartureDateInput renders inline after country selection (not required, not blocking)
- Date stored in URL query parameter (?departureDate=2026-04-15) for shareability
```

NEW:
```
- Reads departure date from URL query parameter (?departureDate=YYYY-MM-DD) as set by Story 1.8's DepartureDateInput component
- Does NOT create its own date input — consumes the value from URL state
```

Rationale: Clarifies that Story 1.8 owns the input and Story 1.9 is a consumer. Removes ambiguity about which story implements the DepartureDateInput component.

---

#### Fix 3c: Story 1.10 Missing Schema Fields

**No story text change needed.** The missing `proprietaryBlend` and `disclosureLevel` fields are now included in Story 1.2a (see Change Group 2, Story 1.2 split). Story 1.10 can reference these fields without a schema migration.

---

#### Fix 3d: Stories 4.1 / 4.2 Reorder

**Reorder Epic 4 stories so the SavedSearch model is created before the dashboard that displays it.**

OLD order:
```
Story 4.1: User Account Dashboard & Saved Search List (displays saved searches)
Story 4.2: Save & Delete Compliance Searches (creates SavedSearch model)
Story 4.3: Saved Search Re-Check with Change Detection
```

NEW order:
```
Story 4.1: Save & Delete Compliance Searches (creates SavedSearch model + save/delete actions)
Story 4.2: User Account Dashboard & Saved Search List (displays saved searches)
Story 4.3: Saved Search Re-Check with Change Detection
```

Content of stories remains identical — only the ordering changes. All internal references to "Story 4.1" and "Story 4.2" must be swapped throughout the epics document.

Rationale: The SavedSearch model must exist before a dashboard can display it. Current ordering creates a circular dependency where the dashboard references a model that hasn't been created yet.

---

#### Fix 3e: Epic 4 -> Epic 5 Tier Logic Removal

**Story 4.2 (was 4.1): Save & Delete Compliance Searches**
Section: Tier-related acceptance criteria

OLD:
```
- Free-tier with consumed slot: attempting second save shows PaywallModal
- Free save slot permanently consumed (FR50)
```

NEW:
```
[REMOVED — tier logic and paywall behavior moved to Epic 5, Story 5.2]
- Save action has no tier awareness. Any authenticated user can save searches.
- Tier-based save limits and paywall triggers are implemented in Story 5.2 (Paywall & Feature Gating).
```

**Story 5.2: Paywall & Feature Gating**
Section: Saved search gating (ADD new acceptance criteria)

ADD:
```
- Free-tier users have one saved search slot. Attempting to save a second search shows PaywallModal.
- Free save slot is permanently consumed when used — deleting the saved search does not restore the slot (FR50).
- PaywallModal for saved searches follows same pattern as multi-medication and layover trap paywalls.
```

Rationale: Epic 4 should focus purely on save/list/revisit/compare mechanics. Tier awareness and paywall behavior belong in Epic 5, which owns all subscription logic. This removes the forward dependency from Epic 4 to Epic 5.

---

### Change Group 4: Normalize UX Spec Against PRD and Architecture

**Priority: Medium**

Three UX features have no backing in the PRD or architecture. Each needs a decision.

---

#### Fix 4a: Search Submission Behavior Contradiction

**UX Design Specification**
Section: Core User Experience (near line 316)

OLD:
```
Submit: search executes immediately on country selection (no submit button needed if both fields are filled)
```

NEW:
```
Submit: search executes only when the user clicks the "Check" button (UX-DR3). The button appears once both medication and country fields are filled. In a high-stakes compliance context, intentional submission respects the weight of the answer.
```

Rationale: The auto-submit line contradicts UX-DR3 and at least two other sections in the same document that require explicit "Check" button submission. The PRD, architecture, and epics all align on the "Check" button. This is a copy-paste artifact.

---

#### Fix 4b: "Send Results to My Email" Scope Decision

**Decision: Add as FR65 in the PRD.**

This feature appears in 3+ UX journey flows as a post-result action. It's a lightweight email capture (email input + send, no account required) consistent with the existing "save for my next trip" pattern. It supports the growth strategy by capturing emails from anonymous users.

**PRD**
Section: Social Sharing & Discovery Capture (after FR64)

ADD:
```
FR65: Traveler can enter an email address on any compliance result page to receive that result via email — a single transient email send with no persistent medication data storage.
```

**Architecture**
Section: API Routes

ADD:
```
/api/share/send-result — POST — Accepts email address and current compliance result data. Sends a single transactional email via Resend containing the compliance result. No data is persisted beyond the email delivery. Rate limited to prevent abuse (max 5 sends per email per hour).
```

**Epics**
Section: Epic 3, after Story 3.3

ADD:
```
Story 3.4: Send Compliance Result via Email
As a traveler, I want to email myself a compliance result so I have it in my inbox for reference.

Acceptance Criteria:
- "Send to my email" ghost-style tertiary action button on every compliance result page
- Clicking opens inline email input (single field + "Send" button, same row)
- /api/share/send-result POST endpoint accepts email + compliance result data
- Zod validation for email format
- Email sent via Resend using template (lib/email/templates/compliance-result.tsx)
- Email contains: medication name, country, compliance status, key details, source citation, link to full result page, disclaimer
- No medication data persisted — transient send only
- Success: input replaced with "Sent to your@email.com" + toast confirmation
- Rate limited: max 5 sends per email per hour
- No account required
- Component in src/components/sharing/SendResultEmail.tsx
```

Rationale: Feature already exists in UX journey flows and aligns with the email capture growth strategy. Adding formal FR + story ensures traceability and prevents implementation drift.

---

#### Fix 4c: Apple Sign-In Scope Decision

**Decision: Remove from UX spec for MVP.**

Apple Sign-In requires Apple Developer Program membership ($99/year), domain verification, and additional implementation complexity. For a solo founder at MVP, Google OAuth + email/password provides sufficient authentication options.

**UX Design Specification**
Section: Account Creation (near line 1215)

OLD:
```
Social login options (Google, Apple) above email/password for speed
```

NEW:
```
Social login option (Google) above email/password for speed. Apple Sign-In deferred to Phase 2.
```

Rationale: PRD (FR40) and architecture only commit to Google OAuth + email/password. Adding Apple Sign-In is non-trivial and not critical for MVP launch. Can be added in Phase 2 alongside other institutional features.

---

### Change Group 5: Reframe Developer-Focused Stories

**Priority: Medium**

---

#### Fix 5a: Story 5.1 User Value Framing

**Story 5.1: Stripe Subscription Integration & Tier Management**

OLD title and framing:
```
Story 5.1: Stripe Subscription Integration & Tier Management
(Implied: "As a developer, I want Stripe subscription infrastructure...")
```

NEW:
```
Story 5.1: Travelers Can Upgrade to Pro for Advanced Features
As a traveler, I want to upgrade to a paid plan so I can unlock multi-medication search, layover trap, and unlimited saved searches.
```

All acceptance criteria remain the same — only the framing changes from developer infrastructure to user value.

Rationale: Stories should express user value, not technical implementation. The ACs describe the same work, but the story title communicates why it matters.

---

### Change Group 6: Rename Epic Titles to User Outcomes

**Priority: Medium**

All 8 epic titles describe features or technical capabilities. Rename to describe what users achieve.

| # | OLD Title | NEW Title |
|---|-----------|-----------|
| Epic 1 | Core Medication Compliance Search | Travelers Get Instant Medication Safety Answers |
| Epic 2 | SEO-Optimized Compliance Pages | Travelers Discover Check Orbit Through Search Engines |
| Epic 3 | Social Sharing & Discovery Capture | Travelers Share Medication Warnings and Capture Interest |
| Epic 4 | User Accounts & Saved Searches | Travelers Track and Revisit Their Medication Checks |
| Epic 5 | Freemium Model & Subscription Management | Travelers Unlock Advanced Features with Pro |
| Epic 6 | Layover Trap & Multi-Stop Itinerary | Travelers Discover Hidden Risks at Layover Countries |
| Epic 7 | Email Notifications & Regulation Alerts | Travelers Stay Informed When Regulations Change |
| Epic 8 | Regulatory Data Pipeline & Curator Dashboard | Curators Keep the Regulatory Database Accurate and Current |

Rationale: User-outcome titles keep teams focused on why each epic matters. Technical details belong in story descriptions, not epic titles.

---

### Change Group 7: Move Admin UX Components to Phase 1

**Priority: Medium**

---

**UX Design Specification**
Section: Component Implementation Roadmap

OLD:
```
Phase 3 - Admin & Operations:
- ChangeQueueItem
- VerificationDetailView
- DataFreshnessIndicator
```

NEW:
```
Phase 1 - Admin & Operations (MVP - Curator Workflow):
- ChangeQueueItem
- VerificationDetailView
- DataFreshnessIndicator

Note: The curator verification workflow (FR29-35) is MVP. The founder operates as Amara (data curator) from day one. These components need at minimum a functional specification for MVP, even if visual polish is deferred.
```

Rationale: Epic 8 (curator dashboard) is an MVP epic. The UX spec's Phase 3 placement creates a gap where developers build curator UI without UX guidance. Moving to Phase 1 ensures the curator workflow has design specifications when it's implemented.

---

### Change Group 8: Add Missing Error Condition ACs

**Priority: Low**

---

**Story 1.4: Medication Search API with Autocomplete**

ADD acceptance criteria:
```
- API response >5 seconds: skeleton loading replaced with "Search is taking longer than expected. Please try again." with retry button
- API 500 response: show "Something went wrong. Please try again." with retry button. Error logged to Sentry.
```

**Story 6.2: Multi-Stop Compliance Check API**

ADD acceptance criteria:
```
- Invalid itinerary (fewer than 2 stops, invalid country codes): Zod validation returns clear error message listing the specific validation failures
- Medication not found in itinerary check: returns { success: false, error: { code: "MEDICATION_NOT_FOUND" } } with guidance
- Rate limited request: returns { success: false, error: { code: "RATE_LIMITED" } } with 429 status and retry-after header
```

**Story 5.1: Stripe Subscription Integration & Tier Management**

ADD acceptance criteria:
```
- getUserTier() failure (Clerk unavailable, network error): defaults to free tier, logs error to Sentry. User is not blocked from using the application; they see free-tier behavior until the issue resolves.
```

---

### Change Group 9: Centralize Schema Definitions

**Priority: Low**

Stories 7.1, 7.2, 8.1, and 8.2 embed Prisma model definitions in their acceptance criteria. This scatters schema across the epics document.

**Recommendation:** Each epic that introduces new database models should define them in that epic's first story. Subsequent stories reference the model by name without re-specifying fields.

Specifically:
- **Epic 7:** Story 7.1 (first story) defines the NotificationSubscription model. Stories 7.2 and 7.3 reference it by name.
- **Epic 8:** Story 8.1c defines StagingRegulation and AuditTrail models. Stories 8.2, 8.3, and 8.4 reference them by name.

This is already approximately correct — the change is to **remove** inline schema definitions from Stories 7.2, 8.2, and 8.3, replacing them with references like "Uses NotificationSubscription model (defined in Story 7.1)" and "Uses StagingRegulation model (defined in Story 8.1c)."

---

### Change Group 10: Minor Architecture Documentation Gaps

**Priority: Low — Pre-implementation decisions, not blocking**

These items should be documented in the architecture before the relevant epic begins implementation, but don't require changes to the epics or PRD.

| Item | When Needed | Recommendation |
|------|-------------|----------------|
| Schema.org structured data types | Before Epic 2 | Define MedicalEntity or Drug type with compliance status properties |
| Canonical URL resolution strategy | Before Epic 2 | Recommend compound-name as canonical (more stable than brand names); brand-name URLs 301 redirect |
| Performance monitoring / RUM | Before Epic 1 completion | Add Vercel Analytics or web-vitals library; define performance budgets |
| `prefers-reduced-motion` pattern | Before Epic 1 Story 1.7 | Add CSS media query pattern to architecture accessibility section |
| ISR cache race condition | Before Epic 8 | Document: stale reads are bounded by CDN TTL (seconds); acceptable given regulatory data changes infrequently |
| Journey 1 UX flow customs card | Before Epic 1 | Remove customs card reference from Journey 1 flow diagram (Phase 2 feature) |
| Journey numbering inconsistency | Documentation cleanup | Add cross-reference: PRD Journey 5 = UX Journey 6 (Amara) |

---

## Section 5: Implementation Handoff

### Change Scope Classification: **Moderate**

The changes require backlog reorganization (story splitting, reordering, AC modifications across 8 epics) but no fundamental replan. The product vision, architecture, and feature scope are unchanged.

### Handoff Plan

| Responsibility | Owner | Deliverables |
|---------------|-------|-------------|
| Update epics.md with all story changes | Dev team / Architect | Split stories (1.1, 1.2, 8.1), reorder (4.1/4.2), remove tier logic from E4, add error ACs, rename titles, add Story 3.4, decouple E7/E8 |
| Update ux-design-specification.md | UX Designer / Architect | Fix auto-submit contradiction, remove Apple sign-in, move admin components to Phase 1, remove Journey 1 customs card |
| Update prd.md | Product Manager | Add FR65 (send results to email) |
| Update architecture.md | Architect | Add event pattern for E7/E8, add /api/share/send-result route, add pre-Epic 2 decisions (Schema.org, canonical URL), add RUM strategy, add prefers-reduced-motion |
| Verify changes are consistent | QA / SM | Cross-check all four documents after updates for remaining contradictions |

### Implementation Order for Document Updates

1. **Epics first** (largest number of changes, most cross-references)
2. **UX spec second** (scope normalization)
3. **Architecture third** (new patterns and routes)
4. **PRD last** (single addition: FR65)
5. **Cross-document verification** (final consistency check)

### Success Criteria

- [ ] No circular dependencies remain between any epics
- [ ] No story exceeds 2 days of estimated work
- [ ] Every story has a clear implementation order within its epic
- [ ] All UX features trace to a formal FR in the PRD
- [ ] All FRs trace to an epic and story
- [ ] No schema definitions scattered across feature stories (centralized in first-use story)
- [ ] All stories include error condition ACs for API endpoints
- [ ] Epic titles describe user outcomes, not features
- [ ] Admin/curator components included in Phase 1 UX roadmap
- [ ] Updated dependency map has no circular references

---

## Checklist Completion Summary

| Section | Status | Notes |
|---------|--------|-------|
| 1. Trigger & Context | [x] Done | Implementation Readiness Report, 33 issues, pre-implementation |
| 2. Epic Impact Assessment | [x] Done | All 8 epics assessed; E1, E4, E7, E8 most impacted |
| 3. Artifact Conflict Analysis | [x] Done | PRD (1 addition), Architecture (6 gaps), UX (5 contradictions) |
| 4. Path Forward Evaluation | [x] Done | Direct Adjustment selected; Low risk, 4-5 hours effort |
| 5. Sprint Change Proposal | [x] Done | 10 change groups, 25+ specific edit proposals |
| 6. Final Review & Handoff | [x] Done | Moderate scope, development team + architect handoff |

---

**Sprint Change Proposal completed: 2026-04-02**
**Prepared by:** Correct Course Workflow (BMAD)
**Report:** `_bmad-output/planning-artifacts/sprint-change-proposal-2026-04-02.md`
