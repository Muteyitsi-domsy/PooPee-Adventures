import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clear } from "idb-keyval";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  beforeEach(async () => {
    cleanup();
    indexedDB = new IDBFactory();
    await clear();
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

    await completeOnboarding(user);

    expect(
      await screen.findByRole("heading", { name: "Hi, Doreen" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Maya's training")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Today is for logging what happened without pressure. You are in Phase 1 for Maya's training.",
      ),
    ).toBeInTheDocument();
  });

  it("persists a pee log across a fresh render", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await completeOnboarding(user);
    await user.click(await screen.findByRole("button", { name: "Log pee" }));

    expect(await screen.findByText("1 pee logs")).toBeInTheDocument();

    cleanup();
    render(<Home />);

    expect(
      await screen.findByRole("heading", { name: "Hi, Doreen" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("1 pee logs")).toBeInTheDocument();
    expect(screen.getByLabelText("Recent potty logs")).toHaveTextContent("Pee");
  });

  it("shows the no-reprimand banner for an outside pee", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await completeOnboarding(user);
    await user.click(
      await screen.findByRole("button", { name: "Outside potty" }),
    );
    await user.selectOptions(screen.getByLabelText("Outside reason"), "travel");
    await user.click(screen.getByRole("button", { name: "Log pee" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "No reprimands. Maya is still learning",
    );
    expect(screen.getByLabelText("Recent potty logs")).toHaveTextContent(
      "Outside potty",
    );
    expect(screen.getByLabelText("Recent potty logs")).toHaveTextContent(
      "Travel",
    );
  });

  it("flips from phase 1 to phase 2 after the first potty poo", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await completeOnboarding(user);

    expect(await screen.findByText("Phase 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Log poo" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Phase 2 unlocked",
    );
    expect(screen.getByText("Phase 2")).toBeInTheDocument();
    expect(screen.getByText("1 poo logs")).toBeInTheDocument();
  });
});

async function completeOnboarding(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByLabelText("Child name"), "Maya");
  await user.clear(screen.getByLabelText("Age in months"));
  await user.type(screen.getByLabelText("Age in months"), "30");
  await user.type(screen.getByLabelText("Caregiver name"), "Doreen");
  await user.click(screen.getByRole("button", { name: "Save setup" }));
}
