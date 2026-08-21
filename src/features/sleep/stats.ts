import type {
  CompletedSleepSession,
  LiquidTimingBucket,
  SleepBucketStats,
  SleepStats,
} from "./types";

const BUCKET_LABELS: Record<LiquidTimingBucket, string> = {
  "none-or-early": "No liquid or 60+ min before",
  "within-hour": "Liquid within 60 min",
  "within-30-min": "Liquid within 30 min",
};

const BUCKETS: LiquidTimingBucket[] = [
  "none-or-early",
  "within-hour",
  "within-30-min",
];

export function computeSleepStats(
  sessions: CompletedSleepSession[],
): SleepStats {
  const dry = sessions.filter((session) => session.dryness === "dry").length;

  return {
    total: sessions.length,
    dry,
    dryRate: getRate(dry, sessions.length),
    buckets: BUCKETS.map((bucket) => getBucketStats(bucket, sessions)),
  };
}

function getBucketStats(
  bucket: LiquidTimingBucket,
  sessions: CompletedSleepSession[],
): SleepBucketStats {
  const bucketSessions = sessions.filter(
    (session) => getLiquidTimingBucket(session.liquidMinutesBefore) === bucket,
  );
  const dry = bucketSessions.filter((session) => session.dryness === "dry").length;

  return {
    bucket,
    label: BUCKET_LABELS[bucket],
    total: bucketSessions.length,
    dry,
    dryRate: getRate(dry, bucketSessions.length),
  };
}

function getRate(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

function getLiquidTimingBucket(
  liquidMinutesBefore: number | undefined,
): LiquidTimingBucket {
  if (liquidMinutesBefore === undefined || liquidMinutesBefore >= 60) {
    return "none-or-early";
  }

  if (liquidMinutesBefore <= 30) {
    return "within-30-min";
  }

  return "within-hour";
}
