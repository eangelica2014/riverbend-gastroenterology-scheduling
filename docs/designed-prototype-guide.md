# Designed Prototype Guide

The Riverbend prototype is an evaluator-accessible, synthetic-data product proof. It combines the Phase 1 voice/text agent with the Phase 2 FieldFlow platform concept in one field-binder navigation system. It does not connect to an EHR, telephony service, production AI model, or real patient record.

| Route | Assignment proof | Recommended evaluator action |
| --- | --- | --- |
| `/` | One-clinic-to-platform narrative and role alignment | Read the operating thesis, then choose Phase 1 or Phase 2 |
| `/agent` | Functional agent, mock tools, voice enhancement, state and trace evidence | Replay “Book follow-up,” “Block a minor,” “Confirm visit,” and “Emergency boundary”; then type a request |
| `/architecture` | Prompt/knowledge/policy/tool separation, runtime layers, assumptions | Inspect the six-layer field map and the three mutation boundaries |
| `/tests` | Scenario catalog, evidence-bearing assertions, iteration rationale | Run all 24 scenarios; expand a critical case and inspect expected versus observed evidence |
| `/platform` | Generalization, designed lifecycle, clinic-versus-platform boundary | Open “Clarify,” “Compile,” “Simulate,” and “Improve”; compare artifacts and decision contracts |
| `/experiments` | Prioritized hypotheses, metrics, evidence value, stop/scale logic | Open both P0 experiments and inspect the smallest useful test and decision rule |

## Five-Minute Demo Path

Start on the case brief and state the thesis: flexible conversation, deterministic policy. Open the agent and replay the follow-up booking scenario, pointing out the identity gate, policy reason codes, slot search, explicit confirmation, and mutation receipt. Replay the minor or emergency case to show a negative guarantee. Move to architecture and explain why the prompt does not own clinic truth. Run the scenario lab and show that evidence includes forbidden calls and mutation state. Open FieldFlow’s Clarify and Simulate stages, then close with the two P0 experiments.

## Ten-Minute Demo Path

Use the five-minute path, then add the exact Riverbend source ambiguities, the generalization boundary, the dual-method mapping, the human-gated improvement model, and the P1/P2 portfolio. End with the decision to fund source-to-policy and policy-to-test before a broad visual builder or autonomous policy learning.

## Voice and Accessibility

Browser speech recognition and speech synthesis are progressive enhancements. If microphone permission is unavailable, the full product proof remains accessible through text and scripted scenarios. The prototype provides a skip link, keyboard controls, visible focus, semantic labels, and reduced-motion support. Evaluators should not enter real patient information.

