import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the Phase 0 app shell", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Potty Pattern Tracker" }),
    ).toBeInTheDocument();
    expect(screen.getByText("CI smoke test")).toBeInTheDocument();
  });
});
