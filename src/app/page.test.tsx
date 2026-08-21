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
        "Onboarding is saved on this device. You can log Maya's potty patterns now.",
      ),
    ).toBeInTheDocument();
  });

  it("persists a pee log across a fresh render", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await user.type(await screen.findByLabelText("Child name"), "Maya");
    await user.clear(screen.getByLabelText("Age in months"));
    await user.type(screen.getByLabelText("Age in months"), "30");
    await user.type(screen.getByLabelText("Caregiver name"), "Doreen");
    await user.click(screen.getByRole("button", { name: "Save setup" }));
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
});
