import "fake-indexeddb/auto";

import { describe, expect, it } from "vitest";
import { get, list, remove, set } from "./storage";

describe("storage", () => {
  it("round-trips values through IndexedDB", async () => {
    await set("test:onboarding", { childName: "Maya", phase: 1 });

    await expect(get("test:onboarding")).resolves.toEqual({
      childName: "Maya",
      phase: 1,
    });
    await expect(list("test:")).resolves.toContainEqual([
      "test:onboarding",
      { childName: "Maya", phase: 1 },
    ]);

    await remove("test:onboarding");

    await expect(get("test:onboarding")).resolves.toBeUndefined();
  });
});
