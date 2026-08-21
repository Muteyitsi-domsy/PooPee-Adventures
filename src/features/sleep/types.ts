export type SleepSessionType = "nap" | "night";
export type SleepDryness = "dry" | "wet";
export type LiquidTimingBucket = "none-or-early" | "within-hour" | "within-30-min";

export type ActiveSleepSession = {
  id: string;
  type: SleepSessionType;
  startedAt: string;
  liquidMinutesBefore?: number;
};

export type CompletedSleepSession = ActiveSleepSession & {
  endedAt: string;
  dryness: SleepDryness;
};

export type SleepBucketStats = {
  bucket: LiquidTimingBucket;
  label: string;
  total: number;
  dry: number;
  dryRate: number;
};

export type SleepStats = {
  total: number;
  dry: number;
  dryRate: number;
  buckets: SleepBucketStats[];
};
