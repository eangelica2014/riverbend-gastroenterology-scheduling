# Riverbend Hiring-Manager Checklist Manifesto

**Candidate:** Eangelica Germano Aton  
**Role:** Product Manager, Platform — Confido Health  
**Purpose:** Present the work as a sequence of verifiable promises, not a tour of artifacts.

> **One-sentence thesis:** I made Riverbend’s clinic-specific truth safe, explicit, testable, and inspectable; then I turned the repeated work into FieldFlow, an FDE-first platform lifecycle that compounds learning across clinics without turning local policy into a global default.

## The Rule of the Presentation

For every claim, complete the same five-step check:

1. **Name the requirement.** State what Confido asked for in plain language.
2. **Show the decision.** Explain the product or architecture choice and why it was necessary.
3. **Open the proof.** Use the live agent, trace, scenario lab, platform prototype, document, repository, or CI run.
4. **Connect the role.** State which Platform PM responsibility this demonstrates.
5. **Name the boundary.** Say what is intentionally not production-complete and what the next gate would be.

This prevents three common take-home failures: presenting attractive screens without behavioral proof, presenting code without product judgment, or presenting confidence without an honest operating boundary.

## Preflight Checklist — Two Minutes Before Recording

- [ ] Open the final deck in presentation mode and confirm internal links work.
- [ ] Open the live prototype at `https://technical.eangelica.com/agent` in a second tab.
- [ ] Open the scenario lab at `https://technical.eangelica.com/tests` in a third tab.
- [ ] Open GitHub CI at `https://github.com/eangelica2014/riverbend-gastroenterology-scheduling/actions`.
- [ ] Confirm the agent is reset to its initial state and the transcript shows its idle privacy note.
- [ ] Keep the **Book follow-up** scenario ready; this is the primary happy-path demo.
- [ ] Keep the **Possible emergency** scenario ready; this is the primary negative-guarantee demo.
- [ ] Keep the **Clinic locations** scenario visible; it is the audit-added proof that all required FAQ classes are explicitly tested.
- [ ] If microphone permission fails, use text input without apologizing; voice is a progressive enhancement, and the full workflow remains inspectable.
- [ ] Do not show or discuss real patient data, credentials, or production access.
- [ ] Target **9:15–9:45**. Use the five-minute cut only if the submission platform imposes a shorter limit.

## Primary Video Route — Requirement → Proof → Role Fit

| Time      | Check                                             | Speak                                                                                                                               | Show                                                    | Requirement and role signal                                                       |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 0:00–0:35 | [ ] Establish the promise                         | “This is a voice-agent build, a productization strategy, and a release-quality proof system.”                                       | Cover and proof index                                   | Both assignment phases; builder-PM framing                                        |
| 0:35–1:05 | [ ] Explain how the work was framed               | “I treated the rules and sample data as operational evidence, not clean configuration.”                                             | Source-to-decision slide                                | FDE discovery; ambiguity management                                               |
| 1:05–1:50 | [ ] Demonstrate empathy becoming product behavior | Explain one-question turns, retained intent, transcript correction, privacy-first identity, supported handoff, and no-blame denials | Empathy-to-design slide, then transcript/progress rail  | Human-centered problem solving; patient experience                                |
| 1:50–2:35 | [ ] Prove the architecture boundary               | “Conversation is flexible; authorization is deterministic.”                                                                         | Prompt/knowledge/policy/tool/adapter/trace architecture | Agentic architecture; hands-on technical judgment                                 |
| 2:35–4:05 | [ ] Run one complete appointment path             | Book follow-up for `555-0102`; verify DOB; confirm coverage; inspect earliest eligible slot; confirm write                          | Live `/agent`                                           | Book existing patient; identity; policy; availability; confirmation; tool receipt |
| 4:05–4:45 | [ ] Prove a negative guarantee                    | Run possible emergency or under-18 scenario                                                                                         | Live trace or `/tests`                                  | Safety preemption or policy denial; forbidden tools                               |
| 4:45–5:25 | [ ] Close every Phase 1 requirement               | Name appointment, FAQ, transfer, and failure families; mention the location-FAQ audit addition                                      | Compliance/checklist slide and scenario lab             | Complete Phase 1 coverage; honest iteration                                       |
| 5:25–6:00 | [ ] Show release evidence                         | “Quality is a release contract, not a demo impression.”                                                                             | CI/CD slide and public Actions run                      | Tests, TypeScript, build, CI; agent-quality benchmark                             |
| 6:00–6:40 | [ ] Make the Phase 1 → Phase 2 inference          | “The repeated work was source clarification, policy compilation, simulation, and diagnosis.”                                        | Friction-to-platform slide                              | Productizes shared problems, not screens                                          |
| 6:40–7:30 | [ ] Walk FieldFlow                                | Ingest → Clarify → Compile → Simulate → Approve → Deploy → Observe → Improve                                                        | `/platform` or lifecycle slide                          | Full agent lifecycle; FDE-first contracts                                         |
| 7:30–8:05 | [ ] Draw the generalization line                  | “Generalize contracts and control; preserve local truth.”                                                                           | Generalization boundary                                 | Multi-tenant platform judgment                                                    |
| 8:05–8:45 | [ ] Prove disciplined experimentation             | Show P0 policy compiler and generated-scenario experiments with numeric gates                                                       | `/experiments`                                          | Smallest falsifying test; scale/stop discipline                                   |
| 8:45–9:20 | [ ] Connect to business and role                  | Relate FDE hours, time to approved release, defect yield, diagnosis time, and second-clinic setup                                   | Role-fit/metrics slide                                  | Revenue leverage without linear FDE growth                                        |
| 9:20–9:40 | [ ] Close with the decision                       | “Fund source-to-policy and policy-to-test first; do not fund autonomous policy drift.”                                              | Final decision slide                                    | Prioritization, safety, and executive clarity                                     |

## Phase 1 Completeness Checklist

### Appointment Management

- [ ] **New-patient visit:** show `SCN-BOOK-RETURNING-AS-NEW`; explain that Riverbend defines a patient last seen more than three years ago as new. The sample-data constraint means an unmatched caller is handled safely rather than silently registered.
- [ ] **Existing-patient follow-up:** show `SCN-BOOK-FOLLOWUP`; verify 15 minutes, assigned provider, and earliest eligible slot.
- [ ] **Reschedule:** show `SCN-RESCHEDULE-GEORGE`; verify lookup → eligibility → availability → explicit confirmation → mutation.
- [ ] **Cancel:** show `SCN-CANCEL-SOFIA`; verify the selected appointment alone changes after confirmation.
- [ ] **Confirm:** show `SCN-CONFIRM-MARGARET`; verify read-only retrieval and no mutation.

### Required FAQs

- [ ] **Hours:** `SCN-FAQ-HOURS` includes weekday hours and lunch closure.
- [ ] **Locations:** `SCN-FAQ-LOCATIONS` includes Maple Grove and Lakeside names and addresses plus `getClinicInfo` provenance.
- [ ] **Parking:** `SCN-FAQ-PARKING` preserves location-specific meter versus free-lot guidance.

### Transfers and Failure Recovery

- [ ] **Front desk:** explicit human, billing, annual physical, discharged status, provider exception, and unsupported-intent paths.
- [ ] **Medical professional:** urgent/clinical-judgment language routes to the nurse line without advice.
- [ ] **Possible emergency:** 911 instruction preempts patient lookup and scheduling.
- [ ] **No matching patient:** no record or appointment detail is disclosed.
- [ ] **No matching appointment:** verified patient receives a clear next step and no mutation.
- [ ] **Unrecognized request:** one repair attempt, then front-desk transfer.
- [ ] **Caller wants a human:** immediate handoff without repeated qualification.

### Required Phase 1 Artifacts

- [ ] **Openable agent:** public voice/text prototype with no login or vendor credential.
- [ ] **Test scenarios:** 25 named scenarios and 19 deterministic assertions.
- [ ] **Architecture write-up:** prompt, knowledge, policy, tools, adapter, trace, privacy, safety, accessibility, and production boundary.
- [ ] **Iteration log:** source defects, rejected designs, changes, validation, visual review, audit gap, and remaining warning.

## Riverbend Rule-Fidelity Checklist

- [ ] Three-year new/follow-up boundary is explicit and reference-date reproducible.
- [ ] New visits are 30 minutes; follow-ups are 15 minutes.
- [ ] Active insurance is required.
- [ ] Card or policy number must be available.
- [ ] Patients under 18 cannot be booked.
- [ ] Follow-ups use the assigned provider unless the office approves a change.
- [ ] Dr. Crane is offered only on Thursday when requested personally.
- [ ] Sofia Mendez is offered only when the Crane-team patient accepts the paired clinician.
- [ ] The earliest **eligible** slot is offered only after policy approval.
- [ ] Discharged patients are never searched for availability or booked.
- [ ] Annual physical scheduling remains visibly unresolved and transfers to staff.
- [ ] Lunch closure and location availability remain tenant configuration, not conversational invention.

## Phase 2 Completeness Checklist

- [ ] **Short document:** FieldFlow strategy connects Phase 1 evidence to product decisions.
- [ ] **Generalization:** each repeated FDE friction maps to a reusable platform artifact or lifecycle control.
- [ ] **Do-not-generalize boundary:** clinic thresholds, provider rules, location schedules, and unresolved policy remain local or configurable.
- [ ] **Agentic boundary:** AI extracts, suggests, clusters, drafts, and explains; it does not authorize critical policy or rewrite production behavior.
- [ ] **Non-agentic authority:** typed policy, permissions, release gates, audit, canary, rollback, and human approvals remain deterministic.
- [ ] **Designed prototype:** the FieldFlow workspace shows all eight stages, artifacts, gates, boundaries, and FDE decisions.
- [ ] **Experiments:** six P0–P2 bets each include a hypothesis, smallest useful test, primary metric, numeric target movement, guardrail, and stop/scale rule.
- [ ] **Prioritization:** policy compiler and generated critical scenarios are P0 because correctness and FDE leverage must be proven before feature breadth.

## Platform PM Role Checklist

- [ ] **Hands-on builder:** show working TypeScript product, policy engine, speech interface, tests, CI, documentation, and release—not only a PRD.
- [ ] **FDE-first discovery:** show source ledger, ambiguity queue, rule provenance, scenario generation, and decision trace.
- [ ] **Multi-tenant architecture:** show normalized contracts and tenant-local configuration rather than Riverbend rules masquerading as global defaults.
- [ ] **Lifecycle ownership:** show build → test → deploy → monitor → evaluate → improve → scale through FieldFlow’s eight governed stages.
- [ ] **Self-learning judgment:** show human-gated improvement proposals and explain why runtime policy remains immutable.
- [ ] **Experiments:** show falsification, numeric movement, and stop/narrow rules rather than a feature wish list.
- [ ] **Commercial leverage:** connect product work to active FDE hours, time to approved release, defect yield, diagnosis time, and second-clinic setup.
- [ ] **Agent quality:** show required and forbidden tools, reason codes, trace replay, privacy and safety preemption, and CI.
- [ ] **Healthcare judgment:** keep administrative completion distinct from clinical advice; preserve human escalation and privacy boundaries.
- [ ] **NYC field model:** state availability for onsite work and domestic provider travel.

## Red-Line Checklist — Do Not Overclaim

- [ ] Say **synthetic-data evaluator prototype**, not production deployment.
- [ ] Say **browser voice/text interface**, not a production phone system.
- [ ] Say **normalized future adapter boundary**, not a live EHR integration.
- [ ] Say **privacy-aware architecture**, not HIPAA-certified or compliant.
- [ ] Say **human-gated learning**, not autonomous self-modifying policy.
- [ ] Say **experiment design with decision rules**, not completed experiment results.
- [ ] Say **candidate-recorded video is ready**, not already submitted unless it has been recorded.
- [ ] Distinguish deterministic 19/19 assertions from 25/25 catalog scenario replays.

## Five-Minute Cut

If time is constrained, use only these six proof moments:

| Time      | Proof moment                                                |
| --------- | ----------------------------------------------------------- |
| 0:00–0:35 | Thesis and two-phase deliverable map                        |
| 0:35–1:20 | Empathy-to-design and deterministic architecture            |
| 1:20–2:35 | Live follow-up booking with trace and progress              |
| 2:35–3:05 | Emergency or minor negative guarantee                       |
| 3:05–3:45 | Tests, 25 scenarios, CI, and failed-to-green iteration      |
| 3:45–5:00 | FieldFlow lifecycle, P0 experiments, role fit, and decision |

## Closing Checklist

- [ ] Repeat the platform thesis: **productize repeatable work; preserve local truth**.
- [ ] Name the first investment: source-linked policy compiler plus generated critical scenarios.
- [ ] Name what not to fund yet: autonomous policy changes, uncontrolled cross-clinic propagation, or a generic visual builder.
- [ ] Connect the decision to Confido: faster FDE launches, higher quality, safer rollout, and compounding field learning.
- [ ] End with a concrete invitation: “I would welcome the chance to walk through the trace, the platform contracts, or the experiment decisions in more depth.”

## References

[1]: ../upload/ConfidoHealth-ProductManager,PlatformTakeHome.pdf "Confido Health — Product Manager, Platform Take-Home"
[2]: https://www.paraform.com/share/confido-health/cmqfno2if000a0cl8js9ax108 "Confido Health — Product Manager, Platform role"
[3]: https://github.com/eangelica2014/riverbend-gastroenterology-scheduling "Riverbend Gastroenterology Scheduling — Public repository"
