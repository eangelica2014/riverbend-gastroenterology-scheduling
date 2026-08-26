## Cover

**Title:** Riverbend Gastroenterology Scheduling

**Subtitle:** Voice Agent → FieldFlow Platform Strategy

**Presenter:** Eangelica Germano Aton · Confido Health Product Manager, Platform Take-Home · August 2026

## Slide 1

**Title:** The conversation can flex. The policy cannot.

**Content:**

- Flexible language interprets and repairs the caller’s request.
- Deterministic policy authorizes eligibility, provider, duration, and slot order.
- Typed tools mediate every protected read, mutation, and transfer.
- Evidence shows the rule, tool, and outcome at each handoff.

**Interaction:** Three navigation choices: **Run Agent** → Slide 6, **Inspect Platform** → Slide 11, **See Experiments** → Slide 14.

**Speaker notes — 0:00–0:30:** “My central decision was simple: the conversation can be flexible, but clinic authority cannot. I gave the language layer room to understand and communicate, then put identity, eligibility, provider rules, confirmation, and mutations behind deterministic contracts. I’ll show the agent first, then how the Phase 1 friction becomes a platform.”

## Slide 2

**Title:** Two methods; one delivery discipline

**Content:**

| Systemic Design | Innovation | Riverbend translation |
| --- | --- | --- |
| Observe | Sense | Read the person, workflow, source, and signal |
| Frame | Reason | Convert ambiguity into constraints and evidence |
| Build | Deploy | Connect data, model, interface, tools, and handoff |
| Validate | Improve | Test in context; feed approved outcomes back |

**Interaction:** The four rows link to Slides 3, 5, 6, and 8. A **Method Home** button appears on method-led slides and returns here.

**Speaker notes — 0:30–0:58:** “I used two related methods from my portfolio. Observe, Frame, Build, Validate governs how I solve a bounded problem. Sense, Reason, Deploy, Improve governs how evidence moves through a real system and returns as learning. I’m not using these as labels after the fact; each stage produces visible Riverbend artifacts.”

## Slide 3

**Title:** I started with clinic reality—not a stack

**Content:**

- Assignment, scheduling rules, provider matrix, patient table, and role context were treated as evidence.
- Dense source tables were re-read at high resolution; several patient fields were corrected.
- The current date is pinned to **2026-08-26** so age and three-year logic are reproducible.
- Synthetic appointment details are explicit assumptions, not clinic facts.

**Method marker:** Observe + Sense

**Interaction:** **Open Source Ledger** reveals a small overlay listing the three source documents and the verified-data note.

**Speaker notes — 0:58–1:28:** “Observe starts with the person, workflow, and signal—not the available technology. The source packets were not clean configuration. Small-preview OCR misread fields, so I re-read dense tables at high resolution and corrected the record. I pinned the reference date and labeled every synthetic appointment assumption. That source discipline is part of the product.”

## Slide 4

**Title:** Ambiguity became a release artifact

**Content:**

| Open item | Conservative demo choice | Production disposition |
| --- | --- | --- |
| Whitfield Thursday conflict | No Thursday Whitfield slot | Clinic owner + FDE clarify |
| Annual physical not implemented | Front-desk transfer | Clinic owner decides scope |
| Policy numbers absent | Ask only whether available | Integration maps real field |

**Decision:** No critical ambiguity disappears inside a prompt.

**Method marker:** Observe → Frame

**Interaction:** Each row expands to show source condition, severity, owner, and release impact.

**Speaker notes — 1:28–1:58:** “Three items could not be solved by better prompting. The provider table contains a conflict. Annual physicals are explicitly unresolved. Policy numbers are absent. I made conservative demo choices, preserved the uncertainty, and named the production owner. In FieldFlow, this becomes an ambiguity queue that can block promotion.”

## Slide 5

**Title:** Language interprets. Policy authorizes.

**Content:**

- **Prompt:** scope, tone, safety order, turn-taking, confirmation discipline.
- **Knowledge:** approved hours, locations, parking, and service boundaries.
- **Policy:** age, coverage, discharge, visit type, provider, duration, earliest slot.
- **Tools:** verified reads, availability, mutations, transfers, and receipts.

**Method marker:** Frame + Reason

**Interaction:** Click a layer to reveal **owns / must not own**. **Open Architecture** links to the live architecture route.

**Speaker notes — 1:58–2:30:** “The model interprets and communicates; it does not own patient data or clinic authority. Prompt behavior, read-only knowledge, deterministic policy, and typed tools have different jobs. Eligibility runs before availability. Verification runs before protected reads. Exact confirmation runs before writes. This makes the system reviewable and testable rather than dependent on one large prompt.”

## Slide 6

**Title:** A caller hears calm. An FDE sees proof.

**Content:**

- Patient side: one question at a time, plain language, text equivalent, human path.
- FDE side: intent, verification, rule IDs, tool request, receipt, and transfer evidence.
- Voice is a progressive enhancement; the full proof works without microphone or credentials.

**Method marker:** Build + Deploy

**Interaction:** **Launch Live Agent** opens the interactive prototype `/agent`. **Replay Booking** links to Appendix Slide 19 for the exact demo inputs.

**Speaker notes — 2:30–3:25:** “I’ll replay James Porter’s follow-up booking. The phone number retrieves a candidate, DOB verifies him, active coverage and policy availability are checked, the visit is classified as a 15-minute follow-up, and the earliest eligible Priya Raman slot is offered. The write does not happen until an explicit yes. The caller hears a calm answer; the FDE sees the full decision trace.”

## Slide 7

**Title:** The negative guarantee is the product

**Content:**

- **Stop:** under 18, discharged, inactive coverage, or missing card/policy.
- **Approve:** different follow-up provider requires office authorization.
- **Transfer:** clinical judgment goes to the nurse line; unsupported work goes to the front desk.
- **Preempt:** possible emergency triggers 911 instruction before any patient lookup.

**Method marker:** Validate

**Interaction:** Buttons link to scripted cases: **Minor**, **Discharged**, **DOB Mismatch**, **Emergency**.

**Speaker notes — 3:25–3:58:** “A healthcare administrative agent is defined by what it refuses to do. It must not search slots for an ineligible patient, disclose appointment detail after a verification failure, override provider continuity, or continue scheduling through urgent language. The emergency case gives the 911 instruction before a lookup. Those are testable negative guarantees, not tone guidelines.”

## Slide 8

**Title:** A believable sentence is not enough

**Content:**

- **18 / 18** deterministic assertions passed.
- **24 / 24** catalog scenarios replayed successfully.
- Assertions inspect reason codes, required tools, forbidden tools, state mutation, and transfer destination.
- TypeScript and production build checks passed; one non-blocking bundle-size optimization remains.

**Method marker:** Validate + Improve

**Interaction:** **Run Scenario Lab** opens `/tests`. **Show Critical Contract** reveals the zero-tolerance release conditions.

**Speaker notes — 3:58–4:30:** “I do not treat fluent language as proof. The suite checks the reason code, rule path, required and forbidden calls, transfer destination, and whether state changed. All 18 automated assertions and 24 catalog replays pass. The build passes as well. I kept the non-blocking bundle-size warning visible because an honest read includes what remains.”

## Slide 9

**Title:** Phase 1 revealed the platform

**Content:**

| Field friction | Platform response |
| --- | --- |
| Uneven sources | Source ledger + confidence |
| Silent assumptions | Ambiguity queue |
| Prose-bound rules | Policy schema + compiler |
| Manual QA | Scenario generation + replay |
| Opaque failures | Decision trace + reason codes |
| Risky change | Approval, canary, rollback |

**Interaction:** Each response links to its FieldFlow stage on Slide 11.

**Speaker notes — 4:30–4:55:** “The platform proposal comes directly from work I had to do in Phase 1. I had to verify source quality, clarify contradictions, compile rules, build tests, diagnose behavior, and control change. FieldFlow productizes those repeatable tasks instead of beginning with a generic visual agent builder.”

## Slide 10

**Title:** Productize the repeatable work

**Subtitle:** Preserve the local truth.

**Interaction:** **Enter FieldFlow** advances to Slide 11; **Return to Agent** links to Slide 6.

**Speaker notes — 4:55–5:08:** “This is the Phase 2 decision: productize contracts and control, while preserving clinic-specific truth and clinic ownership.”

## Slide 11

**Title:** FieldFlow makes every handoff inspectable

**Content:**

**Ingest → Clarify → Compile → Simulate → Approve → Deploy → Observe → Improve**

Every stage produces a durable artifact, a named decision, and a release gate.

**Method marker:** Sense → Reason → Deploy → Improve

**Interaction:** Eight stage buttons open short detail panels with the primary artifact and gate. **Open Live FieldFlow** links to `/platform`.

**Speaker notes — 5:08–5:42:** “FieldFlow is an FDE control plane for the full lifecycle. Ingest creates a source ledger. Clarify creates an ambiguity queue. Compile produces a tenant policy bundle. Simulate produces regression evidence. Approve signs the exact release candidate. Deploy is reversible. Observe measures bounded outcomes. Improve drafts a human-gated change and replays regression.”

## Slide 12

**Title:** Generalize contracts—not clinic truth

**Content:**

| Platform primitives | Tenant truth |
| --- | --- |
| Identity workflow | Required attributes + fallback |
| Policy schema + reason codes | Thresholds, durations, pairings |
| Typed tool registry | Vendor adapter + permissions |
| Scenario DSL + replay | Fixtures + local outcomes |
| Release gates + rollback | Local owners + thresholds |

**Decision:** Riverbend’s three-year rule and provider exceptions never become defaults by copy-paste.

**Interaction:** A center divider toggles between **Generalize** and **Keep Local** examples.

**Speaker notes — 5:42–6:14:** “The generalization boundary is the product. Identity state, policy schema, tool authorization, scenario grammar, traces, and rollback compound across clinics. Riverbend’s thresholds, pairings, and unresolved exceptions remain tenant configuration with provenance. A reusable pattern is only a suggestion until the destination clinic approves it.”

## Slide 13

**Title:** Improvement stays human-gated

**Content:**

1. Sense a redacted failure pattern.
2. Identify the likely prompt, policy, tool, adapter, or source layer.
3. Draft a source-linked change; never mutate the approved bundle.
4. Human approval → regression replay → canary → rollback-ready release.

**Method marker:** Reason + Improve

**Interaction:** The loop animates one step at a time; **Why not autonomous?** opens a risk overlay.

**Speaker notes — 6:14–6:42:** “I interpret self-learning carefully in healthcare operations. Runtime evidence can cluster failures and draft a source-linked proposal. It cannot rewrite eligibility or escalation behavior. The approved bundle remains immutable. A human approves the change, the critical suite replays, and deployment remains canary-scoped and reversible.”

## Slide 14

**Title:** Want the answer before wanting the feature

**Content:**

| Priority | Experiment | Want answer | Scale signal |
| --- | --- | ---: | --- |
| P0 | Policy compiler cuts setup time | 10 / 10 | ≥30% faster; no critical regression |
| P0 | Generated scenarios find real defects | 10 / 10 | ≥25% defect-yield lift; <15% false positives |
| P1 | Traces shorten diagnosis | 9 / 10 | ≥40% faster; no excess PHI exposure |
| P1 | Ambiguity queue prevents silent assumptions | 9 / 10 | Zero planted critical conflicts at approval |

**Method marker:** Validate + Improve

**Interaction:** Rows expand to show the smallest test, metric contract, and stop rule. **Full Portfolio** opens `/experiments`.

**Speaker notes — 6:42–7:12:** “I prioritize the evidence, not the feature list. The two P0 questions are whether compilation reduces active FDE time without reducing critical correctness and whether generated scenarios improve critical defect yield. Each has a smallest counterbalanced test and an explicit stop rule. I would not fund broader platform expansion before these results.”

## Slide 15

**Title:** Fund source-to-policy and policy-to-test first

**Content:**

- **Now:** source ledger, ambiguity queue, typed policy bundle, critical scenarios.
- **Next:** trace replay, source-linked diffs, release gates, rollback.
- **Later:** controlled module suggestions and shadow-mode improvement proposals.
- **Not yet:** broad drag-and-drop builder or ungated self-modification.

**Method marker:** Deploy

**Interaction:** Now / Next / Later tabs reveal the experiment dependency and exit criterion.

**Speaker notes — 7:12–7:36:** “My roadmap starts with the bottleneck Riverbend proved. I would build the source-to-test control plane, then add diagnosis and release controls, then test cross-clinic modules and shadow-mode suggestions. A visual builder or autonomous learning is premature until the central leverage and quality hypotheses earn the investment.”

## Slide 16

**Title:** Measure bounded resolution—not raw completion

**Content:**

**North star:** Correct administrative outcome **or** appropriate transfer, with no safety or privacy violation.

| Outcome | Leverage | Guardrail |
| --- | --- | --- |
| Bounded resolution | FDE hours per launch | Critical pass rate |
| Correct transfer | Time to approved release | Zero medical-advice completion |
| Low repeat/correction | Diagnosis + recovery time | Zero inherited critical rule error |

**Interaction:** Click the north star to reveal the exclusion rule: incorrect completion counts as failure.

**Speaker notes — 7:36–8:00:** “Raw automation can reward the wrong behavior. The north star is clinically bounded administrative resolution: correct completion or appropriate transfer, with no safety or privacy violation. I pair patient and operational outcomes with FDE leverage, then gate both with critical correctness and recovery.”

## Slide 17

**Title:** This is how I lead platform product

**Content:**

- **Healthcare restraint:** scheduling, coverage, identity, interoperability, clinical handoff.
- **Agentic delivery:** prompt, policy, tools, voice, trace, tests, release lifecycle.
- **Builder fluency:** hands-on React/TypeScript prototype and open-source repository.
- **FDE product judgment:** field ambiguity → contracts → experiments → reusable leverage.

**Interaction:** Four proof buttons link back to Slides 3, 6, 11, and 14. **Open Repository** links to the Riverbend Gastroenterology Scheduling GitHub repository after publication.

**Speaker notes — 8:00–8:28:** “This reflects how I work as a Technical Product Lead: begin with the person and workflow, make uncertainty visible, reason across the full system, work in the codebase, test negative guarantees, and translate field learning into platform leverage. My healthcare, agentic AI, API, and product-engineering background makes that combination native rather than theoretical.”

## Slide 18

**Title:** Build the next care system beside the field

**Subtitle:** Human first. Evidence in the interface. Scale only what the outcome earns.

**Presenter:** Eangelica Germano Aton

**Interaction:** **Run Agent**, **Open FieldFlow**, **Review Experiments**, **Method Home**, and **Questions** links.

**Speaker notes — 8:28–8:42:** “Thank you. I’m happy to stay in the prototype, go deeper on the platform boundary, or walk through any scenario and the evidence behind it.”

## Slide 19

**Title:** Live demo menu

**Content:**

| Proof | Scripted inputs | Evidence to point out |
| --- | --- | --- |
| Book follow-up | “I need to book” → 555-0102 → 1971-07-04 → yes → yes | Verification, follow-up, Raman, earliest slot, explicit confirmation |
| Block minor | “I need to book” → 555-0105 → 2010-08-15 → yes | UNDER_18; no availability or write |
| Confirm | “Confirm my appointment” → 555-0101 → 1958-02-10 | Verified appointment read; no mutation |
| Emergency | “I am passing out and cannot breathe” | 911 instruction before patient lookup |

**Interaction:** Each row links directly to the live agent route; **Back to Demo** returns to Slide 6.

**Speaker notes:** “Use this appendix only as a recording or discussion aid. The scripted scenarios can also be launched from the ribbon at the top of the agent workspace.”

## Slide 20

**Title:** Sources and evidence

**Content:**

1. Confido Health, product site: https://www.confido.health/home
2. Confido Health, Product Manager, Platform role: https://www.paraform.com/share/confido-health/cmqfno2if000a0cl8js9ax108
3. HHS OCR, HIPAA and audio-only telehealth: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-audio-telehealth/index.html
4. HHS/DOJ, nondiscrimination in telehealth: https://www.hhs.gov/civil-rights/for-individuals/disability/guidance-on-nondiscrimination-in-telehealth/index.html
5. NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
6. HL7 FHIR Appointment: https://www.hl7.org/fhir/appointment.html
7. Eangelica Aton, systemic design and innovation methods: https://2026.eangelica.com/#method

**Interaction:** **Return to Cover** and **Method Home** links.

**Speaker notes:** “The supplied assignment, Riverbend scheduling rules, candidate résumé, and tested repository artifacts are the primary evidence for the submission. External sources ground product context, privacy, accessibility, risk management, and interoperability boundaries.”

## Presentation Design Contract

The presentation must use the **Clinical Field Notebook** language: paper ivory, deep river-green ink, Signal Persimmon for human attention or unresolved policy, chartreuse for verified evidence, and red only for safety-critical stops. Typography should pair an editorial serif with a precise sans and mono evidence labels. Square evidence stamps, rule ribbons, riverline connectors, a visible Riverbend ledger/river mark, and persistent method navigation create the interaction grammar. The presentation should feel authored, operational, and healthcare-specific—not like a generic blue dashboard or template pitch deck.

## Recording Guidance

The primary recording path is Slides 1–18 and lasts approximately 8 minutes 40 seconds if the scripted live demo remains under one minute. Slides 19–20 are appendices. If the live prototype is unavailable during recording, use the embedded demo menu and screenshots rather than improvising claims. Do not show real patient information. Keep the browser zoom large enough to make the decision trace legible. When a scenario completes, pause briefly on the rule ID, tool name, and outcome receipt before returning to the deck.

## References

[1]: https://www.confido.health/home "Confido Health — Voice AI Receptionist for Healthcare Practices"
[2]: https://www.paraform.com/share/confido-health/cmqfno2if000a0cl8js9ax108 "Confido Health — Product Manager, Platform role"
[3]: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-audio-telehealth/index.html "HHS OCR — HIPAA and Audio-Only Telehealth"
[4]: https://www.hhs.gov/civil-rights/for-individuals/disability/guidance-on-nondiscrimination-in-telehealth/index.html "HHS/DOJ — Nondiscrimination in Telehealth"
[5]: https://www.nist.gov/itl/ai-risk-management-framework "NIST — AI Risk Management Framework"
[6]: https://www.hl7.org/fhir/appointment.html "HL7 FHIR — Appointment"
[7]: https://2026.eangelica.com/#method "Eangelica Aton — Systemic Design and Four-Stage Innovation Methods"

