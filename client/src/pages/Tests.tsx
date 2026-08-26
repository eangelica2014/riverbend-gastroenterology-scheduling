/**
 * Clinical Field Notebook design: test results read like signed operational evidence,
 * with criticality, expected behavior, and proof exposed before celebratory pass states.
 */

import { EvidenceStamp } from "@/components/EvidenceStamp";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ScenarioDefinition, scenarios } from "@/data/riverbend";
import { replayScenario } from "@/lib/agentEngine";
import {
  AlertOctagon,
  Check,
  ChevronDown,
  FlaskConical,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

interface TestResult {
  passed: boolean;
  outcome: string;
  evidence: string[];
}

const iterationHighlights = [
  {
    iteration: "01",
    title: "Prompt-only rules rejected",
    change: "Moved clinic policy into a versioned decision layer.",
    reason: "Rules became diffable, testable, and enforceable before writes.",
  },
  {
    iteration: "02",
    title: "Identity gate strengthened",
    change: "Phone retrieves a candidate; DOB verifies the person.",
    reason: "Two James Porter records made name-only matching unsafe.",
  },
  {
    iteration: "03",
    title: "Safety preempts intent",
    change: "Emergency and clinical language stop scheduling at any turn.",
    reason:
      "A completed task is not success if the agent crosses a clinical boundary.",
  },
  {
    iteration: "04",
    title: "Unknowns became artifacts",
    change: "Contradictory or absent clinic detail enters an ambiguity queue.",
    reason: "A silent assumption is a future production incident.",
  },
  {
    iteration: "05",
    title: "Tests inspect tools",
    change:
      "Assertions cover reason codes, forbidden calls, and mutation state.",
    reason: "A fluent final sentence can hide an incorrect workflow.",
  },
];

function ScenarioRow({
  scenario,
  result,
  onRun,
}: {
  scenario: ScenarioDefinition;
  result?: TestResult;
  onRun: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`scenario-row ${result ? (result.passed ? "scenario-row--pass" : "scenario-row--fail") : ""}`}
    >
      <button
        type="button"
        className="scenario-row__main"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
      >
        <span
          className={`criticality-dot criticality-dot--${scenario.criticality}`}
          aria-label={`${scenario.criticality} criticality`}
        />
        <div className="scenario-row__copy">
          <span>{scenario.id}</span>
          <h3>{scenario.title}</h3>
          <p>{scenario.expectedOutcome}</p>
        </div>
        <EvidenceStamp
          tone={
            scenario.criticality === "critical"
              ? "blocked"
              : scenario.criticality === "high"
                ? "attention"
                : "neutral"
          }
        >
          {scenario.criticality}
        </EvidenceStamp>
        <div className="scenario-result">
          {result ? (
            result.passed ? (
              <>
                <Check size={16} /> Pass
              </>
            ) : (
              <>
                <AlertOctagon size={16} /> Fail
              </>
            )
          ) : (
            "Not run"
          )}
        </div>
        <ChevronDown
          className={open ? "chevron chevron--open" : "chevron"}
          size={17}
        />
      </button>
      {open ? (
        <div className="scenario-row__detail">
          <div>
            <span>Assertion focus</span>
            <strong>{scenario.proof}</strong>
          </div>
          <div>
            <span>Observed outcome</span>
            <strong>
              {result?.outcome || "Run the scenario to inspect evidence"}
            </strong>
          </div>
          <div className="evidence-list">
            {(result?.evidence || ["No result yet"]).map(item => (
              <EvidenceStamp
                key={item}
                tone={result?.passed ? "verified" : "neutral"}
              >
                {item}
              </EvidenceStamp>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={event => {
              event.stopPropagation();
              onRun();
            }}
          >
            <Play size={15} /> Run this test
          </Button>
        </div>
      ) : null}
    </article>
  );
}

export default function Tests() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [filter, setFilter] = useState<
    "all" | "critical" | "booking" | "safety"
  >("all");

  const visibleScenarios = useMemo(
    () =>
      scenarios.filter(scenario => {
        if (filter === "all") return true;
        if (filter === "critical") return scenario.criticality === "critical";
        return scenario.family === filter;
      }),
    [filter]
  );

  const runOne = (id: string) =>
    setResults(current => ({ ...current, [id]: replayScenario(id) }));
  const runAll = () => {
    const next: Record<string, TestResult> = {};
    scenarios.forEach(scenario => {
      next[scenario.id] = replayScenario(scenario.id);
    });
    setResults(next);
  };

  const resultValues = Object.values(results);
  const passed = resultValues.filter(result => result.passed).length;
  const criticalTotal = scenarios.filter(
    scenario => scenario.criticality === "critical"
  ).length;
  const criticalPassed = scenarios.filter(
    scenario =>
      scenario.criticality === "critical" && results[scenario.id]?.passed
  ).length;

  return (
    <div className="page-shell tests-page">
      <PageHeader
        eyebrow="Phase 1 · Scenario lab"
        title="A believable sentence is not enough."
        lede="The suite checks the outcome and the evidence beneath it: reason code, rule path, forbidden tool calls, mutation safety, transfer destination, and source-grounded knowledge."
      >
        <div className="header-stamps">
          <EvidenceStamp tone="blocked">{criticalTotal} critical</EvidenceStamp>
          <EvidenceStamp tone="neutral">
            {scenarios.length} total scenarios
          </EvidenceStamp>
        </div>
      </PageHeader>

      <section className="test-console">
        <div className="test-console__run">
          <div
            className="run-gauge"
            aria-label={`${passed} of ${scenarios.length} scenarios passed`}
          >
            <strong>{resultValues.length ? passed : "—"}</strong>
            <span>/ {scenarios.length} passed</span>
          </div>
          <div className="run-copy">
            <span className="eyebrow">Release evidence</span>
            <h2>
              {resultValues.length
                ? passed === scenarios.length
                  ? "All configured checks passed."
                  : "The suite found a failure."
                : "Run the deterministic regression set."}
            </h2>
            <p>
              Critical launch gate: {criticalPassed}/{criticalTotal} critical
              scenarios verified in this browser session.
            </p>
          </div>
          <Button className="run-suite-button" onClick={runAll}>
            <FlaskConical size={18} /> Run all {scenarios.length}
          </Button>
          <Button
            variant="outline"
            onClick={() => setResults({})}
            aria-label="Clear test results"
          >
            <RotateCcw size={17} />
          </Button>
        </div>
        <div
          className="test-filters"
          role="group"
          aria-label="Filter scenarios"
        >
          {(["all", "critical", "booking", "safety"] as const).map(item => (
            <button
              key={item}
              type="button"
              className={
                filter === item ? "filter-tab filter-tab--active" : "filter-tab"
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="scenario-table">
          {visibleScenarios.map(scenario => (
            <ScenarioRow
              key={scenario.id}
              scenario={scenario}
              result={results[scenario.id]}
              onRun={() => runOne(scenario.id)}
            />
          ))}
        </div>
      </section>

      <section className="critical-contract">
        <ShieldCheck size={28} />
        <div>
          <span className="eyebrow">Critical contract</span>
          <h2>Zero tolerance for unsafe administrative completion.</h2>
          <p>
            A release cannot pass if it books a minor, a discharged patient,
            inactive coverage, an unapproved provider, or any write before
            verified identity and explicit confirmation. It cannot continue
            scheduling through urgent clinical or emergency language.
          </p>
        </div>
      </section>

      <section className="iteration-section">
        <div className="iteration-heading">
          <span className="eyebrow">High-level iteration log</span>
          <h2>Each revision traces back to a source risk or failure mode.</h2>
          <p>
            The full repository log preserves all nine material iterations and
            will append actual build and test outcomes after validation.
          </p>
        </div>
        <div className="iteration-ledger">
          {iterationHighlights.map(item => (
            <article key={item.iteration}>
              <span>{item.iteration}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.change}</p>
                <small>{item.reason}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
