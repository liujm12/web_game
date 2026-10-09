// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BlockDropGame, FlappyDashGame } from "../components/games/classic-arcade";
import {
  blockAction, blockCollides, blockGhost, blockInterval, clearBlockLines,
  createBlocks, createFlappy, flapBird, flappyCollision, flappySettings,
  makeBag, rotateCells, stepFlappy, TETROMINOES,
} from "../lib/games/classic-arcade";

describe("Block Drop engine", () => {
  it("shuffles all seven tetrominoes exactly once per bag", () => {
    const bag = makeBag(() => 0.3);
    expect(new Set(bag).size).toBe(7);
    expect([...bag].sort()).toEqual(Object.keys(TETROMINOES).sort());
    for (const shape of Object.values(TETROMINOES)) expect(shape).toHaveLength(4);
  });
  it("returns a shape after four rotations and keeps the square unchanged", () => {
    for (const shape of Object.values(TETROMINOES)) {
      let rotated = shape;
      for (let turn = 0; turn < 4; turn++) rotated = rotateCells(rotated);
      expect(rotated.map(cell => cell.join()).sort()).toEqual(shape.map(cell => cell.join()).sort());
    }
  });
  it("rejects wall, floor, and occupied cells", () => {
    const state = createBlocks("normal", () => 0.5);
    expect(blockCollides(state.board, { ...state.piece, x: -4 })).toBe(true);
    expect(blockCollides(state.board, { ...state.piece, y: 20 })).toBe(true);
    const [col, row] = state.piece.cells[0];
    state.board[row + state.piece.y][col + state.piece.x] = 1;
    expect(blockCollides(state.board, state.piece)).toBe(true);
  });
  it("compacts every full row without mutating its input", () => {
    const board = Array.from({ length: 20 }, () => Array(10).fill(0));
    board[19].fill(1); board[18].fill(2); board[17][3] = 4;
    const result = clearBlockLines(board);
    expect(result.lines).toBe(2);
    expect(result.board).toHaveLength(20);
    expect(result.board[19][3]).toBe(4);
    expect(result.board[0]).toEqual(Array(10).fill(0));
    expect(board[19][0]).toBe(1);
  });
  it("lands hard drops on the ghost, scores distance, and spawns next", () => {
    const state = createBlocks("normal", () => 0.5);
    const ghost = blockGhost(state);
    expect(blockCollides(state.board, { ...ghost, y: ghost.y + 1 })).toBe(true);
    const next = blockAction(state, "hard", () => 0.5);
    expect(next.score).toBe(2 * (ghost.y - state.piece.y));
    expect(next.piece.kind).toBe(state.queue[0]);
    for (const [col, row] of ghost.cells) expect(next.board[ghost.y + row][ghost.x + col]).toBeGreaterThan(0);
    expect(state.board.flat().every(cell => cell === 0)).toBe(true);
  });
  it("clears four lines, awards a tetris, and advances level", () => {
    const state = createBlocks("normal", () => 0.5);
    state.lines = 6;
    state.piece = { kind: "I", cells: [[0, 0], [0, 1], [0, 2], [0, 3]], x: 4, y: 16 };
    for (let row = 16; row < 20; row++) state.board[row] = Array.from({ length: 10 }, (_, col) => col === 4 ? 0 : 1);
    const next = blockAction(state, "hard", () => 0.5);
    expect(next.lines).toBe(10);
    expect(next.level).toBe(2);
    expect(next.score).toBe(800);
    expect(next.board.flat().every(cell => cell === 0)).toBe(true);
    expect(blockInterval("normal", 2)).toBeLessThan(blockInterval("normal", 1));
    expect(blockInterval("hard", 1)).toBeLessThan(blockInterval("easy", 1));
  });
  it("ends when the next spawn is obstructed and ignores subsequent moves", () => {
    const state = createBlocks("normal", () => 0.5);
    state.board[0].fill(1); state.board[0][0] = 0;
    state.piece.y = 17;
    const next = blockAction(state, "hard", () => 0.5);
    expect(next.over).toBe(true);
    expect(blockAction(next, "left")).toBe(next);
  });
  it("keeps soft-drop points distinct from automatic gravity", () => {
    const state = createBlocks();
    expect(blockAction(state, "down").score).toBe(1);
    expect(blockAction(state, "tick").score).toBe(0);
    expect(blockAction(state, "left").piece.y).toBe(state.piece.y);
  });
  it("keeps seven-piece bag boundaries across repeated spawns", () => {
    let state = createBlocks("normal", () => 0.2);
    const spawned: string[] = [];
    for (let count = 0; count < 21; count++) {
      spawned.push(state.piece.kind);
      state = blockAction(state, "hard", () => 0.8);
      state.board = Array.from({ length: 20 }, () => Array(10).fill(0));
    }
    for (let offset = 0; offset < 21; offset += 7) expect(new Set(spawned.slice(offset, offset + 7)).size).toBe(7);
  });
  it("wall-kicks a rotation into bounds and rejects completely blocked rotations", () => {
    const state = createBlocks();
    state.piece = { kind: "I", cells: [[0, 0], [0, 1], [0, 2], [0, 3]], x: 8, y: 5 };
    const rotated = blockAction(state, "rotate");
    expect(rotated.piece.x).toBe(6);
    expect(blockCollides(rotated.board, rotated.piece)).toBe(false);
    state.board = Array.from({ length: 20 }, () => Array(10).fill(1));
    for (let row = 5; row < 9; row++) state.board[row][8] = 0;
    expect(blockAction(state, "rotate")).toBe(state);
  });
  it.each([[1, 100], [2, 300], [3, 500]])("scores %i cleared lines at the current level", (lineCount, points) => {
    const state = createBlocks();
    state.level = 3;
    state.lines = 20;
    state.piece = { kind: "I", cells: [[0, 0], [0, 1], [0, 2], [0, 3]], x: 4, y: 16 };
    for (let row = 20 - lineCount; row < 20; row++) state.board[row] = Array.from({ length: 10 }, (_, col) => col === 4 ? 0 : 1);
    const next = blockAction(state, "hard");
    expect(next.score).toBe(points * 3);
    expect(next.lines).toBe(20 + lineCount);
  });
  it("ends safely when a piece locks above the visible board", () => {
    const state = createBlocks();
    state.piece = { kind: "O", cells: TETROMINOES.O, x: 4, y: -1 };
    state.board[1][4] = 1;
    expect(blockAction(state, "down").over).toBe(true);
  });
});

describe("Flappy Dash physics", () => {
  it("starts with a generous runway and ordered difficulty", () => {
    const state = createFlappy("normal", () => 0.5);
    expect(state.pipes[0].x).toBeGreaterThan(360);
    expect(flappyCollision(state)).toBe(false);
    expect(flappySettings.easy.gap).toBeGreaterThan(flappySettings.hard.gap);
    expect(flappySettings.easy.speed).toBeLessThan(flappySettings.hard.speed);
  });
  it("flaps upward and integrates gravity independent of frame size", () => {
    const state = flapBird(createFlappy());
    expect(state.velocity).toBeLessThan(0);
    const whole = stepFlappy(state, 0.1, () => 0.5);
    let parts = state;
    for (let frame = 0; frame < 12; frame++) parts = stepFlappy(parts, 1 / 120, () => 0.5);
    expect(whole.y).toBeCloseTo(parts.y, 5);
    expect(whole.velocity).toBeCloseTo(parts.velocity, 5);
    expect(whole.pipes[0].x).toBeCloseTo(parts.pipes[0].x, 5);
  });
  it("detects exact circular bird collisions at floor, ceiling, pipe faces, and corners", () => {
    const state = createFlappy("normal", () => 0.5);
    expect(flappyCollision({ ...state, y: 12 })).toBe(true);
    expect(flappyCollision({ ...state, y: 468 })).toBe(true);
    state.pipes = [{ id: 1, x: 84, center: 240, gap: 160, scored: false }];
    expect(flappyCollision({ ...state, y: 240 })).toBe(false);
    expect(flappyCollision({ ...state, y: 169 })).toBe(true);
    state.pipes[0].x = 94;
    expect(flappyCollision({ ...state, y: 170 })).toBe(false);
  });
  it("awards a point only after safely clearing a pipe and never twice", () => {
    const state = createFlappy("normal", () => 0.5);
    state.pipes = [{ id: 0, x: 17, center: 240, gap: 180, scored: false }];
    const next = stepFlappy(state, 0.03, () => 0.5);
    expect(next.score).toBe(1);
    expect(stepFlappy(next, 0.03, () => 0.5).score).toBe(1);
    expect(state.pipes[0].scored).toBe(false);
  });
  it("ends on impact, cannot flap after death, and does not tunnel through a pipe", () => {
    const state = createFlappy("hard", () => 0.5);
    state.pipes = [{ id: 0, x: 100, center: 100, gap: 80, scored: false }];
    const next = stepFlappy(state, 0.25);
    expect(next.over).toBe(true);
    expect(flapBird(next)).toBe(next);
    expect(stepFlappy(next, 1)).toBe(next);
  });
  it("spawns bounded reachable gaps and increases speed with score", () => {
    const state = createFlappy("normal", () => 0.5);
    state.pipes = [{ id: 0, x: 130, center: 240, gap: 160, scored: true }];
    const next = stepFlappy(state, 0.01, () => 1);
    expect(next.pipes.length).toBe(2);
    expect(Math.abs(next.pipes[1].center - 240)).toBeLessThanOrEqual(70);
    expect(next.pipes[1].center + next.pipes[1].gap / 2).toBeLessThan(480);
    const faster = stepFlappy({ ...state, score: 20 }, 0.01);
    expect(faster.pipes[0].x).toBeLessThan(next.pipes[0].x);
  });
});

describe("arcade controls and lifecycle", () => {
  let frames: Map<number, FrameRequestCallback>;
  let now: number;
  let nextFrame: number;
  beforeEach(() => {
    frames = new Map();
    now = 0;
    nextFrame = 0;
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, String(value)),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      key: (index: number) => [...storage.keys()][index] ?? null,
      get length() { return storage.size; },
    });
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
  function advance(milliseconds: number) {
    for (let elapsed = 0; elapsed < milliseconds; elapsed += 10) {
      now += 10;
      act(() => {
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach(callback => callback(now));
      });
    }
  }
  function activeBlockRows(container: HTMLElement) {
    const board = container.querySelector('svg[aria-label*="lines cleared"]')!;
    return [...board.querySelectorAll("rect")].slice(-4).map(rect => Number(rect.getAttribute("y")));
  }
  it("keeps gravity running through repeated movement and rerenders", () => {
    const { container } = render(createElement(BlockDropGame));
    fireEvent.click(screen.getByRole("button", { name: "Start blocks" }));
    const rows = activeBlockRows(container);
    for (let index = 0; index < 8; index++) {
      advance(100);
      fireEvent.keyDown(window, { key: index % 2 ? "ArrowRight" : "ArrowLeft" });
    }
    expect(activeBlockRows(container)).toEqual(rows.map(row => row + 1));
  });
  it("pauses blocks on visibility changes and resumes only explicitly", () => {
    const { container } = render(createElement(BlockDropGame));
    fireEvent.click(screen.getByRole("button", { name: "Start blocks" }));
    const rows = activeBlockRows(container);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(screen.getByRole("heading", { name: "Paused" })).toBeTruthy();
    advance(2000);
    expect(activeBlockRows(container)).toEqual(rows);
    fireEvent.keyDown(window, { key: "p" });
    advance(800);
    expect(activeBlockRows(container)).toEqual(rows.map(row => row + 1));
  });
  it("hard drops using Space, ignores held repeats, and saves an actual best", () => {
    render(createElement(BlockDropGame));
    fireEvent.click(screen.getByRole("button", { name: "Start blocks" }));
    fireEvent.keyDown(window, { key: " " });
    const best = Number(window.localStorage.getItem("turbo-best:block-drop-normal"));
    expect(best).toBeGreaterThan(0);
    fireEvent.keyDown(window, { key: " ", repeat: true });
    expect(Number(window.localStorage.getItem("turbo-best:block-drop-normal"))).toBe(best);
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    expect(screen.getByText(`Score 0 · Best ${best}`)).toBeTruthy();
  });
  it("preserves normal form keyboard behavior and separates difficulty records", () => {
    render(createElement(BlockDropGame));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "hard" } });
    fireEvent.click(screen.getByRole("button", { name: "Start blocks" }));
    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    fireEvent(screen.getByRole("combobox"), event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByText("Score 0 · Best 0")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Hard drop" }));
    expect(Number(window.localStorage.getItem("turbo-best:block-drop-hard"))).toBeGreaterThan(0);
    expect(window.localStorage.getItem("turbo-best:block-drop-normal")).toBeNull();
  });
  it("renders Flappy in matching logical coordinates and supports button, key, and board input", () => {
    const { container } = render(createElement(FlappyDashGame));
    fireEvent.click(screen.getByRole("button", { name: "Start flight" }));
    const svg = screen.getByRole("img", { name: "Bird flight. 0 pipes cleared." });
    expect(svg.getAttribute("viewBox")).toBe("0 0 360 480");
    const bird = () => container.querySelector('g[transform^="translate(84"]')!.getAttribute("transform");
    advance(200);
    const first = bird();
    fireEvent.click(screen.getByRole("button", { name: "Flap ↑" }));
    advance(50);
    expect(bird()).not.toBe(first);
    fireEvent.keyDown(window, { key: "ArrowUp" });
    fireEvent.pointerDown(svg);
    expect(screen.queryByRole("heading", { name: "Paused" })).toBeNull();
  });
  it("pauses Flappy on blur without a resume jump, then ends and restarts cleanly", () => {
    const { container } = render(createElement(FlappyDashGame));
    fireEvent.click(screen.getByRole("button", { name: "Start flight" }));
    advance(150);
    fireEvent(window, new Event("blur"));
    const bird = () => container.querySelector('g[transform^="translate(84"]')!.getAttribute("transform");
    const paused = bird();
    advance(5000);
    expect(bird()).toBe(paused);
    fireEvent.keyDown(window, { key: "p" });
    advance(10);
    expect(bird()).toBe(paused);
    advance(2000);
    expect(screen.getByRole("button", { name: "Fly again" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Fly again" }));
    expect(screen.queryByRole("button", { name: "Fly again" })).toBeNull();
    expect(screen.getByText("Score 0 · Best 0")).toBeTruthy();
  });
  it("cancels animation frames when either game unmounts", () => {
    for (const Component of [BlockDropGame, FlappyDashGame]) {
      const view = render(createElement(Component));
      fireEvent.click(screen.getByRole("button", { name: /Start blocks|Start flight/ }));
      expect(frames.size).toBe(1);
      view.unmount();
      expect(frames.size).toBe(0);
    }
  });
  it("continues playing if persistent storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => { throw new Error("Storage blocked"); },
      setItem: () => { throw new Error("Storage blocked"); },
    });
    render(createElement(BlockDropGame));
    fireEvent.click(screen.getByRole("button", { name: "Start blocks" }));
    expect(() => fireEvent.click(screen.getByRole("button", { name: "Hard drop" }))).not.toThrow();
    expect(screen.queryByRole("button", { name: "Start blocks" })).toBeNull();
  });
});
