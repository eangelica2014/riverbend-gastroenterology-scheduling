# Assignment Requirement Traceability

This matrix prevents a polished submission from accidentally omitting a stated requirement. Status values will be updated as artifacts are implemented and tested.

| ID | Requirement | Planned evidence | Validation | Status |
| --- | --- | --- | --- | --- |
| P1-01 | Book appointments for new patients | `/agent` new-patient scenario and `bookAppointment` trace | Scenario assertion on 30-minute slot and policy gates | Designed |
| P1-02 | Book appointments for existing patients | `/agent` James Porter follow-up scenario | Assigned-provider and 15-minute assertions | Designed |
| P1-03 | Reschedule appointment | Upcoming-appointment fixture and explicit confirmation flow | Atomic before/after state assertion | Designed |
| P1-04 | Cancel appointment | Upcoming-appointment fixture and explicit confirmation flow | Status mutation and receipt assertion | Designed |
| P1-05 | Confirm appointment | Upcoming-appointment retrieval with verified identity | No-mutation confirmation assertion | Designed |
| P1-06 | Answer hours FAQ | Approved knowledge record | Exact hours and lunch closure assertion | Designed |
| P1-07 | Answer locations FAQ | Approved knowledge record | Both locations and addresses assertion | Designed |
| P1-08 | Answer parking FAQ | Approved knowledge record | Meter versus free-lot assertion | Designed |
| P1-09 | Transfer to front desk | Explicit human, billing, annual physical, unsupported intent | Destination and reason-code assertion | Designed |
| P1-10 | Route urgent clinical question | Nurse-line transfer with no medical advice | Safety phrase and destination assertion | Designed |
| P1-11 | Handle possible emergency | 911 instruction plus clinical transfer path | Critical exact-intent assertion | Designed |
| P1-12 | No matching patient | Unknown phone/DOB scenario | `NO_PATIENT` with safe next step | Designed |
| P1-13 | No matching appointment | Verified patient without active appointment | `NO_APPOINTMENT` without invented details | Designed |
| P1-14 | Unrecognized request | Unsupported-intent scenario | Repair once, then front-desk transfer | Designed |
| P1-15 | Caller wants human | Explicit request at multiple states | Immediate front-desk transfer | Designed |
| P1-16 | Agent is inspectable | Public browser prototype with trace drawer and data fixtures | Evaluator can run scenarios without credentials | Designed |
| P1-17 | Scenarios submitted | `/tests` catalog plus repository test files | Automated suite with critical tags | Designed |
| P1-18 | Architecture write-up | `docs/architecture.md` and `/architecture` | Prompt/knowledge/policy/tool boundary reviewed | Designed |
| P1-19 | High-level iteration log | `docs/iteration-log.md` and `/tests` iteration view | Each change has evidence and rationale | Designed |
| RB-01 | Three-year new/follow-up rule | Policy `RB-VISIT-01` | Boundary-date tests | Designed |
| RB-02 | New 30 minutes; follow-up 15 | Policy `RB-DUR-01` | Slot-duration tests | Designed |
| RB-03 | Active insurance and policy number required | Policies `RB-COV-01/02` | Inactive and missing-number tests | Designed |
| RB-04 | Under 18 blocked | Policy `RB-AGE-01` | Robert Kim test | Designed |
| RB-05 | Follow-up uses assigned provider | Policy `RB-PROV-01` | Alternate-provider transfer test | Designed |
| RB-06 | Dr. Crane Thursday constraint and Sofia pairing | Policy `RB-CRANE-01/02` | Preference and weekday tests | Designed |
| RB-07 | Offer soonest eligible appointment | Policy `RB-SLOT-01` | Sorted-candidate assertion | Designed |
| RB-08 | Discharged patient not booked | Policy `RB-DISCH-01` | Patricia Nguyen critical test | Designed |
| RB-09 | Annual physical remains TBD | Policy `RB-TBD-01` | Human-transfer assertion | Designed |
| RB-10 | Clinic hours exclude lunch | Schedule configuration | No slot overlaps 12–1 PM | Designed |
| P2-01 | Generalize clinic lessons into product features | FieldFlow lifecycle and primitive/config/local boundary | Each feature tied to Phase 1 friction | Designed |
| P2-02 | Identify what should not be abstracted | Explicit tenant/local/unresolved matrix | Riverbend examples remain configurable | Designed |
| P2-03 | Provide designed prototype | `/platform` interactive lifecycle workbench | Source-to-release walkthrough | Designed |
| P2-04 | Specify experiments for unknowns | `/experiments` and PRD portfolio | Hypothesis, test, metric, value, priority, decision rule present | Designed |
| P2-05 | Prioritize experiments | P0/P1/P2 ordering with evidence-value score | P0 addresses highest correctness and leverage risks | Designed |
| VID-01 | Optional 5–10 minute walkthrough | Interactive PowerPoint and timed speaker script | Rehearsed target duration 7–8 minutes | Planned |
| DOC-01 | MS Word PRD summary | `.docx` with executive summary, diagrams, decisions, metrics, risks, references | Open and visual QA in Word-compatible viewer | Planned |
| OSS-01 | Open-source repository | Public GitHub repo named “Riverbend Gastroenterology Scheduling” | Clean commit, license, README, security, tests, CI | Planned |

## Completion Standard

A requirement moves to **Implemented** only when its artifact exists, and to **Verified** only when the associated test, visual review, or document inspection passes. The final package will include a copy of this matrix with no assignment row left in Designed or Planned state.

