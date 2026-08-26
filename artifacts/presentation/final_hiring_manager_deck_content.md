## Cover

**Title:** Riverbend: From Clinic Rules to Platform Leverage

**Subtitle:** A complete Phase 1 + Phase 2 proof for Confido Health

**Presenter:** Eangelica Germano Aton · Product Manager, Platform candidate

## Slide 1

**Title:** Every requirement is implemented—and inspectable

**Content:**

| Assignment promise           | Verified result                                       |
| ---------------------------- | ----------------------------------------------------- |
| Phase 1 agent functions      | **15 / 15**                                           |
| Phase 1 submission artifacts | **3 / 3**                                             |
| Riverbend rule families      | **10 / 10**                                           |
| Phase 2 required areas       | **5 / 5**                                             |
| Release checks               | **19 / 19 assertions · 25 / 25 scenarios · CI green** |

**Footer statement:** Required work is complete. Production boundaries remain explicit.

**Interaction:** **Run Agent**, **Open Checklist**, and **Jump to FieldFlow**.

**Speaker notes — 0:00–0:35:** “I organized this walkthrough around proof. Every required Phase 1 function, artifact, clinic-rule family, and Phase 2 area has an inspectable evidence location. I’ll show one complete booking, one negative guarantee, the release contract, and the platform decision that follows from the work.”

## Slide 2

**Title:** Empathy changed the interaction order

**Content:**

| Human concern                | Product decision                         | Testable contract                             |
| ---------------------------- | ---------------------------------------- | --------------------------------------------- |
| Anxious or distracted caller | One question at a time; retain intent    | No repeated story before the next gate        |
| Misheard speech              | Local live transcript plus text fallback | Transcript never substitutes for verification |
| Privacy risk                 | Phone finds a candidate; DOB verifies    | No protected read after mismatch              |
| Opaque waiting               | Seven evidence-derived stages            | Progress reflects real state, not animation   |
| Human help                   | Supported front-desk or nurse handoff    | Correct destination; no unsafe continuation   |

**Method marker:** Observe → Frame → Build → Validate → Improve

**Speaker notes — 0:35–1:15:** “My empathetic method changed architecture, not just tone. I framed the caller’s problem as cognitive load plus privacy risk. That produced one-question turns, retained intent, a correctable transcript, visible progress, verification before disclosure, and a supported human path. I validate empathy through negative guarantees rather than sentiment alone.”

## Slide 3

**Title:** Phase 1 covers the complete call surface

**Content:**

| Appointment        | FAQ       | Handoff and recovery            |
| ------------------ | --------- | ------------------------------- |
| New-visit booking  | Hours     | Front desk                      |
| Existing follow-up | Locations | Nurse line                      |
| Reschedule         | Parking   | Emergency instruction           |
| Cancel             |           | No patient / no appointment     |
| Confirm            |           | Unknown request / human request |

**Proof label:** 25 named scenarios include a dedicated post-audit location case.

**Interaction:** Each column links to the corresponding scenario-lab filter.

**Speaker notes — 1:15–1:50:** “The agent covers every function in the brief. New-patient behavior is demonstrated through Riverbend’s own more-than-three-year classification using the supplied sample set. An unmatched caller is handled safely instead of receiving an invented chart. Hours, locations, and parking each have explicit evidence.”

## Slide 4

**Title:** The caller hears calm; the FDE sees proof

**Content:**

- **Patient:** transcript, one next question, progress, confirmation, supported handoff.
- **FDE:** intent, verification, rule ID, tool request, result, mutation receipt.
- **Decision:** policy before availability; confirmation before write.

**Interaction:** **Launch Follow-up Booking** opens the live agent. **Demo Inputs** opens Appendix 1.

**Speaker notes — 1:50–3:15:** “I’ll replay James Porter’s follow-up. The phone finds a candidate; DOB verifies him; active coverage and policy availability are confirmed; `RB-VISIT-01` classifies a 15-minute follow-up; `RB-PROV-01` keeps the assigned provider; `RB-SLOT-01` selects the earliest eligible slot. No write occurs until an explicit yes. The patient receives a calm answer while the FDE receives the decision evidence.”

## Slide 5

**Title:** The negative guarantee is the product

**Content:**

| Boundary                                  | Guaranteed absence                             |
| ----------------------------------------- | ---------------------------------------------- |
| Possible emergency                        | No lookup or scheduling before 911 instruction |
| DOB mismatch                              | No appointment disclosure                      |
| Under 18 / inactive coverage / discharged | No availability search or write                |
| Different follow-up provider              | No self-booking without office approval        |
| Urgent clinical question                  | No medical advice; nurse-line handoff          |

**Interaction:** **Run Emergency**, **Run Minor**, **Run DOB Mismatch**.

**Speaker notes — 3:15–3:50:** “A safe healthcare administrative agent is defined by what it refuses to do. I test the absence of protected reads, unauthorized searches, writes, medical advice, and unsafe continuation. The emergency path preempts the ordinary workflow before patient lookup.”

## Slide 6

**Title:** Language interprets; deterministic services authorize

**Content:**

**Caller → Conversation → Safety → Identity → Policy → Availability / Mutation → Adapter**

| Layer     | Owns                                         | Must not own                              |
| --------- | -------------------------------------------- | ----------------------------------------- |
| Prompt    | Scope, tone, repair, confirmation discipline | Patient records or hidden authority       |
| Knowledge | Approved hours, locations, parking           | Mutable appointments or unresolved policy |
| Policy    | Eligibility, provider, duration, slot order  | Conversational phrasing                   |
| Tools     | Validated reads, writes, transfers, receipts | Free-form business judgment               |
| Trace     | Redacted reason and outcome evidence         | Unrestricted PHI analytics                |

**Interaction:** **Open Architecture**.

**Speaker notes — 3:50–4:25:** “The model interprets and communicates. It does not own mutable data or clinic authority. This boundary makes the agent diffable, testable, and portable across telephony and EHR adapters.”

## Slide 7

**Title:** Quality is a release contract

**Content:**

| Gate                     | Final evidence |
| ------------------------ | -------------: |
| Deterministic assertions |    **19 / 19** |
| Catalog scenario replays |    **25 / 25** |
| TypeScript               |  **No errors** |
| Production build         |  **Succeeded** |
| GitHub Actions           |      **Green** |

**Callout:** The audit found a missing dedicated location regression; the artifact was added and the full suite rerun.

**Interaction:** **Open Scenario Lab** and **Open GitHub CI**.

**Speaker notes — 4:25–5:05:** “A believable sentence is not my quality contract. The suite checks rule IDs, required and forbidden tools, state changes, and transfer destinations. The fresh audit found that location behavior existed but lacked a dedicated scenario. I added it, moved the suite to 19 assertions and 25 scenarios, and reran the release checks. That is the improvement loop in practice.”

## Slide 8

**Title:** Phase 1 friction revealed the platform

**Content:**

| Observed FDE work                     | FieldFlow product response                        |
| ------------------------------------- | ------------------------------------------------- |
| Verify uneven source packets          | Source ledger with provenance and confidence      |
| Resolve missing or conflicting policy | Ambiguity queue with owner and release impact     |
| Translate prose into authority        | Typed policy bundle and reason codes              |
| Prove failure behavior                | Generated scenarios and forbidden-call assertions |
| Diagnose change                       | Source-linked trace replay                        |
| Promote safely                        | Approval, canary, rollback, immutable release     |

**Speaker notes — 5:05–5:35:** “I did not begin Phase 2 with a generic builder. I productized the repeated work I had to perform: source verification, clarification, compilation, simulation, diagnosis, and controlled release.”

## Slide 9

**Title:** FieldFlow makes every handoff inspectable

**Content:**

**Ingest → Clarify → Compile → Simulate → Approve → Deploy → Observe → Improve**

Every stage produces a durable artifact, a named decision, and a release gate.

**Interaction:** Eight stage buttons reveal artifact, owner, agentic contribution, deterministic authority, and exit gate. **Open Live FieldFlow**.

**Speaker notes — 5:35–6:15:** “FieldFlow is an FDE control plane. Ingest preserves sources. Clarify exposes ambiguity. Compile creates a tenant bundle. Simulate creates regression evidence. Approve signs the exact candidate. Deploy is reversible. Observe measures bounded outcomes. Improve drafts a human-gated change and reruns regression.”

## Slide 10

**Title:** Generalize contracts—not clinic truth

**Content:**

| Platform primitive              | Tenant-local authority                      |
| ------------------------------- | ------------------------------------------- |
| Identity workflow               | Required attributes and accessible fallback |
| Policy schema and reason codes  | Thresholds, durations, provider pairings    |
| Tool registry and authorization | Vendor adapter and clinic permissions       |
| Scenario grammar and replay     | Fixtures and expected local outcomes        |
| Trace, release gate, rollback   | Retention, owners, thresholds               |

**Agentic:** extract, suggest, cluster, draft, explain.  
**Deterministic / human-gated:** authorize, write, approve, promote, rollback.

**Speaker notes — 6:15–6:55:** “The generalization boundary is the product. Reusable contracts compound; Riverbend’s three-year threshold, provider rules, schedule, and unresolved exceptions remain tenant truth. Self-learning produces evidence-backed proposals, not silent policy changes.”

## Slide 11

**Title:** Want the answer before the feature

**Content:**

| Priority               | Smallest falsifying test                  | Scale gate                                                   |
| ---------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| P0 policy compiler     | Counterbalanced two-FDE, two-packet study | ≥30% less active time; no critical regression                |
| P0 generated scenarios | Seed matched critical defects             | ≥25% defect-yield lift; <15% false positives                 |
| P1 decision trace      | Transcript-only versus trace diagnosis    | ≥40% faster; no excess PHI exposure                          |
| P1 ambiguity queue     | Plant cross-source conflicts              | Zero critical conflicts reach approval; ≤15% review overhead |

**Interaction:** Rows expand to show stop/narrow rules. **Open Full Portfolio**.

**Speaker notes — 6:55–7:35:** “I prioritize evidence, not feature breadth. The first two questions are whether compilation reduces active FDE time without lowering correctness and whether generated scenarios find more critical defects without adding noise. If those fail, I narrow or stop before funding a larger platform.”

## Slide 12

**Title:** Roadmap: earn the right to scale

**Content:**

| Now                | Next                | Later                 | Not yet                 |
| ------------------ | ------------------- | --------------------- | ----------------------- |
| Source ledger      | Trace replay        | Controlled modules    | Broad visual builder    |
| Ambiguity queue    | Source-linked diffs | Cross-clinic evidence | Autonomous policy drift |
| Policy compiler    | Release gates       | Shadow proposals      | Ungated self-serve      |
| Critical scenarios | Canary + rollback   | Local acceptance      |                         |

**Speaker notes — 7:35–8:00:** “I would fund source-to-policy and policy-to-test first. Once that earns time and quality gains, I would add diagnosis and release controls, then controlled reuse. I would not fund autonomous policy change or a broad builder before the central leverage hypothesis is proven.”

## Slide 13

**Title:** The work mirrors Confido’s Platform PM mandate

**Content:**

| Role mandate           | Riverbend proof                                                     |
| ---------------------- | ------------------------------------------------------------------- |
| Hands-on builder       | Working TypeScript agent, voice/text UX, tests, docs, CI            |
| FDE-first product      | Source ledger, ambiguity queue, policy diff, replay, gates          |
| Multi-tenant lifecycle | FieldFlow contracts from build through improve and scale            |
| Honest experiments     | Numeric targets, guardrails, and stop/narrow decisions              |
| Revenue leverage       | FDE hours, time to approved release, diagnosis, second-clinic setup |
| Quality benchmark      | Negative guarantees, reason codes, trace, regression, rollback      |

**Speaker notes — 8:00–8:35:** “This is how I lead technical platform product: I can work in the codebase, stay close to healthcare operations, make architecture and lifecycle contracts explicit, test what can invalidate the roadmap, and connect quality to FDE leverage and deployment velocity.”

## Slide 14

**Title:** I exceeded scope without hiding the boundary

**Content:**

| Added proof                             | Production boundary kept explicit               |
| --------------------------------------- | ----------------------------------------------- |
| Public open-source repository and CI    | Not a production clinic deployment              |
| Transcript, progress, and FDE trace     | Not identity proof or unrestricted PHI logging  |
| 25-scenario lab and negative guarantees | Synthetic fixtures and deterministic demo NLU   |
| Editable Word PRD and interactive deck  | Candidate still records the final video         |
| Multi-tenant platform contracts         | No live tenant auth, storage, EHR, or telephony |

**Speaker notes — 8:35–9:05:** “The submission goes beyond the brief where added evidence improves trust: reproducible code, CI, an editable PRD, an interactive deck, transcript and progress, and a full scenario lab. I keep the production boundary equally visible. This is a product proof, not a claim of live healthcare readiness.”

## Slide 15

**Title:** Productize the repeatable work. Preserve local truth.

**Subtitle:** Fund source-to-policy and policy-to-test first.

**Presenter:** Eangelica Germano Aton

**Interaction:** **Run Agent**, **Open Checklist**, **Open FieldFlow**, **Review Experiments**, **Open Repository**.

**Speaker notes — 9:05–9:25:** “The result is more than a voice-agent demo. It is an inspectable operating model for turning clinic-specific learning into safer, faster, compounding platform capability. I would welcome the chance to go deeper on any trace, contract, or experiment decision.”

## Slide 16

**Title:** Live demo inputs

**Content:**

| Proof             | Inputs                                                       | Evidence                                                              |
| ----------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| Follow-up booking | `I need to book` → `555-0102` → `1971-07-04` → `yes` → `yes` | Verification, 15 minutes, Raman, earliest slot, confirmation, receipt |
| Minor blocked     | `I need to book` → `555-0105` → `2010-08-15` → `yes`         | `UNDER_18`; no search or write                                        |
| Location FAQ      | `Where are your locations?`                                  | Both approved locations and addresses                                 |
| Emergency         | `I am passing out and cannot breathe`                        | 911 before lookup                                                     |

**Interaction:** Each row opens the live agent. **Back to Demo** returns to Slide 4.

**Speaker notes:** “Use this appendix only as a recording or discussion aid.”

## Slide 17

**Title:** Checklist Manifesto

**Content:**

**Requirement → Decision → Proof → Role signal → Boundary**

| Before the demo             | During the proof            | Before the close                   |
| --------------------------- | --------------------------- | ---------------------------------- |
| Reset agent                 | Name rule and tool          | Confirm every required family      |
| Open scenario lab and CI    | Pause on evidence           | State production boundary          |
| Test microphone or use text | Show one negative guarantee | Name next investment and stop rule |

**Interaction:** **Open Full Checklist** and **Return to Scorecard**.

**Speaker notes:** “This checklist keeps the presentation evidence-led and prevents me from substituting polish for proof.”

## Slide 18

**Title:** Sources and evidence

**Content:**

1. Confido Health Product Manager, Platform take-home assignment.
2. Riverbend Gastroenterology scheduling rules and sample data.
3. Confido Health Product Manager, Platform role description.
4. Riverbend public repository, release artifacts, and GitHub Actions.
5. HHS privacy and accessibility guidance; NIST AI RMF; HL7 FHIR scheduling resources.
6. Eangelica Aton résumé and product-method portfolio.

**Interaction:** **Return to Cover**, **Open Repository**, **Open Compliance Matrix**.

**Speaker notes:** “The supplied assignment, clinic rules, résumé, and tested repository are the primary evidence. External sources ground the healthcare, risk, and interoperability boundaries.”

## Presentation Design Contract

Use the established **Clinical Field Notebook** system: paper ivory, river-ink green, Signal Persimmon for human attention or unresolved policy, chartreuse for verified evidence, and red only for safety-critical stops. Preserve the Riverbend ledger/river mark, folio navigation, mono evidence labels, square stamps, and source-to-rule riverline motif. The deck must feel like a concise release dossier for a technical hiring manager, not a generic pitch deck.

## References

[1]: https://www.paraform.com/share/confido-health/cmqfno2if000a0cl8js9ax108 "Confido Health — Product Manager, Platform role"
[2]: https://github.com/eangelica2014/riverbend-gastroenterology-scheduling "Riverbend Gastroenterology Scheduling — Public repository"
[3]: https://2026.eangelica.com/#method "Eangelica Aton — Product methods"
