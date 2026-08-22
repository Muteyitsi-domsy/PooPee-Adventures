export type LogKind = "pee" | "poo" | "both";
export type LogLocation = "potty" | "outside" | "sleep";
export type Initiator = "child" | "parent" | "accident";
export type LogContext = "normal" | "pre-nap" | "post-nap" | "during-nap" | "during-night";
export type OutsideReason = "unaware" | "refusal" | "cheeky";
export type PooStyle = "hid" | "open" | "unknown";

export interface PottyLog {
  id: string;
  kind: LogKind;
  location: LogLocation;
  initiator: Initiator;
  context: LogContext;
  reason: OutsideReason | null;
  pooStyle: PooStyle | null;
  sleepKind?: "nap" | "night";
  ts: number;
  silent?: boolean;
}

export interface Beverage {
  at: number;
}

export interface EngineResult {
  hasData: boolean;
  avgMs: number;
  adjustedMs: number;
  bevActive: boolean;
  nextTs: number;
  lastSuccess: PottyLog | undefined;
}
