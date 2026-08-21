export type ReadinessAnswer =
  | "staysDry"
  | "communicatesNeed"
  | "noticesWet"
  | "canPullDown"
  | "interestedInPotty"
  | "followsDirections"
  | "regularBowels"
  | "calmWithToilet";

export type ReadinessAnswers = Record<ReadinessAnswer, boolean>;

export type ReadinessBand = "not-yet" | "getting-close" | "ready";

export type OnboardingProfile = {
  childName: string;
  childAgeMonths: number;
  caregiverName: string;
  startedAt: string;
  readinessAnswers: ReadinessAnswers;
  readinessScore: number;
  readinessBand: ReadinessBand;
};
