import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import Home from "./page";

afterEach(() => {
  indexedDB = new IDBFactory();
});

describe("Home", () => {
  it("shows onboarding when no profile has been saved yet", async () => {
    render(<Home />);

    expect(await screen.findByText("What's her name?")).toBeInTheDocument();
  });
});
