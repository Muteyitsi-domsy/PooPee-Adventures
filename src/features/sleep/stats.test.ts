import { describe, expect, it } from "vitest";
import { computeSleepStats, timingLabel } from "./stats";
import type { SleepSession } from "./types";

function session(overrides: Partial<SleepSession> = {}): SleepSession {
  return {
    id: `s-${Math.random()}`,
    kind: "nap",
    startTs: 0,
    liquid: { had: false },
    estMinutes: 90,
    status: "done",
    actualMinutes: 85,
    outcome: "dry",
    ...overrides,
  };
}

describe("timingLabel", () => {
  it("reports no liquid when mins is null or undefined", () => {
    expect(timingLabel(null)).toBe("No liquid");
    expect(timingLabel(undefined)).toBe("No liquid");
  });

  it("buckets minutes into the right label", () => {
    expect(timingLabel(10)).toBe("Just before");
    expect(timingLabel(25)).toBe("15–30 min before");
    expect(timingLabel(45)).toBe("30–60 min before");
    expect(timingLabel(90)).toBe("1–2h before");
    expect(timingLabel(150)).toBe("2h+ / none noted");
  });
});

describe("computeSleepStats", () => {
  it("only considers completed sessions of the requested kind", () => {
    const stats = computeSleepStats(
      [
        session({ kind: "nap", status: "done", outcome: "dry" }),
        session({ kind: "night", status: "done", outcome: "wet" }),
        session({ kind: "nap", status: "active", outcome: undefined }),
      ],
      "nap",
    );
    expect(stats.totalDone).toBe(1);
    expect(stats.dryPct).toBe(100);
  });

  it("buckets dryness by liquid timing", () => {
    const stats = computeSleepStats(
      [
        session({ liquid: { had: true, mins: 10 }, outcome: "dry" }),
        session({ liquid: { had: true, mins: 10 }, outcome: "wet" }),
        session({ liquid: { had: false }, outcome: "dry" }),
      ],
      "nap",
    );
    const justBefore = stats.rows.find((r) => r.label === "Just before");
    expect(justBefore).toMatchObject({ dry: 1, wet: 1, total: 2, dryPct: 50 });
    const noLiquid = stats.rows.find((r) => r.label === "No liquid");
    expect(noLiquid).toMatchObject({ dry: 1, wet: 0, total: 1, dryPct: 100 });
  });

  it("returns null dryPct/avgMinutes with no completed sessions", () => {
    const stats = computeSleepStats([], "night");
    expect(stats.dryPct).toBeNull();
    expect(stats.avgMinutes).toBeNull();
  });
});
