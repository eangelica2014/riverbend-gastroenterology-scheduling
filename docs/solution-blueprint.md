# Riverbend Gastroenterology Scheduling — Solution Blueprint

**Candidate:** Eangelica Germano Aton  
**Target role:** Product Manager, Platform — Confido Health  
**Reference date for deterministic age and visit-status calculations:** August 26, 2026

## Executive Thesis

The prototype separates **agentic conversation** from **deterministic clinic policy**. The conversational layer interprets what the caller wants, asks one question at a time, repairs ambiguity, summarizes, and selects an allowed tool. The policy layer alone decides eligibility, visit type, provider constraints, duration, discharge restrictions, and whether a human must approve. Typed tools alone read or mutate synthetic scheduling data.

This separation makes the Riverbend agent safer and easier to inspect, but it also exposes the platform opportunity: Confido can productize the conversion of messy clinic artifacts into a versioned policy bundle, test catalog, observable runtime, and controlled deployment lifecycle. The platform should generalize the **primitives and lifecycle**, not turn Riverbend’s accidental local rules into universal product truth.

> **Operating principle:** The conversation can be flexible. The policy cannot.

## Primary Users and Jobs

| User                      | Job to be done                                                                               | Success condition                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Patient or caregiver      | Complete an administrative scheduling task or get clinic information without waiting on hold | Correct resolution, clear confirmation, appropriate transfer, and no medical advice             |
| Forward Deployed Engineer | Translate clinic reality into a working, testable agent and diagnose failures quickly        | Approved configuration, reusable tools, high scenario pass rate, fast root-cause identification |
| Deployment Strategist     | Align clinic stakeholders on scope, unresolved policy, rollout, and outcomes                 | Visible decisions, ownership, acceptance criteria, and honest launch risk                       |
| Clinic operations lead    | Approve policy and understand what the agent will and will not do                            | Traceable rules, realistic simulations, safe handoffs, and rollback confidence                  |
| Platform PM / engineering | Convert repeated implementation work into durable multi-tenant capabilities                  | Reduced time-to-live and FDE effort without lowering correctness or patient experience          |

## Phase 1 Product Scope

The agent supports inbound appointment booking for new and follow-up patients, confirmation, cancellation, rescheduling, clinic FAQs, front-desk transfers, and nurse-line or emergency escalation. It explicitly handles no patient match, duplicate/ambiguous match, no appointment match, unsupported requests, and caller-requested humans.

The evaluator-accessible implementation is a browser-based voice and text experience because the brief prioritizes rules, design, and iteration rather than telephony. Browser speech recognition and synthesis are optional enhancement layers; every action remains accessible through text and scenario playback.

### Scope Boundary

The agent manages **administrative Appointment state**, not diagnosis, treatment, clinical triage, prescription decisions, billing resolution, or an Encounter. Urgent clinical content transfers to the nurse line; clear emergencies receive a 911 instruction before transfer. Unsupported administrative content transfers to the front desk.

## Deterministic Decision Sequence

| Order | Gate                       | Example outcomes                                                                                |
| ----- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| 1     | Safety and intent gate     | Emergency instruction; nurse transfer; front-desk transfer; supported workflow                  |
| 2     | Identity gate              | Phone candidate lookup plus DOB verification before disclosure or mutation                      |
| 3     | Record-state gate          | No match, duplicate ambiguity, discharged restriction, existing appointment lookup              |
| 4     | Patient eligibility gate   | Adult age; active insurance; policy number present                                              |
| 5     | Visit classification gate  | New when never seen or last seen more than three years ago; otherwise follow-up                 |
| 6     | Provider-policy gate       | Follow-up assigned provider; different-provider request needs approval; Dr. Crane Thursday rule |
| 7     | Availability gate          | Earliest eligible slot, correct duration, clinic hours, no lunch overlap                        |
| 8     | Consequential confirmation | Repeat date, time, provider, location, and action before mutation                               |
| 9     | Mutation and receipt       | Typed success or reason-coded failure; final patient-readable confirmation                      |

## Prompt, Knowledge, Policy, and Tool Boundaries

| Layer                | Belongs here                                                                                                                                                 | Must not live here                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| System prompt        | Persona, tone, scope, turn-taking, verification sequence, safety behavior, tool-use discipline, confirmation before mutation                                 | Individual patients, mutable appointment state, full provider calendars, hidden business-rule enforcement |
| Knowledge content    | Practice name, addresses, parking, hours, approved explanation of services and boundaries                                                                    | Eligibility decisions, record mutations, unapproved or unresolved policy                                  |
| Deterministic policy | Age threshold, insurance requirement, visit classification, provider pairing, Dr. Crane exception, discharge restriction, visit duration, earliest-slot rule | Conversational phrasing or clinical advice                                                                |
| Typed tools          | Patient lookup, appointment lookup, availability search, booking, cancellation, rescheduling, transfer, audit event                                          | Free-form decisions, policy invention, direct model database access                                       |
| Runtime state        | Current intent, verification status, selected appointment, pending confirmation, tool outcomes                                                               | Long-term policy source of truth                                                                          |

## Normalized Domain Contracts

The prototype uses FHIR-inspired separation without claiming full FHIR conformance. A production adapter can map these normalized objects to vendor-specific EHR/PMS APIs.

| Object             | Key fields                                                             | Why it is separate                                      |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| `PatientCandidate` | patient ID, masked name, phone match, DOB verification status          | Search results are not verified identity                |
| `CoverageStatus`   | payer, active flag, policy-number-present flag                         | Coverage is a scheduling gate and changes independently |
| `Provider`         | provider ID, role, location, paired provider                           | Supports tenant-specific routing and preferences        |
| `Schedule`         | provider, location, recurrence, exceptions                             | Defines when slots may exist                            |
| `Slot`             | start, end, duration, status, provider, location                       | Availability is not the same as eligibility             |
| `Appointment`      | appointment ID, patient, slot, visit type, status                      | Administrative plan, distinct from a clinical encounter |
| `PolicyDecision`   | allowed, reason code, matched rules, human-review target               | Makes denial and transfer behavior inspectable          |
| `AgentTraceEvent`  | timestamp, turn, intent, gate, tool, outcome, latency, redaction class | Enables replay, evaluation, and incident review         |

## Mock Data Assumptions

The source identifies three patients with upcoming appointments but intentionally leaves appointment details for the candidate to define. The demo adopts the following synthetic records and labels them as assumptions:

| Patient       | Mock upcoming appointment                                                           | Rationale                                                                    |
| ------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Margaret Hill | September 3, 2026, 10:00 AM; Dr. Alan Whitfield; Maple Grove; follow-up; 15 minutes | Tests confirmation, cancellation, and rescheduling with an assigned provider |
| Sofia Delgado | September 4, 2026, 2:00 PM; Dr. Alan Whitfield; Maple Grove; follow-up; 15 minutes  | Tests a second Whitfield patient and future-date mutation                    |
| George Adams  | September 2, 2026, 11:00 AM; Dr. Priya Raman; Lakeside; follow-up; 15 minutes       | Tests a different provider and location                                      |

Availability is a finite synthetic slot fixture beginning August 27, 2026. Search sorts ascending and returns the first slot that passes policy and duration requirements. The demo never represents its fixtures as live clinic inventory.

## Tool Catalog

| Tool                         | Read/write      | Required checks                                                            | Structured result                             |
| ---------------------------- | --------------- | -------------------------------------------------------------------------- | --------------------------------------------- |
| `lookupPatient`              | Read            | Normalized phone, then DOB verification before detail disclosure           | no match, one candidate, multiple candidates  |
| `getAppointments`            | Read            | Verified patient                                                           | active appointments or `NO_APPOINTMENT`       |
| `evaluateBookingEligibility` | Read/decision   | Age, discharge, coverage, policy number, visit classification              | allowed, visit type, duration, reason codes   |
| `searchAvailability`         | Read            | Provider-policy decision, duration, location, earliest-first sorting       | ordered eligible slots                        |
| `bookAppointment`            | Write           | Verified identity, eligible decision, explicit confirmation, unbooked slot | appointment receipt or typed conflict         |
| `cancelAppointment`          | Write           | Verified identity, active appointment, explicit confirmation               | cancelled receipt or typed conflict           |
| `rescheduleAppointment`      | Write           | Same checks as cancel and book, performed atomically in production         | updated receipt or typed conflict             |
| `transferCall`               | External action | Transfer reason and approved destination                                   | front desk, nurse line, emergency instruction |
| `getClinicInfo`              | Read            | Approved FAQ key                                                           | hours, location, parking                      |

## Conversation State Machine

`START → CLASSIFY_INTENT → SAFETY_GATE → IDENTIFY → VERIFY → RETRIEVE → POLICY_EVALUATE → OFFER → CONFIRM → MUTATE → RECEIPT`

At any point, `HUMAN_REQUEST`, `UNSUPPORTED`, `CLINICAL_JUDGMENT`, and `EMERGENCY` exit to a reason-coded transfer state. Repair turns return to the narrowest unresolved state rather than restarting the call.

## Quality Model

| Dimension                | Primary measure                                           | Launch-oriented guardrail                                                         |
| ------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Task correctness         | Scenario outcome and required tool sequence               | 100% pass on critical safety and mutation scenarios in the approved release set   |
| Policy adherence         | Correct reason code and matched rule IDs                  | Zero age, discharge, inactive-insurance, or provider-policy bypasses              |
| Transfer appropriateness | Correct destination and emergency wording                 | Zero medical-advice outputs; zero clear emergencies handled as routine scheduling |
| Mutation safety          | Confirmation and identity gates before write              | Zero writes before DOB verification and explicit confirmation                     |
| Conversation quality     | Turns to resolution, repair success, concise prompts      | No loops beyond two failed repair attempts; human path always available           |
| Accessibility            | Keyboard/text parity, labels, reduced motion, clear focus | Core workflows complete without microphone or animation                           |
| Observability            | Trace completeness and redaction                          | Every policy decision and tool mutation emits a reason-coded event                |

## Phase 1 Scenario Families

The automated catalog includes happy paths and adversarial cases, not only scripted demos. Critical examples include:

1. Existing follow-up booking with active coverage and earliest-slot offer.
2. Returning patient last seen more than three years ago classified as new.
3. Minor blocked by age policy.
4. Inactive coverage blocked before availability search.
5. Missing policy number blocked without exposing available slots.
6. Discharged patient blocked and transferred without debating the flag.
7. Dr. Crane follow-up offered Thursday with Dr. Crane or weekday with Sofia Mendez according to preference.
8. Different-provider request routed for office approval.
9. Confirmation, cancellation, and rescheduling against each assumed upcoming appointment.
10. No patient, duplicate name without sufficient verification, and no appointment.
11. Hours, locations, and parking FAQs.
12. Billing, annual physical, unrecognized request, and explicit human request to front desk.
13. Urgent symptoms to nurse line and clear emergency to 911 instruction.
14. Correction, pause, repetition, and microphone-unavailable fallback.

## Phase 2 Platform Concept: FieldFlow

**FieldFlow** is an FDE-first workbench that turns source artifacts into an approved, testable, deployable clinic agent. It does not remove the FDE from discovery; it makes field learning structured, comparable, and reusable.

### Lifecycle

| Stage       | Platform capability                                                                                 | Primary artifact               |
| ----------- | --------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1. Ingest   | Parse PDFs, documents, tables, and API samples with provenance                                      | Source ledger                  |
| 2. Clarify  | Detect conflicts, omissions, unsupported values, and risky assumptions                              | Ambiguity queue with owners    |
| 3. Compile  | Map approved facts into schemas, policy rules, prompts, FAQ knowledge, and adapter config           | Versioned tenant policy bundle |
| 4. Simulate | Generate scenario families and run deterministic plus conversational evaluations                    | Test matrix and replay traces  |
| 5. Approve  | Human sign-off on critical policy, safety boundaries, and rollout criteria                          | Release candidate              |
| 6. Deploy   | Environment promotion, canary scope, adapter health checks, and rollback                            | Deployment record              |
| 7. Observe  | Resolution, transfer, latency, policy, and patient-experience signals with PHI-aware traces         | Quality dashboard              |
| 8. Improve  | Cluster failures, propose source-linked changes, replay regression set, and share reusable patterns | Improvement proposal           |

### Generic Versus Tenant-Specific Boundary

| Platform primitive                     | Tenant configuration                                  | Keep explicitly local or unresolved               |
| -------------------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Identity and verification workflow     | Accepted identifiers and thresholds                   | Staff-approved exception for a specific patient   |
| Appointment/read-write tool contracts  | EHR/PMS adapter and field mappings                    | Vendor outage workaround with no durable contract |
| Policy schema and evaluation engine    | Age, coverage, visit type, provider, and timing rules | Annual physical policy until Riverbend decides    |
| Knowledge retrieval and provenance     | Addresses, parking, hours, approved FAQ               | Unapproved informal staff habit                   |
| Scenario generation and evaluation     | Clinic-specific data fixtures and acceptance set      | One-time test artifact with no reusable learning  |
| Trace, review, and rollback primitives | Retention, redaction, reviewer roles                  | Raw PHI copied into general product analytics     |

## Designed Prototype Information Architecture

| Route           | Evaluator experience                                                                          | Assignment proof                            |
| --------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `/`             | Case-study brief, thesis, phase map, direct demo paths                                        | Coherent approach and candidate positioning |
| `/agent`        | Interactive voice/text caller, scripted scenarios, live rule and tool trace                   | Inspectable Phase 1 agent equivalent        |
| `/architecture` | Layer map, prompt/knowledge/policy/tool decisions, assumptions                                | Architecture write-up                       |
| `/tests`        | Scenario catalog, pass/fail runner, critical assertions, iteration changes                    | Testing scenarios and iteration evidence    |
| `/platform`     | FieldFlow lifecycle prototype with clinic source, ambiguity, policy, eval, and release states | Designed Phase 2 prototype                  |
| `/experiments`  | Prioritized unknowns, metric contracts, evidence value, and decision rules                    | Required experiment portfolio               |

## Prioritized Experiments

| Priority | Unknown / falsifiable hypothesis                                                                | Smallest useful test                                                                                           | Primary metric                                                       | Evidence value | Decision rule                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| P0       | Structured policy compilation cuts FDE configuration time without reducing critical correctness | Two FDEs configure the same clinic once with current workflow and once with FieldFlow on counterbalanced tasks | Median active setup time; critical scenario pass rate                | 10/10          | Scale if setup time falls at least 30% and critical pass rate is non-inferior; stop or narrow if any critical rule regresses |
| P0       | Generated scenario families find meaningful failures before manual QA                           | Run generated and manually authored suites on seeded policy and tool defects                                   | Unique critical defects found per reviewer hour; false-positive rate | 10/10          | Scale if generated tests find at least 25% more seeded critical defects per hour with under 15% false positives              |
| P1       | Decision traces reduce FDE diagnosis time                                                       | Randomized trace-on versus transcript-only diagnosis of the same failures                                      | Median time to correct root cause; correct-layer identification      | 9/10           | Scale if diagnosis time falls 40% and correct-layer identification improves without exposing excess PHI                      |
| P1       | Ambiguity queues prevent silent assumption errors during onboarding                             | Replay three clinic packets with planted conflicts through normal review versus structured queue               | Unresolved critical ambiguity at approval; review minutes            | 9/10           | Scale if zero planted critical ambiguities reach approval and review time does not increase more than 15%                    |
| P2       | Reusable policy modules improve second-clinic velocity without overgeneralizing                 | Configure a second gastroenterology clinic using suggested modules with mandatory diff review                  | Reuse acceptance rate; override count; critical regression rate      | 7/10           | Scale only if at least 50% of modules are accepted with zero inherited critical policy errors                                |
| P2       | FDE-approved improvement suggestions can shorten the runtime learning loop                      | Shadow-mode clustering and suggested patches on de-identified failed scenarios                                 | Accepted suggestion rate; replay pass improvement; reviewer time     | 6/10           | Keep human-gated; expand if at least 30% are accepted and no suggestion bypasses required approval                           |

## Product and Business Metrics

The north-star is **clinically bounded administrative resolution**, not raw containment. The platform scorecard combines time-to-live, FDE hours per launch, critical scenario pass rate, automation completion, appropriate transfer, patient-rated experience, incident rate, and regression recovery time. Revenue leverage appears when more clinics reach safe automation without linear FDE effort, but quality guardrails prevent speed from becoming the sole optimization target.

## Residual Risks

The demo is synthetic and does not validate real-world speech performance, EHR race conditions, phone transfer reliability, or HIPAA compliance. Browser speech support varies. Clinic rules can conflict or change after approval. Identity-verification thresholds require organizational risk decisions. A production rollout would therefore require security review, accessibility testing with users, adapter certification, clinic sign-off, controlled canary traffic, monitoring, and tested rollback.
