export const PATROL_ESCAPE_BOARD_SIZE = 6;
export const PATROL_ESCAPE_TARGET_ID = "police";

export type PatrolEscapeOrientation = "horizontal" | "vertical";

export type PatrolEscapeVehicle = {
  id: string;
  label: string;
  row: number;
  col: number;
  length: 2 | 3;
  orientation: PatrolEscapeOrientation;
  color: "police" | "blue" | "amber" | "green" | "rose" | "violet" | "slate";
};

export type PatrolEscapeLevel = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert" | "Master";
  par: number;
  vehicles: PatrolEscapeVehicle[];
};

export type PatrolEscapeState = {
  levelId: number;
  moves: number;
  vehicles: PatrolEscapeVehicle[];
};

export type PatrolEscapeMove = {
  vehicleId: string;
  delta: number;
};

export function createPatrolEscapeState(level: PatrolEscapeLevel): PatrolEscapeState {
  return {
    levelId: level.id,
    moves: 0,
    vehicles: level.vehicles.map((vehicle) => ({ ...vehicle })),
  };
}

function cellsForVehicle(vehicle: PatrolEscapeVehicle) {
  return Array.from({ length: vehicle.length }, (_, index) => ({
    row: vehicle.row + (vehicle.orientation === "vertical" ? index : 0),
    col: vehicle.col + (vehicle.orientation === "horizontal" ? index : 0),
  }));
}

function occupiedCells(state: PatrolEscapeState, ignoredVehicleId: string) {
  const occupied = new Set<string>();

  for (const vehicle of state.vehicles) {
    if (vehicle.id === ignoredVehicleId) continue;
    for (const cell of cellsForVehicle(vehicle)) {
      occupied.add(`${cell.row}:${cell.col}`);
    }
  }

  return occupied;
}

export function getLegalDeltas(state: PatrolEscapeState, vehicleId: string) {
  const vehicle = state.vehicles.find((candidate) => candidate.id === vehicleId);
  if (!vehicle) return [];

  const occupied = occupiedCells(state, vehicleId);
  const deltas: number[] = [];

  for (const direction of [-1, 1]) {
    for (let distance = 1; distance < PATROL_ESCAPE_BOARD_SIZE; distance += 1) {
      const delta = direction * distance;
      const nextRow = vehicle.row + (vehicle.orientation === "vertical" ? delta : 0);
      const nextCol = vehicle.col + (vehicle.orientation === "horizontal" ? delta : 0);
      const lastRow = nextRow + (vehicle.orientation === "vertical" ? vehicle.length - 1 : 0);
      const lastCol = nextCol + (vehicle.orientation === "horizontal" ? vehicle.length - 1 : 0);

      if (
        nextRow < 0 ||
        nextCol < 0 ||
        lastRow >= PATROL_ESCAPE_BOARD_SIZE ||
        lastCol >= PATROL_ESCAPE_BOARD_SIZE
      ) {
        break;
      }

      const blocked = Array.from({ length: vehicle.length }, (_, index) => {
        const row = nextRow + (vehicle.orientation === "vertical" ? index : 0);
        const col = nextCol + (vehicle.orientation === "horizontal" ? index : 0);
        return occupied.has(`${row}:${col}`);
      }).some(Boolean);

      if (blocked) break;
      deltas.push(delta);
    }
  }

  return deltas;
}

export function applyVehicleMove(
  state: PatrolEscapeState,
  vehicleId: string,
  delta: number,
): PatrolEscapeState {
  if (!Number.isInteger(delta) || delta === 0) return state;
  if (!getLegalDeltas(state, vehicleId).includes(delta)) return state;

  return {
    ...state,
    moves: state.moves + Math.abs(delta),
    vehicles: state.vehicles.map((vehicle) =>
      vehicle.id === vehicleId
        ? {
            ...vehicle,
            row: vehicle.row + (vehicle.orientation === "vertical" ? delta : 0),
            col: vehicle.col + (vehicle.orientation === "horizontal" ? delta : 0),
          }
        : vehicle,
    ),
  };
}

export function isPatrolEscapeSolved(state: PatrolEscapeState) {
  const police = state.vehicles.find((vehicle) => vehicle.id === PATROL_ESCAPE_TARGET_ID);
  return Boolean(
    police &&
      police.orientation === "horizontal" &&
      police.row === 2 &&
      police.col + police.length === PATROL_ESCAPE_BOARD_SIZE,
  );
}

function encodeState(state: PatrolEscapeState) {
  return state.vehicles.map((vehicle) => `${vehicle.id}:${vehicle.row}:${vehicle.col}`).join("|");
}

export function solvePatrolEscape(
  initialState: PatrolEscapeState,
  maximumStates = 75_000,
): PatrolEscapeMove[] {
  if (isPatrolEscapeSolved(initialState)) return [];

  const queue: { state: PatrolEscapeState; moves: PatrolEscapeMove[] }[] = [
    { state: initialState, moves: [] },
  ];
  const visited = new Set([encodeState(initialState)]);

  for (let cursor = 0; cursor < queue.length && visited.size <= maximumStates; cursor += 1) {
    const current = queue[cursor];

    for (const vehicle of current.state.vehicles) {
      const singleStepDeltas = getLegalDeltas(current.state, vehicle.id).filter(
        (delta) => Math.abs(delta) === 1,
      );

      for (const delta of singleStepDeltas) {
        const nextState = applyVehicleMove(current.state, vehicle.id, delta);
        const key = encodeState(nextState);
        if (visited.has(key)) continue;

        const moves = [...current.moves, { vehicleId: vehicle.id, delta }];
        if (isPatrolEscapeSolved(nextState)) return moves;

        visited.add(key);
        queue.push({ state: nextState, moves });
      }
    }
  }

  return [];
}

export function getPatrolEscapeHint(state: PatrolEscapeState) {
  return solvePatrolEscape(state)[0] ?? null;
}

export function getPatrolEscapeStars(moves: number, par: number) {
  if (moves <= par) return 3;
  if (moves <= par + 3) return 2;
  return 1;
}
