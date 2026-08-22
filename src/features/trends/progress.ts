import type { LogKind, PottyLog } from "@/features/logging/types";
import type { ProgressResult } from "./types";

export function progressLabel(pct: number): string {
  if (pct < 30) return "Just starting";
  if (pct < 55) return "Building consistency";
  if (pct < 75) return "Good progress";
  if (pct < 90) return "Mostly mastered";
  return "Consistently independent";
}

export function computeProgress(logs: PottyLog[], kind: LogKind): ProgressResult {
  const relevant = logs.filter((l) => l.location !== "sleep" && (l.kind === kind || l.kind === "both"));
  const pottyCount = relevant.filter((l) => l.location === "potty").length;
  const outsideCount = relevant.filter((l) => l.location === "outside").length;
  const total = pottyCount + outsideCount;
  if (total < 3) return { pct: null, total };
  const successRate = pottyCount / total;
  const childCount = relevant.filter((l) => l.location === "potty" && l.initiator === "child").length;
  const childRate = pottyCount ? childCount / pottyCount : 0;
  const pct = Math.round((successRate * 0.6 + childRate * 0.4) * 100);
  return {
    pct,
    total,
    successRate: Math.round(successRate * 100),
    childRate: Math.round(childRate * 100),
  };
}
