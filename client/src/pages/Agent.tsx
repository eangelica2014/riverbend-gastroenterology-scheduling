/**
 * Clinical Field Notebook design: patient dialogue stays warm and sparse while the adjacent
 * evidence rail exposes the exact intent, verification, policy, and tool path for the FDE.
 */

import { EvidenceStamp } from "@/components/EvidenceStamp";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createSession, processTurn, TraceEvent } from "@/lib/agentEngine";
import { useSpeech } from "@/hooks/useSpeech";
import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  Keyboard,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const traceImage = "/manus-storage/riverbend-trace-v2_a9383625.png";

const scenarioScripts = [
  { id: "book", label: "Book follow-up", note: "James Porter · active coverage", turns: ["I need to book an appointment", "555-0102", "1971-07-04", "yes", "yes"] },
  { id: "new", label: "Classify as new", note: "Elena · last seen in 2019", turns: ["I need to schedule", "555-0104", "1985-12-01", "yes"] },
  { id: "minor", label: "Block a minor", note: "Robert · age 16", turns: ["I need to book", "555-0105", "2010-08-15", "yes"] },
  { id: "confirm", label: "Confirm visit", note: "Margaret · upcoming appointment", turns: ["Please confirm my appointment", "555-0101", "1958-02-10"] },
  { id: "cancel", label: "Cancel visit", note: "Sofia · explicit confirmation", turns: ["Cancel my appointment", "555-0109", "1995-09-09", "yes"] },
  { id: "reschedule", label: "Reschedule visit", note: "George · earliest Raman slot", turns: ["Reschedule my appointment", "555-0110", "1948-03-17", "yes", "yes"] },
  { id: "parking", label: "Ask about parking", note: "Approved FAQ knowledge", turns: ["Where can I park at each location?"] },
  { id: "emergency", label: "Emergency boundary", note: "911 instruction + nurse line", turns: ["I am passing out and cannot breathe"] },
];

function TraceRow({ item }: { item: TraceEvent }) {
  const tone = item.status === "pass" ? "verified" : item.status === "attention" ? "attention" : item.status === "blocked" ? "blocked" : "neutral";
  return (
    <li className="trace-row">
      <div className={`trace-node trace-node--${item.status}`} aria-hidden="true" />
      <div>
        <div className="trace-row__meta">
          <span>{item.stage}</span>
          {item.ruleId ? <EvidenceStamp tone={tone}>{item.ruleId}</EvidenceStamp> : null}
          {item.tool ? <EvidenceStamp tone="neutral">{item.tool}</EvidenceStamp> : null}
        </div>
        <strong>{item.label}</strong>
        <p>{item.detail}</p>
      </div>
    </li>
  );
}

export default function Agent() {
  const [session, setSession] = useState(createSession);
  const [input, setInput] = useState("");
  const [voiceOutput, setVoiceOutput] = useState(false);
  const [lastScenario, setLastScenario] = useState<string | null>(null);
  const speech = useSpeech();

  const stateLabel = useMemo(() => session.step.replaceAll("_", " "), [session.step]);

  const submit = (text: string) => {
    const result = processTurn(session, text);
    setSession(result.session);
    setInput("");
    if (voiceOutput) speech.speak(result.reply);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (input.trim()) submit(input);
  };

  const runScenario = (script: (typeof scenarioScripts)[number]) => {
    let replay = createSession();
    let reply = replay.messages[0].text;
    script.turns.forEach((turn) => {
      const result = processTurn(replay, turn);
      replay = result.session;
      reply = result.reply;
    });
    setSession(replay);
    setLastScenario(script.label);
    if (voiceOutput) speech.speak(reply);
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
          <EvidenceStamp tone="neutral">Reference date 2026-08-26</EvidenceStamp>
        </div>
      </PageHeader>

      <section className="scenario-ribbon" aria-label="Scripted scenarios">
        <div className="scenario-ribbon__label">
          <Play size={16} />
          <span>Replay a proof</span>
        </div>
        <div className="scenario-ribbon__scroll">
          {scenarioScripts.map((script) => (
            <button key={script.id} type="button" onClick={() => runScenario(script)} className={lastScenario === script.label ? "scenario-chip scenario-chip--active" : "scenario-chip"}>
              <strong>{script.label}</strong>
              <small>{script.note}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="agent-workspace">
        <div className="conversation-panel">
          <div className="panel-toolbar">
            <div>
              <span className="live-dot" />
              <strong>Riverbend scheduling line</strong>
            </div>
            <div className="toolbar-actions">
              <button type="button" className={voiceOutput ? "tool-toggle tool-toggle--active" : "tool-toggle"} onClick={() => setVoiceOutput((value) => !value)} aria-pressed={voiceOutput}>
                <Volume2 size={15} /> Voice replies {voiceOutput ? "on" : "off"}
              </button>
              <button type="button" className="icon-button" onClick={() => { setSession(createSession()); setLastScenario(null); }} aria-label="Reset conversation">
                <RotateCcw size={17} />
              </button>
            </div>
          </div>

          <ScrollArea className="conversation-scroll" aria-live="polite">
            <div className="conversation-thread">
              {session.messages.map((message) => (
                <article key={message.id} className={`message message--${message.role}`}>
                  <span>{message.role === "agent" ? "Riverbend" : "Caller"}</span>
                  <p>{message.text}</p>
                  {message.role === "agent" && speech.outputSupported ? (
                    <button type="button" onClick={() => speech.speak(message.text)} aria-label="Read this response aloud"><Headphones size={14} /></button>
                  ) : null}
                </article>
              ))}
            </div>
          </ScrollArea>

          <form className="conversation-input" onSubmit={onSubmit}>
            <div className="input-status">
              <span><Keyboard size={14} /> Text always available</span>
              <span className={speech.inputSupported ? "status-available" : "status-unavailable"}>
                {speech.inputSupported ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                {speech.inputSupported ? "Browser voice ready" : "Voice unavailable in this browser"}
              </span>
            </div>
            <div className="input-row">
              <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type a request, phone number, date of birth, yes, or no…" aria-label="Caller message" />
              <Button type="button" variant="outline" className={speech.listening ? "mic-button mic-button--live" : "mic-button"} disabled={!speech.inputSupported} onClick={() => speech.listening ? speech.stop() : speech.listen((text) => { setInput(text); submit(text); })} aria-label={speech.listening ? "Stop listening" : "Speak a request"}>
                {speech.listening ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button type="submit" className="send-button" disabled={!input.trim()}>
                <Send size={17} /> <span>Send</span>
              </Button>
            </div>
            {speech.error ? <p className="speech-error">{speech.error}</p> : null}
          </form>
        </div>

        <aside className="evidence-panel" aria-label="Agent decision evidence">
          <div className="evidence-visual">
            <img src={traceImage} alt="Conceptual sequence from utterance through identity, policy, tool, and appointment evidence" />
            <div className="evidence-visual__label"><span>Runtime provenance</span><strong>Utterance → rule → tool → receipt</strong></div>
          </div>
          <div className="evidence-summary">
            <div>
              <span>Current state</span>
              <strong>{stateLabel}</strong>
            </div>
            <div>
              <span>Intent</span>
              <strong>{session.intent}</strong>
            </div>
            <div>
              <span>Mutations</span>
              <strong>{session.appointments.filter((item) => !item.assumption || item.status === "cancelled").length}</strong>
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
              {[...session.trace].reverse().map((item) => <TraceRow key={item.id} item={item} />)}
            </ol>
          </ScrollArea>
        </aside>
      </section>

      <footer className="prototype-disclaimer">
        <AlertTriangle size={17} />
        <p><strong>Prototype boundary:</strong> synthetic fixtures, browser speech, and no live EHR or telephony. Do not enter real patient information.</p>
      </footer>
    </div>
  );
}
