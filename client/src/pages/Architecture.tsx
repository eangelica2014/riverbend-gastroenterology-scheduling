/**
 * Clinical Field Notebook design: architecture is presented as a source-linked layered field map,
 * with sharp boundaries and rule ribbons instead of an ornamental technology diagram.
 */

import { EvidenceStamp, RuleRibbon } from "@/components/EvidenceStamp";
import { PageHeader } from "@/components/PageHeader";
import {
  ArrowDown,
  BookOpen,
  Bot,
  Braces,
  Database,
  Eye,
  FileCheck2,
  LockKeyhole,
  Network,
  ShieldAlert,
  Wrench,
} from "lucide-react";

const layers = [
  { number: "01", icon: Bot, title: "Conversation orchestrator", subtitle: "Flexible language, narrow authority", description: "Interprets intent, manages repair, asks one question at a time, summarizes, and chooses an allowed next action.", contains: ["tone", "scope", "turn-taking", "confirmation discipline"], excludes: "No patient data or hidden eligibility decisions" },
  { number: "02", icon: ShieldAlert, title: "Safety + identity gates", subtitle: "Preempt before task completion", description: "Stops scheduling for possible emergencies or clinical judgment and requires DOB verification before protected reads or writes.", contains: ["911 boundary", "nurse handoff", "candidate match", "verification state"], excludes: "No name-only disambiguation" },
  { number: "03", icon: FileCheck2, title: "Versioned policy engine", subtitle: "Deterministic clinic truth", description: "Evaluates age, coverage, discharge, visit type, duration, provider continuity, Dr. Crane’s rule, and earliest-slot order.", contains: ["reason codes", "rule IDs", "policy version", "human-review target"], excludes: "No conversational improvisation" },
  { number: "04", icon: Wrench, title: "Typed tool registry", subtitle: "Reads and writes through contracts", description: "Looks up records, retrieves appointments, searches eligible slots, mutates only after confirmation, and produces structured receipts.", contains: ["lookup", "availability", "mutation", "transfer"], excludes: "No model access to a raw database" },
  { number: "05", icon: Database, title: "Tenant adapter", subtitle: "Synthetic now; EHR/PMS later", description: "Maps normalized patient, coverage, provider, schedule, slot, appointment, and outcome contracts to the clinic system.", contains: ["field maps", "auth", "idempotency", "vendor errors"], excludes: "No clinic rule embedded in vendor plumbing" },
  { number: "06", icon: Eye, title: "Trace + evaluation", subtitle: "Prove what happened and why", description: "Captures redacted intent, gate, rule, tool, result, and response events for scenario replay, diagnosis, release gates, and rollback.", contains: ["replay", "assertions", "regression", "quality metrics"], excludes: "No unrestricted PHI analytics" },
];

export default function Architecture() {
  return (
    <div className="page-shell architecture-page">
      <PageHeader
        eyebrow="Phase 1 · Architecture write-up"
        title="Agentic language. Deterministic authority."
        lede="The model can interpret and communicate. It cannot invent a patient, override eligibility, select an unauthorized provider, or call a write tool before verified confirmation."
      >
        <div className="header-stamps">
          <EvidenceStamp tone="verified">Policy v1.0.0</EvidenceStamp>
          <EvidenceStamp tone="attention">3 visible assumptions</EvidenceStamp>
        </div>
      </PageHeader>

      <section className="boundary-table" aria-labelledby="boundary-heading">
        <div className="boundary-intro">
          <span className="eyebrow">The central product decision</span>
          <h2 id="boundary-heading">What belongs where?</h2>
          <p>A prompt should govern behavior, not become a fragile database. Each layer owns one kind of truth and fails closed when its contract is missing.</p>
        </div>
        <div className="boundary-grid">
          <article>
            <Bot size={21} />
            <h3>Prompt</h3>
            <p>Persona, scope, safety order, verification sequence, turn-taking, and tool discipline.</p>
            <small>Never: individual patient data or policy enforcement.</small>
          </article>
          <article>
            <BookOpen size={21} />
            <h3>Knowledge</h3>
            <p>Approved read-only facts: hours, addresses, parking, and service boundaries.</p>
            <small>Never: mutable schedules or unresolved policy.</small>
          </article>
          <article>
            <Braces size={21} />
            <h3>Policy</h3>
            <p>Age, coverage, discharge, visit classification, provider, duration, and slot order.</p>
            <small>Never: conversational phrasing or medical advice.</small>
          </article>
          <article>
            <Wrench size={21} />
            <h3>Tools</h3>
            <p>Verified reads, availability, mutations, transfers, structured failures, and receipts.</p>
            <small>Never: free-form business judgment.</small>
          </article>
        </div>
      </section>

      <section className="architecture-map">
        <div className="architecture-map__title">
          <span className="eyebrow">Runtime field map</span>
          <h2>Six layers; one inspectable path.</h2>
        </div>
        <div className="layer-stack">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <div key={layer.number} className="layer-wrap">
                <article className="architecture-layer">
                  <span className="layer-number">{layer.number}</span>
                  <div className="layer-icon"><Icon size={23} /></div>
                  <div className="layer-copy">
                    <span>{layer.subtitle}</span>
                    <h3>{layer.title}</h3>
                    <p>{layer.description}</p>
                  </div>
                  <div className="layer-contains">
                    {layer.contains.map((item) => <EvidenceStamp key={item} tone="neutral">{item}</EvidenceStamp>)}
                    <small>{layer.excludes}</small>
                  </div>
                </article>
                {index < layers.length - 1 ? <ArrowDown className="layer-arrow" size={20} aria-hidden="true" /> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="architecture-decisions">
        <div>
          <span className="eyebrow">Critical controls</span>
          <h2>Three boundaries protect every mutation.</h2>
        </div>
        <div className="decision-ribbons">
          <RuleRibbon id="IDENTITY">
            Phone retrieves a candidate. Date of birth verifies the caller before appointment disclosure or change.
          </RuleRibbon>
          <RuleRibbon id="ELIGIBILITY">
            Availability search begins only after age, discharge, coverage, policy-number, visit-type, and provider rules pass.
          </RuleRibbon>
          <RuleRibbon id="CONFIRMATION">
            The agent repeats the exact action, provider, location, date, and time; only an explicit yes unlocks a write.
          </RuleRibbon>
        </div>
      </section>

      <section className="assumption-ledger">
        <div className="assumption-ledger__header">
          <LockKeyhole size={23} />
          <div>
            <span className="eyebrow">Ambiguity queue</span>
            <h2>Unknowns stay visible until a clinic owner resolves them.</h2>
          </div>
        </div>
        <div className="assumption-grid">
          <article>
            <EvidenceStamp tone="attention">Open · RB-AMB-01</EvidenceStamp>
            <h3>Whitfield’s Thursday conflict</h3>
            <p>The workday and location cells conflict. The demo creates no Thursday Whitfield slot and routes alternate-location preference for approval.</p>
          </article>
          <article>
            <EvidenceStamp tone="attention">Open · RB-AMB-02</EvidenceStamp>
            <h3>Annual physicals</h3>
            <p>Riverbend has not implemented this visit type. The agent transfers rather than quietly converting it to another appointment.</p>
          </article>
          <article>
            <EvidenceStamp tone="verified">Demo-resolved · RB-AMB-03</EvidenceStamp>
            <h3>Policy-number data</h3>
            <p>The fixtures contain no numbers. The agent asks only whether the card or number is available and never invents or displays one.</p>
          </article>
        </div>
      </section>

      <section className="standards-note">
        <Network size={25} />
        <div>
          <h2>FHIR-inspired boundaries, not a false conformance claim.</h2>
          <p>The internal contracts separate schedule, slot, appointment, patient, coverage, and outcome so a future adapter can map them to an EHR/PMS. Eligibility remains above availability, and appointment administration remains distinct from clinical encounter logic.</p>
        </div>
      </section>
    </div>
  );
}

