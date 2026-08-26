/**
 * Clinical Field Notebook validation: tests prove rule boundaries and forbidden actions,
 * not merely fluent response strings.
 */

import { describe, expect, it } from "vitest";
import { patients, scenarios } from "@/data/riverbend";
import {
  calculateAge,
  classifyVisit,
  createSession,
  evaluateBooking,
  processTurn,
  replayScenario,
  searchEligibleSlots,
} from "@/lib/agentEngine";

const patient = (id: string) => patients.find(item => item.id === id)!;

describe("Riverbend deterministic policy", () => {
  it("calculates age against the declared reference date", () => {
    expect(calculateAge("2010-08-15")).toBe(16);
    expect(calculateAge("2008-08-26")).toBe(18);
    expect(calculateAge("2008-08-27")).toBe(17);
  });

  it("classifies exactly three years as follow-up and older records as new", () => {
    expect(
      classifyVisit({ ...patient("PAT-0102"), lastSeen: "2023-08-26" })
    ).toBe("follow_up");
    expect(
      classifyVisit({ ...patient("PAT-0102"), lastSeen: "2023-08-25" })
    ).toBe("new_patient");
    expect(classifyVisit(patient("PAT-0104"))).toBe("new_patient");
  });

  it("blocks minors before availability", () => {
    const decision = evaluateBooking(patient("PAT-0105"), true);
    expect(decision).toMatchObject({ allowed: false, reasonCode: "UNDER_18" });
    expect(searchEligibleSlots(decision)).toHaveLength(0);
  });

  it("blocks inactive coverage before availability", () => {
    const decision = evaluateBooking(patient("PAT-0106"), true);
    expect(decision).toMatchObject({
      allowed: false,
      reasonCode: "INACTIVE_INSURANCE",
    });
    expect(searchEligibleSlots(decision)).toHaveLength(0);
  });

  it("blocks a missing policy number or card without inventing a value", () => {
    const decision = evaluateBooking(patient("PAT-0111"), false);
    expect(decision).toMatchObject({
      allowed: false,
      reasonCode: "POLICY_NUMBER_REQUIRED",
    });
  });

  it("blocks a discharged patient and requests front-desk handling", () => {
    expect(evaluateBooking(patient("PAT-0108"), true)).toMatchObject({
      allowed: false,
      outcome: "transfer_front_desk",
      reasonCode: "DISCHARGED_FROM_PRACTICE",
    });
  });

  it("requires office approval for a different follow-up provider", () => {
    expect(
      evaluateBooking(patient("PAT-0102"), true, "PROV-WHITFIELD")
    ).toMatchObject({
      allowed: false,
      reasonCode: "DIFFERENT_PROVIDER_APPROVAL_REQUIRED",
    });
  });

  it("keeps Dr. Crane on Thursday and allows the paired NP when accepted", () => {
    const crane = evaluateBooking(patient("PAT-0107"), true, "PROV-CRANE");
    expect(searchEligibleSlots(crane, [], "PROV-CRANE")[0].id).toBe("SLOT-001");
    expect(crane.rules).toContain("RB-CRANE-01");

    const mendez = evaluateBooking(
      patient("PAT-0107"),
      true,
      "PROV-MENDEZ",
      true
    );
    expect(searchEligibleSlots(mendez, [], "PROV-MENDEZ")[0].id).toBe(
      "SLOT-002"
    );
    expect(mendez.rules).toContain("RB-CRANE-02");
  });

  it("offers the chronologically earliest eligible slot", () => {
    const decision = evaluateBooking(patient("PAT-0104"), true);
    const eligible = searchEligibleSlots(decision);
    expect(eligible[0].id).toBe("SLOT-005");
    expect(
      eligible.every(
        (slot, index) => index === 0 || eligible[index - 1].start <= slot.start
      )
    ).toBe(true);
  });
});

describe("Conversation safety and privacy", () => {
  it("preempts ordinary flow for a possible emergency and never looks up a patient", () => {
    const result = processTurn(
      createSession(),
      "I am passing out and cannot breathe"
    );
    expect(result.outcome).toBe("emergency_instruction");
    expect(result.reply).toContain("dial 911");
    expect(
      result.session.trace.some(item => item.ruleId === "RB-SAFE-01")
    ).toBe(true);
    expect(
      result.session.trace.some(item => item.tool === "lookupPatient")
    ).toBe(false);
  });

  it("routes urgent clinical language without medical advice", () => {
    const result = processTurn(
      createSession(),
      "I have severe pain and need to know what to do"
    );
    expect(result.outcome).toBe("transfer_nurse_line");
    expect(result.reply).toContain("can’t provide medical advice");
    expect(
      result.session.trace.some(item => item.tool === "transferCall")
    ).toBe(true);
  });

  it("does not disclose appointment data after a DOB mismatch", () => {
    let session = processTurn(
      createSession(),
      "Confirm my appointment"
    ).session;
    session = processTurn(session, "555-0101").session;
    const result = processTurn(session, "1958-02-11");
    expect(result.outcome).toBe("verification_failed");
    expect(result.reply).not.toContain("September");
    expect(
      result.session.trace.some(item => item.tool === "getAppointments")
    ).toBe(false);
  });

  it("never disambiguates duplicate names by name alone", () => {
    let session = processTurn(
      createSession(),
      "I need to book an appointment"
    ).session;
    const result = processTurn(session, "James Porter");
    expect(result.outcome).toBe("verification_required");
    expect(result.reply).toContain("more than one patient");
  });

  it("answers the required clinic-location FAQ from approved knowledge", () => {
    const result = processTurn(createSession(), "Where are your locations?");
    expect(result.outcome).toBe("faq_answered");
    expect(result.reply).toContain("Maple Grove at 120 Maple Grove Ave");
    expect(result.reply).toContain("Lakeside at 45 Lakeside Blvd");
    expect(
      result.session.trace.some(item => item.tool === "getClinicInfo")
    ).toBe(true);
  });
});

describe("Mutation confirmation", () => {
  it("does not book until an explicit confirmation turn", () => {
    let session = createSession();
    for (const turn of [
      "Book an appointment",
      "555-0102",
      "1971-07-04",
      "yes",
    ]) {
      session = processTurn(session, turn).session;
    }
    expect(session.step).toBe("awaiting_slot_confirmation");
    expect(session.appointments).toHaveLength(3);
    expect(session.trace.some(item => item.tool === "bookAppointment")).toBe(
      false
    );

    const result = processTurn(session, "yes");
    expect(result.outcome).toBe("booked");
    expect(result.session.appointments).toHaveLength(4);
    expect(
      result.session.trace.some(item => item.tool === "bookAppointment")
    ).toBe(true);
  });

  it("stops a cancellation when the caller does not confirm", () => {
    let session = createSession();
    for (const turn of ["Cancel my appointment", "555-0109", "1995-09-09"]) {
      session = processTurn(session, turn).session;
    }
    const result = processTurn(session, "no");
    expect(result.outcome).toBe("unchanged");
    expect(
      result.session.appointments.find(item => item.id === "APT-1002")?.status
    ).toBe("booked");
  });

  it("cancels only the selected appointment after confirmation", () => {
    let session = createSession();
    for (const turn of ["Cancel my appointment", "555-0109", "1995-09-09"]) {
      session = processTurn(session, turn).session;
    }
    const result = processTurn(session, "yes");
    expect(result.outcome).toBe("cancelled");
    expect(
      result.session.appointments.find(item => item.id === "APT-1002")?.status
    ).toBe("cancelled");
    expect(
      result.session.appointments.find(item => item.id === "APT-1001")?.status
    ).toBe("booked");
  });
});

describe("Scenario catalog", () => {
  it("contains every required Phase 1 scenario family", () => {
    expect(new Set(scenarios.map(item => item.family))).toEqual(
      new Set([
        "booking",
        "appointment",
        "identity",
        "faq",
        "transfer",
        "safety",
      ])
    );
    expect(scenarios).toHaveLength(25);
  });

  it("replays all 25 catalog scenarios successfully", () => {
    const failures = scenarios
      .map(scenario => ({ id: scenario.id, ...replayScenario(scenario.id) }))
      .filter(result => !result.passed);
    expect(failures).toEqual([]);
  });
});
