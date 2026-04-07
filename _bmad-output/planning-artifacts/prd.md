---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
productName: 'Check Orbit'
inputDocuments: ['_bmad-output/brainstorming/brainstorming-session-2026-03-25-1800.md']
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: web_app
  domain: travel_health_compliance
  complexity: high
  projectContext: greenfield
---

# Product Requirements Document - Check Orbit

**Author:** Trish
**Date:** 2026-03-25

## Executive Summary

Travel medication compliance is an unowned problem. No actor in the travel ecosystem — airlines, travel agents, doctors, pharmacists, employers, or insurers — takes responsibility for informing travelers whether their medications are legal at their destination. The visible consequence — a traveler detained at customs — is rare and dramatic. The invisible problem is far larger: thousands of travelers silently skip their medication rather than risk bringing it across borders. They never get detained, never make headlines, but suffer through impaired performance, anxiety episodes, unmanaged pain, and health consequences throughout their trips. Between the panic of last-minute discovery and the quiet suffering of going without, no one is solving either problem.

Check Orbit is a web application that gives travelers instant, verified compliance answers for any medication, supplement, or vitamin-destination pair. A traveler enters their product and destination country; the platform decomposes it to its active compounds and ingredients, cross-references each against a structured regulatory database, and returns a clear status — Legal, Prescription-Only, Restricted, or Banned — with required documentation, quantity limits, permit lead times, and biosecurity warnings where applicable.

**B2C:** Travelers spend time planning their trip, not worrying about their meds. Speed and confidence replace hours of anxious, unreliable research.

**B2B2C:** Organizations with duty-of-care obligations — universities, corporate travel programs, insurers, travel management companies — embed the platform as a privacy-safe compliance layer into existing workflows. Travelers self-screen without disclosing health data; organizations get proof they provided the screening and eliminate hidden medication liability exposure.

### What Makes This Special

The core moat is a structured, compound-first regulatory database that no one has built. Medication and supplement import regulations exist as unstructured legal text in local languages across fragmented government agencies — health ministries, customs authorities, drug enforcement, agricultural biosecurity agencies. Whoever aggregates, structures, and maintains this dataset first owns an asset that is extraordinarily expensive to replicate. The platform is a confidence product, not an information product — the value is verified certainty with source citations, not raw data a traveler could theoretically find on Google. The killer differentiator is the layover trap: automatic detection of medication conflicts at transit countries, something no search engine can replicate without structured multi-country cross-referencing. The stateless privacy architecture — never storing personal medication data — turns a potential liability into a competitive advantage.

### MVP Scope at a Glance

**In MVP (Phase 1):** Core compliance search, ingredient decomposition (medications and supplements), layover trap (manual entry), permit lead time alerts, multi-medication search, source citations, biosecurity warning flags, SEO-optimized pages, shareable risk cards, send results to email, "save for my next trip" email capture, debunking landing pages, email notifications, user accounts, saved searches, freemium model, regulatory database (top 50 countries), AI monitoring with human verification.

**Deferred to Phase 2:** Customs communication card, university/institutional screening workflow, admin dashboard for institutions, itinerary file upload/parsing, compliance certificates, B2B2C API layer, wallet pass integration.

**Deferred to Phase 3:** Emergency detention hotline, telemedicine connection, government co-branded certificates, certified travel agent program, anonymized search intelligence product.

## Project Classification

- **Project Type:** Web Application
- **Domain:** Travel Health Compliance (pharmaceutical regulatory data + international travel compliance)
- **Complexity:** High — multi-country regulatory fragmentation, compound-level drug classification, enforcement-vs-legal-status gaps, multi-authority conflicts within countries, evolving international regulations
- **Project Context:** Greenfield

## Success Criteria

### User Success

- Traveler receives complete compliance status (Legal/Prescription-Only/Restricted/Banned per active compound) within 20 seconds of search
- Travelers with multi-stop itineraries get every transit and layover country flagged for medication conflicts — eliminating the "I didn't know my layover was a problem" scenario
- Users report confidence replacing anxiety — the product delivers certainty, not just information
- Travelers who would have silently skipped medication instead travel with their meds confidently

### Business Success

- 50,000 registered users within first 3 months of launch — driven by organic social content (TikTok/Meta) generating branded search volume and backlinks that accelerate SEO authority, SEO-optimized medication-country pages capturing high-intent search demand, and PR/media outreach around traveler safety stories
- At least one university B2B2C pilot in active conversation within 3 months — institutional partnerships pursued in parallel with B2C growth as a dual-channel strategy
- Repeat usage rate indicating travelers return for subsequent trips (target: 30%+ returning within 6 months) — supported by saved search snapshot comparison (Lina's journey), email notifications on regulation changes, and freemium-to-paid conversion triggers

### Technical Success

- Compound-first regulatory database covering top 50 destination countries at launch
- Ingredient decomposition engine accurately maps brand-name medications to active compounds with correct dosage-threshold classification
- Sub-20-second end-to-end response time from search to full compliance result including multi-stop itinerary analysis
- Stateless privacy architecture — zero personal medication data stored
- Source citation chain: every regulation links to its source document with "last verified" date

### Measurable Outcomes

- Time to compliance answer: < 20 seconds
- Country coverage at launch: top 50 destinations (~90% of international travel)
- Compound decomposition accuracy: 99%+ for covered medications
- Zero personal health data retained post-session for anonymous users; account holders store only search parameters and result snapshots they explicitly choose to save

## User Journeys

### Journey 1: Calm Planner — Emma's First International Trip

**Emma, 28, first-time international traveler.** She takes sertraline (Zoloft) daily for anxiety and has a trip to Dubai in 3 weeks. She's excited but her mom texted her "make sure your meds are okay over there."

**Opening Scene:** Emma Googles "can I bring Zoloft to Dubai" and gets conflicting forum posts from 2019, an expired government PDF, and a Reddit thread that terrifies her. She doesn't know if sertraline is the same as Zoloft, doesn't know UAE has a specific import permit process, and has no idea who to trust.

**Rising Action:** Emma finds Check Orbit. She types "Zoloft" and selects "United Arab Emirates." The platform instantly decomposes Zoloft to its active compound (sertraline), checks sertraline against UAE regulations, and returns a clear status: **Restricted — permit required.** The result shows: UAE Ministry of Health requires advance approval, apply minimum 2 weeks before travel, bring original prescription, maximum 3-month supply. Source: UAE MOH Circular 2024, last verified 2026-03-10.

**Climax:** Emma sees the permit lead time warning — she has exactly enough time if she applies this week. The platform generates a customs communication card in Arabic with her medication details, legal status, and prescription confirmation. She downloads it to her phone.

**Resolution:** Emma lands in Dubai with her permit approval, her Arabic customs card, and zero anxiety about her anxiety medication. She tells three friends about Check Orbit before her trip is over.

**Requirements revealed:** Core search, compound decomposition, permit lead time alerts, customs card generation, source citations with verification dates, multi-language output.

### Journey 2: Panic Gap — Marcus's Friday Nightmare

**Marcus, 42, occasional business traveler.** He takes methylphenidate (Ritalin) for ADHD and oxycodone as needed for a chronic back injury. He just got told Thursday afternoon he's flying to Tokyo Monday morning.

**Opening Scene:** Marcus vaguely remembers hearing Japan is strict about medications. It's Friday 4:47 PM. His doctor's office closes in 13 minutes. He has the weekend to figure this out or skip his meds for a week-long trip.

**Rising Action:** Marcus opens Check Orbit and enters both medications with "Japan." Within seconds he sees: Methylphenidate — **Banned.** Japan prohibits all stimulants including methylphenidate regardless of prescription. Oxycodone — **Restricted.** Allowed with advance Yakkan Shoumei (medication import certificate) from Japan's Ministry of Health, Labour and Welfare. Minimum 2-week processing time.

**Climax:** The oxycodone permit requires more lead time than Marcus has. But the critical discovery is the methylphenidate ban — there is no permit, no workaround, no exception. If Marcus had packed his Ritalin without checking, he could have faced detention and criminal charges at Narita.

**Resolution:** Marcus calls his doctor before the office closes, gets guidance on managing without Ritalin for the trip, and learns he can't bring the oxycodone this time either. Check Orbit didn't solve his problem — it prevented a catastrophe. He arrives in Tokyo without his medications but also without a criminal record. His company purchases a team account the following week.

**Requirements revealed:** Multi-medication search, clear banned vs. restricted distinction, lead time warnings that communicate "you're already too late," emotional design that delivers bad news clearly without causing additional panic.

### Journey 3: Layover Trap — Priya's Hidden Risk

**Priya, 35, travels twice a year.** She takes codeine-containing migraine medication (prescribed, completely legal in the UK and Australia). She's booked London to Sydney with a 6-hour layover in Dubai.

**Opening Scene:** Priya has traveled this route before with no issues. She's checked her meds for Australia — no problems. She hasn't thought about Dubai because she's not "going to" Dubai, she's just passing through.

**Rising Action:** Priya enters her itinerary into Check Orbit — London → Dubai → Sydney. The platform flags her medications for each country in sequence. UK: Legal. Australia: Legal. Then the alert: **Dubai (transit) — Banned.** Codeine is a controlled substance in the UAE. Even in transit, luggage can be inspected and medications in carry-on are subject to UAE law.

**Climax:** Priya stares at the screen. She's flown this route twice before carrying codeine through Dubai and never knew she was committing a crime. The platform shows her the UAE regulation, the source, and the verification date. This isn't a forum rumor — it's cited law.

**Resolution:** Priya rebooks through Singapore (codeine: Legal with prescription) and downloads customs cards for both Singapore and Australia. She shares Check Orbit with her entire travel group chat. The layover trap feature just justified the product's existence.

**Requirements revealed:** Itinerary parsing with transit country extraction, multi-country sequential compliance check, transit-specific regulatory rules, rebooking awareness (showing which alternative hubs are safe), visual itinerary timeline with per-country status.

### Journey 4: University Admin — David's Pre-Departure Problem

**David, 51, study abroad director at a mid-size university.** He sends 400 students to 23 countries annually. Last year a student was detained in South Korea for 6 hours over ADHD medication. The university's legal counsel is now requiring a medication compliance screening process — but FERPA and health privacy laws mean David can't ask students what medications they take.

**Opening Scene:** David is in a meeting with the university's risk management team. They want a solution by next semester. David has been manually Googling medication rules country by country and building spreadsheets. It's incomplete, possibly inaccurate, and takes him 40+ hours per semester.

**Rising Action:** David discovers Check Orbit's institutional model. He embeds a link in the pre-departure checklist that every study abroad student must complete. Students click through, enter their own medications privately, and check against their destination country. The platform returns compliance results directly to the student — David never sees what medications they take.

**Climax:** The student completes the screening and receives a confirmation code. David's system records that the student completed the medication compliance check — not what they checked, just that they did it. The university now has documented proof they provided the screening, satisfying duty-of-care requirements without violating health privacy.

**Resolution:** David replaces 40 hours of manual research with a self-service tool. The university's legal team signs off. Zero detention incidents in the following academic year. David presents the solution at the Forum on Education Abroad conference and three peer institutions ask for introductions.

**Requirements revealed:** Institutional workflow integration, privacy-safe confirmation system (completion proof without health data disclosure), bulk country coverage reporting for institutional planning, admin dashboard showing screening completion rates (not medication data).

### Journey 5: Data Curator — Amara's Verification Workflow

**Amara, 30, regulatory data analyst on the Check Orbit team.** She manages the accuracy and freshness of the regulatory database across 50 countries. The AI monitoring system has flagged 12 potential regulatory changes this week.

**Opening Scene:** Amara opens her dashboard Monday morning. The AI monitoring layer has scanned government gazette publications, health ministry announcements, and customs authority updates across all covered countries overnight. 12 items flagged: 3 high-confidence changes, 5 medium-confidence, 4 low-confidence (likely false positives).

**Rising Action:** Amara starts with the high-confidence flags. Thailand's FDA has published a new controlled substances schedule reclassifying tramadol. The AI has extracted the relevant text, translated it from Thai, identified the affected compounds, and drafted an update to the database record — but it's marked "AI-drafted, pending human verification." Amara reads the source document (linked), confirms the AI's interpretation, verifies the effective date, and approves the change. The database record updates with "Verified by Amara, 2026-03-25, Source: Thai FDA Gazette Vol. 143."

**Climax:** One of the medium-confidence flags is ambiguous — Indonesia's BPOM published a circular that could be interpreted two ways regarding benzodiazepine import limits. Amara flags it for escalation, adds a note to the record ("Regulatory language ambiguous — conservative interpretation applied, monitoring for clarification"), and adjusts the traveler-facing guidance to reflect the stricter interpretation until clarified.

**Resolution:** By end of day, Amara has processed all 12 flags — 7 confirmed updates, 3 dismissed as false positives, 2 flagged for follow-up. Every change has a human verification stamp, source citation, and verification date. The database is current, auditable, and honest about its own uncertainty.

**Requirements revealed:** AI monitoring and change detection pipeline, human verification workflow with approval/reject/escalate actions, source document linking and citation management, confidence indicators on AI-extracted data, audit trail for all database changes, ambiguity handling with conservative defaults.

### Journey 6: Returning User — Lina's Regulation Shift

**Lina, 31, frequent traveler with a free Check Orbit account.** She takes lamotrigine (Lamictal) for bipolar disorder and travels to Thailand twice a year for work. Six months ago she ran a compliance check, saved the result, and flew without issues.

**Opening Scene:** Lina is planning her next trip to Bangkok. She logs back into Check Orbit and opens her saved search for lamotrigine + Thailand.

**Rising Action:** The platform regenerates the compliance result from the current database and compares it against her saved snapshot. A change indicator appears: **Regulation Updated.** Thailand's FDA reclassified lamotrigine import documentation requirements — previously no permit needed, now a prescription translation is required. The change is highlighted with the old status, new status, effective date, and source citation.

**Climax:** Lina sees the change happened two months ago. She also has an unread email notification — Check Orbit had alerted her when the regulation changed, but she missed it. The saved search comparison makes the change unmistakable. She now has 3 weeks to get her prescription translated before departure.

**Resolution:** Lina updates her travel preparation, gets the translation, and flies with confidence. She upgrades to the paid tier to unlock multi-medication search and layover trap for a more complex trip she's planning next quarter. She tells a colleague about the regulation-change alert — "it caught something I would have missed."

**Requirements revealed:** User accounts, saved search with snapshot comparison, regulation-change highlighting, email notification for regulatory changes, returning-user re-check workflow, freemium-to-paid conversion trigger, SEO-driven initial discovery (Lina originally found Check Orbit via search).

### Journey 7: Social Discovery — Jae's TikTok Rabbit Hole

**Jae, 24, casual international traveler.** He takes melatonin nightly for sleep and occasionally uses CBD gummies for anxiety. He's not planning a trip right now but follows travel content on TikTok.

**Opening Scene:** Jae is scrolling TikTok at 11 PM and sees a Check Orbit risk card — a bold graphic showing "Melatonin → PRESCRIPTION ONLY in Germany 🇩🇪" — shared by a travel creator with the caption "things that will get you stopped at customs." He's surprised. Melatonin is on his nightstand. He didn't know it was restricted anywhere.

**Rising Action:** He taps the link in the creator's bio and lands on the Check Orbit melatonin + Germany compliance page. The result confirms it: melatonin is classified as a medicinal product in Germany and requires a prescription. Source citation links to the German Federal Institute for Drugs and Medical Devices. He thinks about his CBD gummies and runs a second search — CBD + Germany. **Banned.** He runs CBD + Japan out of curiosity. **Banned.** CBD + Thailand. **Banned.** Each result has a shareable risk card. He screenshots the CBD + Japan card and sends it to a group chat: "bro anyone else know about this?"

**Climax:** Jae isn't traveling anywhere soon, but now he's genuinely rattled about his CBD gummies. He sees the "Save for my next trip" prompt — enter your email and destinations you're interested in, and Check Orbit will alert you if regulations change. He enters his email and adds Japan, Germany, and Thailand — countries he's been loosely planning to visit. No account required, no medication data stored. He also generates and shares the melatonin risk card to his Instagram story.

**Resolution:** Four months later, Jae books a trip to Japan. He gets a Check Orbit email reminding him that CBD is banned there. He comes back to the site — this time with intent — runs a full search for his supplements, creates a free account, and saves the result. He tells the friends in his group chat to check their meds too. One of them shares a risk card on TikTok, continuing the loop.

**Requirements revealed:** Shareable risk cards (FR60-61), social-to-site discovery flow, "save for my next trip" email capture (FR62-63), debunking/educational content (FR64), supplement compliance search (FR9, FR13a), biosecurity-adjacent awareness, no-account discovery experience (FR47), account creation as a conversion event, viral growth loop through user-generated sharing.

### Journey Requirements Summary

| Capability | Emma | Marcus | Priya | David | Amara | Lina | Jae |
|---|---|---|---|---|---|---|---|
| Core compliance search | x | x | x | | | x | x |
| Compound decomposition | x | x | x | | | x | x |
| Multi-medication search | | x | | | | | |
| Layover/transit detection | | | x | | | | |
| Customs communication card (Phase 2) | x | | x | | | | |
| Permit lead time alerts | x | | | | | | |
| Clear banned status communication | | x | | | | | |
| Itinerary parsing | | | x | | | | |
| Privacy-safe institutional screening (Phase 2) | | | | x | | | |
| Admin completion dashboard (Phase 2) | | | | x | | | |
| AI monitoring pipeline | | | | | x | | |
| Human verification workflow | | | | | x | | |
| Source citation & audit trail | x | x | x | | x | x | x |
| User accounts & saved searches | | | | | | x | x |
| Regulation-change notifications | | | | | | x | |
| Saved search snapshot comparison | | | | | | x | |
| Freemium-to-paid conversion | | | | | | x | |
| SEO-driven discovery | | | | | | x | |
| Shareable risk cards | | | | | | | x |
| "Save for my next trip" email capture | | | | | | | x |
| Debunking/educational landing pages | | | | | | | x |
| Supplement compliance search | | | | | | | x |
| Social-to-site discovery flow | | | | | | | x |

## Domain-Specific Requirements

### Compliance & Regulatory

- **Legal positioning:** Check Orbit is an informational platform, not a legal or medical advisory service. All results carry clear disclaimers: "This information is provided for informational purposes only and does not constitute legal or medical advice. Verify with relevant authorities before travel."
- **Evolution path:** Informational tool → compliance certificates (Growth phase) → government co-branded certificates (Vision phase). Legal positioning will evolve as institutional trust and partnerships develop.
- **Privacy compliance:** Stateless architecture is the primary privacy strategy — no personal medication data stored means GDPR, HIPAA, and international health privacy laws are largely sidestepped. Session data is ephemeral. For institutional screening (B2B2C), only completion confirmation is stored, never health data.
- **International data sourcing:** Government regulatory data is public domain. AI-assisted monitoring extracts from official government publications (gazettes, ministry announcements, customs authority bulletins). No scraping concerns — source material is public law.

### Data Integrity & Liability

- **Stale data risk mitigation:** Every regulation record carries a "last verified" date and source citation. Users see data freshness transparently. Conservative interpretation applied when regulatory language is ambiguous.
- **Legal shield architecture:** Source citation chain creates an auditable trail — every data point links to its government source document. The platform reports what the law says with citations, not what the platform recommends.
- **E&O liability consideration:** The combination of compliance status outputs, high-stakes consequences, and user reliance creates potential Errors & Omissions exposure. E&O insurance coverage should be evaluated with a lawyer familiar with travel/compliance SaaS before launch. Defensive design choices (source citations, conservative interpretation, "unable to verify" fallback, informational disclaimer) reduce but do not eliminate this exposure.
- **Error handling:** When a medication or country isn't covered, the platform explicitly states "not yet covered" rather than guessing. Honesty about coverage boundaries over false completeness.
- **AI-human verification model:** AI detects and drafts regulatory changes; humans verify before any data goes live. No AI-generated content reaches travelers without human approval.

### Technical Constraints

- **Multi-language data extraction:** Regulations sourced from 50+ countries in local languages require translation and interpretation. AI translation with human verification for accuracy.
- **Compound identification accuracy:** Medication-to-compound mapping must be near-perfect (99%+). Incorrect decomposition could give a traveler a false "Legal" status. Leverage established pharmaceutical databases (ATC classification, RxNorm, DrugBank). Supplement ingredient mapping targets high accuracy for known compounds but explicitly acknowledges lower confidence for proprietary blends and novel herbal extracts.
- **Dosage threshold precision:** Some regulations are dosage-dependent. The data model must support substance + dosage + country classification across a four-level status model (Legal/Prescription-Only/Restricted/Banned), not binary legal/illegal.
- **OTC-vs-prescription threshold shifts:** The same compound can be over-the-counter in one country and prescription-only or banned in another (e.g., pseudoephedrine, low-dose codeine, common ADHD medications). The Prescription-Only status captures this critical distinction — preventing travelers from assuming a medication that's OTC at home requires no documentation abroad.
- **Stateless session architecture:** Anonymous sessions retain zero personal data. Account holders explicitly opt in to save search parameters and result snapshots — no passive data collection. Session results generated on-the-fly; only saved when the user chooses.

### Supplement & Vitamin Classification

- **The supplement blind spot:** Vitamins, supplements, and herbal products represent a major category of traveler-carried items that fall outside traditional pharmaceutical databases. Common supplements like DHEA (a controlled anabolic steroid in many countries), CBD products (illegal in most of Asia and the Middle East despite Western availability), melatonin (prescription-only in the EU, UK, Australia), and herbal extracts (e.g., kratom, kava, valerian) have wildly inconsistent legal status across borders.
- **Supplement ingredient decomposition:** Unlike regulated pharmaceuticals with standardized compound data, supplements often contain proprietary blends with undisclosed ratios, plant-derived ingredients with variable classification, and marketing names that obscure their active compounds. The decomposition engine must handle these ambiguities explicitly rather than silently failing.
- **Unverifiable blends:** Proprietary supplement blends that do not fully disclose their ingredients cannot be reliably verified. The system must clearly communicate this limitation — a traveler carrying a "wellness blend" with undisclosed ingredients needs to understand the risk rather than receive a false sense of compliance.
- **Database scope:** The compound-mapping database covers pharmaceutical active ingredients, common supplement compounds (DHEA, CBD, melatonin, 5-HTP, ephedrine-containing herbs), and herbal extracts with known regulatory triggers. Coverage prioritizes ingredients most likely to cause border problems over exhaustive supplement cataloging.

### Biosecurity Restrictions

- **Biosecurity as orthogonal concern:** Some countries (notably Australia, New Zealand, parts of Southeast Asia) restrict or prohibit the import of plant-derived, animal-derived, or soil-contact products under agricultural biosecurity laws — independent of pharmaceutical classification. A plant-based supplement can be pharmacologically Legal but biosecurity-restricted. This is a separate axis from the four-status compliance model.
- **Biosecurity warning flag:** Biosecurity restrictions are modeled as an overlay warning on the compliance result, not a fifth status. A product can simultaneously be "Legal" from a pharmaceutical standpoint and carry a biosecurity warning for specific destination countries. The warning includes the specific biosecurity concern (plant origin, animal derivative, soil contact) and the enforcing authority.
- **Scope limitation:** Biosecurity flags are applied to countries with known aggressive biosecurity enforcement (Australia, New Zealand, and others as identified). The system does not attempt to model agricultural import rules for all countries — only those where supplement travelers are realistically at risk.

### Risk Mitigations

See Risk Mitigation Strategy in Project Scoping & Phased Development for comprehensive risk analysis. Key domain-specific mitigations:
- Multi-authority conflicts resolved by applying the most restrictive interpretation and noting the conflict
- Traveler over-reliance addressed through clear UX messaging that Check Orbit supplements but does not replace consulting with a doctor or relevant embassy
- Reputational risk from errors mitigated by source citation on every result; dispute/correction mechanism planned for Growth phase

## Innovation & Novel Patterns

### Detected Innovation Areas

- **First global compound-first regulatory database:** Country-specific tools exist (Singapore, Dubai) but no one has built a structured, cross-country database keyed on chemical compounds rather than brand names — and none cover supplements or biosecurity restrictions. This is data infrastructure that doesn't exist — the platform isn't competing with existing tools, it's creating a new category.
- **Layover trap — novel compliance pattern:** No consumer tool checks transit countries against medication compliance. The itinerary-aware multi-country cross-reference is a genuinely new interaction pattern with no precedent.
- **Ingredient decomposition as compliance engine:** Combining pharmaceutical compound identification (ATC/CAS classification) with per-country regulatory status at the dosage-threshold level. Each capability exists in isolation (drug databases, regulatory texts); the innovation is the structured combination and real-time cross-referencing.
- **Stateless privacy as competitive architecture:** Designing the system to never store personal health data is both a technical choice and a market position. Competitors who store profiles inherit privacy liability; Check Orbit's statelessness is a feature, not a constraint.
- **AI-detect, human-verify trust model:** AI monitors and drafts regulatory updates; humans verify before publication. Inverts the typical AI pattern (AI answers questions) into a fundamentally different trust architecture appropriate for high-stakes compliance.

### Market Context & Competitive Landscape

- **Country-specific tools (Singapore, Dubai):** Prove demand and validate that governments see value in medication compliance tools. Limited to single-country scope — no cross-border or transit awareness.
- **Government travel advisories:** Mention medications vaguely ("check local laws") without structured data, compound-level specificity, or actionable guidance.
- **Travel forums and Reddit:** Anecdotal, often outdated, conflicting, and impossible to verify. High anxiety, low confidence.
- **No global structured tool exists.** The gap between country-specific government tools and unstructured forum advice is exactly where Check Orbit sits — and the aggregation challenge is why no one has filled it yet.

### Validation Approach

- **Go wide from the start:** Launch with top 50 destination countries and broad medication coverage rather than a narrow proof of concept. The value proposition depends on coverage breadth — a tool that covers 5 countries doesn't solve the traveler's problem.
- **Compound decomposition validation:** Leverage established pharmaceutical databases (ATC, RxNorm, DrugBank) for medication-to-compound mapping and supplement ingredient databases for vitamin/supplement decomposition. Cross-validate against country-specific tools where they exist (Singapore, Dubai) as ground truth for those markets. Validate supplement edge cases (DHEA, CBD, melatonin) against known country-specific restrictions.
- **Regulatory data accuracy:** Verify initial dataset against known cases — medications documented as problematic in specific countries (codeine in UAE/Japan, stimulants in Japan, benzodiazepines in certain Asian markets). Use publicized detention incidents as test cases.
- **User validation:** Monitor search patterns and user feedback for data accuracy signals. Implement dispute/correction mechanism in Growth phase for crowdsourced accuracy improvement.

### Innovation Risk Mitigation

See Risk Mitigation Strategy in Project Scoping & Phased Development for comprehensive risk analysis. Key innovation-specific risks:
- Data accuracy at scale mitigated by conservative interpretations, transparent "last verified" dates, and "not yet covered" messaging
- Compound mapping edge cases handled by "unable to verify" fallback rather than guessing — especially critical for proprietary supplement blends where incomplete ingredient disclosure makes verification impossible
- Market timing risk mitigated by the data moat — aggregating this database is a multi-year effort regardless of distribution

## Web Application Specific Requirements

### Project-Type Overview

Check Orbit is a multi-page web application optimized for organic search acquisition. Each medication-country compliance pair generates a server-rendered, indexable page — so when a traveler Googles "can I bring Adderall to Japan," Check Orbit appears in results with the authoritative answer. The core interaction is search → compound decomposition → compliance result → customs card download, with itinerary-based multi-country analysis as the differentiating feature.

### Technical Architecture Considerations

#### Rendering & SEO Strategy

- **Multi-page application** with server-side rendering for all compliance result pages
- Each medication-country pair generates a unique, indexable URL (e.g., `/check/adderall/japan`)
- Structured data markup (schema.org) for rich search results — medication name, compliance status, destination country
- Dynamic sitemap generation as country and medication coverage expands
- Meta descriptions auto-generated from compliance status for search result snippets
- Canonical URLs to handle brand name vs. compound name variations (e.g., `/check/zoloft/uae` canonicalizes to `/check/sertraline/uae` or vice versa)

#### Browser Support

- Modern evergreen browsers: Chrome, Safari, Firefox, Edge (latest 2 versions)
- No IE11 or legacy browser support required
- Progressive enhancement — core compliance results readable without JavaScript, enhanced features (itinerary builder, card download) require modern JS

#### Responsive Design

- Mobile-first responsive design — travelers will frequently access from phones, especially in the panic gap scenario
- Breakpoints: mobile (320-768px), tablet (768-1024px), desktop (1024px+)
- Customs communication card optimized for mobile display and offline screenshot
- Itinerary input usable on mobile (touch-friendly multi-stop entry)

#### Performance Targets

See NFR1–NFR7 for specific measurable targets. Core Web Vitals passing on all indexed pages is critical for SEO ranking.

#### Accessibility

See NFR26–NFR30 for specific measurable targets. WCAG 2.1 AA compliance across all pages with focus management for search results and multi-step itinerary flow.

#### Notification System

- **Email notifications** for:
  - Regulatory changes affecting a previously searched medication-country pair (requires opt-in email, not stored medication data — notification keyed to anonymized search hash)
  - Permit deadline reminders for travelers who searched restricted medications with lead time requirements
  - "Save for my next trip" destination-level alerts for discovery-mode users who signed up via social channels but aren't traveling immediately
  - Institutional admin alerts for screening completion milestones (B2B2C)
- Email delivery infrastructure with transactional email provider
- Notification preferences and unsubscribe management

### Implementation Considerations

- **Dual-channel acquisition architecture:** SEO infrastructure (URL structure, server rendering, structured data) captures high-intent search traffic. Organic social content (TikTok/Meta) drives initial awareness and branded search volume that accelerates SEO authority. Both channels feed the same product experience.
- **Stateless search with optional notification opt-in:** Core search remains stateless. Email notifications require a minimal opt-in flow (email + search parameters) that stores notification triggers without storing personal medication context.
- **Customs card generation:** Server-side PDF/image generation for downloadable cards in destination language. Must work offline once downloaded.
- **Itinerary input:** Support manual multi-stop entry at MVP. Itinerary file upload/parsing (PNR, email, calendar) deferred to Growth.
- **Internationalization foundation:** UI in English at launch, but customs cards generated in 50+ destination languages. Architecture must support future UI localization.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Hybrid problem-solving + platform MVP. Check Orbit can't solve the traveler's problem without the regulatory database — the data infrastructure IS the product. There is no "thin" version that works without compound-level, country-specific regulatory data. The MVP must deliver both the consumer search experience and the underlying data platform simultaneously.

**Resource Requirements:** Solo founder with developer friends contributing. AI-assisted tooling leveraged heavily for data pipeline (regulatory monitoring, translation, compound mapping). Human verification performed by founder initially, scaling to dedicated data team as revenue grows.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Emma (calm planner) — full journey minus customs card
- Marcus (panic gap) — full journey
- Priya (layover trap) — full journey minus customs card
- Lina (returning user) — full journey
- Amara (data curator) — full journey (founder as Amara initially)
- Jae (social discovery) — full journey

**Must-Have Capabilities:**
- Core compliance search: medication + destination → compound-level status (Legal/Prescription-Only/Restricted/Banned)
- Ingredient decomposition engine: brand name → active compounds → per-compound regulatory check with dosage threshold awareness
- Layover trap: manual multi-stop itinerary entry → flag medication conflicts at every transit country
- Permit lead time alerts: surface advance permit requirements with "you need X weeks" or "you're already too late" messaging
- Multi-medication search: check multiple medications against one or more destinations in a single session
- Source citation on every result: government source document, last verified date, link to original
- "Not yet covered" transparency for uncovered countries and unmapped medications
- SEO-optimized medication-country pages for organic search acquisition
- Email notification opt-in for regulatory changes affecting searched medication-country pairs
- Regulatory database covering top 50 destination countries
- AI monitoring pipeline with human verification workflow (founder as verifier at launch)
- Stateless session architecture — zero personal medication data stored
- Informational disclaimer on all results
- User accounts with email/password and Google sign-in
- Saved searches with result snapshot comparison (highlights regulatory changes since last check)
- Freemium model: free single-medication/single-country search, free account with one saved search slot (permanently consumed on use), paid tier unlocks multi-medication, layover trap, unlimited saves, and email notifications
- Stripe-powered subscription management
- Shareable risk cards: compliance results formatted as visually striking, exportable graphics optimized for social sharing (Instagram Stories, TikTok greenscreen)
- "Save for my next trip" email capture: destination bucket list + email for discovery-mode users who aren't traveling immediately, with automated alerts if regulations change for their saved destinations
- Debunking landing pages: SEO content addressing dangerous viral travel trends (e.g., pill-in-Tic-Tac-box), positioning Check Orbit as the authoritative correction source and bridging social virality to search intent

**Deferred from MVP:**
- Customs communication card (Phase 2 — high value but presentation layer, not core data)
- University/institutional screening workflow (Phase 2 — David's journey requires B2B2C infrastructure)
- Admin completion dashboard for institutions (Phase 2)
- Itinerary file upload/parsing — manual entry only at MVP (Phase 2)

### Post-MVP Features

**Phase 2 (Growth):**
- Customs communication card in destination language (downloadable PDF)
- B2B2C institutional screening workflow with privacy-safe confirmation system
- Admin dashboard for institutional partners (screening completion rates)
- Compliance certificates with QR verification and source citations
- Itinerary file upload/parsing (PNR, email, calendar)
- B2B2C API layer for university, insurer, and travel management company integration
- Privacy-safe partner architecture (green/yellow/red status without health data)
- Dispute/correction mechanism for crowdsourced accuracy improvement
- Wallet pass integration (Apple/Google Wallet)
- Multi-stop card stack ordered by itinerary sequence
- Audio assist for customs interactions

**Phase 3 (Expansion):**
- Emergency detention hotline with local legal guidance
- Telemedicine connection for travel medication documentation
- Government data validation partnerships and co-branded certificates
- Certified travel agent program
- Anonymized search intelligence data product
- WHO/INCB/IATA recognition pursuit
- Country coverage expansion beyond top 50
- UI localization for non-English markets

### Risk Mitigation Strategy

**Technical Risks:**
- *Regulatory interpretation at scale:* Legal language is ambiguous across 50 countries and 50 legal traditions. Mitigated by: AI-assisted extraction with mandatory human verification, conservative interpretation as default, transparent confidence indicators, and explicit "ambiguous — consult embassy" messaging when interpretation is uncertain.
- *Compound mapping accuracy:* Mitigated by leveraging established pharmaceutical databases (ATC, RxNorm, DrugBank) rather than building from scratch. Cross-validate against existing country-specific tools (Singapore, Dubai).

**Market Risks:**
- *YMYL SEO cold-start:* Google's "Your Money or Your Life" algorithm suppresses new, unproven sites offering legal/medical guidance. A new domain will struggle to rank for queries like "Is Adderall legal in Japan?" without established authority. Mitigated by: organic social content (TikTok/Meta) drives branded search volume, which signals legitimacy to Google; viral social content generates backlinks from publishers and travel blogs, building domain authority; high user engagement from social traffic (dwell time, low bounce rate) reinforces quality signals. SEO is a medium-term outcome, not the Day-1 acquisition engine.
- *50,000 users in 3 months:* Aggressive target for a solo founder. Mitigated by: social-first awareness via short-form video content built around "panic gap" and "layover trap" shock value, shareable risk cards that function as a viral growth loop, "save for next trip" email capture for discovery-mode users who aren't traveling immediately, and B2B2C institutional partnerships providing high-throughput user cohorts in parallel.

**Resource Risks:**
- *Solo founder bottleneck:* Founder is the developer, data verifier, and business operator simultaneously. Mitigated by: AI-heavy automation for monitoring and data extraction, developer friends for implementation support, and phased scope that prioritizes core search over ancillary features.
- *Data verification capacity:* 50 countries with ongoing regulatory changes could exceed one person's verification bandwidth. Mitigated by: prioritize high-traffic countries for frequent verification, batch lower-traffic countries on longer cycles, and clearly display "last verified" dates so users calibrate trust appropriately.

## Functional Requirements

### Medication Compliance Search

- FR1: Traveler can search for a medication by brand name, generic name, or compound name
- FR2: Traveler can select a destination country from a list of covered countries
- FR3: Traveler can view a compliance status (Legal, Prescription-Only, Restricted, or Banned) for each active compound in their searched medication against their selected destination. Legal: no special requirements. Prescription-Only: legal with valid prescription documentation. Restricted: requires advance permit or special approval. Banned: prohibited regardless of documentation
- FR4: Traveler can view required documentation, quantity limits, and permit requirements for Prescription-Only and Restricted medications
- FR5: Traveler can view permit lead time requirements including the issuing authority name, application URL or process, and minimum lead time in days
- FR5a: Traveler can optionally enter a departure date to enable time-sensitive alerts
- FR6: System can display a "you're already too late" warning when a traveler's departure date is provided and the remaining days before departure are fewer than the permit's required lead time
- FR7: Traveler can search up to 10 medications against one or more destinations in a single session (paid tier)
- FR8: Traveler can view the government source document, source link, and last verified date for every compliance result

### Ingredient Decomposition

- FR9: System can decompose a brand-name medication or named supplement into its individual active compounds and ingredients using established pharmaceutical and supplement compound classification data
- FR10: System can independently check each active compound against destination country regulations
- FR11: System can apply dosage-threshold classification where country regulations differentiate by dosage level
- FR12: System can flag any combination medication or supplement containing at least one controlled or restricted ingredient, regardless of product name or brand perception
- FR13: System can display "unable to verify" for unmapped medications, supplements with undisclosed proprietary blends, or products whose full ingredient list cannot be determined — with messaging that explains the verification gap and advises the traveler to consult destination customs authorities
- FR13a: System can identify when a supplement declares a proprietary blend without full ingredient disclosure and display a specific warning that compliance cannot be guaranteed for undisclosed ingredients
- FR13b: System can display a biosecurity warning flag on compliance results for products containing plant-derived, animal-derived, or soil-contact ingredients when the destination country enforces agricultural biosecurity import restrictions — independent of the product's pharmaceutical compliance status

### Layover & Transit Compliance

- FR14: Traveler can enter a multi-stop itinerary with origin, destination, and transit/layover countries (paid tier)
- FR15: System can check medication compliance for every country in the itinerary sequence, including transit stops
- FR16: Traveler can view a per-country compliance status across their full itinerary in sequence
- FR17: System can flag transit country conflicts where medication is legal at origin and destination but banned at a layover
- FR17a: When a transit country conflict is detected, system can display a list of common alternative transit hubs for the same origin-destination pair where the medication is legal (paid tier)

### Customs Communication Card (Phase 2)

- FR58: Traveler can generate a downloadable customs communication card for a medication-country pair containing medication name, compound name, compliance status, prescription confirmation, and quantity — rendered in the destination country's official language (Phase 2)
- FR59: Customs communication card can be viewed offline once downloaded (Phase 2)

### Coverage Transparency

- FR18: Traveler can see which countries are covered and which are not yet covered
- FR19: System can display explicit "not yet covered" messaging for uncovered countries rather than returning no result
- FR20: Traveler can see explicit "unable to verify" messaging for medications that cannot be mapped to known compounds

### Email Notifications

- FR21: Traveler can opt in to receive email notifications when a regulation changes status (Legal/Prescription-Only/Restricted/Banned), documentation requirements change, or quantity limits change for a medication-country pair they previously searched (paid tier)
- FR22: Traveler can opt in to receive permit deadline reminders sent at configurable intervals (e.g., 4 weeks, 2 weeks, 1 week before departure) for restricted medications that require advance permits (paid tier)
- FR23: Traveler can manage notification preferences and unsubscribe
- FR24: System can send notifications without storing the traveler's medication data — notification triggers keyed to anonymized search parameters

### SEO & Content Pages

- FR25: System can generate a unique, search-engine-indexable page for each medication-country compliance pair
- FR26: System can produce pages eligible for search engine rich results displaying medication name, compliance status, and destination country
- FR27: System can generate dynamic sitemaps as medication and country coverage expands
- FR28: System can resolve brand name and compound name URL variations to a single authoritative page per medication-country pair

### Social Sharing & Discovery Capture

- FR60: System can generate a shareable risk card from any compliance result — a visually formatted, exportable graphic displaying medication name, destination, compliance status, and a branded call-to-action — optimized for Instagram Stories and TikTok greenscreen dimensions
- FR61: Traveler can export a risk card as an image file or share it directly to social platforms via native share APIs
- FR62: Traveler who is not planning an immediate trip can enter an email address and one or more destination countries to receive automated alerts if medication regulations change for those destinations ("save for my next trip")
- FR63: "Save for my next trip" subscriptions require only an email and destination list — no medication data is stored, and alerts are triggered by any regulation change for the selected countries
- FR64: System can serve editorially authored debunking landing pages that address specific dangerous travel trends (e.g., removing prescription labels, carrying pills in unlabeled containers) with links to relevant compliance searches
- FR65: Traveler can enter an email address on any compliance result page to receive that result via email — a single transient email send with no persistent medication data storage

### Regulatory Data Management

- FR29: Data curator can view a dashboard of automatically flagged potential regulatory changes categorized by confidence level (high, medium, low) with source links
- FR30: Data curator can review AI-extracted regulatory updates with links to source documents
- FR31: Data curator can approve, reject, or escalate flagged regulatory changes
- FR32: Data curator can add notes and annotations to regulatory records (e.g., ambiguity flags, conservative interpretation notes)
- FR33: System can monitor government publications across covered countries for regulatory changes on a daily cycle
- FR34: System can produce draft regulatory updates from monitored government publications — including extracted text, translated content, and affected compounds — for human review before publication
- FR35: System can maintain an audit trail for all database changes including verifier identity, date, and source citation

### Data Integrity & Trust

- FR36: System can detect when two or more regulatory authorities within a country publish conflicting rules for the same compound and apply the most restrictive interpretation, displaying both sources to the traveler
- FR37: System can display a data freshness indicator on every compliance result showing the last-verified date, verification source, and a staleness badge (Current: verified within 90 days, Aging: 90-180 days, Stale: >180 days)
- FR38: System can display an informational disclaimer on all compliance results
- FR39: System can link every regulation record to its government source document with a verification date

### User Accounts & Saved Searches

- FR40: Traveler can create an account using email/password or third-party authentication and sign in
- FR41: Traveler can save a compliance search (medication + destination/itinerary) to their account
- FR42: Traveler can view a list of their saved searches
- FR43: Traveler can revisit a saved search and see current compliance results regenerated from the latest database
- FR44: System can display the previous compliance result snapshot alongside current results when a traveler revisits a saved search
- FR45: System can highlight changes between the saved snapshot and current results (e.g., status changed from Legal to Prescription-Only, or from Restricted to Banned)
- FR46: Traveler can delete saved searches from their account
- FR47: Traveler can use Check Orbit without creating an account — accounts are optional, core search remains stateless for anonymous users

### Freemium & Monetization

- FR48: Traveler can use core single-medication, single-country compliance search for free without an account
- FR49: Traveler can create a free account with one saved search slot
- FR50: System can permanently consume a free save slot when used — deleting the saved search does not restore the slot
- FR51: Traveler can upgrade to a paid tier to unlock additional saved searches, multi-medication search, and layover trap
- FR52: System can manage subscription tiers with feature gating based on plan level

### Institutional Screening (B2B2C — Phase 2 build, Phase 1 sales pipeline)

- FR53: University administrator can embed a self-service medication screening link in pre-departure workflows
- FR54: Student can privately screen medications against their destination country; the system never transmits medication names, compound names, or compliance details to the institution's systems or staff
- FR55: Student can receive a confirmation code upon completing the screening
- FR56: University administrator can view screening completion rates without seeing medication data
- FR57: System can generate a timestamped, verifiable attestation document confirming that a specific student completed the medication compliance screening for a specific destination, without including any medication data

## Non-Functional Requirements

### Performance

- NFR1: Core single-medication, single-country compliance search returns complete results within 20 seconds end-to-end
- NFR2: Multi-medication search returns results for up to 10 medications against a single destination within 20 seconds
- NFR3: Layover trap itinerary analysis returns per-country results for up to 10 transit stops within 20 seconds
- NFR4: Server-rendered medication-country pages achieve Largest Contentful Paint (LCP) < 2.5 seconds
- NFR5: Cumulative Layout Shift (CLS) < 0.1 on all pages
- NFR6: First Contentful Paint (FCP) < 2 seconds on simulated 3G connections as measured by Lighthouse lab testing
- NFR7: All indexed pages pass Core Web Vitals assessment (LCP < 2.5s, FID/INP < 200ms, CLS < 0.1) as measured by Google Search Console field data at 75th percentile

### Security

- NFR8: Authentication supported via email/password and Google sign-in. Passwords hashed using industry-standard algorithms (bcrypt/argon2) — no plaintext password storage
- NFR9: Payment processing handled entirely by Stripe — no credit card data stored or processed by Check Orbit
- NFR10: All data encrypted in transit (TLS 1.2+) and at rest
- NFR11: User account data (email, saved search parameters, result snapshots) stored with encryption at rest
- NFR12: Anonymous search sessions generate no persistent user-identifiable data
- NFR13: Email notification triggers stored as anonymized search hashes, not human-readable medication names
- NFR14: Data curator admin access restricted with role-based access control; at minimum two roles (admin, curator) with curator unable to modify user accounts, billing, or system configuration
- NFR15: Regulatory database change audit trail is immutable — entries cannot be edited or deleted after creation

### Scalability

- NFR16: System supports 50,000 registered users within 3 months of launch
- NFR17: System maintains NFR1-NFR3 response time targets at 3x average daily traffic as measured by load testing simulating peak seasonal periods (summer June–August, holidays November–January)
- NFR18: Adding a new country to the regulatory database requires only data entry and verification — no code changes, schema migrations, or infrastructure provisioning
- NFR19: Medication-country page response times (NFR4) remain within target when total page count doubles, as verified by load testing after batch database expansion
- NFR20: Email notification system can deliver up to 50,000 notifications within 4 hours when a regulatory change affects a widely searched medication-country pair

### Reliability

- NFR21: 99.9% uptime for the core compliance search service (< 8.76 hours downtime per year)
- NFR22: Regulatory database maintains data integrity during update operations — no partial or corrupted records served to users during curator verification workflow
- NFR23: Failed search queries return clear error messaging rather than incorrect or partial compliance data
- NFR24: Email notification delivery achieves 99%+ deliverability rate
- NFR25: Core compliance search (FR1-FR8) and saved search retrieval (FR42-FR45) remain available and return correct results during regulatory database update operations — zero user-facing downtime during curator verification workflow

### Accessibility

- NFR26: WCAG 2.1 AA compliance across all user-facing pages
- NFR27: Compliance status (Legal/Prescription-Only/Restricted/Banned) conveyed through text and icons, not color alone
- NFR28: All interactive elements (search, itinerary builder, account management) fully keyboard navigable
- NFR29: Screen reader compatible — all compliance results, status indicators, and navigation elements properly labeled
- NFR30: High contrast mode support for compliance status displays

### Integration

- NFR31: Google OAuth 2.0 integration for user authentication
- NFR32: Stripe integration for subscription management, payment processing, and webhook handling
- NFR33: Transactional email provider integration for notification delivery with bounce/complaint handling
- NFR34: Pharmaceutical and supplement database integration (ATC, RxNorm, DrugBank, and supplement ingredient databases) for compound identification, mapping, and biosecurity classification
- NFR35: SEO infrastructure — search engine crawler compatibility, structured data validation, sitemap protocol compliance
