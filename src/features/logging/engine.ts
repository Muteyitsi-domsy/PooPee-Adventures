import { HR, isSameDay, MIN } from "@/lib/time";
import type { Beverage, EngineResult, PottyLog } from "./types";

export function computeEngine(
  logs: PottyLog[],
  beverage: Beverage | undefined,
  now: number = Date.now(),
): EngineResult {
  const successes = logs
    .filter((l) => l.location === "potty" && (l.kind === "pee" || l.kind === "both"))
    .sort((a, b) => a.ts - b.ts);

  const intervals: number[] = [];
  for (let i = 1; i < successes.length; i++) {
    if (isSameDay(successes[i].ts, successes[i - 1].ts)) {
      const diff = successes[i].ts - successes[i - 1].ts;
      if (diff > 15 * MIN && diff < 6 * HR) intervals.push(diff);
    }
  }
  const recent = intervals.slice(-8);
  const avgMs = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 2 * HR;

  const bevActive = Boolean(beverage && now - beverage.at < 2.5 * HR);
  const adjustedMs = bevActive ? Math.max(45 * MIN, avgMs * 0.55) : avgMs;

  const lastSuccess = successes[successes.length - 1];
  const anchor = lastSuccess ? lastSuccess.ts : now - 30 * MIN;
  const nextTs = anchor + adjustedMs;

  return {
    hasData: intervals.length >= 2,
    avgMs,
    adjustedMs,
    bevActive,
    nextTs,
    lastSuccess,
  };
}
