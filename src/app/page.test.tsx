import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the Phase 1 onboarding shell", async () => {
    render(<Home />);

    expect(
      await screen.findByRole("heading", { name: "Set up the tracker" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Readiness signs")).toBeInTheDocument();
  });
});
