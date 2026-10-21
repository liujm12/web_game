import { describe, expect, it } from "vitest";

import { patrolEscapeLevels } from "@/data/patrol-escape-levels";
import {
  applyVehicleMove,
  createPatrolEscapeState,
  getLegalDeltas,
  getPatrolEscapeHint,
  isPatrolEscapeSolved,
  solvePatrolEscape,
} from "@/lib/patrol-escape";

describe("Patrol Escape engine", () => {
  it("keeps every vehicle inside the board without overlapping another vehicle", () => {
    for (const level of patrolEscapeLevels) {
      const occupiedCells = new Set<string>();

      for (const vehicle of level.vehicles) {
        for (let offset = 0; offset < vehicle.length; offset += 1) {
          const row = vehicle.row + (vehicle.orientation === "vertical" ? offset : 0);
          const col = vehicle.col + (vehicle.orientation === "horizontal" ? offset : 0);
          const cell = `${row}:${col}`;

          expect(row, `${level.title}: ${vehicle.id} leaves the board`).toBeGreaterThanOrEqual(0);
          expect(row, `${level.title}: ${vehicle.id} leaves the board`).toBeLessThan(6);
          expect(col, `${level.title}: ${vehicle.id} leaves the board`).toBeGreaterThanOrEqual(0);
          expect(col, `${level.title}: ${vehicle.id} leaves the board`).toBeLessThan(6);
          expect(occupiedCells.has(cell), `${level.title}: vehicles overlap at ${cell}`).toBe(false);
          occupiedCells.add(cell);
        }
      }
    }
  });

  it("only moves vehicles along their orientation without crossing blockers", () => {
    const state = createPatrolEscapeState(patrolEscapeLevels[0]);

    expect(getLegalDeltas(state, "police")).toEqual([]);
    expect(getLegalDeltas(state, "gate-van")).toContain(-1);
    expect(getLegalDeltas(state, "gate-van")).not.toContain(4);
  });

  it("applies legal movement immutably and counts each grid step", () => {
    const state = createPatrolEscapeState(patrolEscapeLevels[0]);
    const moved = applyVehicleMove(state, "gate-van", -1);

    expect(moved).not.toBe(state);
    expect(moved.vehicles.find((vehicle) => vehicle.id === "gate-van")?.row).toBe(0);
    expect(moved.moves).toBe(1);
    expect(state.vehicles.find((vehicle) => vehicle.id === "gate-van")?.row).toBe(1);
  });

  it("recognizes the police car at the right-side exit", () => {
    let state = createPatrolEscapeState(patrolEscapeLevels[0]);
    state = applyVehicleMove(state, "gate-van", -1);
    state = applyVehicleMove(state, "police", 4);

    expect(isPatrolEscapeSolved(state)).toBe(true);
    expect(state.moves).toBe(5);
  });

  it("ships one hundred twenty distinct levels with verified solutions and useful hints", () => {
    expect(patrolEscapeLevels).toHaveLength(120);
    expect(new Set(patrolEscapeLevels.map((level) => level.vehicles.map((vehicle) => `${vehicle.id}:${vehicle.row}:${vehicle.col}`).join("|"))).size).toBe(120);

    for (const level of patrolEscapeLevels) {
      const state = createPatrolEscapeState(level);
      const solution = solvePatrolEscape(state);

      expect(solution.length, level.title).toBeGreaterThan(0);
      expect(solution.length, level.title).toBeLessThanOrEqual(100);
      if (level.id === 1 || level.id % 10 === 0) {
        expect(getPatrolEscapeHint(state), level.title).toEqual(solution[0]);
      }
    }
  }, 30_000);

  it("uses progressive difficulty bands across the level map", () => {
    expect(patrolEscapeLevels[0].difficulty).toBe("Easy");
    expect(patrolEscapeLevels[19].difficulty).toBe("Easy");
    expect(patrolEscapeLevels[20].difficulty).toBe("Medium");
    expect(patrolEscapeLevels[44].difficulty).toBe("Medium");
    expect(patrolEscapeLevels[45].difficulty).toBe("Hard");
    expect(patrolEscapeLevels[74].difficulty).toBe("Hard");
    expect(patrolEscapeLevels[75].difficulty).toBe("Expert");
    expect(patrolEscapeLevels[99].difficulty).toBe("Expert");
    expect(patrolEscapeLevels[100].difficulty).toBe("Master");
    expect(patrolEscapeLevels[119].difficulty).toBe("Master");
    expect(new Set(patrolEscapeLevels.map((level) => level.title)).size).toBe(120);
  });

  it("uses the solver's shortest route as each level par", () => {
    const shortestRoutes = patrolEscapeLevels.map((level) =>
      solvePatrolEscape(createPatrolEscapeState(level)).length,
    );

    expect(patrolEscapeLevels.map((level) => level.par)).toEqual(shortestRoutes);
    shortestRoutes.forEach((length, index) => {
      const id = index + 1;
      const range = id <= 20
        ? [4, 7]
        : id <= 45
          ? [6, 10]
          : id <= 75
            ? [8, 13]
            : id <= 100
              ? [10, 18]
              : [20, 60];
      expect(length, `Level ${id}`).toBeGreaterThanOrEqual(range[0]);
      expect(length, `Level ${id}`).toBeLessThanOrEqual(range[1]);
    });
  }, 20_000);

  it("packs every Master level with at least eight blocking vehicles", () => {
    for (const level of patrolEscapeLevels.slice(100)) {
      expect(level.vehicles.length - 1, level.title).toBeGreaterThanOrEqual(8);
    }
  });
});
