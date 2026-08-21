import { describe, expect, it } from "vitest";
import { getNextTrainingPhase } from "./phase";
import type { PottyLogEntry } from "./types";

function log(overrides: Partial<PottyLogEntry>): PottyLogEntry {
  return {
    id: "log-1",
    type: "pee",
    location: "potty",
    happenedAt: "2026-08-21T08:00:00.000Z",
    createdAt: "2026-08-21T08:00:00.000Z",
    ...overrides,
  };
}

describe("getNextTrainingPhase", () => {
  it("moves from phase 1 to phase 2 on the first potty poo", () => {
    expect(getNextTrainingPhase(1, log({ type: "poo", location: "potty" }))).toBe(
      2,
    );
  });

  it("does not unlock phase 2 for outside poo or pee logs", () => {
    expect(
      getNextTrainingPhase(1, log({ type: "poo", location: "outside" })),
    ).toBe(1);
    expect(getNextTrainingPhase(1, log({ type: "pee", location: "potty" }))).toBe(
      1,
    );
  });
});
