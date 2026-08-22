import type { SleepSession, SleepStats } from "./types";

export function timingLabel(mins: number | null | undefined): string {
  if (mins == null) return "No liquid";
  if (mins <= 12) return "Just before";
  if (mins <= 30) return "15–30 min before";
  if (mins <= 60) return "30–60 min before";
  if (mins <= 100) return "1–2h before";
  return "2h+ / none noted";
}

export function computeSleepStats(sessions: SleepSession[], kind: "nap" | "night"): SleepStats {
  const done = sessions.filter((s) => s.kind === kind && s.status === "done");
  const buckets: Record<string, { dry: number; wet: number }> = {};
  done.forEach((s) => {
    const key = s.liquid && s.liquid.had ? timingLabel(s.liquid.mins) : "No liquid";
    if (!buckets[key]) buckets[key] = { dry: 0, wet: 0 };
    buckets[key][s.outcome === "wet" ? "wet" : "dry"]++;
  });
  const rows = Object.entries(buckets)
    .map(([label, v]) => ({
      label,
      dry: v.dry,
      wet: v.wet,
      total: v.dry + v.wet,
      dryPct: Math.round((v.dry / (v.dry + v.wet)) * 100),
    }))
    .sort((a, b) => b.total - a.total);
  const totalDone = done.length;
  const totalDry = done.filter((s) => s.outcome === "dry").length;
  const avgMinutes = done.length
    ? Math.round(done.reduce((a, s) => a + (s.actualMinutes || 0), 0) / done.length)
    : null;
  return {
    rows,
    totalDone,
    totalDry,
    dryPct: totalDone ? Math.round((totalDry / totalDone) * 100) : null,
    avgMinutes,
  };
}
