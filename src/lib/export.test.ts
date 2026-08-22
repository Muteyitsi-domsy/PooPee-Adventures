import { describe, expect, it } from "vitest";
import { csvEscape, logsToCSV, sleepToCSV } from "./export";
import type { PottyLog } from "@/features/logging/types";
import type { SleepSession } from "@/features/sleep/types";

describe("csvEscape", () => {
  it("passes plain values through unchanged", () => {
    expect(csvEscape("potty")).toBe("potty");
    expect(csvEscape(3)).toBe("3");
  });

  it("returns an empty string for null or undefined", () => {
    expect(csvEscape(null)).toBe("");
    expect(csvEscape(undefined)).toBe("");
  });

  it("quotes and escapes values containing commas, quotes, or newlines", () => {
    expect(csvEscape('has "quotes", and a comma')).toBe('"has ""quotes"", and a comma"');
    expect(csvEscape("line1\nline2")).toBe('"line1\nline2"');
  });
});

function log(overrides: Partial<PottyLog> = {}): PottyLog {
  return {
    id: "1",
    kind: "pee",
    location: "potty",
    initiator: "child",
    context: "normal",
    reason: null,
    pooStyle: null,
    ts: Date.UTC(2026, 0, 5, 8, 0),
    ...overrides,
  };
}

describe("logsToCSV", () => {
  it("emits a header row and one row per log, sorted by time", () => {
    const csv = logsToCSV([
      log({ id: "2", ts: Date.UTC(2026, 0, 5, 9, 0), kind: "poo" }),
      log({ id: "1", ts: Date.UTC(2026, 0, 5, 8, 0) }),
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe(
      "date,time,type,location,initiator,context,outside_reason,poo_style,sleep_kind",
    );
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain("pee");
    expect(lines[2]).toContain("poo");
  });
});

function sleepSession(overrides: Partial<SleepSession> = {}): SleepSession {
  return {
    id: "s1",
    kind: "nap",
    startTs: Date.UTC(2026, 0, 5, 13, 0),
    liquid: { had: false },
    estMinutes: 90,
    status: "done",
    actualMinutes: 85,
    outcome: "dry",
    ...overrides,
  };
}

describe("sleepToCSV", () => {
  it("only includes completed sessions", () => {
    const csv = sleepToCSV([
      sleepSession({ id: "active", status: "active", outcome: undefined }),
      sleepSession({ id: "done" }),
    ]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("nap");
  });

  it("marks wet outcome with unknown timing when wetUnknown is set", () => {
    const csv = sleepToCSV([
      sleepSession({ outcome: "wet", wetUnknown: true, wetTs: null }),
    ]);
    expect(csv.split("\n")[1]).toContain("unknown");
  });
});
