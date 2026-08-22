export interface ProgressResult {
  pct: number | null;
  total: number;
  successRate?: number;
  childRate?: number;
}
