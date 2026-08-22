export type LiquidTimingValue = "just" | "15-30" | "30-60" | "1-2h" | "long";
export type LiquidTypeValue = "milk" | "juice" | "water" | "porridge" | "other";

export interface SleepLiquid {
  had: boolean;
  type?: LiquidTypeValue;
  timing?: LiquidTimingValue;
  mins?: number;
}

export interface SleepSession {
  id: string;
  kind: "nap" | "night";
  startTs: number;
  liquid: SleepLiquid;
  estMinutes: number;
  status: "active" | "done";
  endTs?: number;
  actualMinutes?: number;
  outcome?: "dry" | "wet";
  wetTs?: number | null;
  wetUnknown?: boolean;
}

export interface SleepStatsRow {
  label: string;
  dry: number;
  wet: number;
  total: number;
  dryPct: number;
}

export interface SleepStats {
  rows: SleepStatsRow[];
  totalDone: number;
  totalDry: number;
  dryPct: number | null;
  avgMinutes: number | null;
}
