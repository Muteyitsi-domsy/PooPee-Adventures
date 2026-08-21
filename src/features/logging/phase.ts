import type { PottyLogEntry } from "./types";

export type TrainingPhase = 1 | 2;

export function getNextTrainingPhase(
  currentPhase: TrainingPhase,
  entry: PottyLogEntry,
): TrainingPhase {
  if (currentPhase === 1 && entry.type === "poo" && entry.location === "potty") {
    return 2;
  }

  return currentPhase;
}
