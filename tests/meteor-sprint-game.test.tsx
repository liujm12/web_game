// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MeteorSprintGame } from "@/components/games/meteor-sprint-game";

describe("MeteorSprintGame", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("starts a run when the player clicks Start run", () => {
    vi.useFakeTimers();

    render(<MeteorSprintGame />);

    fireEvent.click(screen.getByRole("button", { name: "Start run" }));

    expect(screen.queryByRole("button", { name: "Start run" })).not.toBeInTheDocument();
    expect(screen.queryByText("Ready for launch?")).not.toBeInTheDocument();
  });

  it("supports desktop keyboard start and lane movement", () => {
    vi.useFakeTimers();

    const { container } = render(<MeteorSprintGame />);

    fireEvent.keyDown(window, { key: " " });
    expect(screen.queryByRole("button", { name: "Start run" })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(container.querySelectorAll('[data-active="true"]')[0]).toHaveStyle({
      left: "18%",
    });

    fireEvent.keyDown(window, { key: "d" });
    expect(container.querySelectorAll('[data-active="true"]')[0]).toHaveStyle({
      left: "50%",
    });
  });

  it("places lane controls after the playfield for mobile play", () => {
    const { container } = render(<MeteorSprintGame />);

    const moveLeftButton = screen.getByRole("button", { name: "Move left" });
    const playfield = container.querySelector('[data-meteor-field="true"]');

    expect(playfield).toBeTruthy();
    expect(
      Boolean(
        playfield!.compareDocumentPosition(moveLeftButton) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
  });
});
