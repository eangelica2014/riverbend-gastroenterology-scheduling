/**
 * Clinical Field Notebook design: FieldFlow is a horizontal field-to-platform lifecycle,
 * with source artifacts, ambiguity, approvals, and evidence visible at every handoff.
 */

import { EvidenceStamp } from "@/components/EvidenceStamp";
import { PageHeader } from "@/components/PageHeader";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CloudUpload,
  CodeXml,
  Eye,
  FileSearch,
  FlaskConical,
  Lightbulb,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";

const platformImage = "/manus-storage/riverbend-lifecycle-v2_54a95784.png";

const lifecycle = [
  {
    id: "ingest",
    index: "01",
    label: "Ingest",
    icon: FileSearch,
    method: "Observe / Sense",
    promise:
      "Turn clinic artifacts into a source ledger without losing provenance.",
    artifact: "Source ledger",
    evidence: [
      "3 PDFs indexed",
      "tables visually verified",
      "source quality flagged",
    ],
    decision: "No policy generation from unreadable content.",
  },
  {
    id: "clarify",
    index: "02",
    label: "Clarify",
    icon: ScanSearch,
    method: "Frame",
    promise:
      "Surface conflicts, missing values, and risky assumptions before they become runtime behavior.",
    artifact: "Ambiguity queue",
    evidence: [
      "Whitfield row conflict",
      "annual physical unresolved",
      "policy number absent",
    ],
    decision: "Every material ambiguity gets an owner and disposition.",
  },
  {
    id: "compile",
    index: "03",
    label: "Compile",
    icon: CodeXml,
    method: "Reason",
    promise:
      "Convert approved facts into schemas, rules, knowledge, prompts, and adapter configuration.",
    artifact: "Tenant policy bundle",
    evidence: [
      "14 reason-coded rules",
      "prompt / policy separation",
      "version 1.0.0",
    ],
    decision: "The model proposes; a human approves critical policy.",
  },
  {
    id: "simulate",
    index: "04",
    label: "Simulate",
    icon: FlaskConical,
    method: "Build / Validate",
    promise:
      "Generate scenario families and replay the exact rule and tool path before deployment.",
    artifact: "Regression matrix",
    evidence: ["25 scenarios", "9 critical cases", "forbidden-call assertions"],
    decision: "A plausible response cannot hide a bad tool call.",
  },
  {
    id: "approve",
    index: "05",
    label: "Approve",
    icon: ClipboardCheck,
    method: "Validate",
    promise:
      "Collect clinic and FDE sign-off on policy, safety boundaries, and release gates.",
    artifact: "Release candidate",
    evidence: [
      "critical suite 100%",
      "open ambiguity reviewed",
      "rollback owner named",
    ],
    decision: "No production promotion with unresolved critical risk.",
  },
  {
    id: "deploy",
    index: "06",
    label: "Deploy",
    icon: CloudUpload,
    method: "Deploy",
    promise:
      "Promote a versioned bundle through environment checks, canary scope, and controlled rollback.",
    artifact: "Deployment record",
    evidence: ["adapter health", "canary cohort", "versioned rollback"],
    decision: "Deployment is a reversible experiment, not a ceremony.",
  },
  {
    id: "observe",
    index: "07",
    label: "Observe",
    icon: Eye,
    method: "Sense",
    promise:
      "Monitor bounded administrative resolution, transfer quality, latency, and policy exceptions.",
    artifact: "Quality dashboard",
    evidence: [
      "resolution + transfer",
      "reason-code trends",
      "PHI-aware traces",
    ],
    decision: "Speed never outranks safety or correctness.",
  },
  {
    id: "improve",
    index: "08",
    label: "Improve",
    icon: RefreshCw,
    method: "Improve",
    promise:
      "Cluster failures, propose source-linked changes, replay regression, and share validated patterns.",
    artifact: "Improvement proposal",
    evidence: [
      "human-gated patch",
      "regression replay",
      "reusable module candidate",
    ],
    decision: "Learn from outcomes without self-modifying clinic policy.",
  },
];

const methodPairs = [
  {
    systemic: "Observe",
    innovation: "Sense",
    riverbend:
      "Read the person, workflow, source, and signal before choosing technology.",
  },
  {
    systemic: "Frame",
    innovation: "Reason",
    riverbend:
      "Convert ambiguity into constraints, typed rules, evidence, and a measurable promise.",
  },
  {
    systemic: "Build",
    innovation: "Deploy",
    riverbend:
      "Connect data, policy, model, interface, tool, and human handoff in the real workflow.",
  },
  {
    systemic: "Validate",
    innovation: "Improve",
    riverbend:
      "Test usefulness and reliability, then feed approved outcomes back into the system.",
  },
];

export default function Platform() {
  const [activeId, setActiveId] = useState("clarify");
  const active = lifecycle.find(stage => stage.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <div className="page-shell platform-page">
      <PageHeader
        eyebrow="Phase 2 · Designed prototype"
        title="Field learning becomes platform leverage."
        lede="FieldFlow helps an FDE turn uneven clinic reality into a governed policy bundle, replayable evidence, and a reversible release—without pretending local exceptions are universal product truth."
      >
        <div className="header-stamps">
          <EvidenceStamp tone="verified">FDE-first</EvidenceStamp>
          <EvidenceStamp tone="neutral">Multi-tenant by contract</EvidenceStamp>
        </div>
      </PageHeader>

      <section className="platform-hero">
        <figure>
          <img
            src={platformImage}
            alt="Editorial lifecycle illustration showing clinic documents becoming approved policy, tests, deployment, observation, and improvement"
          />
          <figcaption>
            <span>Figure 02</span> Source artifact → approved bundle →
            evidence-backed release
          </figcaption>
        </figure>
        <div className="platform-manifesto">
          <span className="eyebrow">The product thesis</span>
          <h2>Productize the repeatable work. Preserve the local truth.</h2>
          <p>
            Identity, tool contracts, policy schemas, test generation, traces,
            review, and rollback are durable platform primitives. Riverbend’s
            names, three-year threshold, provider pairing, and unresolved
            exceptions remain tenant configuration with provenance.
          </p>
          <div className="manifesto-principles">
            <span>
              <Users size={16} /> Build beside the domain expert
            </span>
            <span>
              <ShieldCheck size={16} /> Human approval at critical boundaries
            </span>
            <span>
              <Activity size={16} /> Outcomes—not demos—close the loop
            </span>
          </div>
        </div>
      </section>

      <section className="method-matrix">
        <div className="method-matrix__intro">
          <span className="eyebrow">Eangelica’s dual method</span>
          <h2>Problem solving inside an innovation loop.</h2>
          <p>
            The Systemic Design Method governs how each problem is handled. The
            Four-Stage Innovation Method carries the system from signal to
            real-world outcomes and back again.
          </p>
        </div>
        <div className="method-pairs">
          {methodPairs.map((pair, index) => (
            <article key={pair.systemic}>
              <span className="method-index">0{index + 1}</span>
              <div className="method-names">
                <strong>{pair.systemic}</strong>
                <ArrowRight size={16} />
                <em>{pair.innovation}</em>
              </div>
              <p>{pair.riverbend}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lifecycle-workbench">
        <div className="lifecycle-heading">
          <div>
            <span className="eyebrow">Interactive lifecycle</span>
            <h2>Open any handoff. Inspect the artifact.</h2>
          </div>
          <EvidenceStamp tone="attention">Click a stage</EvidenceStamp>
        </div>
        <div
          className="lifecycle-tabs"
          role="tablist"
          aria-label="FieldFlow lifecycle stages"
        >
          {lifecycle.map(stage => {
            const Icon = stage.icon;
            const selected = stage.id === activeId;
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={
                  selected
                    ? "lifecycle-tab lifecycle-tab--active"
                    : "lifecycle-tab"
                }
                onClick={() => setActiveId(stage.id)}
              >
                <span>{stage.index}</span>
                <Icon size={18} />
                <strong>{stage.label}</strong>
              </button>
            );
          })}
        </div>
        <div className="lifecycle-detail" role="tabpanel">
          <div className="lifecycle-detail__primary">
            <div className="lifecycle-stage-icon">
              <ActiveIcon size={32} />
            </div>
            <EvidenceStamp tone="neutral">{active.method}</EvidenceStamp>
            <h3>{active.label}</h3>
            <p>{active.promise}</p>
          </div>
          <div className="lifecycle-artifact">
            <span>Primary artifact</span>
            <strong>{active.artifact}</strong>
            <div className="artifact-sheet">
              {active.evidence.map(item => (
                <span key={item}>
                  <CheckCircle2 size={15} /> {item}
                </span>
              ))}
            </div>
          </div>
          <div className="lifecycle-decision">
            <Lightbulb size={22} />
            <span>Decision contract</span>
            <p>{active.decision}</p>
          </div>
        </div>
      </section>

      <section className="boundary-board">
        <div className="boundary-column boundary-column--platform">
          <span className="eyebrow">Generalize</span>
          <h2>Platform primitives</h2>
          <p>Reusable capabilities that should improve every implementation.</p>
          <div className="boundary-items">
            {[
              "Identity workflow",
              "Policy schema + compiler",
              "Typed tool registry",
              "Scenario generation",
              "Trace + replay",
              "Approval + rollback",
            ].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="boundary-spine">
          <CodeXml size={26} />
          <span>Contracts, not copy-paste</span>
        </div>
        <div className="boundary-column boundary-column--tenant">
          <span className="eyebrow">Configure or keep local</span>
          <h2>Clinic truth</h2>
          <p>
            Source-linked rules and unresolved decisions that must not become
            defaults.
          </p>
          <div className="boundary-items">
            {[
              "Three-year threshold",
              "Provider pairings",
              "Dr. Crane Thursday",
              "Lunch closure",
              "Annual physical TBD",
              "Clinic-owned exceptions",
            ].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
