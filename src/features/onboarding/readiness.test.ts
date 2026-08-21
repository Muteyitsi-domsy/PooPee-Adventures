import { describe, expect, it } from "vitest";
import {
  emptyReadinessAnswers,
  readinessQuestions,
  scoreReadiness,
} from "./readiness";
import type { ReadinessAnswers } from "./types";

function answersWithYes(count: number): ReadinessAnswers {
  return readinessQuestions.reduce(
    (answers, question, index) => ({
      ...answers,
      [question.id]: index < count,
    }),
    { ...emptyReadinessAnswers },
  );
}

describe("scoreReadiness", () => {
  it("marks scores below 50 as not ready yet", () => {
    expect(scoreReadiness(answersWithYes(3))).toMatchObject({
      score: 38,
      band: "not-yet",
    });
  });

  it("marks scores from 50 through 74 as getting close", () => {
    expect(scoreReadiness(answersWithYes(4))).toMatchObject({
      score: 50,
      band: "getting-close",
    });
    expect(scoreReadiness(answersWithYes(5))).toMatchObject({
      score: 63,
      band: "getting-close",
    });
  });

  it("marks scores at 75 and above as ready", () => {
    expect(scoreReadiness(answersWithYes(6))).toMatchObject({
      score: 75,
      band: "ready",
    });
    expect(scoreReadiness(answersWithYes(8))).toMatchObject({
      score: 100,
      band: "ready",
    });
  });
});
