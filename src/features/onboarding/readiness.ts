import type { FollowsInstructions, PottyExposure, Readiness } from "./types";

interface ScoreReadinessInput {
  ageMonths: number;
  follows: FollowsInstructions;
  exposure: PottyExposure;
}

export function scoreReadiness({ ageMonths, follows, exposure }: ScoreReadinessInput): Readiness {
  const ageScore = ageMonths < 18 ? 0.4 : ageMonths <= 24 ? 0.7 : 1.0;
  const followsScore = follows === "yes" ? 1 : follows === "sometimes" ? 0.65 : 0.3;
  const exposureScore = exposure === "regular" ? 1 : exposure === "occasional" ? 0.7 : 0.4;
  const pct = Math.round(((ageScore + followsScore + exposureScore) / 3) * 100);

  let label: string;
  let note: string;
  if (pct < 50) {
    label = "Early days";
    note = "No rush — exposure now (letting her sit, see the potty) lays groundwork without pressure.";
  } else if (pct < 70) {
    label = "Showing signs";
    note = "Good moment to keep offering, gently, without expecting consistency yet.";
  } else if (pct < 85) {
    label = "Ready to begin";
    note = "This is a solid window to lead gently and start noticing her own patterns.";
  } else {
    label = "Ready and eager";
    note = "She has the pieces in place — your job now is mostly to get out of her way.";
  }

  return { pct, label, note };
}
