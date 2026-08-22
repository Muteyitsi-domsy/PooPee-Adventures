export type FollowsInstructions = "no" | "sometimes" | "yes";
export type PottyExposure = "never" | "occasional" | "regular";
export type TrainingPhase = "pee" | "pee+poo";

export interface Readiness {
  pct: number;
  label: string;
  note: string;
}

export interface Profile {
  name: string;
  ageMonths: number;
  follows: FollowsInstructions;
  exposure: PottyExposure;
  readiness: Readiness;
  phase: TrainingPhase;
  onboarded: boolean;
  createdAt: number;
}
