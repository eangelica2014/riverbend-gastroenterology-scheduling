# FieldFlow: Productizing Agent-Building Without Flattening Clinic Reality

**Author:** Eangelica Germano Aton  
**Role:** Product Manager, Platform candidate  
**Case:** Riverbend Gastroenterology Scheduling  
**Date:** August 26, 2026

## Executive Summary

Riverbend exposed a recurring FDE problem: the hard part of agent-building is not writing a longer prompt. It is converting uneven source material, implicit clinic decisions, mutable records, safety boundaries, and integration behavior into one governed system that can be tested and changed without losing trust. Confido describes an operating model in which healthcare agents complete administrative work inside EHR and PMS workflows while deliberately transferring work that requires clinical judgment.[1] The platform opportunity is therefore not a generic chatbot builder. It is a **field-to-production control plane** for the full agent lifecycle.

I propose **FieldFlow**, an FDE-first workspace that turns clinic artifacts into a source-linked, human-approved tenant bundle; generates evidence-bearing scenarios; promotes the bundle through controlled environments; observes bounded administrative outcomes; and proposes improvements without allowing the runtime to rewrite clinic policy. This preserves Confido’s forward-deployed advantage while converting repeated implementation work into durable multi-tenant primitives.

> **Product thesis:** Productize the repeatable work. Preserve the local truth.

## What Phase 1 Taught Me

The voice agent required four kinds of reasoning that should remain separate. The conversation orchestrator needed latitude to interpret language and repair turns. The policy engine needed deterministic authority over age, coverage, discharge, visit type, duration, provider continuity, and slot order. Typed tools needed to mediate all reads, writes, and transfers. The source ledger needed to preserve provenance and make contradictions visible. Combining these in one prompt would have made the system faster to sketch but slower to debug, review, migrate, and trust.

The Riverbend source also proved that onboarding material cannot be treated as clean configuration. A provider row contained a workday/location conflict; annual physicals were explicitly unresolved; policy-number values were absent; and appointment fixtures had to be created by the implementer. Each ambiguity was operationally meaningful. The correct platform behavior is to make it inspectable, assign an owner, and block critical promotion when necessary—not silently guess.

| Phase 1 friction | Evidence from Riverbend | Platform response |
| --- | --- | --- |
| Source quality | OCR and small previews misread patient/provider fields | Source ledger, visual verification, field confidence, provenance |
| Implicit business rules | Eligibility, duration, pairing, and Thursday behavior were embedded in prose/tables | Typed policy schema, reason codes, version diff, approval |
| Missing or contradictory truth | Whitfield conflict, annual-physical TBD, absent policy numbers | Ambiguity queue with owner, severity, disposition, and release impact |
| Safety mixed with ordinary intent | Urgent symptoms or emergencies can appear during any administrative flow | Preemptive safety classifier, clinical-transfer contract, critical scenarios |
| EHR/PMS coupling | Patient, coverage, schedule, slot, and appointment behavior vary by system | Normalized domain contracts plus tenant adapters |
| QA effort | Correctness depends on sequence, tools, denials, and negative guarantees | Scenario generation, trace replay, forbidden-call assertions, regression gates |
| Iteration risk | A change can preserve fluent language while breaking a tool or rule | Versioned bundle, environment promotion, canary scope, rollback |

## Primary User and Job

The primary user is the **Forward Deployed Engineer**, working with a deployment strategist and clinic owner. Their job is not merely to configure an agent. It is to translate the clinic’s operating truth into a reliable, observable, revenue-producing automation and maintain it as the clinic and integration change. This aligns with the role’s explicit FDE-first lifecycle ownership: build, test, deploy, monitor, evaluate, improve, and scale.[2]

The secondary users are clinic subject-matter owners who must review policy without reading code, engineering/platform teams who maintain shared contracts and adapters, and quality/safety operators who investigate failures and govern releases. Patient interactions are the outcome surface, not the configuration surface.

## Product Principles

**Evidence must survive every handoff.** A source excerpt becomes a typed rule with provenance; the rule appears in a scenario; the scenario appears in a release gate; the runtime trace points back to the same identifier. **Useful beats impressive.** FieldFlow should reduce active FDE work, diagnosis time, and unsafe variation rather than showcase maximal automation. **Critical authority remains human-gated.** The system may extract, suggest, cluster, and draft, but it does not silently approve policy or self-modify production behavior. **The system is one product.** Data, model, policy, interface, privacy, tools, deployment, rollback, and human escalation are designed together.

## FieldFlow Lifecycle

| Stage | FDE question | System action | Durable artifact | Gate |
| --- | --- | --- | --- | --- |
| **1. Ingest** | What did the clinic actually provide? | Parse documents, tables, forms, transcripts, and existing configurations; preserve page/cell provenance | Source ledger | Unreadable critical source blocks compilation |
| **2. Clarify** | What is missing, conflicting, or consequential? | Detect ambiguous values and cross-source conflict; assign owner and severity | Ambiguity queue | Critical ambiguity requires disposition |
| **3. Compile** | What belongs in prompt, knowledge, policy, tool, or adapter configuration? | Produce a typed tenant bundle with rule IDs and source references | Versioned policy bundle | Human approval for critical policy |
| **4. Simulate** | Can this bundle survive happy paths and failure modes? | Generate scenario families and replay intent, gate, rule, tool, result, and response | Regression matrix | All critical scenarios pass |
| **5. Approve** | Are clinic truth and safety boundaries correctly represented? | Present source-linked diffs and unresolved risk to clinic/FDE reviewers | Signed release candidate | Named owner and rollback plan |
| **6. Deploy** | How do we promote without making the clinic the test environment? | Validate adapter health, canary scope, version compatibility, and rollback | Deployment record | Technical and operational readiness |
| **7. Observe** | Did the workflow resolve correctly and appropriately? | Measure bounded resolution, correct transfer, latency, reason codes, and recovery | Quality dashboard | Threshold alerts and incident playbook |
| **8. Improve** | Which failures deserve a policy, test, tool, or platform change? | Cluster redacted failures, propose source-linked changes, replay regression | Improvement proposal | Human approval before promotion |

This lifecycle echoes NIST’s governance emphasis: trustworthiness must be considered throughout design, development, use, and evaluation, not appended after a demo.[3] It also matches healthcare scheduling interoperability boundaries. HL7 distinguishes a schedule from a reservable slot and a planned appointment, while its workflow notes that availability does not itself establish eligibility.[4] FieldFlow therefore evaluates clinic policy before calling availability and maps vendor-specific systems through adapters rather than placing clinic rules in vendor plumbing.

## Generalization Boundary

The platform should generalize **contracts and control**, not every clinic decision. A reusable primitive earns platform status when it is cross-tenant, versionable, observable, permissionable, and testable. A rule remains tenant configuration when its meaning depends on local policy, staffing, service scope, location, or unresolved owner judgment.

| Generalize as a platform primitive | Why it compounds | Keep configurable or local | Why it must not become a default |
| --- | --- | --- | --- |
| Identity workflow and verification state | Protects reads/writes across tenants | Required attributes and fallback path | Risk and accessible verification practices differ |
| Policy schema, reason codes, and compiler | Makes business rules diffable and testable | Three-year threshold, age minimum, visit durations | Local clinical and operational policy varies |
| Typed tool registry and authorization | Standardizes least-privilege reads, writes, transfers, and receipts | Vendor adapter and clinic permissions | EHR/PMS capability and clinic authority vary |
| Scenario families and assertion DSL | Reuses safety, privacy, repair, and mutation patterns | Patient/provider/appointment fixtures and expected local outcomes | Test truth must reflect the clinic bundle |
| Trace, replay, release gates, rollback | Reduces diagnosis and migration risk | Retention, visibility, and operational thresholds | Privacy, contracts, and risk appetite vary |
| Module registry with provenance | Surfaces reusable, field-proven patterns | Module acceptance and policy overrides | A shared pattern is a suggestion until locally approved |
| Ambiguity queue and review workflow | Prevents silent implementation assumptions | Owner, disposition, and source-specific resolution | Only the clinic can settle some ambiguities |
| Outcome/incident taxonomy | Enables portfolio learning without raw transcript dependence | Clinic baseline and target | Volume, mix, staffing, and workflow differ |

Riverbend’s three-year threshold, Dr. Crane’s Thursday behavior, provider pairings, lunch closure, annual-physical status, and Whitfield conflict are configuration with provenance. They should never be copied into a second clinic because they happened to work in the first.

## System Architecture and Contracts

FieldFlow stores a tenant-scoped **source ledger**, **policy bundle**, **scenario catalog**, **release candidate**, **deployment record**, and **quality event**. The agent runtime consumes only an approved bundle version. Tools accept validated inputs and return typed results or reason-coded failures. A trace event records redacted intent, verification state, policy decision, tool request, tool outcome, response class, escalation, bundle version, and correlation ID.

HHS guidance supports reasonable safeguards and identity verification for unknown individuals without mandating one universal method, and it notes that electronic audio, recordings, and transcripts can create security obligations.[5] Production FieldFlow should therefore support tenant isolation, least privilege, encryption, configurable retention, PHI-safe telemetry, role-based review, accessible verification paths, vendor/BAA assessment, and auditability. The take-home demo uses only synthetic records and browser speech.

## Human-Gated Improvement, Not Autonomous Policy Drift

“Self-learning” should mean that the platform detects recurring failure patterns, attaches evidence, identifies the likely layer, proposes a source-linked change, and automatically replays the regression suite. It should **not** mean that a production agent rewrites eligibility or escalation behavior from live calls. Runtime signals can create a draft improvement; an authorized FDE or clinic owner approves the relevant change; the release pipeline then applies normal tests, canary scope, and rollback.

This creates a defensible learning loop. Tenant improvements remain tenant-scoped by default. A pattern can become a reusable module only after de-identification, repeated cross-clinic evidence, explicit platform review, documented applicability, and local acceptance at each destination clinic.

## Measures of Success

The north star is **clinically bounded administrative resolution**: the share of in-scope requests that end in a correct, policy-compliant administrative outcome or an appropriate transfer, with no safety or privacy violation. Completion without correctness is not success.

| Dimension | Metric | Guardrail |
| --- | --- | --- |
| FDE leverage | Median active FDE hours per launch; time to first approved release | Critical scenario pass rate must not decline |
| Patient outcome | Bounded resolution; correction/repeat rate; appropriate transfer | Zero known medical-advice completions |
| Quality | Critical regression pass rate; policy/tool error rate | Release blocked by critical failure |
| Operations | Median diagnosis time; recovery time; rollback success | Trace access is role-scoped and PHI-aware |
| Platform compounding | Reusable module acceptance; override rate; second-clinic setup time | Zero inherited critical rule errors |
| Clinic trust | Review turnaround; unresolved ambiguity age; rollback requests | Critical ambiguity requires named disposition |

Confido’s public site reports patient and operational outcomes for its products, but those claims are company-reported and do not replace tenant-specific baseline measurement.[1] FieldFlow should define metric contracts before rollout and preserve an honest read of neutral or negative results.

## Rollout Sequence

The first release should focus on the proven bottleneck: **source-to-policy and policy-to-test**. The platform does not need a broad drag-and-drop builder to test its central value. Start with a pilot pod using two scheduling implementations, instrument active FDE time and defect yield, and retain the existing release path as a control. The second release adds source-linked trace replay and ambiguity review. The third adds controlled module suggestions and cross-clinic evidence, only after the first two demonstrate reliability and workflow adoption.

The designed prototype implements the information architecture and interaction model for this sequence. The experiment portfolio defines the smallest falsifying test, metric contract, evidence value, and stop-or-scale rule for each uncertain bet.

## Risks and Mitigations

| Risk | Failure mode | Mitigation |
| --- | --- | --- |
| False abstraction | A local clinic rule becomes a platform default | Provenance, local acceptance, override monitoring, cross-tenant evidence threshold |
| Automation bias | FDE accepts a compiled rule because the system appears confident | Source excerpt, confidence, explicit reviewer action, critical-field checklist |
| Policy drift | Runtime changes behavior without review | Immutable approved bundle; draft-only improvement proposals |
| PHI overcollection | Transcripts and traces expose unnecessary data | Redaction, structured events, retention controls, role-based access |
| Test theater | Passing language tests hide bad tools or mutations | Tool-sequence, forbidden-call, reason-code, and state assertions |
| Platform burden | New workflow adds review time without lowering setup or defects | Counterbalanced pilot; stop rule if burden exceeds evidence value |

## Decision

I would fund the **policy compiler + generated critical scenarios** as the P0 product slice. It addresses the repeated work observed in Riverbend, produces inspectable artifacts, creates the foundation for trace replay and governed deployment, and can be falsified quickly. I would not fund autonomous policy modification, broad cross-clinic module propagation, or a generic visual builder until the P0 experiments demonstrate that the source-to-test control plane reduces FDE time while preserving critical correctness.

## References

[1]: https://www.confido.health/home "Confido Health — Voice AI Receptionist for Healthcare Practices"
[2]: https://www.paraform.com/share/confido-health/cmqfno2if000a0cl8js9ax108 "Confido Health — Product Manager, Platform role"
[3]: https://www.nist.gov/itl/ai-risk-management-framework "NIST — AI Risk Management Framework"
[4]: https://www.hl7.org/fhir/appointment.html "HL7 FHIR R5 — Appointment"
[5]: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-audio-telehealth/index.html "HHS OCR — HIPAA and Audio-Only Telehealth"

