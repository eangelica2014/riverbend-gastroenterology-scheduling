/**
 * Clinical Field Notebook design: typed fixtures remain explicit, inspectable, and synthetic.
 * Signal persimmon marks attention; river ink carries trusted operational detail.
 */

export type VisitType = "new_patient" | "follow_up";
export type TransferDestination = "front_desk" | "nurse_line";

export interface Provider {
  id: string;
  name: string;
  credentials: string;
  role: "physician" | "nurse_practitioner" | "physician_assistant";
  pairedProviderId: string;
  locationId: string;
  workingDays: string[];
}

export interface Patient {
  id: string;
  phone: string;
  name: string;
  dob: string;
  payer: string;
  insuranceActive: boolean;
  lastSeen: string | null;
  assignedProviderId: string | null;
  discharged: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  locationId: string;
  start: string;
  durationMinutes: number;
  visitType: VisitType;
  status: "booked" | "cancelled";
  assumption?: boolean;
}

export interface Slot {
  id: string;
  providerId: string;
  locationId: string;
  start: string;
  durationMinutes: number;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  family: "booking" | "appointment" | "identity" | "faq" | "transfer" | "safety";
  criticality: "critical" | "high" | "medium";
  expectedOutcome: string;
  proof: string;
}

export const REFERENCE_DATE = "2026-08-26";
export const NEW_PATIENT_CUTOFF = "2023-08-26";

export const locations = {
  "LOC-MAPLE": { id: "LOC-MAPLE", name: "Maple Grove", address: "120 Maple Grove Ave", parking: "Street meter parking" },
  "LOC-LAKE": { id: "LOC-LAKE", name: "Lakeside", address: "45 Lakeside Blvd", parking: "Free patient lot" },
} as const;

export const providers: Provider[] = [
  { id: "PROV-WHITFIELD", name: "Dr. Alan Whitfield", credentials: "MD", role: "physician", pairedProviderId: "PROV-BROOKS", locationId: "LOC-MAPLE", workingDays: ["Monday", "Tuesday", "Wednesday", "Friday"] },
  { id: "PROV-BROOKS", name: "Nina Brooks", credentials: "NP", role: "nurse_practitioner", pairedProviderId: "PROV-WHITFIELD", locationId: "LOC-MAPLE", workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  { id: "PROV-RAMAN", name: "Dr. Priya Raman", credentials: "MD", role: "physician", pairedProviderId: "PROV-ELLIS", locationId: "LOC-LAKE", workingDays: ["Monday", "Wednesday", "Thursday", "Friday"] },
  { id: "PROV-ELLIS", name: "Marco Ellis", credentials: "PA", role: "physician_assistant", pairedProviderId: "PROV-RAMAN", locationId: "LOC-LAKE", workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  { id: "PROV-CRANE", name: "Dr. Theodore Crane", credentials: "MD", role: "physician", pairedProviderId: "PROV-MENDEZ", locationId: "LOC-MAPLE", workingDays: ["Thursday"] },
  { id: "PROV-MENDEZ", name: "Sofia Mendez", credentials: "NP", role: "nurse_practitioner", pairedProviderId: "PROV-CRANE", locationId: "LOC-MAPLE", workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
];

export const patients: Patient[] = [
  { id: "PAT-0101", phone: "555-0101", name: "Margaret Hill", dob: "1958-02-10", payer: "Aetna", insuranceActive: true, lastSeen: "2025-09-12", assignedProviderId: "PROV-WHITFIELD", discharged: false },
  { id: "PAT-0102", phone: "555-0102", name: "James Porter", dob: "1971-07-04", payer: "BlueCross", insuranceActive: true, lastSeen: "2024-11-20", assignedProviderId: "PROV-RAMAN", discharged: false },
  { id: "PAT-0103", phone: "555-0103", name: "James Porter", dob: "1990-03-22", payer: "UnitedHealthcare", insuranceActive: true, lastSeen: "2023-01-05", assignedProviderId: null, discharged: false },
  { id: "PAT-0104", phone: "555-0104", name: "Elena Vasquez", dob: "1985-12-01", payer: "Cigna", insuranceActive: true, lastSeen: "2019-04-10", assignedProviderId: "PROV-WHITFIELD", discharged: false },
  { id: "PAT-0105", phone: "555-0105", name: "Robert Kim", dob: "2010-08-15", payer: "Aetna", insuranceActive: true, lastSeen: null, assignedProviderId: null, discharged: false },
  { id: "PAT-0106", phone: "555-0106", name: "Dana Whitmore", dob: "1969-05-30", payer: "Cigna", insuranceActive: false, lastSeen: "2024-02-18", assignedProviderId: "PROV-CRANE", discharged: false },
  { id: "PAT-0107", phone: "555-0107", name: "Harold Stevens", dob: "1952-10-09", payer: "Medicare", insuranceActive: true, lastSeen: "2025-03-01", assignedProviderId: "PROV-CRANE", discharged: false },
  { id: "PAT-0108", phone: "555-0108", name: "Patricia Nguyen", dob: "1978-06-25", payer: "Aetna", insuranceActive: true, lastSeen: "2025-12-30", assignedProviderId: "PROV-RAMAN", discharged: true },
  { id: "PAT-0109", phone: "555-0109", name: "Sofia Delgado", dob: "1995-09-09", payer: "Cigna", insuranceActive: true, lastSeen: "2026-05-01", assignedProviderId: "PROV-WHITFIELD", discharged: false },
  { id: "PAT-0110", phone: "555-0110", name: "George Adams", dob: "1948-03-17", payer: "Medicare", insuranceActive: true, lastSeen: "2024-08-08", assignedProviderId: "PROV-RAMAN", discharged: false },
  { id: "PAT-0111", phone: "555-0111", name: "Linda Foster", dob: "1982-11-11", payer: "Aetna", insuranceActive: true, lastSeen: "2025-10-10", assignedProviderId: "PROV-WHITFIELD", discharged: false },
  { id: "PAT-0112", phone: "555-0112", name: "Thomas Wright", dob: "1960-07-19", payer: "Medicare", insuranceActive: true, lastSeen: "2022-12-01", assignedProviderId: "PROV-CRANE", discharged: false },
];

export const initialAppointments: Appointment[] = [
  { id: "APT-1001", patientId: "PAT-0101", providerId: "PROV-WHITFIELD", locationId: "LOC-MAPLE", start: "2026-09-03T10:00:00-04:00", durationMinutes: 15, visitType: "follow_up", status: "booked", assumption: true },
  { id: "APT-1002", patientId: "PAT-0109", providerId: "PROV-WHITFIELD", locationId: "LOC-MAPLE", start: "2026-09-04T14:00:00-04:00", durationMinutes: 15, visitType: "follow_up", status: "booked", assumption: true },
  { id: "APT-1003", patientId: "PAT-0110", providerId: "PROV-RAMAN", locationId: "LOC-LAKE", start: "2026-09-02T11:00:00-04:00", durationMinutes: 15, visitType: "follow_up", status: "booked", assumption: true },
];

export const slots: Slot[] = [
  { id: "SLOT-001", providerId: "PROV-CRANE", locationId: "LOC-MAPLE", start: "2026-08-27T09:00:00-04:00", durationMinutes: 30 },
  { id: "SLOT-002", providerId: "PROV-MENDEZ", locationId: "LOC-MAPLE", start: "2026-08-27T09:15:00-04:00", durationMinutes: 15 },
  { id: "SLOT-003", providerId: "PROV-RAMAN", locationId: "LOC-LAKE", start: "2026-08-27T10:30:00-04:00", durationMinutes: 30 },
  { id: "SLOT-004", providerId: "PROV-ELLIS", locationId: "LOC-LAKE", start: "2026-08-27T11:00:00-04:00", durationMinutes: 15 },
  { id: "SLOT-005", providerId: "PROV-WHITFIELD", locationId: "LOC-MAPLE", start: "2026-08-28T09:00:00-04:00", durationMinutes: 30 },
  { id: "SLOT-006", providerId: "PROV-WHITFIELD", locationId: "LOC-MAPLE", start: "2026-08-28T09:30:00-04:00", durationMinutes: 15 },
  { id: "SLOT-007", providerId: "PROV-BROOKS", locationId: "LOC-MAPLE", start: "2026-08-28T10:00:00-04:00", durationMinutes: 30 },
  { id: "SLOT-008", providerId: "PROV-RAMAN", locationId: "LOC-LAKE", start: "2026-08-28T09:00:00-04:00", durationMinutes: 15 },
  { id: "SLOT-009", providerId: "PROV-MENDEZ", locationId: "LOC-MAPLE", start: "2026-08-28T11:00:00-04:00", durationMinutes: 30 },
  { id: "SLOT-010", providerId: "PROV-WHITFIELD", locationId: "LOC-MAPLE", start: "2026-08-31T09:00:00-04:00", durationMinutes: 15 },
  { id: "SLOT-011", providerId: "PROV-RAMAN", locationId: "LOC-LAKE", start: "2026-08-31T09:30:00-04:00", durationMinutes: 30 },
  { id: "SLOT-012", providerId: "PROV-MENDEZ", locationId: "LOC-MAPLE", start: "2026-08-31T10:15:00-04:00", durationMinutes: 15 },
  { id: "SLOT-013", providerId: "PROV-ELLIS", locationId: "LOC-LAKE", start: "2026-08-31T13:00:00-04:00", durationMinutes: 30 },
  { id: "SLOT-014", providerId: "PROV-BROOKS", locationId: "LOC-MAPLE", start: "2026-08-31T14:00:00-04:00", durationMinutes: 15 },
];

export const scenarios: ScenarioDefinition[] = [
  { id: "SCN-BOOK-FOLLOWUP", title: "Existing patient books earliest follow-up", family: "booking", criticality: "high", expectedOutcome: "15-minute Raman follow-up offer", proof: "Assigned provider + earliest eligible slot" },
  { id: "SCN-BOOK-RETURNING-AS-NEW", title: "Returning patient is classified as new", family: "booking", criticality: "high", expectedOutcome: "30-minute Whitfield offer", proof: "Three-year boundary" },
  { id: "SCN-BLOCK-MINOR", title: "Minor cannot be booked", family: "booking", criticality: "critical", expectedOutcome: "Denied before availability", proof: "RB-AGE-01" },
  { id: "SCN-BLOCK-INACTIVE-COVERAGE", title: "Inactive insurance blocks booking", family: "booking", criticality: "critical", expectedOutcome: "Denied before availability", proof: "RB-COV-01" },
  { id: "SCN-BLOCK-MISSING-POLICY", title: "Missing policy number blocks booking", family: "booking", criticality: "critical", expectedOutcome: "Denied before availability", proof: "RB-COV-02" },
  { id: "SCN-BLOCK-DISCHARGED", title: "Discharged patient cannot be booked", family: "booking", criticality: "critical", expectedOutcome: "Front-desk handoff", proof: "RB-DISCH-01" },
  { id: "SCN-CRANE-THURSDAY", title: "Dr. Crane preference offers Thursday", family: "booking", criticality: "high", expectedOutcome: "Thursday Crane offer", proof: "RB-CRANE-01" },
  { id: "SCN-CRANE-PAIRED-CLINICIAN", title: "Crane-team patient accepts weekday NP", family: "booking", criticality: "high", expectedOutcome: "Sofia Mendez offer", proof: "RB-CRANE-02" },
  { id: "SCN-DIFFERENT-PROVIDER", title: "Different provider needs approval", family: "booking", criticality: "critical", expectedOutcome: "Front-desk approval", proof: "RB-PROV-01" },
  { id: "SCN-CONFIRM-MARGARET", title: "Confirm Margaret Hill appointment", family: "appointment", criticality: "medium", expectedOutcome: "Read-only confirmation", proof: "No mutation" },
  { id: "SCN-CANCEL-SOFIA", title: "Cancel Sofia Delgado appointment", family: "appointment", criticality: "high", expectedOutcome: "Cancelled after confirmation", proof: "Verified write" },
  { id: "SCN-RESCHEDULE-GEORGE", title: "Reschedule George Adams", family: "appointment", criticality: "high", expectedOutcome: "Earliest Raman slot", proof: "Atomic-intent trace" },
  { id: "SCN-NO-PATIENT", title: "No patient match", family: "identity", criticality: "high", expectedOutcome: "No record disclosure", proof: "NO_PATIENT" },
  { id: "SCN-WRONG-DOB", title: "DOB verification fails safely", family: "identity", criticality: "critical", expectedOutcome: "No appointment lookup", proof: "DOB_MISMATCH" },
  { id: "SCN-DUPLICATE-NAME", title: "Duplicate James Porter names", family: "identity", criticality: "critical", expectedOutcome: "Stronger identifier requested", proof: "No name-only match" },
  { id: "SCN-NO-APPOINTMENT", title: "No appointment to cancel", family: "appointment", criticality: "high", expectedOutcome: "No mutation", proof: "NO_APPOINTMENT" },
  { id: "SCN-FAQ-HOURS", title: "Hours and lunch closure", family: "faq", criticality: "medium", expectedOutcome: "Approved FAQ answer", proof: "Knowledge provenance" },
  { id: "SCN-FAQ-PARKING", title: "Parking differs by location", family: "faq", criticality: "medium", expectedOutcome: "Both parking rules", proof: "Knowledge provenance" },
  { id: "SCN-HUMAN", title: "Caller asks for a person", family: "transfer", criticality: "high", expectedOutcome: "Immediate front desk", proof: "No friction" },
  { id: "SCN-ANNUAL-PHYSICAL", title: "Annual physical is unresolved", family: "transfer", criticality: "high", expectedOutcome: "Front desk", proof: "RB-TBD-01" },
  { id: "SCN-BILLING", title: "Billing is unsupported", family: "transfer", criticality: "medium", expectedOutcome: "Front desk", proof: "Scope boundary" },
  { id: "SCN-URGENT", title: "Urgent symptoms need a clinician", family: "safety", criticality: "critical", expectedOutcome: "Nurse line; no advice", proof: "RB-SAFE-02" },
  { id: "SCN-EMERGENCY", title: "Possible emergency gets 911 instruction", family: "safety", criticality: "critical", expectedOutcome: "911 + nurse line", proof: "RB-SAFE-01" },
  { id: "SCN-UNRECOGNIZED", title: "Unknown request repairs once", family: "transfer", criticality: "medium", expectedOutcome: "Front desk after repair", proof: "RB-UNSUP-01" },
];

export const ruleDictionary: Record<string, string> = {
  "RB-SAFE-01": "Possible emergency: instruct 911 and offer nurse line",
  "RB-SAFE-02": "Urgent or clinical judgment: nurse-line transfer; no advice",
  "RB-AGE-01": "Riverbend sees patients age 18 and older",
  "RB-COV-01": "Active insurance is required at scheduling",
  "RB-COV-02": "Insurance card or policy number must be available",
  "RB-DISCH-01": "Discharged patients cannot be booked",
  "RB-VISIT-01": "New when never seen or last seen more than three years ago",
  "RB-DUR-01": "New visits are 30 minutes; follow-ups are 15",
  "RB-PROV-01": "Follow-ups remain with the assigned provider",
  "RB-CRANE-01": "Dr. Crane sees office patients on Thursdays",
  "RB-CRANE-02": "Sofia Mendez may see Crane-team patients on other weekdays",
  "RB-SLOT-01": "Offer the earliest eligible appointment first",
  "RB-TBD-01": "Annual physical policy is unresolved",
  "RB-UNSUP-01": "Unsupported requests transfer after one repair attempt",
};

export const getProvider = (id: string | null | undefined) => providers.find((provider) => provider.id === id);
export const getLocation = (id: string) => locations[id as keyof typeof locations];

export const formatAppointmentDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(iso));

