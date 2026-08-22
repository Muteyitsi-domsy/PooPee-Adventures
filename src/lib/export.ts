import type { PottyLog } from "@/features/logging/types";
import type { SleepSession } from "@/features/sleep/types";

export function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function logsToCSV(logs: PottyLog[]): string {
  const header = [
    "date",
    "time",
    "type",
    "location",
    "initiator",
    "context",
    "outside_reason",
    "poo_style",
    "sleep_kind",
  ];
  const rows = [...logs]
    .sort((a, b) => a.ts - b.ts)
    .map((l) => {
      const d = new Date(l.ts);
      return [
        d.toISOString().slice(0, 10),
        d.toTimeString().slice(0, 5),
        l.kind || "",
        l.location || "",
        l.initiator || "",
        l.context || "",
        l.reason || "",
        l.pooStyle || "",
        l.sleepKind || "",
      ];
    });
  return [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
}

export function sleepToCSV(sessions: SleepSession[]): string {
  const header = [
    "kind",
    "start_date",
    "start_time",
    "estimated_minutes",
    "actual_minutes",
    "outcome",
    "wet_time",
    "liquid_had",
    "liquid_type",
    "liquid_timing",
  ];
  const rows = [...sessions]
    .filter((s) => s.status === "done")
    .sort((a, b) => a.startTs - b.startTs)
    .map((s) => {
      const d = new Date(s.startTs);
      const wet = s.wetTs
        ? new Date(s.wetTs).toTimeString().slice(0, 5)
        : s.outcome === "wet" && s.wetUnknown
          ? "unknown"
          : "";
      return [
        s.kind,
        d.toISOString().slice(0, 10),
        d.toTimeString().slice(0, 5),
        s.estMinutes,
        s.actualMinutes,
        s.outcome,
        wet,
        s.liquid?.had ? "yes" : "no",
        s.liquid?.type || "",
        s.liquid?.timing || "",
      ];
    });
  return [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
}

export function downloadFile(filename: string, content: string, mime: string): boolean {
  try {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch {
    return false;
  }
}
