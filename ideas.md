# Riverbend Gastroenterology Scheduling — Design Ideas

## Three Directions Considered

### Theme Name: Clinical Field Notebook

**Very Brief Intro:** A warm, editorial operations surface inspired by a clinician’s annotated field notebook, with visible evidence, hand-marked decision paths, and calm institutional typography. It feels human and exact without resembling a hospital portal.

**Probability:** 0.031

### Theme Name: Night Shift Operations Theater

**Very Brief Intro:** A dark, high-contrast control room for live agent traces, scenario playback, and deployment assurance. It emphasizes runtime observability and technical confidence.

**Probability:** 0.074

### Theme Name: Public Health Wayfinding

**Very Brief Intro:** A civic-service visual language built from directional signage, transit-map logic, and accessible color blocks. It makes complicated clinic rules feel navigable and public-facing.

**Probability:** 0.018

## Chosen Direction: Clinical Field Notebook

### Design Movement

The interface draws from **Swiss editorial modernism filtered through medical field documentation**: rational type, asymmetrical composition, ruled annotations, index tabs, and evidence labels. It borrows the credibility of a well-kept clinical operations binder without imitating an EHR.

### Core Principles

1. **Evidence stays visible.** Important outcomes always reveal the source rule, matched record, tool call, or test assertion that produced them.
2. **Calm before clever.** The patient interaction is warm and concise; the FDE interface is precise and progressively discloses complexity.
3. **Asymmetry creates orientation.** A persistent narrow rail, offset panels, and staggered evidence blocks replace a generic centered dashboard.
4. **Every accent carries meaning.** Green means verified or allowed, orange means human attention or unresolved policy, and red is reserved for safety-critical stops.

### Color Philosophy

The base is **paper ivory**, chosen to reduce the coldness of a typical blue healthcare interface and reinforce the sense of a working field notebook. **River ink** is a very dark green-black used for text and navigation, conveying stability without defaulting to pure black. A vivid **signal orange** carries Eangelica’s human-first energy and marks decisions that need attention. A sharp **chartreuse verification color** connects to her portfolio identity and is used sparingly for proven, test-passing states. The palette makes administrative healthcare feel precise, humane, and authored.

### Layout Paradigm

The application uses a **field-binder layout** rather than a centered grid. A slim vertical folio rail establishes mode and progress. The primary workspace is an offset split: conversation or build canvas on the left, evidence and policy trace on the right. Phase 2 unfolds as a horizontal lifecycle ribbon with vertically stacked artifacts beneath it. Mobile collapses the evidence rail into a bottom drawer while keeping the active action and current state visible.

### Signature Elements

1. **Rule ribbons:** thin annotated bands with identifiers such as `RB-ELIG-03` that connect a decision to its source policy.
2. **Evidence stamps:** compact rectangular marks—VERIFIED, TRANSFERRED, BLOCKED, HUMAN REVIEW—styled like careful operations annotations rather than rounded pills.
3. **Riverline traces:** fine meandering connector lines that show the path from utterance to intent to rule to tool to outcome.

### Interaction Philosophy

Interactions should feel like handling a precise instrument. Buttons depress immediately; scenario selection updates the trace without theatrical delay; consequential actions require an explicit confirmation turn. The interface never hides why an action is disabled. Hover and focus reveal provenance or expected impact, and every voice action has a text equivalent.

### Animation

Motion is limited to state clarification. Conversation turns enter with an 180 ms rise-and-fade; the decision trace draws from left to right in 240 ms after a tool result; evidence stamps land with a subtle 0.98-to-1 scale. Scenario runs animate their progress through the lifecycle ribbon but never exceed 300 ms per transition. Keyboard actions are instant. All nonessential motion is removed under `prefers-reduced-motion`.

### Typography System

**Newsreader** is the display and narrative face, used for page titles, key questions, and reflective product framing. **IBM Plex Sans** is the interface and body face for clarity at operational sizes. **IBM Plex Mono** is reserved for rule identifiers, tool names, timestamps, and structured outcomes. Headlines use high contrast between Newsreader italic emphasis and Plex Sans technical labels; body copy remains left-aligned with a comfortable measure.

### Brand Essence

**Positioning:** An inspectable scheduling agent and FDE workbench for turning messy clinic rules into safe, testable, reusable operations.

**Personality:** Empathetic, exacting, composed.

### Brand Voice

Headlines state the operating insight plainly. CTAs describe the action and its consequence. Microcopy is calm, brief, and specific; it avoids generic invitations and hype.

Example headline: **“The conversation can be flexible. The policy cannot.”**

Example CTA: **“Run the duplicate-patient test”**

### Wordmark & Logo

The wordmark uses a custom editorial lockup: `RIVERBEND` in tightly tracked Plex Sans capitals, a fine riverline crossing the baseline, and `scheduling system` in Newsreader italic. The mark is a bold abstract **R-shaped river bend within an open appointment ledger**, with no text, so it remains legible as a favicon and header symbol.

### Signature Brand Color

**Signal Persimmon — `#F05A28`**. It is warm, highly visible, and already resonates with the candidate’s public portfolio, making the work feel personally authored rather than template-derived.

## Style Decisions

- This design deliberately avoids a generic blue-and-white healthcare dashboard.
- Corners are mostly square or lightly eased; rounded pills are limited to compact state controls.
- The patient-facing voice surface and the FDE platform share one system but use different density: warm simplicity for patients, annotated evidence for operators.
- Every screen should answer three questions without a manual: **What is happening? Why? What can I do next?**
- Every major route carries the **Riverbend ledger/river symbol and editorial lockup** as a primary orientation mark; `RB / 2026` remains secondary metadata only.
- The persistent folio structure identifies the current mode and progress through the case study; full-page captures may omit fixed navigation chrome, but the live experience must retain it.
- Rule ribbons, evidence stamps, and fine riverline connectors form the interface grammar. Important decisions should visibly connect source, rule, tool, test, and outcome wherever density permits.
- **Signal Persimmon `#F05A28`** marks human attention or unresolved policy, **chartreuse** marks verified or test-passing evidence, and **red** appears only for true safety-critical stops or failing critical gates.
