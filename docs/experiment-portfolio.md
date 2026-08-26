# FieldFlow Experiment Portfolio

**Author:** Eangelica Germano Aton  
**Decision frame:** Hypothesis → smallest falsifying test → metric contract → honest read

## Prioritization Logic

The portfolio prioritizes two things before feature breadth: **critical correctness** and **FDE leverage**. “Want the answer” is a 1–10 score for how much the result should change the roadmap. Priority combines that evidence value with dependency order and safety. A P0 result is needed before the team responsibly expands the platform thesis.

| ID     | Priority | Experiment                                      | Want the answer | Primary metric                                                  | Scale rule                                                  | Stop or narrow rule                             |
| ------ | -------- | ----------------------------------------------- | --------------: | --------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| EXP-01 | P0       | Policy compiler reduces FDE setup time          |              10 | Median active setup time + critical pass rate                   | ≥30% less active time and non-inferior critical correctness | Any critical regression                         |
| EXP-02 | P0       | Generated scenarios find real defects           |              10 | Unique critical defects per reviewer hour + false-positive rate | ≥25% defect-yield lift and <15% false positives             | Noise increases total review time               |
| EXP-03 | P1       | Decision traces shorten diagnosis               |               9 | Median diagnosis time + correct-layer identification            | ≥40% faster with no excess PHI exposure                     | Trace density reduces layer accuracy            |
| EXP-04 | P1       | Ambiguity queue prevents silent assumptions     |               9 | Critical ambiguity at approval + review minutes                 | Zero planted critical conflicts reach approval              | >15% added review time without better detection |
| EXP-05 | P2       | Reusable modules improve second-clinic velocity |               7 | Acceptance, overrides, critical regressions                     | ≥50% module acceptance and zero inherited critical errors   | Overrides erase time benefit                    |
| EXP-06 | P2       | Human-gated runtime learning adds value         |               6 | Accepted suggestion rate + replay improvement + review time     | ≥30% accepted suggestions and zero approval bypasses        | Suggestions turn local exceptions into defaults |

## P0 Experiment Specifications

### EXP-01 — Policy Compiler Reduces FDE Setup Time

**Hypothesis.** A structured, source-linked policy bundle reduces median active FDE configuration time by at least 30% without reducing critical scenario correctness.

**Smallest useful test.** Recruit two FDEs and two representative clinic scheduling packets. Each FDE configures one packet with the current workflow and one with FieldFlow, with order counterbalanced to reduce learning effects. Time only active work, not waiting for clinic answers. A blinded reviewer runs the same critical suite against each resulting configuration.

**Metric contract.** The primary result is within-person median active minutes. The non-inferiority guardrail is the critical scenario pass rate and the count of critical source fields incorrectly represented. The read is successful only when time decreases and correctness does not.

**Decision.** Scale to another pod if active time falls by 30% or more with no critical regression. Narrow to the ambiguity and schema steps if the full workflow adds review burden. Stop if any critical rule bypass is attributable to compilation or if FDEs must reconstruct source context outside the workspace.

### EXP-02 — Generated Scenarios Find Real Defects

**Hypothesis.** Source-derived scenario families find at least 25% more seeded critical defects per reviewer hour than a manual QA set alone.

**Smallest useful test.** Seed the same policy bundle and tool adapter with known failures across identity, age, coverage, discharge, provider continuity, slot order, urgent transfer, and confirmation. Give reviewers either the generated suite or the current manual process, then cross over on a second bundle. Count unique defects, time, and false positives.

**Metric contract.** The primary result is unique critical defects found per reviewer hour. Guardrails are false-positive rate, missed critical defects, and the amount of time spent interpreting generated evidence.

**Decision.** Scale when defect yield improves by at least 25%, false positives remain below 15%, and no critical family is systematically missed. Narrow if generation is strong only for a subset such as policy denials. Stop if reviewers spend more time dismissing noisy cases than they save.

## P1 Experiment Specifications

### EXP-03 — Decision Traces Shorten Diagnosis

Randomize FDEs to diagnose matched failures using transcript-only evidence or a source-linked decision trace. Measure median time to a correct root cause, correct-layer identification, unnecessary escalation, and perceived workload. Scale at a 40% median reduction with no increase in PHI exposure or incorrect diagnosis. Simplify the trace if density lowers layer-identification accuracy.

### EXP-04 — Ambiguity Queue Prevents Silent Assumptions

Prepare three clinic packets with planted conflicts of different forms: contradictory tables, missing consequential values, and prose/table disagreement. Compare the existing review with FieldFlow’s ambiguity queue. Scale only if no planted critical conflict reaches approval and added review time remains at or below 15%. Narrow to critical fields if low-severity findings overwhelm the reviewer.

## P2 Experiment Specifications

### EXP-05 — Reusable Modules Improve Second-Clinic Velocity

Configure a second gastroenterology clinic using modules suggested from Riverbend, while forcing a source diff and local approval. Measure accepted modules, override count, setup time, and inherited critical error. Scale when at least half the modules are accepted, time improves, and no critical rule transfers incorrectly. Keep the pattern local if overrides erase the benefit.

### EXP-06 — Human-Gated Runtime Learning Adds Value

Cluster de-identified, synthetic or appropriately governed failure events in shadow mode. Present FDEs with source-linked suggestions that can be accepted, edited, or rejected. Measure acceptance, review time, replay improvement, and whether suggestions preserve tenant boundaries. Expand only when at least 30% of suggestions are accepted and none bypass human approval. Stop if suggestions encourage local exceptions as cross-clinic defaults.

## Honest Read Template

| Field          | Required entry                                                          |
| -------------- | ----------------------------------------------------------------------- |
| Result         | Primary metric, confidence interval when useful, and guardrail outcomes |
| Interpretation | What the evidence supports—and what it does not                         |
| Decision       | Scale, narrow, repeat, or stop                                          |
| Product change | Exact lifecycle stage, contract, or interface affected                  |
| Risk update    | New failure mode or assumption discovered                               |
| Next test      | Smallest remaining uncertainty worth resolving                          |
