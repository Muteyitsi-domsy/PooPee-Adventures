export type PottyEventType = "pee" | "poo";
export type PottyLocation = "potty" | "outside";
export type OutsideReason = "missed-cue" | "resisted-potty" | "travel" | "other";

export type PottyLogEntry = {
  id: string;
  type: PottyEventType;
  location: PottyLocation;
  happenedAt: string;
  createdAt: string;
  notes?: string;
  recentBeverageMl?: number;
  outsideReason?: OutsideReason;
};

export type PatternEngineResult = {
  nextReminderAt: string;
  minutesUntilReminder: number;
  learnedIntervalMinutes: number;
  sampleCount: number;
  confidence: "fallback" | "learned";
  beverageAdjusted: boolean;
};
