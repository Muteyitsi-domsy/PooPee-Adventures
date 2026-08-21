import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
  });

  it("renders the Phase 1 onboarding shell", async () => {
    render(<Home />);

    expect(
      await screen.findByRole("heading", { name: "Set up the tracker" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Readiness signs")).toBeInTheDocument();
  });

  it("addresses the caregiver after onboarding is saved", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await user.type(await screen.findByLabelText("Child name"), "Maya");
    await user.clear(screen.getByLabelText("Age in months"));
    await user.type(screen.getByLabelText("Age in months"), "30");
    await user.type(screen.getByLabelText("Caregiver name"), "Doreen");
    await user.click(
      screen.getByRole("button", {
        name: "Save setup",
      }),
    );

    expect(
      await screen.findByRole("heading", { name: "Hi, Doreen" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Maya's training")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Onboarding is saved on this device. You can start logging Maya's potty patterns in the next phase.",
      ),
    ).toBeInTheDocument();
  });
});
