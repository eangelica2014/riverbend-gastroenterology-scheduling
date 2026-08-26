/**
 * Clinical Field Notebook design: experiments are written as decision contracts,
 * with evidence value and stop/scale criteria visible before roadmap enthusiasm.
 */

import { EvidenceStamp } from "@/components/EvidenceStamp";
import { PageHeader } from "@/components/PageHeader";
import { ArrowDown, ArrowUp, Clock3, Gauge, Scale, Target, TriangleAlert } from "lucide-react";
import { useState } from "react";

const experiments = [
  {
    id: "EXP-01", priority: "P0", title: "Policy compiler reduces FDE setup time", value: 10,
    hypothesis: "A structured policy bundle cuts active configuration time by at least 30% without reducing critical scenario correctness.",
    test: "Two FDEs configure equivalent clinic tasks using today’s workflow and FieldFlow in counterbalanced order.",
    metric: "Median active setup time + critical scenario pass rate",
    scale: "Scale when time falls ≥30% and critical correctness is non-inferior.",
    stop: "Stop or narrow if any critical rule regresses.",
    methods: ["Observe", "Frame", "Reason", "Validate"],
  },
  {
    id: "EXP-02", priority: "P0", title: "Generated scenarios find real defects", value: 10,
    hypothesis: "Generated scenario families find at least 25% more seeded critical defects per reviewer hour than manual QA alone.",
    test: "Run generated and manually authored suites against the same seeded policy and tool defects.",
    metric: "Unique critical defects per reviewer hour + false-positive rate",
    scale: "Scale at ≥25% defect-yield lift and <15% false positives.",
    stop: "Stop if generated noise increases total review time.",
    methods: ["Build", "Validate", "Improve"],
  },
  {
    id: "EXP-03", priority: "P1", title: "Decision traces shorten diagnosis", value: 9,
    hypothesis: "Source-linked decision traces reduce median root-cause diagnosis time by 40% versus transcript-only review.",
    test: "Randomize FDEs to diagnose the same failures with a transcript or the FieldFlow trace.",
    metric: "Median diagnosis time + correct-layer identification",
    scale: "Scale at ≥40% faster diagnosis with no excess PHI exposure.",
    stop: "Simplify if trace density lowers correct-layer identification.",
    methods: ["Sense", "Reason", "Validate"],
  },
  {
    id: "EXP-04", priority: "P1", title: "Ambiguity queue prevents silent assumptions", value: 9,
    hypothesis: "A structured ambiguity queue prevents every planted critical conflict from reaching approval without adding more than 15% review time.",
    test: "Replay three clinic packets with planted conflicts through normal review and structured review.",
    metric: "Critical ambiguity at approval + review minutes",
    scale: "Scale if zero planted critical ambiguities reach approval.",
    stop: "Redesign if review time rises >15% without better detection.",
    methods: ["Observe", "Frame", "Validate"],
  },
  {
    id: "EXP-05", priority: "P2", title: "Reusable modules improve second-clinic velocity", value: 7,
    hypothesis: "Suggested modules accelerate a second gastroenterology clinic while preserving local policy review.",
    test: "Configure a second clinic with suggested modules and mandatory source diff.",
    metric: "Module acceptance + override count + critical regression rate",
    scale: "Scale at ≥50% accepted modules and zero inherited critical errors.",
    stop: "Keep local if overrides erase the expected time benefit.",
    methods: ["Reason", "Deploy", "Improve"],
  },
  {
    id: "EXP-06", priority: "P2", title: "Human-gated runtime learning adds value", value: 6,
    hypothesis: "Failure clustering can produce useful policy or test suggestions without allowing self-modifying behavior.",
    test: "Run de-identified failures in shadow mode and ask FDEs to accept, edit, or reject suggestions.",
    metric: "Accepted suggestion rate + replay improvement + reviewer time",
    scale: "Expand at ≥30% accepted suggestions and zero approval bypasses.",
    stop: "Stop if suggestions encourage local exceptions as platform defaults.",
    methods: ["Sense", "Improve", "Validate"],
  },
];

export default function Experiments() {
  const [sort, setSort] = useState<"priority" | "value">("priority");
  const [openId, setOpenId] = useState("EXP-01");
  const sorted = [...experiments].sort((a, b) => sort === "value" ? b.value - a.value : a.priority.localeCompare(b.priority));

  return (
    <div className="page-shell experiments-page">
      <PageHeader
        eyebrow="Phase 2 · Experiments for the unknowns"
        title="Want the answer before wanting the feature."
        lede="Each proposal is a falsifiable decision contract: the smallest useful test, the metric that matters, how valuable the answer is, and the exact condition to scale, narrow, or stop."
      >
        <div className="header-stamps">
          <EvidenceStamp tone="blocked">2 P0 bets</EvidenceStamp>
          <EvidenceStamp tone="neutral">Evidence value 6–10</EvidenceStamp>
        </div>
      </PageHeader>

      <section className="experiment-thesis">
        <div><Target size={25} /><strong>Hypothesis</strong><span>What must be true?</span></div>
        <ArrowDown size={18} />
        <div><Clock3 size={25} /><strong>Smallest test</strong><span>How fast can it fail?</span></div>
        <ArrowDown size={18} />
        <div><Gauge size={25} /><strong>Metric</strong><span>What movement matters?</span></div>
        <ArrowDown size={18} />
        <div><Scale size={25} /><strong>Decision</strong><span>Scale, narrow, or stop?</span></div>
      </section>

      <section className="experiment-board">
        <div className="experiment-board__toolbar">
          <div>
            <span className="eyebrow">Prioritized portfolio</span>
            <h2>Correctness and FDE leverage first.</h2>
          </div>
          <div className="sort-control" role="group" aria-label="Sort experiments">
            <button type="button" className={sort === "priority" ? "filter-tab filter-tab--active" : "filter-tab"} onClick={() => setSort("priority")}>Priority</button>
            <button type="button" className={sort === "value" ? "filter-tab filter-tab--active" : "filter-tab"} onClick={() => setSort("value")}>Evidence value</button>
          </div>
        </div>
        <div className="experiment-list">
          {sorted.map((experiment) => {
            const open = experiment.id === openId;
            return (
              <article key={experiment.id} className={open ? "experiment-card experiment-card--open" : "experiment-card"}>
                <button type="button" onClick={() => setOpenId(open ? "" : experiment.id)} className="experiment-card__summary" aria-expanded={open}>
                  <EvidenceStamp tone={experiment.priority === "P0" ? "blocked" : experiment.priority === "P1" ? "attention" : "neutral"}>{experiment.priority}</EvidenceStamp>
                  <span className="experiment-id">{experiment.id}</span>
                  <div><h3>{experiment.title}</h3><p>{experiment.hypothesis}</p></div>
                  <div className="evidence-value"><span>Want the answer</span><strong>{experiment.value}/10</strong></div>
                  {open ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </button>
                {open ? (
                  <div className="experiment-card__detail">
                    <div className="experiment-detail-block"><span>Smallest useful test</span><p>{experiment.test}</p></div>
                    <div className="experiment-detail-block"><span>Metric contract</span><p>{experiment.metric}</p></div>
                    <div className="experiment-decision experiment-decision--scale"><ArrowUp size={17} /><div><span>Scale</span><p>{experiment.scale}</p></div></div>
                    <div className="experiment-decision experiment-decision--stop"><TriangleAlert size={17} /><div><span>Stop / narrow</span><p>{experiment.stop}</p></div></div>
                    <div className="experiment-methods">{experiment.methods.map((method) => <EvidenceStamp key={method} tone="neutral">{method}</EvidenceStamp>)}</div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="north-star">
        <div>
          <span className="eyebrow">North-star outcome</span>
          <h2>Clinically bounded administrative resolution.</h2>
        </div>
        <p>Completion counts only when the task is correct, policy-compliant, appropriately transferred, understandable to the patient, observable to the FDE, and recoverable by the clinic.</p>
        <div className="north-star-metrics">
          {['Time to live', 'FDE hours / launch', 'Critical pass rate', 'Bounded resolution', 'Appropriate transfer', 'Recovery time'].map((metric) => <span key={metric}>{metric}</span>)}
        </div>
      </section>
    </div>
  );
}

