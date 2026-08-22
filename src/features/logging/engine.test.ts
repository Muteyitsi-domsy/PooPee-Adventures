import { describe, expect, it } from "vitest";
import { HR, MIN } from "@/lib/time";
import { computeEngine } from "./engine";
import type { PottyLog } from "./types";

function pottyPee(ts: number): PottyLog {
  return {
    id: `pee-${ts}`,
    kind: "pee",
    location: "potty",
    initiator: "child",
    context: "normal",
    reason: null,
    pooStyle: null,
    ts,
  };
}

describe("computeEngine", () => {
  it("falls back to a 2h default interval with no history", () => {
    const now = Date.UTC(2026, 0, 5, 12, 0);
    const result = computeEngine([], undefined, now);
    expect(result.hasData).toBe(false);
    expect(result.avgMs).toBe(2 * HR);
    expect(result.nextTs).toBe(now - 30 * MIN + 2 * HR);
  });

  it("learns the average interval between same-day successes", () => {
    const base = Date.UTC(2026, 0, 5, 8, 0);
    const logs = [pottyPee(base), pottyPee(base + 2 * HR), pottyPee(base + 4 * HR)];
    const now = base + 4 * HR + 10 * MIN;
    const result = computeEngine(logs, undefined, now);
    expect(result.hasData).toBe(true);
    expect(result.avgMs).toBe(2 * HR);
    expect(result.nextTs).toBe(base + 4 * HR + 2 * HR);
  });

  it("ignores gaps that cross midnight or exceed 6 hours", () => {
    const day1 = Date.UTC(2026, 0, 5, 23, 0);
    const day2 = Date.UTC(2026, 0, 6, 7, 0);
    const logs = [pottyPee(day1), pottyPee(day2)];
    const result = computeEngine(logs, undefined, day2 + MIN);
    expect(result.hasData).toBe(false);
    expect(result.avgMs).toBe(2 * HR);
  });

  it("shortens the predicted interval when a beverage was recently logged", () => {
    const base = Date.UTC(2026, 0, 5, 8, 0);
    const logs = [pottyPee(base), pottyPee(base + 2 * HR)];
    const now = base + 2 * HR + 10 * MIN;
    const beverage = { at: now - 20 * MIN };
    const result = computeEngine(logs, beverage, now);
    expect(result.bevActive).toBe(true);
    expect(result.adjustedMs).toBe(Math.max(45 * MIN, 2 * HR * 0.55));
  });

  it("treats a beverage older than 2.5h as inactive", () => {
    const now = Date.UTC(2026, 0, 5, 12, 0);
    const beverage = { at: now - 3 * HR };
    const result = computeEngine([], beverage, now);
    expect(result.bevActive).toBe(false);
    expect(result.adjustedMs).toBe(result.avgMs);
  });
});
