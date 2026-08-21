import { describe, expect, it } from "vitest";
import { computeSleepStats } from "./stats";
import type { CompletedSleepSession, SleepDryness } from "./types";

function session(
  id: string,
  dryness: SleepDryness,
  liquidMinutesBefore?: number,
): CompletedSleepSession {
  return {
    id,
    type: "nap",
    startedAt: "2026-08-21T12:00:00.000Z",
    endedAt: "2026-08-21T13:00:00.000Z",
    dryness,
    liquidMinutesBefore,
  };
}

describe("computeSleepStats", () => {
  it("returns zero rates for zero sessions", () => {
    expect(computeSleepStats([])).toMatchObject({
      total: 0,
      dry: 0,
      dryRate: 0,
    });
  });

  it("calculates all-dry sessions", () => {
    expect(
      computeSleepStats([session("1", "dry"), session("2", "dry", 90)]),
    ).toMatchObject({
      total: 2,
      dry: 2,
      dryRate: 100,
    });
  });

  it("calculates all-wet sessions", () => {
    expect(
      computeSleepStats([session("1", "wet", 20), session("2", "wet", 45)]),
    ).toMatchObject({
      total: 2,
      dry: 0,
      dryRate: 0,
    });
  });

  it("buckets dryness by liquid timing", () => {
    const stats = computeSleepStats([
      session("1", "dry"),
      session("2", "wet", 45),
      session("3", "dry", 20),
      session("4", "wet", 15),
    ]);

    expect(stats.buckets).toEqual([
      {
        bucket: "none-or-early",
        label: "No liquid or 60+ min before",
        total: 1,
        dry: 1,
        dryRate: 100,
      },
      {
        bucket: "within-hour",
        label: "Liquid within 60 min",
        total: 1,
        dry: 0,
        dryRate: 0,
      },
      {
        bucket: "within-30-min",
        label: "Liquid within 30 min",
        total: 2,
        dry: 1,
        dryRate: 50,
      },
    ]);
  });
});
