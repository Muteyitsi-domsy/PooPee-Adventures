import { describe, expect, it } from "vitest";
import { computeProgress } from "./progress";
import type { PottyLog } from "@/features/logging/types";

function log(overrides: Partial<PottyLog> = {}): PottyLog {
  return {
    id: `l-${Math.random()}`,
    kind: "pee",
    location: "potty",
    initiator: "child",
    context: "normal",
    reason: null,
    pooStyle: null,
    ts: 0,
    ...overrides,
  };
}

describe("computeProgress", () => {
  it("returns null pct with fewer than 3 relevant entries", () => {
    const result = computeProgress([log(), log()], "pee");
    expect(result.pct).toBeNull();
    expect(result.total).toBe(2);
  });

  it("weights success rate and child-initiation rate 60/40", () => {
    const logs = [
      log({ location: "potty", initiator: "child" }),
      log({ location: "potty", initiator: "parent" }),
      log({ location: "outside" }),
    ];
    const result = computeProgress(logs, "pee");
    expect(result.total).toBe(3);
    expect(result.successRate).toBe(67);
    expect(result.childRate).toBe(50);
    expect(result.pct).toBe(Math.round((2 / 3) * 0.6 * 100 + (1 / 2) * 0.4 * 100));
  });

  it("counts both-kind logs toward pee and poo progress", () => {
    const logs = [
      log({ kind: "both", location: "potty" }),
      log({ kind: "both", location: "potty" }),
      log({ kind: "both", location: "outside" }),
    ];
    expect(computeProgress(logs, "pee").total).toBe(3);
    expect(computeProgress(logs, "poo").total).toBe(3);
  });

  it("excludes sleep-location entries", () => {
    const logs = [
      log({ location: "sleep" }),
      log({ location: "potty" }),
      log({ location: "potty" }),
      log({ location: "outside" }),
    ];
    expect(computeProgress(logs, "pee").total).toBe(3);
  });
});
