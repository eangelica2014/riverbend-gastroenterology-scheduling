/**
 * Clinical Field Notebook design: the opening composition is editorial and asymmetric,
 * pairing an empathetic operating thesis with inspectable proof—not a generic marketing hero.
 */

import { EvidenceStamp } from "@/components/EvidenceStamp";
import { ArrowRight, Check, FlaskConical, GitBranch, Mic2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const heroUrl = "/manus-storage/riverbend-hero-v2_d3e21f9f.png";
const logoUrl = "/manus-storage/riverbend-logo_d20ad05b.png";

const proofPoints = [
  { value: "14", label: "versioned clinic rules", detail: "with source-linked reason codes" },
  { value: "24", label: "replayable scenarios", detail: "including critical safety gates" },
  { value: "12", label: "synthetic patient records", detail: "verified from the supplied source" },
  { value: "0", label: "writes before confirmation", detail: "enforced by session state" },
];

export default function Home() {
  return (
    <div className="page-shell home-page">
      <section className="hero-field">
        <div className="hero-copy">
          <div className="hero-kicker">
            <img src={logoUrl} alt="" className="hero-brand-mark" />
            <EvidenceStamp tone="verified">Confido take-home</EvidenceStamp>
            <span>Product Manager, Platform</span>
          </div>
          <h1>
            The conversation can be <em>flexible.</em><br />
            The policy cannot.
          </h1>
          <p className="hero-lede">
            I approached Riverbend as a forward-deployed engagement: make the clinic’s rules safe,
            explicit, and testable—then turn the friction into an FDE-first platform that compounds.
          </p>
          <div className="hero-actions">
            <Link href="/agent" className="button-primary">
              Run the voice agent <Mic2 size={18} />
            </Link>
            <Link href="/platform" className="button-secondary">
              Explore FieldFlow <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero-signature">
            <span>Prepared by</span>
            <strong>Eangelica Germano Aton</strong>
            <small>Technical Product Lead · NYC</small>
          </div>
        </div>
        <figure className="hero-visual">
          <img src={heroUrl} alt="Editorial illustration of a patient conversation flowing through a clinic policy notebook into a verified appointment" />
          <figcaption>
            <span>Figure 01</span>
            Agentic conversation → deterministic policy → typed tools
          </figcaption>
        </figure>
      </section>

      <section className="proof-strip" aria-label="Prototype evidence">
        {proofPoints.map((point) => (
          <article key={point.label}>
            <strong>{point.value}</strong>
            <div>
              <h2>{point.label}</h2>
              <p>{point.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="thesis-section">
        <div className="section-note">
          <span className="eyebrow">Operating thesis</span>
          <p>Human first. Evidence in the interface. Useful over impressive.</p>
        </div>
        <div className="thesis-copy">
          <h2>One clinic, treated as a platform proving ground.</h2>
          <p>
            Phase 1 proves that the agent can complete administrative work while respecting identity,
            coverage, age, discharge, provider, scheduling, and safety boundaries. Phase 2 productizes
            what the FDE had to do: ingest, clarify, compile, simulate, approve, deploy, observe, and improve.
          </p>
        </div>
      </section>

      <section className="phase-ledger">
        <article className="phase-entry phase-entry--dark">
          <div className="phase-index">Phase 1</div>
          <Mic2 size={26} />
          <h2>Build the agent</h2>
          <p>A functional voice/text workspace with visible identity, rule, tool, and transfer evidence.</p>
          <ul>
            <li><Check size={15} /> Book, confirm, cancel, and reschedule</li>
            <li><Check size={15} /> Clinic FAQs and human handoffs</li>
            <li><Check size={15} /> Safety preemption and zero medical advice</li>
          </ul>
          <Link href="/agent">Open the live workspace <ArrowRight size={16} /></Link>
        </article>

        <article className="phase-entry phase-entry--paper">
          <div className="phase-index">Phase 2</div>
          <GitBranch size={26} />
          <h2>Productize the work</h2>
          <p>FieldFlow turns messy clinic artifacts into approved policy, regression evidence, and a controlled release.</p>
          <ul>
            <li><Check size={15} /> Generic primitives versus local policy</li>
            <li><Check size={15} /> Source-linked ambiguity queue</li>
            <li><Check size={15} /> Falsifiable P0–P2 experiments</li>
          </ul>
          <Link href="/platform">Walk the lifecycle <ArrowRight size={16} /></Link>
        </article>
      </section>

      <section className="fit-section">
        <div>
          <span className="eyebrow">Why this approach fits the role</span>
          <h2>Builder speed with healthcare restraint.</h2>
        </div>
        <div className="fit-cards">
          <article>
            <ShieldCheck size={23} />
            <h3>Full-system judgment</h3>
            <p>Prompt, policy, tools, interface, privacy, handoff, and evaluation are designed as one operating system.</p>
          </article>
          <article>
            <FlaskConical size={23} />
            <h3>Honest experimentation</h3>
            <p>Each platform bet has a smallest falsifying test, a metric contract, and an explicit stop-or-scale rule.</p>
          </article>
          <article>
            <GitBranch size={23} />
            <h3>Compounding FDE leverage</h3>
            <p>Reusable primitives reduce repeated implementation work without flattening clinic-specific truth.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
