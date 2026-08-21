import type {
  ReadinessAnswer,
  ReadinessAnswers,
  ReadinessBand,
} from "./types";

export const readinessQuestions: Array<{
  id: ReadinessAnswer;
  label: string;
}> = [
  {
    id: "staysDry",
    label: "Stays dry for about two hours during the day",
  },
  {
    id: "communicatesNeed",
    label: "Can communicate pee, poo, wet, or potty needs",
  },
  {
    id: "noticesWet",
    label: "Notices or dislikes a wet or dirty diaper",
  },
  {
    id: "canPullDown",
    label: "Can help pull pants up and down",
  },
  {
    id: "interestedInPotty",
    label: "Shows interest in the potty or bathroom routine",
  },
  {
    id: "followsDirections",
    label: "Can follow simple one-step directions",
  },
  {
    id: "regularBowels",
    label: "Has somewhat predictable bowel movements",
  },
  {
    id: "calmWithToilet",
    label: "Can sit near or on the potty without distress",
  },
];

export const emptyReadinessAnswers: ReadinessAnswers =
  readinessQuestions.reduce(
    (answers, question) => ({
      ...answers,
      [question.id]: false,
    }),
    {} as ReadinessAnswers,
  );

export function scoreReadiness(answers: ReadinessAnswers): {
  score: number;
  band: ReadinessBand;
  message: string;
} {
  const yesCount = readinessQuestions.filter(
    (question) => answers[question.id],
  ).length;
  const score = Math.round((yesCount / readinessQuestions.length) * 100);

  if (score >= 75) {
    return {
      score,
      band: "ready",
      message: "Ready for you to start structured potty practice.",
    };
  }

  if (score >= 50) {
    return {
      score,
      band: "getting-close",
      message: "Getting close. Start gently and keep expectations light.",
    };
  }

  return {
    score,
    band: "not-yet",
    message: "Not quite ready. Build comfort and routines first.",
  };
}
