/**
 * Clinical Field Notebook design: patient dialogue stays warm and sparse while the adjacent
 * evidence rail exposes the exact intent, verification, policy, and tool path for the FDE.
 * Empathy is operationalized through one-question turns, transcript correction, safe progress,
 * text fallback, and a supported human path—not through tone alone.
 */

import { EvidenceStamp } from "@/components/EvidenceStamp";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpeech } from "@/hooks/useSpeech";
import { createSession, processTurn, TraceEvent } from "@/lib/agentEngine";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Headphones,
  Keyboard,
  Loader2,
  Mic,
  MicOff,
  Play,
  Radio,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import "./AgentEnhancements.css";

const traceImage = "/manus-storage/riverbend-trace-v2_a9383625.png";

const scenarioScripts = [
  {
    id: "book",
    label: "Book follow-up",
    note: "James Porter · active coverage",
    turns: [
      "I need to book an appointment",
      "555-0102",
      "1971-07-04",
      "yes",
      "yes",
    ],
  },
  {
    id: "new",
    label: "Classify as new",
    note: "Elena · last seen in 2019",
    turns: ["I need to schedule", "555-0104", "1985-12-01", "yes"],
  },
  {
    id: "minor",
    label: "Block a minor",
    note: "Robert · age 16",
    turns: ["I need to book", "555-0105", "2010-08-15", "yes"],
  },
  {
    id: "confirm",
    label: "Confirm visit",
    note: "Margaret · upcoming appointment",
    turns: ["Please confirm my appointment", "555-0101", "1958-02-10"],
  },
  {
    id: "cancel",
    label: "Cancel visit",
    note: "Sofia · explicit confirmation",
    turns: ["Cancel my appointment", "555-0109", "1995-09-09", "yes"],
  },
  {
    id: "reschedule",
    label: "Reschedule visit",
    note: "George · earliest Raman slot",
    turns: [
      "Reschedule my appointment",
      "555-0110",
      "1948-03-17",
      "yes",
      "yes",
    ],
  },
  {
    id: "parking",
    label: "Ask about parking",
    note: "Approved FAQ knowledge",
    turns: ["Where can I park at each location?"],
  },
  {
    id: "emergency",
    label: "Emergency boundary",
    note: "911 instruction + nurse line",
    turns: ["I am passing out and cannot breathe"],
  },
];

function TraceRow({ item }: { item: TraceEvent }) {
  const tone =
    item.status === "pass"
      ? "verified"
      : item.status === "attention"
        ? "attention"
        : item.status === "blocked"
          ? "blocked"
          : "neutral";
  return (
    <li className="trace-row">
      <div
        className={`trace-node trace-node--${item.status}`}
        aria-hidden="true"
      />
      <div>
        <div className="trace-row__meta">
          <span>{item.stage}</span>
          {item.ruleId ? (
            <EvidenceStamp tone={tone}>{item.ruleId}</EvidenceStamp>
          ) : null}
          {item.tool ? (
            <EvidenceStamp tone="neutral">{item.tool}</EvidenceStamp>
          ) : null}
        </div>
        <strong>{item.label}</strong>
        <p>{item.detail}</p>
      </div>
    </li>
  );
}

type ProgressState = "pending" | "active" | "complete" | "blocked" | "skipped";

interface ProgressStage {
  id: string;
  label: string;
  detail: string;
  state: ProgressState;
}

const appointmentIntents = new Set(["book", "confirm", "cancel", "reschedule"]);

function deriveProgress(
  session: ReturnType<typeof createSession>,
  processing: string | null
): ProgressStage[] {
  const has = (predicate: (item: TraceEvent) => boolean) =>
    session.trace.some(predicate);
  const tracePassed = (stage: TraceEvent["stage"], label?: string) =>
    has(
      item =>
        item.stage === stage &&
        item.status === "pass" &&
        (!label || item.label === label)
    );
  const traceBlocked = (stage: TraceEvent["stage"]) =>
    has(item => item.stage === stage && item.status === "blocked");
  const isAppointment = appointmentIntents.has(session.intent);
  const coverageRequired =
    session.intent === "book" || session.intent === "reschedule";
  const confirmationRequired =
    session.intent === "book" ||
    session.intent === "reschedule" ||
    session.intent === "cancel";
  const identityComplete = tracePassed("identity", "Identity verified");
  const policyEvaluated = has(
    item =>
      item.stage === "policy" &&
      Boolean(item.ruleId) &&
      item.ruleId !== "RB-TBD-01" &&
      item.ruleId !== "RB-UNSUP-01"
  );
  const availabilityComplete = has(
    item => item.tool === "searchAvailability" && item.status === "pass"
  );
  const availabilityBlocked = has(
    item => item.tool === "searchAvailability" && item.status === "blocked"
  );
  const confirmationRequested = has(
    item => item.label === "Explicit confirmation required"
  );
  const mutationComplete = has(item =>
    ["bookAppointment", "rescheduleAppointment", "cancelAppointment"].includes(
      item.tool || ""
    )
  );
  const mutationStopped = has(
    item =>
      item.label === "Write stopped" || item.label === "Cancellation stopped"
  );
  const terminal =
    session.step === "idle" &&
    session.intent !== "unknown" &&
    session.messages.length > 1;
  const skipped = (required: boolean): ProgressState | null =>
    !required && session.intent !== "unknown" ? "skipped" : null;

  const intentState: ProgressState =
    session.intent !== "unknown"
      ? "complete"
      : processing
        ? "active"
        : "pending";
  const identityState: ProgressState =
    skipped(isAppointment) ||
    (traceBlocked("identity")
      ? "blocked"
      : identityComplete
        ? "complete"
        : session.step === "awaiting_phone" || session.step === "awaiting_dob"
          ? "active"
          : "pending");
  const coverageState: ProgressState =
    skipped(coverageRequired) ||
    (policyEvaluated
      ? "complete"
      : session.step === "awaiting_insurance"
        ? "active"
        : "pending");
  const policyState: ProgressState =
    skipped(coverageRequired) ||
    (traceBlocked("policy")
      ? "blocked"
      : policyEvaluated
        ? "complete"
        : processing && session.step === "awaiting_insurance"
          ? "active"
          : "pending");
  const availabilityState: ProgressState =
    skipped(coverageRequired) ||
    (availabilityBlocked
      ? "blocked"
      : availabilityComplete || session.step === "awaiting_slot_confirmation"
        ? "complete"
        : processing && session.step === "awaiting_insurance"
          ? "active"
          : "pending");
  const confirmationState: ProgressState =
    skipped(confirmationRequired) ||
    (mutationComplete || mutationStopped
      ? "complete"
      : confirmationRequested ||
          session.step === "awaiting_slot_confirmation" ||
          session.step === "awaiting_cancel_confirmation"
        ? "active"
        : "pending");
  const outcomeState: ProgressState = traceBlocked("safety")
    ? "blocked"
    : terminal
      ? "complete"
      : processing
        ? "active"
        : "pending";

  return [
    {
      id: "intent",
      label: "Intent",
      detail: session.intent === "unknown" ? "Understand need" : session.intent,
      state: intentState,
    },
    {
      id: "identity",
      label: "Identity",
      detail:
        session.intent === "unknown"
          ? "Awaiting intent"
          : identityComplete
            ? "Verified"
            : isAppointment
              ? "Privacy gate"
              : "Not required",
      state: identityState,
    },
    {
      id: "coverage",
      label: "Coverage",
      detail:
        session.intent === "unknown"
          ? "Awaiting intent"
          : coverageRequired
            ? "Card or policy"
            : "Not required",
      state: coverageState,
    },
    {
      id: "policy",
      label: "Policy",
      detail:
        session.intent === "unknown"
          ? "Awaiting intent"
          : policyEvaluated
            ? "Rules evaluated"
            : coverageRequired
              ? "Clinic rules"
              : "Not required",
      state: policyState,
    },
    {
      id: "availability",
      label: "Availability",
      detail:
        session.intent === "unknown"
          ? "Awaiting intent"
          : availabilityComplete
            ? "Earliest eligible"
            : coverageRequired
              ? "Search after gates"
              : "Not required",
      state: availabilityState,
    },
    {
      id: "confirmation",
      label: "Confirm",
      detail:
        session.intent === "unknown"
          ? "Awaiting intent"
          : mutationComplete
            ? "Explicit yes"
            : confirmationRequired
              ? "No write yet"
              : "Not required",
      state: confirmationState,
    },
    {
      id: "outcome",
      label: "Outcome",
      detail: terminal ? "Complete or transferred" : "Awaiting result",
      state: outcomeState,
    },
  ];
}

function ProgressRail({
  stages,
  processing,
}: {
  stages: ProgressStage[];
  processing: string | null;
}) {
  return (
    <section
      className="scheduling-progress"
      aria-label="Scheduling progress"
      aria-live="polite"
    >
      <div className="scheduling-progress__heading">
        <div>
          <Sparkles size={15} />
          <strong>Scheduling progress</strong>
        </div>
        <span
          className={
            processing
              ? "processing-status processing-status--active"
              : "processing-status"
          }
        >
          {processing ? (
            <Loader2 className="progress-spinner" size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {processing || "Ready for the next safe step"}
        </span>
      </div>
      <ol className="progress-rail">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            className={`progress-step progress-step--${stage.state}`}
            aria-current={stage.state === "active" ? "step" : undefined}
          >
            <span className="progress-step__index">
              {stage.state === "complete" ? (
                <CheckCircle2 size={15} />
              ) : stage.state === "blocked" ? (
                <AlertTriangle size={15} />
              ) : (
                <Circle size={13} />
              )}
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong>{stage.label}</strong>
            <small>{stage.detail}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Agent() {
  const [session, setSession] = useState(createSession);
  const [input, setInput] = useState("");
  const [voiceOutput, setVoiceOutput] = useState(false);
  const [lastScenario, setLastScenario] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(
    null
  );
  const processingTimer = useRef<number | null>(null);
  const speech = useSpeech();

  const stateLabel = useMemo(
    () => session.step.replaceAll("_", " "),
    [session.step]
  );
  const progress = useMemo(
    () => deriveProgress(session, processing),
    [session, processing]
  );
  const latestCaller = useMemo(
    () =>
      [...session.messages]
        .reverse()
        .find(message => message.role === "caller"),
    [session.messages]
  );
  const latestAgent = useMemo(
    () =>
      [...session.messages].reverse().find(message => message.role === "agent"),
    [session.messages]
  );

  useEffect(
    () => () => {
      if (processingTimer.current) window.clearTimeout(processingTimer.current);
    },
    []
  );

  const processingCopy = () => {
    if (session.step === "awaiting_phone" || session.step === "awaiting_dob")
      return "Checking identity safely…";
    if (session.step === "awaiting_insurance")
      return "Applying coverage and clinic policy…";
    if (session.step === "awaiting_slot_confirmation")
      return "Committing only after confirmation…";
    if (session.step === "awaiting_cancel_confirmation")
      return "Applying the cancellation boundary…";
    return "Understanding the request…";
  };

  const submit = (text: string) => {
    const callerText = text.trim();
    if (!callerText || processing) return;
    const currentSession = session;
    setPendingTranscript(callerText);
    setProcessing(processingCopy());
    setInput("");
    setLastScenario(null);
    processingTimer.current = window.setTimeout(() => {
      const result = processTurn(currentSession, callerText);
      setSession(result.session);
      setPendingTranscript(null);
      setProcessing(null);
      if (voiceOutput) speech.speak(result.reply);
    }, 520);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (input.trim()) submit(input);
  };

  const runScenario = (script: (typeof scenarioScripts)[number]) => {
    if (processing) return;
    setProcessing(`Replaying ${script.label.toLowerCase()}…`);
    let replay = createSession();
    let reply = replay.messages[0].text;
    script.turns.forEach(turn => {
      const result = processTurn(replay, turn);
      replay = result.session;
      reply = result.reply;
    });
    processingTimer.current = window.setTimeout(() => {
      setSession(replay);
      setLastScenario(script.label);
      setPendingTranscript(null);
      setProcessing(null);
      if (voiceOutput) speech.speak(reply);
    }, 680);
  };

  const resetConversation = () => {
    if (processingTimer.current) window.clearTimeout(processingTimer.current);
    speech.stop();
    setSession(createSession());
    setInput("");
    setLastScenario(null);
    setPendingTranscript(null);
    setProcessing(null);
  };

  return (
    <div className="page-shell agent-page">
      <PageHeader
        eyebrow="Phase 1 · Inspectable agent"
        title="Hear the patient. Show the decision."
        lede="Speak, type, or replay a test. The caller sees a calm scheduling assistant; the FDE sees every state, policy rule, and tool boundary beside it."
      >
        <div className="header-stamps">
          <EvidenceStamp tone="verified">Synthetic data</EvidenceStamp>
          <EvidenceStamp tone="neutral">
            Reference date 2026-08-26
          </EvidenceStamp>
        </div>
      </PageHeader>

      <section className="scenario-ribbon" aria-label="Scripted scenarios">
        <div className="scenario-ribbon__label">
          <Play size={16} />
          <span>Replay a proof</span>
        </div>
        <div className="scenario-ribbon__scroll">
          {scenarioScripts.map(script => (
            <button
              key={script.id}
              type="button"
              disabled={Boolean(processing)}
              onClick={() => runScenario(script)}
              className={
                lastScenario === script.label
                  ? "scenario-chip scenario-chip--active"
                  : "scenario-chip"
              }
            >
              <strong>{script.label}</strong>
              <small>{script.note}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="agent-workspace">
        <div className="workspace-folio" aria-hidden="true">
          <span>Folio 01</span>
          <strong>Agent proof</strong>
          <small>Observe → Validate</small>
        </div>
        <div className="conversation-panel">
          <div className="panel-toolbar">
            <div>
              <span className="live-dot" />
              <strong>Riverbend scheduling line</strong>
              <span className="workspace-index">PATIENT MODE · READY</span>
            </div>
            <div className="toolbar-actions">
              <button
                type="button"
                className={
                  voiceOutput
                    ? "tool-toggle tool-toggle--active"
                    : "tool-toggle"
                }
                onClick={() => setVoiceOutput(value => !value)}
                aria-pressed={voiceOutput}
              >
                <Volume2 size={15} /> Voice replies {voiceOutput ? "on" : "off"}
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={resetConversation}
                aria-label="Reset conversation"
              >
                <RotateCcw size={17} />
              </button>
            </div>
          </div>

          <section
            className="live-transcript"
            aria-label="Real-time transcript"
            aria-live="polite"
          >
            <div className="live-transcript__heading">
              <div>
                <Radio size={15} />
                <strong>Live transcript</strong>
              </div>
              <span>
                {speech.listening
                  ? "Listening now"
                  : processing
                    ? "Request captured"
                    : "Local session only"}
              </span>
            </div>
            <div className="live-transcript__grid">
              <div>
                <span>Caller · live</span>
                <p
                  className={
                    speech.listening || processing
                      ? "transcript-line transcript-line--active"
                      : "transcript-line"
                  }
                >
                  {speech.interimTranscript ||
                    (speech.listening
                      ? "Listening for the caller…"
                      : processing
                        ? pendingTranscript ||
                          "Processing the captured request…"
                        : latestCaller?.text || "No caller utterance yet.")}
                </p>
              </div>
              <div>
                <span>Riverbend · latest</span>
                <p className="transcript-line">{latestAgent?.text}</p>
              </div>
            </div>
            <small>
              Displayed in this browser session for correction and orientation;
              never used as a substitute for verification.
            </small>
          </section>

          <ProgressRail stages={progress} processing={processing} />

          <ScrollArea className="conversation-scroll" aria-live="polite">
            <div className="conversation-thread">
              {session.messages.map(message => (
                <article
                  key={message.id}
                  className={`message message--${message.role}`}
                >
                  <span>
                    {message.role === "agent" ? "Riverbend" : "Caller"}
                  </span>
                  <p>{message.text}</p>
                  {message.role === "agent" && speech.outputSupported ? (
                    <button
                      type="button"
                      onClick={() => speech.speak(message.text)}
                      aria-label="Read this response aloud"
                    >
                      <Headphones size={14} />
                    </button>
                  ) : null}
                </article>
              ))}
              {session.messages.length === 1 ? (
                <aside
                  className="idle-evidence-note"
                  aria-label="Current evidence contract"
                >
                  <div className="idle-evidence-note__heading">
                    <strong>Before the caller speaks</strong>
                    <div>
                      <EvidenceStamp tone="verified">SCOPE OPEN</EvidenceStamp>
                      <EvidenceStamp tone="attention">
                        AWAITING INTENT
                      </EvidenceStamp>
                    </div>
                  </div>
                  <div className="idle-evidence-note__grid">
                    <div>
                      <span>Known</span>
                      <strong>Administrative scope only</strong>
                    </div>
                    <div>
                      <span>Unknown</span>
                      <strong>Intent and identity</strong>
                    </div>
                    <div>
                      <span>Next safe step</span>
                      <strong>Ask one clear question</strong>
                    </div>
                  </div>
                  <p>
                    Protected reads, policy evaluation, and scheduling tools
                    remain locked until their prerequisite gates are visible in
                    the trace.
                  </p>
                </aside>
              ) : null}
            </div>
          </ScrollArea>

          <form className="conversation-input" onSubmit={onSubmit}>
            <div className="input-status">
              <span>
                <Keyboard size={14} /> Text always available
              </span>
              <span
                className={
                  speech.inputSupported
                    ? "status-available"
                    : "status-unavailable"
                }
              >
                {speech.inputSupported ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <AlertTriangle size={14} />
                )}
                {speech.inputSupported
                  ? "Browser voice ready"
                  : "Voice unavailable in this browser"}
              </span>
            </div>
            <div className="input-row">
              <Input
                value={input}
                disabled={Boolean(processing)}
                onChange={event => setInput(event.target.value)}
                placeholder="Type a request, phone number, date of birth, yes, or no…"
                aria-label="Caller message"
              />
              <Button
                type="button"
                variant="outline"
                className={
                  speech.listening
                    ? "mic-button mic-button--live"
                    : "mic-button"
                }
                disabled={!speech.inputSupported || Boolean(processing)}
                onClick={() =>
                  speech.listening
                    ? speech.stop()
                    : speech.listen(text => submit(text))
                }
                aria-label={
                  speech.listening ? "Stop listening" : "Speak a request"
                }
              >
                {speech.listening ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button
                type="submit"
                className="send-button"
                disabled={!input.trim() || Boolean(processing)}
              >
                {processing ? (
                  <Loader2 className="progress-spinner" size={17} />
                ) : (
                  <Send size={17} />
                )}
                <span>{processing ? "Working" : "Send"}</span>
              </Button>
            </div>
            {speech.error ? (
              <p className="speech-error">{speech.error}</p>
            ) : null}
          </form>
        </div>

        <aside className="evidence-panel" aria-label="Agent decision evidence">
          <div className="evidence-visual">
            <img
              src={traceImage}
              alt="Conceptual sequence from utterance through identity, policy, tool, and appointment evidence"
            />
            <div className="evidence-visual__label">
              <span>Runtime provenance</span>
              <strong>Utterance → rule → tool → receipt</strong>
            </div>
          </div>
          <div className="evidence-summary">
            <div>
              <span>Current state</span>
              <strong>{processing ? "processing" : stateLabel}</strong>
            </div>
            <div>
              <span>Intent</span>
              <strong>{session.intent}</strong>
            </div>
            <div>
              <span>Mutations</span>
              <strong>
                {
                  session.appointments.filter(
                    item => !item.assumption || item.status === "cancelled"
                  ).length
                }
              </strong>
            </div>
          </div>
          <div className="trace-heading">
            <div>
              <Sparkles size={16} />
              <strong>Decision trace</strong>
            </div>
            <span>{session.trace.length} events</span>
          </div>
          <ScrollArea className="trace-scroll">
            <ol className="trace-list">
              {[...session.trace].reverse().map(item => (
                <TraceRow key={item.id} item={item} />
              ))}
            </ol>
            {session.trace.length === 1 ? (
              <div className="idle-provenance">
                <span>PROVENANCE PATH · ARMED</span>
                <strong>
                  Utterance → intent → identity → policy → tool → outcome
                </strong>
                <div>
                  <EvidenceStamp tone="verified">KNOWN · SCOPE</EvidenceStamp>
                  <EvidenceStamp tone="attention">
                    UNKNOWN · CALLER NEED
                  </EvidenceStamp>
                </div>
                <p>
                  The next event will preserve what changed, why it changed, and
                  which tool remained locked or became eligible.
                </p>
              </div>
            ) : null}
          </ScrollArea>
        </aside>
      </section>

      <footer className="prototype-disclaimer">
        <AlertTriangle size={17} />
        <p>
          <strong>Prototype boundary:</strong> synthetic fixtures, browser
          speech, and no live EHR or telephony. Do not enter real patient
          information.
        </p>
      </footer>
    </div>
  );
}
