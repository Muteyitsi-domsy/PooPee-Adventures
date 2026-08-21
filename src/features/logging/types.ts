export type PottyEventType = "pee" | "poo";

export type PottyLogEntry = {
  id: string;
  type: PottyEventType;
  happenedAt: string;
  createdAt: string;
  notes?: string;
  recentBeverageMl?: number;
};

export type PatternEngineResult = {
  nextReminderAt: string;
  minutesUntilReminder: number;
  learnedIntervalMinutes: number;
  sampleCount: number;
  confidence: "fallback" | "learned";
  beverageAdjusted: boolean;
};
