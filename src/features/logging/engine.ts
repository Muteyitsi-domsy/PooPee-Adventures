import type { PatternEngineResult, PottyLogEntry } from "./types";

const FALLBACK_INTERVAL_MINUTES = 90;
const MINIMUM_INTERVAL_MINUTES = 30;
const BEVERAGE_THRESHOLD_ML = 150;
const BEVERAGE_INTERVAL_MULTIPLIER = 0.75;

export function computeEngine(
  logs: PottyLogEntry[],
  now = new Date(),
): PatternEngineResult {
  const peeLogs = logs
    .filter((log) => log.type === "pee")
    .sort(
      (left, right) =>
        new Date(left.happenedAt).getTime() - new Date(right.happenedAt).getTime(),
    );
  const intervals = getSameDayIntervals(peeLogs);
  const latestPee = peeLogs.at(-1);
  const hasBeverageAdjustment =
    (latestPee?.recentBeverageMl ?? 0) >= BEVERAGE_THRESHOLD_ML;

  const averageInterval =
    intervals.length > 0
      ? Math.round(
          intervals.reduce((total, minutes) => total + minutes, 0) /
            intervals.length,
        )
      : FALLBACK_INTERVAL_MINUTES;
  const baseInterval = Math.max(MINIMUM_INTERVAL_MINUTES, averageInterval);
  const learnedIntervalMinutes = hasBeverageAdjustment
    ? Math.max(
        MINIMUM_INTERVAL_MINUTES,
        Math.round(baseInterval * BEVERAGE_INTERVAL_MULTIPLIER),
      )
    : baseInterval;
  const anchor = latestPee ? new Date(latestPee.happenedAt) : now;
  const nextReminderAt = new Date(
    anchor.getTime() + learnedIntervalMinutes * 60_000,
  );

  return {
    nextReminderAt: nextReminderAt.toISOString(),
    minutesUntilReminder: Math.max(
      0,
      Math.ceil((nextReminderAt.getTime() - now.getTime()) / 60_000),
    ),
    learnedIntervalMinutes,
    sampleCount: intervals.length,
    confidence: intervals.length > 0 ? "learned" : "fallback",
    beverageAdjusted: hasBeverageAdjustment,
  };
}

function getSameDayIntervals(peeLogs: PottyLogEntry[]) {
  const intervals: number[] = [];

  for (let index = 1; index < peeLogs.length; index += 1) {
    const previous = new Date(peeLogs[index - 1].happenedAt);
    const current = new Date(peeLogs[index].happenedAt);

    if (!isSameUtcDay(previous, current)) {
      continue;
    }

    intervals.push(Math.round((current.getTime() - previous.getTime()) / 60_000));
  }

  return intervals;
}

function isSameUtcDay(left: Date, right: Date) {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}
