import { describe, expect, it } from "vitest";
import { scoreReadiness } from "./readiness";

describe("scoreReadiness", () => {
  it("labels a young, inconsistent, unexposed child as early days", () => {
    const result = scoreReadiness({ ageMonths: 15, follows: "no", exposure: "never" });
    expect(result.label).toBe("Early days");
    expect(result.pct).toBeLessThan(50);
  });

  it("labels an older, reliable, regularly exposed child as ready and eager", () => {
    const result = scoreReadiness({ ageMonths: 30, follows: "yes", exposure: "regular" });
    expect(result.label).toBe("Ready and eager");
    expect(result.pct).toBeGreaterThanOrEqual(85);
  });

  it("labels a mid-range profile as showing signs or ready to begin", () => {
    const result = scoreReadiness({ ageMonths: 22, follows: "sometimes", exposure: "occasional" });
    expect(["Showing signs", "Ready to begin"]).toContain(result.label);
  });
});
