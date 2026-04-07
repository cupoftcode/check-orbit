# Implementation Readiness Assessment Report

**Date:** 2026-04-02
**Project:** travel-buddy-app

---
stepsCompleted: [step-01-document-discovery, step-02-prd-analysis, step-03-epic-coverage-validation, step-04-ux-alignment, step-05-epic-quality-review, step-06-final-assessment]
filesIncluded:
  prd: prd.md
  architecture: architecture.md
  epics: epics.md
  ux: ux-design-specification.md
  supplementary: prd validation report.md
---

## Document Inventory

### PRD
- `prd.md` (60,250 bytes, Mar 26 14:12)
- `prd validation report.md` (20,752 bytes, Mar 26 14:25) — supplementary

### Architecture
- `architecture.md` (71,607 bytes, Mar 27 15:01)

### Epics & Stories
- `epics.md` (91,525 bytes, Apr 1 09:31)

### UX Design
- `ux-design-specification.md` (116,395 bytes, Mar 27 13:26)

### Discovery Notes
- No duplicate document conflicts
- No missing required documents
- All four core document types present

## PRD Analysis

**Product:** Check Orbit
**Classification:** Web Application | Travel Health Compliance | High Complexity | Greenfield

### Functional Requirements

#### Medication Compliance Search (FR1-FR8)
- FR1: Traveler can search for a medication by brand name, generic name, or compound name
- FR2: Traveler can select a destination country from a list of covered countries
- FR3: Traveler can view a compliance status (Legal, Prescription-Only, Restricted, or Banned) for each active compound against their selected destination
- FR4: Traveler can view required documentation, quantity limits, and permit requirements for Prescription-Only and Restricted medications
- FR5: Traveler can view permit lead time requirements including issuing authority name, application URL or process, and minimum lead time in days
- FR5a: Traveler can optionally enter a departure date to enable time-sensitive alerts
- FR6: System can display a "you're already too late" warning when departure date is provided and remaining days are fewer than the permit's required lead time
- FR7: Traveler can search up to 10 medications against one or more destinations in a single session (paid tier)
- FR8: Traveler can view the government source document, source link, and last verified date for every compliance result

#### Ingredient Decomposition (FR9-FR13b)
- FR9: System can decompose a brand-name medication or named supplement into its individual active compounds and ingredients
- FR10: System can independently check each active compound against destination country regulations
- FR11: System can apply dosage-threshold classification where country regulations differentiate by dosage level
- FR12: System can flag any combination medication or supplement containing at least one controlled or restricted ingredient
- FR13: System can display "unable to verify" for unmapped medications, supplements with undisclosed proprietary blends, or products whose full ingredient list cannot be determined
- FR13a: System can identify when a supplement declares a proprietary blend without full ingredient disclosure and display a specific warning
- FR13b: System can display a biosecurity warning flag on compliance results for products containing plant-derived, animal-derived, or soil-contact ingredients when the destination country enforces agricultural biosecurity import restrictions

#### Layover & Transit Compliance (FR14-FR17a)
- FR14: Traveler can enter a multi-stop itinerary with origin, destination, and transit/layover countries (paid tier)
- FR15: System can check medication compliance for every country in the itinerary sequence, including transit stops
- FR16: Traveler can view a per-country compliance status across their full itinerary in sequence
- FR17: System can flag transit country conflicts where medication is legal at origin and destination but banned at a layover
- FR17a: When a transit country conflict is detected, system can display alternative transit hubs where the medication is legal (paid tier)

#### Coverage Transparency (FR18-FR20)
- FR18: Traveler can see which countries are covered and which are not yet covered
- FR19: System can display explicit "not yet covered" messaging for uncovered countries
- FR20: Traveler can see explicit "unable to verify" messaging for medications that cannot be mapped to known compounds

#### Email Notifications (FR21-FR24)
- FR21: Traveler can opt in to receive email notifications when a regulation changes for a medication-country pair they previously searched (paid tier)
- FR22: Traveler can opt in to receive permit deadline reminders at configurable intervals (paid tier)
- FR23: Traveler can manage notification preferences and unsubscribe
- FR24: System can send notifications without storing the traveler's medication data — triggers keyed to anonymized search parameters

#### SEO & Content Pages (FR25-FR28)
- FR25: System can generate a unique, search-engine-indexable page for each medication-country compliance pair
- FR26: System can produce pages eligible for search engine rich results
- FR27: System can generate dynamic sitemaps as coverage expands
- FR28: System can resolve brand name and compound name URL variations to a single authoritative page

#### Regulatory Data Management (FR29-FR35)
- FR29: Data curator can view a dashboard of flagged potential regulatory changes categorized by confidence level
- FR30: Data curator can review AI-extracted regulatory updates with source document links
- FR31: Data curator can approve, reject, or escalate flagged regulatory changes
- FR32: Data curator can add notes and annotations to regulatory records
- FR33: System can monitor government publications across covered countries for regulatory changes on a daily cycle
- FR34: System can produce draft regulatory updates from monitored publications for human review before publication
- FR35: System can maintain an audit trail for all database changes

#### Data Integrity & Trust (FR36-FR39)
- FR36: System can detect multi-authority conflicts within a country and apply the most restrictive interpretation
- FR37: System can display a data freshness indicator on every compliance result (Current: <90 days, Aging: 90-180 days, Stale: >180 days)
- FR38: System can display an informational disclaimer on all compliance results
- FR39: System can link every regulation record to its government source document with verification date

#### User Accounts & Saved Searches (FR40-FR47)
- FR40: Traveler can create an account using email/password or third-party authentication and sign in
- FR41: Traveler can save a compliance search to their account
- FR42: Traveler can view a list of their saved searches
- FR43: Traveler can revisit a saved search and see current compliance results regenerated from latest database
- FR44: System can display the previous compliance result snapshot alongside current results
- FR45: System can highlight changes between the saved snapshot and current results
- FR46: Traveler can delete saved searches from their account
- FR47: Traveler can use Check Orbit without creating an account — core search remains stateless for anonymous users

#### Freemium & Monetization (FR48-FR52)
- FR48: Traveler can use core single-medication, single-country compliance search for free without an account
- FR49: Traveler can create a free account with one saved search slot
- FR50: System can permanently consume a free save slot when used — deleting does not restore the slot
- FR51: Traveler can upgrade to a paid tier to unlock additional features
- FR52: System can manage subscription tiers with feature gating based on plan level

#### Institutional Screening — B2B2C (FR53-FR57) [Phase 2]
- FR53: University administrator can embed a self-service medication screening link in pre-departure workflows
- FR54: Student can privately screen medications; system never transmits medication data to the institution
- FR55: Student can receive a confirmation code upon completing the screening
- FR56: University administrator can view screening completion rates without seeing medication data
- FR57: System can generate a timestamped attestation document confirming screening completion without medication data

#### Customs Communication Card (FR58-FR59) [Phase 2]
- FR58: Traveler can generate a downloadable customs communication card in the destination country's language
- FR59: Customs communication card can be viewed offline once downloaded

#### Social Sharing & Discovery Capture (FR60-FR64)
- FR60: System can generate a shareable risk card from any compliance result, optimized for Instagram Stories and TikTok greenscreen dimensions
- FR61: Traveler can export a risk card as an image file or share via native share APIs
- FR62: Traveler can enter email + destination countries to receive regulation change alerts ("save for my next trip")
- FR63: "Save for my next trip" subscriptions require only email and destination list — no medication data stored
- FR64: System can serve editorially authored debunking landing pages addressing dangerous travel trends

**Total Functional Requirements: 68** (56 MVP Phase 1 + 7 Phase 2 + 5 Phase 2 institutional)

### Non-Functional Requirements

#### Performance (NFR1-NFR7)
- NFR1: Core single-medication search returns complete results within 20 seconds
- NFR2: Multi-medication search (up to 10 meds) returns results within 20 seconds
- NFR3: Layover trap itinerary analysis (up to 10 stops) returns results within 20 seconds
- NFR4: Server-rendered pages achieve LCP < 2.5 seconds
- NFR5: CLS < 0.1 on all pages
- NFR6: FCP < 2 seconds on simulated 3G connections
- NFR7: All indexed pages pass Core Web Vitals (LCP < 2.5s, FID/INP < 200ms, CLS < 0.1)

#### Security (NFR8-NFR15)
- NFR8: Authentication via email/password and Google sign-in; passwords hashed with bcrypt/argon2
- NFR9: Payment processing entirely via Stripe — no credit card data stored
- NFR10: All data encrypted in transit (TLS 1.2+) and at rest
- NFR11: User account data stored with encryption at rest
- NFR12: Anonymous search sessions generate no persistent user-identifiable data
- NFR13: Email notification triggers stored as anonymized search hashes
- NFR14: Role-based access control for data curator admin access (admin, curator roles)
- NFR15: Regulatory database audit trail is immutable — entries cannot be edited or deleted

#### Scalability (NFR16-NFR20)
- NFR16: System supports 50,000 registered users within 3 months
- NFR17: Response times maintained at 3x average daily traffic (peak seasonal load testing)
- NFR18: Adding a new country requires only data entry — no code changes or schema migrations
- NFR19: Page response times remain within target when total page count doubles
- NFR20: Email system can deliver up to 50,000 notifications within 4 hours

#### Reliability (NFR21-NFR25)
- NFR21: 99.9% uptime for core compliance search (< 8.76 hours downtime/year)
- NFR22: Database maintains integrity during update operations — no partial/corrupted records
- NFR23: Failed queries return clear error messaging, not incorrect data
- NFR24: Email notification delivery achieves 99%+ deliverability
- NFR25: Core search and saved search remain available during database update operations

#### Accessibility (NFR26-NFR30)
- NFR26: WCAG 2.1 AA compliance across all user-facing pages
- NFR27: Compliance status conveyed through text and icons, not color alone
- NFR28: All interactive elements fully keyboard navigable
- NFR29: Screen reader compatible with properly labeled elements
- NFR30: High contrast mode support for compliance status displays

#### Integration (NFR31-NFR35)
- NFR31: Google OAuth 2.0 for authentication
- NFR32: Stripe for subscription management, payment processing, webhook handling
- NFR33: Transactional email provider integration with bounce/complaint handling
- NFR34: Pharmaceutical/supplement database integration (ATC, RxNorm, DrugBank)
- NFR35: SEO infrastructure — crawler compatibility, structured data validation, sitemap compliance

**Total Non-Functional Requirements: 35**

### Additional Requirements & Constraints

- **Legal Positioning:** Informational platform, not legal/medical advisory. All results carry disclaimers.
- **Privacy Architecture:** Stateless — zero personal medication data stored. GDPR/HIPAA sidestepped by design.
- **Stale Data Risk:** Every record carries "last verified" date. Conservative interpretation when ambiguous.
- **AI-Human Verification Model:** AI detects and drafts changes; humans verify before data goes live. No AI-generated content reaches travelers without human approval.
- **Compound Mapping Accuracy:** 99%+ target using ATC, RxNorm, DrugBank databases.
- **Dosage Threshold Precision:** Four-level status model (Legal/Prescription-Only/Restricted/Banned), not binary.
- **Supplement Blind Spot:** Proprietary blends with undisclosed ingredients cannot be reliably verified — system must communicate this limitation explicitly.
- **Biosecurity as Orthogonal Concern:** Modeled as overlay warning, not a fifth status.
- **E&O Insurance:** Should be evaluated before launch.
- **Browser Support:** Modern evergreen browsers, no IE11.
- **Responsive Design:** Mobile-first with breakpoints at 320-768px, 768-1024px, 1024px+.
- **Internationalization:** UI in English at launch; customs cards in 50+ destination languages.
- **Resource Context:** Solo founder with developer friends contributing; AI-assisted tooling leveraged heavily.

### PRD Completeness Assessment

The PRD is comprehensive and well-structured. It includes:
- Clear executive summary and product vision
- 7 detailed user journeys covering B2C, B2B2C, internal, and growth-loop personas
- 68 functional requirements with explicit numbering and phase designation
- 35 non-functional requirements with measurable targets
- Domain-specific requirements addressing regulatory, legal, and technical constraints
- Phased development roadmap (MVP → Growth → Expansion)

## Epic Coverage Validation

### Coverage Matrix

| FR | Requirement Summary | Epic | Status |
|----|-------------------|------|--------|
| FR1 | Search by brand/generic/compound name | Epic 1 | ✓ Covered |
| FR2 | Select destination country | Epic 1 | ✓ Covered |
| FR3 | View compliance status (4-tier) | Epic 1 | ✓ Covered |
| FR4 | View required docs, quantity limits, permits | Epic 1 | ✓ Covered |
| FR5 | View permit lead time requirements | Epic 1 | ✓ Covered |
| FR5a | Optional departure date input | Epic 1 | ✓ Covered |
| FR6 | "You're already too late" warning | Epic 1 | ✓ Covered |
| FR7 | Multi-medication search (paid) | Epic 5 | ✓ Covered |
| FR8 | Source document, link, verified date | Epic 1 | ✓ Covered |
| FR9 | Brand-name decomposition to compounds | Epic 1 | ✓ Covered |
| FR10 | Per-compound regulatory check | Epic 1 | ✓ Covered |
| FR11 | Dosage-threshold classification | Epic 1 | ✓ Covered |
| FR12 | Flag combination meds with controlled ingredients | Epic 1 | ✓ Covered |
| FR13 | "Unable to verify" for unmapped meds | Epic 1 | ✓ Covered |
| FR13a | Proprietary blend warning | Epic 1 | ✓ Covered |
| FR13b | Biosecurity warning flag | Epic 1 | ✓ Covered |
| FR14 | Multi-stop itinerary entry (paid) | Epic 6 | ✓ Covered |
| FR15 | Per-country compliance across itinerary | Epic 6 | ✓ Covered |
| FR16 | Per-country status display in sequence | Epic 6 | ✓ Covered |
| FR17 | Transit country conflict flagging | Epic 6 | ✓ Covered |
| FR17a | Alternative transit hub suggestions (paid) | Epic 6 | ✓ Covered |
| FR18 | Country coverage visibility | Epic 1 | ✓ Covered |
| FR19 | "Not yet covered" messaging | Epic 1 | ✓ Covered |
| FR20 | "Unable to verify" for unmapped meds | Epic 1 | ✓ Covered |
| FR21 | Regulation change email notifications (paid) | Epic 7 | ✓ Covered |
| FR22 | Permit deadline reminders (paid) | Epic 7 | ✓ Covered |
| FR23 | Notification preference management | Epic 7 | ✓ Covered |
| FR24 | Anonymized notification triggers | Epic 7 | ✓ Covered |
| FR25 | Unique indexable page per med-country pair | Epic 2 | ✓ Covered |
| FR26 | Structured data for rich search results | Epic 2 | ✓ Covered |
| FR27 | Dynamic sitemap generation | Epic 2 | ✓ Covered |
| FR28 | Brand/compound canonical URL resolution | Epic 2 | ✓ Covered |
| FR29 | Curator dashboard with flagged changes | Epic 8 | ✓ Covered |
| FR30 | AI-extracted regulatory update review | Epic 8 | ✓ Covered |
| FR31 | Approve/reject/escalate changes | Epic 8 | ✓ Covered |
| FR32 | Notes and annotations on records | Epic 8 | ✓ Covered |
| FR33 | Daily government publication monitoring | Epic 8 | ✓ Covered |
| FR34 | Draft regulatory updates for human review | Epic 8 | ✓ Covered |
| FR35 | Immutable audit trail | Epic 8 | ✓ Covered |
| FR36 | Multi-authority conflict resolution | Epic 1 | ✓ Covered |
| FR37 | Data freshness indicator | Epic 1 | ✓ Covered |
| FR38 | Informational disclaimer | Epic 1 | ✓ Covered |
| FR39 | Source document linking with verification date | Epic 1 | ✓ Covered |
| FR40 | Account creation (email/password + Google) | Epic 4 | ✓ Covered |
| FR41 | Save compliance search to account | Epic 4 | ✓ Covered |
| FR42 | View saved searches list | Epic 4 | ✓ Covered |
| FR43 | Revisit saved search with current results | Epic 4 | ✓ Covered |
| FR44 | Previous snapshot alongside current results | Epic 4 | ✓ Covered |
| FR45 | Change highlighting (saved vs. current) | Epic 4 | ✓ Covered |
| FR46 | Delete saved searches | Epic 4 | ✓ Covered |
| FR47 | Anonymous stateless search (no account) | Epic 1 | ✓ Covered |
| FR48 | Free single-med, single-country search | Epic 1 | ✓ Covered |
| FR49 | Free account with one saved search slot | Epic 5 | ✓ Covered |
| FR50 | Permanently consumed free save slot | Epic 5 | ✓ Covered |
| FR51 | Paid tier upgrade | Epic 5 | ✓ Covered |
| FR52 | Subscription tier management & feature gating | Epic 5 | ✓ Covered |
| FR53 | Institutional screening link (Phase 2) | — | ⏳ Deferred |
| FR54 | Student private medication screening (Phase 2) | — | ⏳ Deferred |
| FR55 | Student confirmation code (Phase 2) | — | ⏳ Deferred |
| FR56 | Admin screening completion rates (Phase 2) | — | ⏳ Deferred |
| FR57 | Attestation document (Phase 2) | — | ⏳ Deferred |
| FR58 | Customs communication card (Phase 2) | — | ⏳ Deferred |
| FR59 | Offline customs card (Phase 2) | — | ⏳ Deferred |
| FR60 | Shareable risk card generation | Epic 3 | ✓ Covered |
| FR61 | Risk card export and social sharing | Epic 3 | ✓ Covered |
| FR62 | "Save for my next trip" email capture | Epic 3 | ✓ Covered |
| FR63 | Destination-only email subscriptions | Epic 3 | ✓ Covered |
| FR64 | Debunking landing pages | Epic 2 | ✓ Covered |

### Missing Requirements

No MVP functional requirements are missing from epic coverage. All 61 Phase 1 FRs are mapped to epics.

**Phase 2 Deferred FRs (by design):**
- FR53-FR57 (Institutional Screening / B2B2C) — explicitly deferred in PRD to Phase 2
- FR58-FR59 (Customs Communication Card) — explicitly deferred in PRD to Phase 2

These 7 Phase 2 FRs are correctly excluded from the epic breakdown. The PRD notes that institutional sales pipeline work begins in Phase 1 but the technical build is Phase 2.

### Coverage Statistics

- Total PRD FRs: 68
- Phase 1 MVP FRs: 61
- Phase 2 Deferred FRs: 7
- FRs covered in epics: 61 / 61 MVP
- **MVP Coverage: 100%**

## UX Alignment Assessment

### UX Document Status

**Found:** `ux-design-specification.md` (116,395 bytes) — comprehensive spec with 39 UX Design Requirements (UX-DR1 through UX-DR39), component specifications, design system tokens, accessibility patterns, and journey flows.

### UX ↔ PRD Alignment

**Aligned:**
- All 6 MVP user journeys (Emma, Marcus, Priya, Lina, Jae, Amara) have corresponding UX flows
- 61 MVP functional requirements have supporting UX component/pattern specifications
- Design system supports all four compliance statuses with triple-encoding (color + icon + text)
- Freemium paywall placement principle aligns with PRD (gates capability, never information)

**Issues Found:**

1. **Journey 1 (Emma) customs card inconsistency** — UX spec Journey 1 flow diagram shows customs card generation ("downloads custom card to phone in Arabic"), but customs card (FR58-59) is explicitly deferred to Phase 2 in the PRD. Appears to be a copy-paste artifact from the user journey narrative rather than an intentional MVP inclusion. UX spec correctly defers customs card elsewhere.

2. **Admin dashboard phase conflict** — PRD states Amara's journey is "full journey (founder as Amara initially)" in MVP, meaning the curator verification workflow (FR29-35) is MVP. However, the UX spec's Component Implementation Roadmap places admin components (ChangeQueueItem, VerificationDetailView, DataFreshnessIndicator) in Phase 3. This creates a gap: the curator workflow is MVP, but its UX is deferred.

3. **David's journey (B2B2C) absent from UX** — No wireflows, component specs, or journey diagram for institutional screening. Correctly Phase 2 per PRD, so not a blocker, but institutional sales pipeline begins in Phase 1 — any demo or mockup work would need UX guidance.

4. **Journey numbering differs** — PRD and UX spec number journeys differently (PRD Journey 5 = Amara, UX Journey 6 = Amara). Minor documentation inconsistency; no functional impact.

5. **Search submission behavior is internally inconsistent in UX spec** *(from Cursor report)* — One UX section states search executes immediately on country selection with no submit button needed, while multiple later sections require explicit "Check" button submission with intentional user control (UX-DR3). The PRD, architecture, epics, and most of the UX document align on explicit "Check" button submission. The contradictory section should be corrected.

6. **"Send results to my email" appears in UX but not in PRD or architecture** *(from Cursor report)* — The UX journeys and post-result action model include a lightweight "send results to email" action, but this capability has no corresponding FR in the PRD and no mapping in the architecture. This is a scope/traceability mismatch — either add it as a formal requirement or remove it from the UX spec.

7. **Apple sign-in in UX but not planned in architecture** *(from Cursor report)* — The UX account creation flow mentions Google and Apple social login, while the PRD (FR40) and architecture only commit to Google OAuth plus email/password. Apple sign-in should be explicitly added to scope or removed from UX to prevent implementation drift.

### UX ↔ Architecture Alignment

**Aligned (85-90%):**
- All interactive components (MedicationAutocomplete, CountrySelector, ItineraryBuilder, ShareDialog, PaywallModal) mapped as Client Components
- All display components (ComplianceStatusBadge, ComplianceResultCard, SourceCitation) mapped as Server Components
- Responsive design breakpoints, mobile-first strategy, and 48px touch targets documented
- shadcn/ui + Radix primitives provide built-in keyboard nav and ARIA support

**Gaps Found:**

1. **No performance instrumentation strategy** — Architecture assumes Next.js defaults are sufficient for LCP/CLS/FCP targets but doesn't document Real User Monitoring, bundle analysis, or performance budget enforcement. Risk of discovering performance issues late.

2. **Missing `prefers-reduced-motion` pattern** — UX-DR27 requires reduced-motion support; architecture doesn't document implementation approach.

3. **No offline/PWA patterns for Phase 2 customs cards** — When customs cards (FR58-59) are built in Phase 2, they need offline access at airports/borders. Architecture has no reserved decision space for Service Worker or offline-first patterns.

4. **ISR cache race condition** — No handling documented for the window between curator approval and ISR cache invalidation. A traveler could briefly see stale data. Low severity, but unaddressed.

5. **Schema.org structured data not fully specified** *(from Cursor report)* — Architecture references structured data for rich search results (FR26) but doesn't detail which Schema.org types/properties to implement. Non-blocking but will require implementation-time decisions.

6. **Canonical URL resolution behavior not fully decided** *(from Cursor report)* — Architecture mentions canonical URLs for brand/compound name variations (FR28) but the specific resolution strategy (brand → compound or compound → brand) is unresolved.

7. **"Save for my next trip" data model not explicitly defined** *(from Cursor report)* — The email capture + destination list storage for discovery-mode users (FR62-63) has no explicit data model in the architecture. Implementation will need to design this.

### Warnings

| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Medium | Admin/curator UX deferred to Phase 3 but workflow is MVP | Create minimal curator UI spec for MVP — even a basic admin page needs UX guidance |
| Low | Journey 1 diagram shows Phase 2 customs card | Remove customs card from Journey 1 UX flow to avoid implementation confusion |
| Low | Journey numbering inconsistency between PRD and UX | Align numbering in one document or add cross-reference mapping |
| Low | No performance monitoring architecture | Add RUM/performance budget strategy before implementation |
| Low | No prefers-reduced-motion pattern documented | Add to architecture accessibility section |
| Medium | UX search submission behavior contradiction | Correct the auto-submit section to match the "Check" button pattern used everywhere else |
| Medium | "Send results to my email" in UX but not in PRD/architecture | Add as FR or remove from UX spec |
| Medium | Apple sign-in in UX but only Google OAuth in PRD/architecture | Normalize across all three documents |
| Low | Schema.org structured data types unspecified | Define before Epic 2 implementation |
| Low | Canonical URL resolution strategy undecided | Decide brand→compound or compound→brand before Epic 2 |
| Low | "Save for my next trip" data model missing | Define before Epic 3 Story 3.3 implementation |

## Epic Quality Review

### Best Practices Compliance Checklist

| Epic | User Value | Independent | Stories Sized | No Forward Deps | DB When Needed | Clear ACs | FR Traceability |
|------|-----------|-------------|---------------|-----------------|----------------|-----------|-----------------|
| Epic 1 | Partial | ✓ Yes | ✗ Oversized | ✗ Issues | ✗ Upfront | Partial | ✓ Yes |
| Epic 2 | ✗ Technical | ✗ Requires E1 | ✓ OK | ✓ OK | N/A | ✓ OK | ✓ Yes |
| Epic 3 | Partial | ✗ Partially requires E1 | ✓ OK | ✗ Issues | N/A | ✓ OK | ✓ Yes |
| Epic 4 | ✓ Yes | ✗ Forward dep on E5 | ✓ OK | ✗ Circular | ✗ Issues | Partial | ✓ Yes |
| Epic 5 | ✗ Dev-focused | ✓ Yes (needs E1,E4) | ✓ OK | ✓ OK | N/A | Partial | ✓ Yes |
| Epic 6 | ✓ Yes | ✓ Yes (needs E1) | ✓ OK | ✓ OK | N/A | Partial | ✓ Yes |
| Epic 7 | ✓ Yes | ✗ Requires E8 | ✓ OK | ✗ Forward dep | ✗ In ACs | ✓ OK | ✓ Yes |
| Epic 8 | ✓ Yes (curator) | ✓ Yes | ✗ 8.1 oversized | ✗ Circular w/ E7 | ✗ In ACs | Partial | ✓ Yes |

### Critical Violations

**CV1: Epic 7 ↔ Epic 8 Circular Dependency**
Story 7.1 states "When a curator approves a regulatory change (from Epic 8)" — notification dispatch requires the curator approval workflow from Story 8.3 to exist. Simultaneously, Story 8.3 states it "dispatches regulation change emails via Trigger.dev (from Story 7.1)." This creates a circular dependency where neither epic can be completed without the other.
- **Impact:** Implementation ordering is broken. Neither epic can be built in isolation.
- **Recommendation:** Decouple by having Story 8.3 emit a generic event (e.g., `regulation.approved`), and Story 7.1 subscribes to that event. Build the event emission in Epic 8 and the subscription in Epic 7, with a stub/no-op listener until Epic 7 is implemented.

**CV2: Epic Titles Describe Features, Not User Outcomes**
All 8 epics are named after features or technical capabilities rather than user outcomes:
- "Core Medication Compliance Search" → should be "Travelers get instant medication safety answers"
- "SEO-Optimized Compliance Pages" → should be "Travelers discover Check Orbit through Google"
- "Social Sharing & Discovery Capture" → should be "Travelers share medication warnings virally"
- **Impact:** Teams may lose sight of user value during implementation.
- **Recommendation:** Rename all epics to describe what the user can achieve, not what the system does.

**CV3: Story 8.1 (AI Regulatory Monitoring Pipeline) Is Epic-Sized**
Story 8.1 bundles multi-country orchestration, PDF extraction, LLM processing, compound mapping, staging table writes, and pipeline error handling into a single story. This is infrastructure-heavy work spanning 5+ days minimum.
- **Recommendation:** Split into: 8.1a (pipeline scaffold + single-country scan), 8.1b (multi-country orchestration + confidence scoring), 8.1c (compound mapping + staging writes).

**CV4: Stories 1.1 and 1.2 Are Oversized**
Story 1.1 bundles 13 distinct setup tasks (Next.js, shadcn/ui, Prisma, Clerk, Stripe, Resend, Upstash, Sentry, Trigger.dev, Tailwind tokens, env, CI, Vercel deploy). Story 1.2 creates ALL database tables upfront (Country, Medication, Compound, Regulation, StagingRegulation, AuditTrail, seed data, Neon branching).
- **Impact:** 1.1 is 3-5 days of work in one story. 1.2 violates "create tables when first needed."
- **Recommendation:** Split 1.1 into scaffold + dependency setup + CI/deploy. Split 1.2 into core schema (Country, Medication, Compound, Regulation) + staging/audit (deferred to Epic 8) + seeding.

### Major Issues

**MJ1: Story 1.4 Forward Dependency on Email Service**
Story 1.4 (Medication Autocomplete) includes an AC: "when no match is found, show email capture field" — but the email infrastructure (Resend integration) isn't built until Story 3.3. Story 1.4 cannot fully complete this AC.
- **Recommendation:** Defer the email capture AC to Story 3.3 or stub the email input as UI-only without backend in 1.4.

**MJ2: Stories 1.8 ↔ 1.9 Circular Dependency**
Story 1.8 (Homepage) adds an "optional departure date prompt" and stores it in URL state. Story 1.9 (Permit Lead Time Alerts) consumes that date. But Story 1.8's date input only makes sense if 1.9 uses it, and 1.9 assumes 1.8 has already implemented it. Ownership of the date input UX is unclear.
- **Recommendation:** Consolidate departure date input and its consumption into one story, or clearly define 1.8 as the owner of the input and 1.9 as the consumer.

**MJ3: Story 1.10 References Schema Fields Not in Story 1.2**
Story 1.10 (Biosecurity Warnings) requires proprietary blend detection, but the Medication model in Story 1.2 has no `proprietaryBlend` or `disclosureLevel` field.
- **Recommendation:** Add supplement classification fields to Story 1.2 schema, or add a schema migration AC to Story 1.10.

**MJ4: Story 4.1 ↔ 4.2 Circular Dependency**
Story 4.1 (Saved Searches Dashboard) needs the SavedSearch model to display saved searches, but Story 4.2 (Save Compliance Search) is where the SavedSearch table is created.
- **Recommendation:** Reorder so 4.2 (save action + model creation) precedes 4.1 (dashboard display), or move model creation to 4.1.

**MJ5: Story 5.1 Written from Developer Perspective**
Story 5.1 reads "As a developer, I want Stripe subscription infrastructure..." — this is a technical milestone, not user value.
- **Recommendation:** Reframe as "As a traveler, I want to upgrade to a paid plan so I can access multi-medication search and layover trap."

**MJ6: Story 1.6 Multi-Authority Conflict Logic Underspecified**
AC says "when two or more regulatory authorities publish conflicting rules, apply most restrictive" but the Regulation schema in Story 1.2 doesn't model multiple authorities per compound-country pair. Implementation would require schema changes.
- **Recommendation:** Either add a `regulatoryAuthority` field allowing multiple records per compound-country, or document the resolution approach.

**MJ7: Multiple Stories Embed DB Schema Definitions in Acceptance Criteria**
Stories 7.1, 7.2, 8.1, 8.2 include Prisma model definitions within ACs (e.g., "NotificationSubscription stores..."). Schema specifications should be in the data model story, not scattered across feature stories.
- **Recommendation:** Centralize all schema additions in dedicated data model stories or in Story 1.2 extensions.

**MJ8: Epic 4 → Epic 5 Forward Dependency** *(from Cursor report)*
Epic 4's saved-search implementation assumes free-tier slot consumption and paywall behavior (e.g., "free save slot is permanently consumed") that is only defined in Epic 5. This means Epic 4 cannot be fully completed without Epic 5's tier logic existing.
- **Recommendation:** Move free-tier slot logic and paywall gating entirely into Epic 5. Keep Epic 4 focused on save/list/revisit/compare mechanics without tier awareness.

**MJ9: Missing Error Conditions Across Multiple Stories**
- Story 1.4: No AC for API timeout or 500 response
- Story 6.2: No AC for invalid itinerary, non-existent medication, or rate limit
- Story 5.1: No AC for getUserTier() failure
- **Recommendation:** Add error scenario ACs to each affected story.

### Minor Concerns

| # | Story | Issue |
|---|-------|-------|
| 1 | 1.6 | "Dosage-threshold classification is applied" — no algorithm or threshold source specified |
| 2 | 1.7 | ComplianceResultCard bundles 10+ sub-components — borderline oversized |
| 3 | 1.8 | Responsive layout specs in ACs are implementation details, not testable behaviors |
| 4 | 4.3 | "Compares current result against saved snapshot" — no definition of what counts as a "change" |
| 5 | 7.3 | Vague UI state management for notification toggles |
| 6 | 8.2 | Keyboard navigation details are vague ("Enter to open detail") |
| 7 | 8.3 | "Conservative interpretation" is undefined — needs explicit criteria |
| 8 | Multiple | Several ACs use "Then a [model/component] exists" instead of behavioral Given/When/Then |

### Dependency Map Summary

```
Epic 1 (Core Search) ← Independent, foundation for all others
  ├── Epic 2 (SEO Pages) ← Depends on E1
  ├── Epic 3 (Social Sharing) ← Stories 3.1-3.2 depend on E1; Story 3.3 independent
  ├── Epic 4 (Accounts & Saves) ← Depends on E1
  │     └── Epic 5 (Freemium) ← Depends on E1, E4; E4 also forward-deps on E5 ⚠️
  ├── Epic 6 (Layover Trap) ← Depends on E1
  ├── Epic 7 (Notifications) ← Depends on E1, E4; BLOCKED by E8 ⚠️
  └── Epic 8 (Data Pipeline) ← Independent; CIRCULAR with E7 ⚠️
```

### Quality Statistics

- **Critical Violations:** 4
- **Major Issues:** 9 (includes 1 from Cursor report)
- **Minor Concerns:** 8
- **Total Epic/Story Findings:** 21

## Summary and Recommendations

### Overall Readiness Status

**NEEDS WORK**

The planning artifacts for Check Orbit are comprehensive and demonstrate strong product thinking. Requirements coverage is excellent — 100% of MVP functional requirements are mapped to epics, all four core documents exist, and the PRD-to-epic traceability is complete. However, the epic and story structure has 4 critical violations and 9 major issues that will cause implementation friction if not addressed. The UX spec also has 3 scope contradictions with the PRD/architecture that need normalization. These are structural problems in how work is organized, not gaps in what needs to be built.

*Note: This report incorporates unique findings from a parallel Cursor-based assessment, marked with "(from Cursor report)" where applicable.*

### Scorecard

| Assessment Area | Score | Notes |
|----------------|-------|-------|
| Document Completeness | **Excellent** | All 4 required documents present, no duplicates |
| PRD Quality | **Excellent** | 68 FRs + 35 NFRs, well-structured, phased roadmap |
| FR Coverage | **Excellent** | 100% MVP coverage (61/61 FRs mapped to 8 epics) |
| UX Alignment | **Good** | 85-90% aligned; 3 scope contradictions + phase conflicts |
| Epic Structure | **Needs Work** | 4 critical violations in dependency ordering and sizing |
| Story Quality | **Needs Work** | 9 major issues in ACs, dependencies, and schema placement |

### Critical Issues Requiring Immediate Action

**1. Break the Epic 7 ↔ Epic 8 Circular Dependency (Highest Priority)**
Epic 7 (Notifications) cannot be built without Epic 8 (Curator Dashboard), and Epic 8's approval flow triggers Epic 7's notification dispatch. Decouple by introducing an event-based pattern: Epic 8 emits `regulation.approved` events; Epic 7 subscribes to them. Build the event emission in Epic 8 first, with a no-op listener until Epic 7 is implemented.

**2. Split Oversized Stories (Stories 1.1, 1.2, 8.1)**
These three stories each contain 3-5 days of work spanning multiple concerns. Story 1.1 (project init) bundles 13 setup tasks. Story 1.2 (database schema) creates all tables upfront instead of when first needed. Story 8.1 (AI pipeline) is infrastructure spanning PDF extraction, LLM processing, compound mapping, and multi-country orchestration. Split each into 2-3 focused stories.

**3. Resolve Forward Dependencies (Stories 1.4, 1.8/1.9, 1.10, 4.1/4.2)**
Four story pairs have circular or forward dependencies:
- 1.4 references email service not built until Story 3.3
- 1.8 and 1.9 have unclear ownership of departure date input
- 1.10 needs schema fields not in 1.2
- 4.1 displays data from a model created in 4.2

**4. Normalize UX Scope Against PRD and Architecture** *(from Cursor report)*
Three UX features have no PRD/architecture backing: (a) search auto-submit behavior contradicts the "Check" button pattern, (b) "Send results to my email" has no FR, (c) Apple sign-in is not in the architecture. Decide on each and update all three documents to match.

**5. Resolve Epic 4 → Epic 5 Forward Dependency** *(from Cursor report)*
Epic 4's saved-search stories assume free-tier slot consumption and paywall behavior defined only in Epic 5. Move tier logic out of Epic 4 entirely.

**6. Reframe Developer-Focused Stories as User Value**
Story 5.1 ("As a developer, I want Stripe infrastructure...") and several epic titles describe technical milestones rather than user outcomes. Reframe to maintain user-value focus throughout.

### Recommended Next Steps

1. **Fix the E7/E8 circular dependency** — This is the single highest-impact fix. Define an event contract between the two epics so they can be built independently. ~30 minutes of document revision.

2. **Split Stories 1.1, 1.2, and 8.1** — Break each into 2-3 independently completable stories. Move StagingRegulation and AuditTrail schema from Story 1.2 to Epic 8. ~1 hour of document revision.

3. **Resolve the 5 forward dependency pairs** — For each pair (1.4/3.3, 1.8/1.9, 1.10/1.2, 4.1/4.2, E4/E5 tier logic), either reorder stories, move ACs to the correct story, or add missing schema fields. ~1 hour of document revision.

3b. **Normalize UX spec against PRD and architecture** — Fix the search submit contradiction, decide on "Send results to my email" (add FR or remove from UX), and decide on Apple sign-in (add to architecture or remove from UX). ~30 minutes.

4. **Add missing error condition ACs** — Stories 1.4, 5.1, 6.2, and others lack error scenario coverage. Add timeout, validation failure, and rate limit ACs. ~30 minutes.

5. **Rename epic titles to user outcomes** — Quick pass to reframe all 8 epic titles from feature descriptions to user-value statements. ~15 minutes.

6. **Create minimal curator UI spec for MVP** — The UX spec defers admin components to Phase 3 but the curator workflow (FR29-35) is MVP. At minimum, add wireframes for the curator dashboard. ~1-2 hours of UX work.

### What's Working Well

- **Requirements traceability is excellent** — every FR maps to an epic, every epic cites its FRs
- **Phase 2 scope boundary is clean** — 7 FRs correctly deferred, no scope ambiguity
- **Acceptance criteria are detailed** — most stories have proper Given/When/Then format with specific, testable conditions
- **Architecture and UX are well-aligned** — shadcn/ui component mapping, responsive strategy, and accessibility patterns are consistent across documents
- **Domain complexity is well-managed** — the four-status compliance model, biosecurity overlay, and compound decomposition are thoughtfully modeled across all artifacts

### Final Note

This merged assessment identified **33 issues** across **5 assessment areas** (4 critical, 9 major, 8 minor epic/story violations + 12 UX/architecture alignment warnings). This report incorporates unique findings from a parallel Cursor-based assessment to provide comprehensive coverage. The planning artifacts are substantively strong — the product vision, requirements, and technical architecture are thorough and well-considered. The issues found are structural (how work is organized into stories, scope contradictions between documents) rather than substantive (what needs to be built). Addressing the critical and major issues is estimated at **4-5 hours of document revision** and will significantly reduce implementation friction. The project can proceed to implementation after these fixes, or the team may choose to accept certain risks and address them during development.

**Assessment completed:** 2026-04-02
**Assessor:** Implementation Readiness Workflow (BMAD)
**Report:** `_bmad-output/planning-artifacts/implementation-readiness-report-2026-04-02.md`
