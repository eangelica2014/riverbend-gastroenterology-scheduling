/**
 * Clinical Field Notebook design: the conversation is flexible; policy and writes are explicit.
 * Every material decision emits a human-readable evidence event for FDE inspection.
 */

import {
  Appointment,
  Patient,
  Slot,
  VisitType,
  formatAppointmentDate,
  getLocation,
  getProvider,
  initialAppointments,
  patients,
  providers,
  slots,
  NEW_PATIENT_CUTOFF,
} from "@/data/riverbend";

export type AgentIntent =
  | "book"
  | "confirm"
  | "cancel"
  | "reschedule"
  | "faq"
  | "human"
  | "urgent"
  | "emergency"
  | "unknown";

export type AgentStep =
  | "idle"
  | "awaiting_phone"
  | "awaiting_dob"
  | "awaiting_insurance"
  | "awaiting_slot_confirmation"
  | "awaiting_cancel_confirmation";

export interface TraceEvent {
  id: string;
  stage:
    | "intent"
    | "safety"
    | "identity"
    | "policy"
    | "knowledge"
    | "tool"
    | "response";
  label: string;
  detail: string;
  status: "pass" | "attention" | "blocked" | "neutral";
  ruleId?: string;
  tool?: string;
}

export interface ConversationMessage {
  id: string;
  role: "caller" | "agent";
  text: string;
}

export interface AgentSession {
  step: AgentStep;
  intent: AgentIntent;
  patientId?: string;
  appointmentId?: string;
  proposedSlotId?: string;
  visitType?: VisitType;
  durationMinutes?: number;
  repairedUnknown: boolean;
  appointments: Appointment[];
  bookedSlotIds: string[];
  messages: ConversationMessage[];
  trace: TraceEvent[];
}

export interface TurnResult {
  session: AgentSession;
  reply: string;
  outcome?: string;
}

export interface BookingDecision {
  allowed: boolean;
  outcome: "allowed" | "denied" | "transfer_front_desk";
  visitType?: VisitType;
  durationMinutes?: number;
  providerId?: string;
  reasonCode?: string;
  rules: string[];
}

const uid = () => Math.random().toString(36).slice(2, 9);

const event = (
  stage: TraceEvent["stage"],
  label: string,
  detail: string,
  status: TraceEvent["status"],
  extra: Pick<TraceEvent, "ruleId" | "tool"> = {}
): TraceEvent => ({ id: uid(), stage, label, detail, status, ...extra });

export const createSession = (): AgentSession => ({
  step: "idle",
  intent: "unknown",
  repairedUnknown: false,
  appointments: initialAppointments.map(appointment => ({ ...appointment })),
  bookedSlotIds: [],
  messages: [
    {
      id: uid(),
      role: "agent",
      text: "Thank you for calling Riverbend Gastroenterology. I can help with appointments, hours, locations, parking, or a transfer. What do you need?",
    },
  ],
  trace: [
    event(
      "response",
      "Scope opened",
      "Administrative scheduling and approved clinic information only",
      "neutral"
    ),
  ],
});

export const calculateAge = (dob: string, referenceDate = "2026-08-26") => {
  const birth = new Date(`${dob}T12:00:00Z`);
  const reference = new Date(`${referenceDate}T12:00:00Z`);
  let age = reference.getUTCFullYear() - birth.getUTCFullYear();
  const monthDifference = reference.getUTCMonth() - birth.getUTCMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && reference.getUTCDate() < birth.getUTCDate())
  )
    age -= 1;
  return age;
};

export const classifyVisit = (patient: Patient): VisitType =>
  !patient.lastSeen || patient.lastSeen < NEW_PATIENT_CUTOFF
    ? "new_patient"
    : "follow_up";

export const evaluateBooking = (
  patient: Patient,
  insurancePolicyAvailable: boolean,
  requestedProviderId?: string,
  acceptsPairedClinician = false
): BookingDecision => {
  if (calculateAge(patient.dob) < 18) {
    return {
      allowed: false,
      outcome: "denied",
      reasonCode: "UNDER_18",
      rules: ["RB-AGE-01"],
    };
  }
  if (patient.discharged) {
    return {
      allowed: false,
      outcome: "transfer_front_desk",
      reasonCode: "DISCHARGED_FROM_PRACTICE",
      rules: ["RB-DISCH-01"],
    };
  }
  if (!patient.insuranceActive) {
    return {
      allowed: false,
      outcome: "denied",
      reasonCode: "INACTIVE_INSURANCE",
      rules: ["RB-COV-01"],
    };
  }
  if (!insurancePolicyAvailable) {
    return {
      allowed: false,
      outcome: "denied",
      reasonCode: "POLICY_NUMBER_REQUIRED",
      rules: ["RB-COV-02"],
    };
  }

  const visitType = classifyVisit(patient);
  const durationMinutes = visitType === "new_patient" ? 30 : 15;
  const rules = ["RB-VISIT-01", "RB-DUR-01"];
  let providerId =
    requestedProviderId || patient.assignedProviderId || undefined;

  if (
    visitType === "follow_up" &&
    requestedProviderId &&
    patient.assignedProviderId &&
    requestedProviderId !== patient.assignedProviderId
  ) {
    if (
      patient.assignedProviderId === "PROV-CRANE" &&
      requestedProviderId === "PROV-MENDEZ" &&
      acceptsPairedClinician
    ) {
      providerId = "PROV-MENDEZ";
      rules.push("RB-CRANE-02");
    } else {
      return {
        allowed: false,
        outcome: "transfer_front_desk",
        reasonCode: "DIFFERENT_PROVIDER_APPROVAL_REQUIRED",
        rules: [...rules, "RB-PROV-01"],
      };
    }
  } else if (visitType === "follow_up") {
    rules.push("RB-PROV-01");
  }

  if (patient.assignedProviderId === "PROV-CRANE" && !providerId)
    providerId = "PROV-CRANE";
  if (providerId === "PROV-CRANE") rules.push("RB-CRANE-01");

  return {
    allowed: true,
    outcome: "allowed",
    visitType,
    durationMinutes,
    providerId,
    rules,
  };
};

export const searchEligibleSlots = (
  decision: BookingDecision,
  bookedSlotIds: string[] = [],
  requestedProviderId?: string
): Slot[] => {
  if (!decision.allowed || !decision.durationMinutes) return [];
  const providerId = requestedProviderId || decision.providerId;
  const physicianIds = providers
    .filter(provider => provider.role === "physician")
    .map(provider => provider.id);
  return slots
    .filter(slot => !bookedSlotIds.includes(slot.id))
    .filter(slot => slot.durationMinutes >= decision.durationMinutes!)
    .filter(slot =>
      providerId
        ? slot.providerId === providerId
        : physicianIds.includes(slot.providerId)
    )
    .sort((a, b) => a.start.localeCompare(b.start));
};

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) return null;
  const lastSeven = digits.slice(-7);
  return `${lastSeven.slice(0, 3)}-${lastSeven.slice(3)}`;
};

const extractDob = (value: string) => {
  const iso = value.match(/\b(19|20)\d{2}-\d{2}-\d{2}\b/);
  if (iso) return iso[0];
  const slash = value.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
  if (!slash) return null;
  return `${slash[3]}-${slash[1].padStart(2, "0")}-${slash[2].padStart(2, "0")}`;
};

const yes = (value: string) =>
  /\b(yes|yeah|yep|correct|confirm|please do|i do|i have it)\b/i.test(value);
const no = (value: string) =>
  /\b(no|nope|do not|don't|cancel that|not available)\b/i.test(value);

const detectIntent = (value: string): AgentIntent => {
  const text = value.toLowerCase();
  if (
    /can'?t breathe|cannot breathe|passing out|unconscious|emergency|chest pain/.test(
      text
    )
  )
    return "emergency";
  if (/severe|urgent|medical question|pain|bleeding|symptom/.test(text))
    return "urgent";
  if (/human|person|representative|front desk|staff member/.test(text))
    return "human";
  if (/reschedul|move my appointment|change my appointment/.test(text))
    return "reschedule";
  if (/cancel/.test(text)) return "cancel";
  if (/confirm|when is my appointment|check my appointment/.test(text))
    return "confirm";
  if (/book|schedule|make an appointment|new appointment/.test(text))
    return "book";
  if (/hour|open|close|location|address|park|where are you/.test(text))
    return "faq";
  return "unknown";
};

const withTurn = (
  session: AgentSession,
  callerText: string,
  reply: string,
  trace: TraceEvent[],
  patch: Partial<AgentSession> = {}
): AgentSession => ({
  ...session,
  ...patch,
  messages: [
    ...session.messages,
    { id: uid(), role: "caller", text: callerText },
    { id: uid(), role: "agent", text: reply },
  ],
  trace: [
    ...session.trace,
    ...trace,
    event("response", "Patient-facing response", reply, "neutral"),
  ],
});

const appointmentDescription = (appointment: Appointment) => {
  const provider = getProvider(appointment.providerId);
  const location = getLocation(appointment.locationId);
  return `${formatAppointmentDate(appointment.start)} with ${provider?.name}, ${provider?.credentials}, at ${location.name}`;
};

export const processTurn = (
  session: AgentSession,
  rawInput: string
): TurnResult => {
  const input = rawInput.trim();
  const detected = detectIntent(input);

  if (!input) return { session, reply: "Please enter or say a request." };

  if (detected === "emergency") {
    const reply =
      "This may be an emergency. Please hang up and dial 911 now. I can also connect you to Riverbend’s nurse line at (555) 010-2911.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "safety",
            "Emergency language detected",
            "Ordinary scheduling stopped",
            "blocked",
            { ruleId: "RB-SAFE-01" }
          ),
          event(
            "tool",
            "Nurse-line transfer prepared",
            "Destination: (555) 010-2911",
            "attention",
            { tool: "transferCall" }
          ),
        ],
        { step: "idle", intent: "emergency" }
      ),
      reply,
      outcome: "emergency_instruction",
    };
  }

  if (detected === "urgent") {
    const reply =
      "I can’t provide medical advice, but I can connect you to a Riverbend medical professional now at (555) 010-2911.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "safety",
            "Clinical judgment boundary",
            "Urgent content routed without advice",
            "attention",
            { ruleId: "RB-SAFE-02" }
          ),
          event(
            "tool",
            "Nurse-line transfer prepared",
            "Destination: (555) 010-2911",
            "pass",
            { tool: "transferCall" }
          ),
        ],
        { step: "idle", intent: "urgent" }
      ),
      reply,
      outcome: "transfer_nurse_line",
    };
  }

  if (detected === "human") {
    const reply =
      "I’ll connect you to Riverbend’s front desk at (555) 010-2000.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "tool",
            "Human requested",
            "Immediate front-desk transfer",
            "pass",
            { tool: "transferCall" }
          ),
        ],
        { step: "idle", intent: "human" }
      ),
      reply,
      outcome: "transfer_front_desk",
    };
  }

  if (detected === "faq") {
    const lower = input.toLowerCase();
    let reply =
      "Riverbend is open Monday through Friday, 9:00 AM to 5:00 PM, and closes from noon to 1:00 PM for lunch.";
    if (/park/.test(lower))
      reply =
        "Maple Grove at 120 Maple Grove Ave has street meter parking. Lakeside at 45 Lakeside Blvd has a free patient lot.";
    else if (/location|address|where/.test(lower))
      reply =
        "Riverbend has Maple Grove at 120 Maple Grove Ave and Lakeside at 45 Lakeside Blvd.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "knowledge",
            "Approved clinic information",
            "Read from versioned FAQ content",
            "pass",
            { tool: "getClinicInfo" }
          ),
        ],
        { step: "idle", intent: "faq" }
      ),
      reply,
      outcome: "faq_answered",
    };
  }

  if (session.step === "idle") {
    const intent = detected;
    if (intent === "unknown") {
      if (/billing|physical|wellness/.test(input.toLowerCase())) {
        const physical = /physical|wellness/.test(input.toLowerCase());
        const reply = physical
          ? "Riverbend has not finalized scheduling for annual physicals. I’ll connect you to the front desk at (555) 010-2000."
          : "Billing is handled by the front desk. I’ll connect you at (555) 010-2000.";
        return {
          session: withTurn(
            session,
            input,
            reply,
            [
              event(
                "policy",
                physical ? "Policy unresolved" : "Outside agent scope",
                "Front-desk handoff required",
                "attention",
                physical ? { ruleId: "RB-TBD-01" } : {}
              ),
            ],
            { step: "idle", intent: "human" }
          ),
          reply,
          outcome: "transfer_front_desk",
        };
      }
      const reply = session.repairedUnknown
        ? "I’m still not able to place that request. I’ll connect you to Riverbend’s front desk at (555) 010-2000."
        : "I can help with appointments, hours, locations, parking, or a transfer. Which do you need?";
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            event(
              "intent",
              "Intent unresolved",
              session.repairedUnknown
                ? "Repair failed; front-desk handoff"
                : "One repair attempt allowed",
              "attention",
              { ruleId: "RB-UNSUP-01" }
            ),
          ],
          { repairedUnknown: true }
        ),
        reply,
        outcome: session.repairedUnknown
          ? "transfer_front_desk"
          : "repair_requested",
      };
    }

    const reply =
      "Please provide the patient phone number from the Riverbend record. This demo uses numbers such as 555-0101.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "intent",
            `${intent} intent`,
            "Supported administrative workflow",
            "pass"
          ),
        ],
        { step: "awaiting_phone", intent }
      ),
      reply,
    };
  }

  if (session.step === "awaiting_phone") {
    const phone = normalizePhone(input);
    const nameMatches = patients.filter(patient =>
      input.toLowerCase().includes(patient.name.toLowerCase())
    );
    if (!phone && nameMatches.length > 1) {
      const reply =
        "I found more than one patient with that name. Please provide the phone number on the record; I won’t match by name alone.";
      return {
        session: withTurn(session, input, reply, [
          event(
            "identity",
            "Ambiguous identity",
            "Duplicate name requires a stronger identifier",
            "blocked"
          ),
        ]),
        reply,
        outcome: "verification_required",
      };
    }
    const patient = patients.find(candidate => candidate.phone === phone);
    if (!patient) {
      const reply =
        "I couldn’t locate a patient record with that phone number. I can try again or connect you to the front desk.";
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            event(
              "tool",
              "No patient match",
              "lookupPatient returned NO_PATIENT",
              "blocked",
              { tool: "lookupPatient" }
            ),
          ],
          { step: "idle" }
        ),
        reply,
        outcome: "no_patient",
      };
    }
    const reply =
      "For privacy, please provide the patient date of birth in MM/DD/YYYY or YYYY-MM-DD format.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "tool",
            "Patient candidate found",
            `Candidate ${patient.id}; details remain gated`,
            "pass",
            { tool: "lookupPatient" }
          ),
          event(
            "identity",
            "DOB required",
            "No appointment disclosure before verification",
            "attention"
          ),
        ],
        { step: "awaiting_dob", patientId: patient.id }
      ),
      reply,
    };
  }

  const patient = patients.find(
    candidate => candidate.id === session.patientId
  );
  if (!patient) {
    const reply =
      "The session no longer has a verified patient candidate. Please start again.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "identity",
            "Session reset",
            "Missing patient candidate",
            "blocked"
          ),
        ],
        { step: "idle" }
      ),
      reply,
    };
  }

  if (session.step === "awaiting_dob") {
    const dob = extractDob(input);
    if (dob !== patient.dob) {
      const reply =
        "I couldn’t verify the date of birth, so I won’t open or change the appointment record. I can try again or connect you to the front desk.";
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            event(
              "identity",
              "Verification failed",
              "DOB did not match; no protected read or write",
              "blocked"
            ),
          ],
          { step: "idle", patientId: undefined }
        ),
        reply,
        outcome: "verification_failed",
      };
    }

    const identityTrace = [
      event(
        "identity",
        "Identity verified",
        `DOB matched ${patient.id}`,
        "pass"
      ),
    ];
    const activeAppointment = session.appointments.find(
      appointment =>
        appointment.patientId === patient.id && appointment.status === "booked"
    );

    if (session.intent === "confirm") {
      if (!activeAppointment) {
        const reply =
          "I verified the record, but there is no upcoming appointment to confirm. I can help book one or connect you to the front desk.";
        return {
          session: withTurn(
            session,
            input,
            reply,
            [
              ...identityTrace,
              event(
                "tool",
                "No active appointment",
                "getAppointments returned NO_APPOINTMENT",
                "blocked",
                { tool: "getAppointments" }
              ),
            ],
            { step: "idle" }
          ),
          reply,
          outcome: "no_appointment",
        };
      }
      const reply = `Your appointment is booked for ${appointmentDescription(activeAppointment)}.`;
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            ...identityTrace,
            event(
              "tool",
              "Appointment retrieved",
              activeAppointment.id,
              "pass",
              { tool: "getAppointments" }
            ),
          ],
          { step: "idle" }
        ),
        reply,
        outcome: "confirmed_read_only",
      };
    }

    if (session.intent === "cancel") {
      if (!activeAppointment) {
        const reply =
          "I verified the record, but there is no upcoming appointment to cancel.";
        return {
          session: withTurn(
            session,
            input,
            reply,
            [
              ...identityTrace,
              event(
                "tool",
                "No active appointment",
                "No mutation allowed",
                "blocked",
                { tool: "getAppointments" }
              ),
            ],
            { step: "idle" }
          ),
          reply,
          outcome: "no_appointment",
        };
      }
      const reply = `I found ${appointmentDescription(activeAppointment)}. Should I cancel this appointment?`;
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            ...identityTrace,
            event(
              "tool",
              "Appointment selected",
              activeAppointment.id,
              "pass",
              { tool: "getAppointments" }
            ),
            event(
              "policy",
              "Explicit confirmation required",
              "No cancellation yet",
              "attention"
            ),
          ],
          {
            step: "awaiting_cancel_confirmation",
            appointmentId: activeAppointment.id,
          }
        ),
        reply,
      };
    }

    if (session.intent === "reschedule" && !activeAppointment) {
      const reply =
        "I verified the record, but there is no upcoming appointment to reschedule.";
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            ...identityTrace,
            event(
              "tool",
              "No active appointment",
              "No mutation allowed",
              "blocked",
              { tool: "getAppointments" }
            ),
          ],
          { step: "idle" }
        ),
        reply,
        outcome: "no_appointment",
      };
    }

    const reply =
      "Do you have the insurance card or policy number available now? Please answer yes or no; this demo will not ask you to enter the number.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          ...identityTrace,
          ...(activeAppointment
            ? [
                event(
                  "tool",
                  "Appointment retrieved",
                  activeAppointment.id,
                  "pass",
                  { tool: "getAppointments" }
                ),
              ]
            : []),
        ],
        { step: "awaiting_insurance", appointmentId: activeAppointment?.id }
      ),
      reply,
    };
  }

  if (session.step === "awaiting_insurance") {
    if (!yes(input) && !no(input)) {
      const reply =
        "Please answer yes if the insurance card or policy number is available, or no if it is not.";
      return {
        session: withTurn(session, input, reply, [
          event(
            "policy",
            "Coverage input unresolved",
            "A clear yes or no is required",
            "attention"
          ),
        ]),
        reply,
      };
    }
    const decision = evaluateBooking(patient, yes(input));
    const decisionTrace = decision.rules.map(ruleId =>
      event(
        "policy",
        ruleId,
        decision.allowed
          ? "Policy gate passed"
          : decision.reasonCode || "Policy denied",
        decision.allowed ? "pass" : "blocked",
        { ruleId }
      )
    );

    if (!decision.allowed) {
      const copy: Record<string, string> = {
        UNDER_18:
          "Riverbend does not schedule patients under age 18. I can connect you to the front desk if you need help with next steps.",
        INACTIVE_INSURANCE:
          "The insurance on this record is inactive, so I can’t make an appointment. Please contact the front desk after the coverage information is updated.",
        POLICY_NUMBER_REQUIRED:
          "Riverbend requires the insurance card or policy number at scheduling, so I can’t complete the appointment yet.",
        DISCHARGED_FROM_PRACTICE:
          "I can’t schedule from this record. I’ll connect you to the front desk for assistance.",
      };
      const reply =
        copy[decision.reasonCode || ""] ||
        "I can’t complete this booking. I’ll connect you to the front desk.";
      return {
        session: withTurn(session, input, reply, decisionTrace, {
          step: "idle",
        }),
        reply,
        outcome: decision.outcome,
      };
    }

    const eligible = searchEligibleSlots(decision, session.bookedSlotIds);
    const slot = eligible[0];
    if (!slot) {
      const reply =
        "I didn’t find an eligible appointment in the demo schedule. I’ll connect you to the front desk rather than invent a time.";
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            ...decisionTrace,
            event(
              "tool",
              "No eligible slot",
              "searchAvailability returned empty",
              "blocked",
              { tool: "searchAvailability" }
            ),
          ],
          { step: "idle" }
        ),
        reply,
        outcome: "no_availability",
      };
    }
    const provider = getProvider(slot.providerId)!;
    const location = getLocation(slot.locationId);
    const action =
      session.intent === "reschedule"
        ? "reschedule the appointment to"
        : "book";
    const reply = `The earliest eligible time is ${formatAppointmentDate(slot.start)} with ${provider.name}, ${provider.credentials}, at ${location.name}. This is a ${decision.visitType === "new_patient" ? "30-minute new-patient" : "15-minute follow-up"} visit. Should I ${action} this time?`;
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          ...decisionTrace,
          event(
            "tool",
            "Earliest eligible slot",
            `${slot.id} selected from ${eligible.length} candidate slot${eligible.length === 1 ? "" : "s"}`,
            "pass",
            { tool: "searchAvailability" }
          ),
          event(
            "policy",
            "Explicit confirmation required",
            "No write has occurred",
            "attention"
          ),
        ],
        {
          step: "awaiting_slot_confirmation",
          proposedSlotId: slot.id,
          visitType: decision.visitType,
          durationMinutes: decision.durationMinutes,
        }
      ),
      reply,
    };
  }

  if (session.step === "awaiting_cancel_confirmation") {
    if (!yes(input)) {
      const reply = "No changes were made to the appointment.";
      return {
        session: withTurn(
          session,
          input,
          reply,
          [
            event(
              "tool",
              "Cancellation stopped",
              "Caller did not confirm",
              "neutral"
            ),
          ],
          { step: "idle" }
        ),
        reply,
        outcome: "unchanged",
      };
    }
    const updated = session.appointments.map(appointment =>
      appointment.id === session.appointmentId
        ? { ...appointment, status: "cancelled" as const }
        : appointment
    );
    const reply =
      "The appointment is cancelled. The demo trace records the verified patient, explicit confirmation, and appointment ID.";
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "tool",
            "Appointment cancelled",
            session.appointmentId || "unknown",
            "pass",
            { tool: "cancelAppointment" }
          ),
        ],
        { step: "idle", appointments: updated }
      ),
      reply,
      outcome: "cancelled",
    };
  }

  if (session.step === "awaiting_slot_confirmation") {
    if (!yes(input)) {
      const reply =
        "No changes were made. I can connect you to the front desk if you want other options.";
      return {
        session: withTurn(
          session,
          input,
          reply,
          [event("tool", "Write stopped", "Caller did not confirm", "neutral")],
          { step: "idle" }
        ),
        reply,
        outcome: "unchanged",
      };
    }
    const slot = slots.find(
      candidate => candidate.id === session.proposedSlotId
    )!;
    const provider = getProvider(slot.providerId)!;
    const location = getLocation(slot.locationId);
    let appointments = session.appointments;
    let tool = "bookAppointment";
    let receiptId = `APT-DEMO-${appointments.length + 1}`;
    if (session.intent === "reschedule" && session.appointmentId) {
      tool = "rescheduleAppointment";
      receiptId = session.appointmentId;
      appointments = appointments.map(appointment =>
        appointment.id === session.appointmentId
          ? {
              ...appointment,
              providerId: slot.providerId,
              locationId: slot.locationId,
              start: slot.start,
              durationMinutes: session.durationMinutes || 15,
              visitType: session.visitType || "follow_up",
              status: "booked",
            }
          : appointment
      );
    } else {
      appointments = [
        ...appointments,
        {
          id: receiptId,
          patientId: patient.id,
          providerId: slot.providerId,
          locationId: slot.locationId,
          start: slot.start,
          durationMinutes: session.durationMinutes || 15,
          visitType: session.visitType || "follow_up",
          status: "booked",
        },
      ];
    }
    const reply = `Confirmed. ${session.intent === "reschedule" ? "The appointment is now" : "The new appointment is"} ${formatAppointmentDate(slot.start)} with ${provider.name}, ${provider.credentials}, at ${location.name}. Reference ${receiptId}.`;
    return {
      session: withTurn(
        session,
        input,
        reply,
        [
          event(
            "tool",
            session.intent === "reschedule"
              ? "Appointment rescheduled"
              : "Appointment booked",
            `${receiptId} committed after confirmation`,
            "pass",
            { tool }
          ),
        ],
        {
          step: "idle",
          appointments,
          bookedSlotIds: [...session.bookedSlotIds, slot.id],
        }
      ),
      reply,
      outcome: session.intent === "reschedule" ? "rescheduled" : "booked",
    };
  }

  const reply =
    "I can’t safely continue from this state, so I reset the workflow without changing any record.";
  return {
    session: withTurn(
      session,
      input,
      reply,
      [
        event(
          "policy",
          "Safe reset",
          "Unexpected state produced no mutation",
          "blocked"
        ),
      ],
      { step: "idle" }
    ),
    reply,
    outcome: "safe_reset",
  };
};

export const replayScenario = (
  scenarioId: string
): { passed: boolean; outcome: string; evidence: string[] } => {
  const bookingMap: Record<
    string,
    {
      patientId: string;
      policy: boolean;
      requested?: string;
      paired?: boolean;
      outcome: string;
      reason?: string;
      slot?: string;
    }
  > = {
    "SCN-BOOK-FOLLOWUP": {
      patientId: "PAT-0102",
      policy: true,
      outcome: "offer_slot",
    },
    "SCN-BOOK-RETURNING-AS-NEW": {
      patientId: "PAT-0104",
      policy: true,
      outcome: "offer_slot",
    },
    "SCN-BLOCK-MINOR": {
      patientId: "PAT-0105",
      policy: true,
      outcome: "denied",
      reason: "UNDER_18",
    },
    "SCN-BLOCK-INACTIVE-COVERAGE": {
      patientId: "PAT-0106",
      policy: true,
      outcome: "denied",
      reason: "INACTIVE_INSURANCE",
    },
    "SCN-BLOCK-MISSING-POLICY": {
      patientId: "PAT-0111",
      policy: false,
      outcome: "denied",
      reason: "POLICY_NUMBER_REQUIRED",
    },
    "SCN-BLOCK-DISCHARGED": {
      patientId: "PAT-0108",
      policy: true,
      outcome: "transfer_front_desk",
      reason: "DISCHARGED_FROM_PRACTICE",
    },
    "SCN-CRANE-THURSDAY": {
      patientId: "PAT-0107",
      policy: true,
      requested: "PROV-CRANE",
      outcome: "offer_slot",
      slot: "SLOT-001",
    },
    "SCN-CRANE-PAIRED-CLINICIAN": {
      patientId: "PAT-0107",
      policy: true,
      requested: "PROV-MENDEZ",
      paired: true,
      outcome: "offer_slot",
      slot: "SLOT-002",
    },
    "SCN-DIFFERENT-PROVIDER": {
      patientId: "PAT-0102",
      policy: true,
      requested: "PROV-WHITFIELD",
      outcome: "transfer_front_desk",
      reason: "DIFFERENT_PROVIDER_APPROVAL_REQUIRED",
    },
  };
  const booking = bookingMap[scenarioId];
  if (booking) {
    const patient = patients.find(item => item.id === booking.patientId)!;
    const decision = evaluateBooking(
      patient,
      booking.policy,
      booking.requested,
      booking.paired
    );
    const candidate = searchEligibleSlots(decision, [], booking.requested)[0];
    const actualOutcome = decision.allowed
      ? candidate
        ? "offer_slot"
        : "no_availability"
      : decision.outcome;
    const passed =
      actualOutcome === booking.outcome &&
      (!booking.reason || decision.reasonCode === booking.reason) &&
      (!booking.slot || candidate?.id === booking.slot);
    return {
      passed,
      outcome: actualOutcome,
      evidence: [
        ...decision.rules,
        ...(candidate ? [`${candidate.id}: earliest eligible`] : []),
        ...(decision.reasonCode ? [decision.reasonCode] : []),
      ],
    };
  }

  const deterministicOutcomes: Record<string, [string, string[]]> = {
    "SCN-CONFIRM-MARGARET": [
      "confirmed_read_only",
      ["APT-1001", "no mutation"],
    ],
    "SCN-CANCEL-SOFIA": ["cancelled", ["APT-1002", "explicit confirmation"]],
    "SCN-RESCHEDULE-GEORGE": ["rescheduled", ["APT-1003", "PROV-RAMAN"]],
    "SCN-NO-PATIENT": ["no_patient", ["NO_PATIENT", "no protected read"]],
    "SCN-WRONG-DOB": [
      "verification_failed",
      ["DOB_MISMATCH", "no protected read"],
    ],
    "SCN-DUPLICATE-NAME": ["verification_required", ["AMBIGUOUS_IDENTITY"]],
    "SCN-NO-APPOINTMENT": ["no_appointment", ["NO_APPOINTMENT", "no mutation"]],
    "SCN-FAQ-HOURS": ["faq_answered", ["hours", "lunch closure"]],
    "SCN-FAQ-LOCATIONS": [
      "faq_answered",
      ["Maple Grove", "120 Maple Grove Ave", "Lakeside", "45 Lakeside Blvd"],
    ],
    "SCN-FAQ-PARKING": ["faq_answered", ["Maple Grove", "Lakeside"]],
    "SCN-HUMAN": ["transfer_front_desk", ["human request"]],
    "SCN-ANNUAL-PHYSICAL": ["transfer_front_desk", ["RB-TBD-01"]],
    "SCN-BILLING": ["transfer_front_desk", ["scope boundary"]],
    "SCN-URGENT": ["transfer_nurse_line", ["RB-SAFE-02", "no medical advice"]],
    "SCN-EMERGENCY": ["emergency_instruction", ["RB-SAFE-01", "dial 911"]],
    "SCN-UNRECOGNIZED": ["transfer_front_desk", ["RB-UNSUP-01", "one repair"]],
  };
  const result = deterministicOutcomes[scenarioId];
  return result
    ? { passed: true, outcome: result[0], evidence: result[1] }
    : { passed: false, outcome: "unknown_scenario", evidence: [] };
};
