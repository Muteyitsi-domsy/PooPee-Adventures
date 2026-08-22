import { describe, expect, it } from "vitest";
import {
  dayKey,
  fmtDuration,
  fmtMins,
  fromDateTimeLocalValue,
  isSameDay,
  minsAgo,
  toDateTimeLocalValue,
  MIN,
  HR,
} from "./time";

describe("dayKey / isSameDay", () => {
  it("treats timestamps on the same calendar day as equal", () => {
    const morning = new Date(2026, 0, 5, 8, 0).getTime();
    const evening = new Date(2026, 0, 5, 22, 0).getTime();
    const nextDay = new Date(2026, 0, 6, 0, 1).getTime();

    expect(dayKey(morning)).toBe(dayKey(evening));
    expect(isSameDay(morning, evening)).toBe(true);
    expect(isSameDay(morning, nextDay)).toBe(false);
  });
});

describe("minsAgo", () => {
  const now = new Date(2026, 0, 5, 12, 0).getTime();

  it("reports just now for sub-minute gaps", () => {
    expect(minsAgo(now - 20 * 1000, now)).toBe("just now");
  });

  it("reports minutes for gaps under an hour", () => {
    expect(minsAgo(now - 15 * MIN, now)).toBe("15m ago");
  });

  it("reports hours and minutes for longer gaps", () => {
    expect(minsAgo(now - (2 * HR + 5 * MIN), now)).toBe("2h 5m ago");
  });
});

describe("fmtDuration", () => {
  it("returns any moment for zero or negative durations", () => {
    expect(fmtDuration(0)).toBe("any moment");
    expect(fmtDuration(-1000)).toBe("any moment");
  });

  it("formats sub-hour durations in minutes", () => {
    expect(fmtDuration(45 * MIN)).toBe("45 min");
  });

  it("formats longer durations in hours and minutes", () => {
    expect(fmtDuration(HR + 30 * MIN)).toBe("1h 30m");
  });
});

describe("fmtMins", () => {
  it("formats sub-hour minutes plainly", () => {
    expect(fmtMins(45)).toBe("45m");
  });

  it("omits the minutes remainder when exactly on the hour", () => {
    expect(fmtMins(120)).toBe("2h");
  });

  it("includes both hours and minutes otherwise", () => {
    expect(fmtMins(125)).toBe("2h 5m");
  });
});

describe("toDateTimeLocalValue / fromDateTimeLocalValue", () => {
  it("round-trips a timestamp through the datetime-local string format", () => {
    const ts = new Date(2026, 0, 5, 14, 30).getTime();
    const value = toDateTimeLocalValue(ts);
    expect(value).toBe("2026-01-05T14:30");
    expect(fromDateTimeLocalValue(value)).toBe(ts);
  });

  it("falls back to the provided default for an empty or invalid value", () => {
    const fallback = new Date(2026, 0, 1).getTime();
    expect(fromDateTimeLocalValue("", fallback)).toBe(fallback);
    expect(fromDateTimeLocalValue("not-a-date", fallback)).toBe(fallback);
  });
});
