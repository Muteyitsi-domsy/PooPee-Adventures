import { describe, expect, it } from "vitest";
import { computeEngine } from "./engine";
import type { PottyLogEntry } from "./types";

function pee(id: string, happenedAt: string, recentBeverageMl = 0): PottyLogEntry {
  return {
    id,
    type: "pee",
    location: "potty",
    happenedAt,
    createdAt: happenedAt,
    recentBeverageMl,
  };
}

describe("computeEngine", () => {
  it("averages regular same-day pee intervals", () => {
    const result = computeEngine(
      [
        pee("1", "2026-08-21T08:00:00.000Z"),
        pee("2", "2026-08-21T09:30:00.000Z"),
        pee("3", "2026-08-21T11:00:00.000Z"),
      ],
      new Date("2026-08-21T11:05:00.000Z"),
    );

    expect(result).toMatchObject({
      learnedIntervalMinutes: 90,
      sampleCount: 2,
      confidence: "learned",
      beverageAdjusted: false,
    });
    expect(result.nextReminderAt).toBe("2026-08-21T12:30:00.000Z");
  });

  it("shortens the learned interval after a substantial recent beverage", () => {
    const result = computeEngine(
      [
        pee("1", "2026-08-21T08:00:00.000Z"),
        pee("2", "2026-08-21T10:00:00.000Z"),
        pee("3", "2026-08-21T12:00:00.000Z", 200),
      ],
      new Date("2026-08-21T12:05:00.000Z"),
    );

    expect(result).toMatchObject({
      learnedIntervalMinutes: 90,
      sampleCount: 2,
      confidence: "learned",
      beverageAdjusted: true,
    });
    expect(result.nextReminderAt).toBe("2026-08-21T13:30:00.000Z");
  });

  it("uses a fallback interval when there is not enough pee history", () => {
    const result = computeEngine([], new Date("2026-08-21T08:00:00.000Z"));

    expect(result).toMatchObject({
      learnedIntervalMinutes: 90,
      sampleCount: 0,
      confidence: "fallback",
    });
    expect(result.nextReminderAt).toBe("2026-08-21T09:30:00.000Z");
  });

  it("excludes intervals that cross a day boundary", () => {
    const result = computeEngine(
      [
        pee("1", "2026-08-20T23:30:00.000Z"),
        pee("2", "2026-08-21T01:00:00.000Z"),
        pee("3", "2026-08-21T02:00:00.000Z"),
      ],
      new Date("2026-08-21T02:05:00.000Z"),
    );

    expect(result).toMatchObject({
      learnedIntervalMinutes: 60,
      sampleCount: 1,
      confidence: "learned",
    });
    expect(result.nextReminderAt).toBe("2026-08-21T03:00:00.000Z");
  });
});
