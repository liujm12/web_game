// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MeteorSprintGame } from "@/components/games/meteor-sprint-game";

describe("MeteorSprintGame", () => {
  it("starts a run when the player clicks Start run", () => {
    vi.useFakeTimers();

    render(<MeteorSprintGame />);

    fireEvent.click(screen.getByRole("button", { name: "Start run" }));

    expect(screen.getByRole("button", { name: "Reset run" })).toBeInTheDocument();
    expect(screen.queryByText("Ready for launch?")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
