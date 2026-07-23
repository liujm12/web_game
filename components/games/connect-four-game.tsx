"use client";

import { useMemo, useState } from "react";

const columns = 7;
const rows = 6;
const playerColors = {
  red: "bg-rose-400",
  yellow: "bg-amber-300",
} as const;

type CellValue = null | "red" | "yellow";

function createBoard() {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => null as CellValue));
}

function checkWinner(board: CellValue[][], player: "red" | "yellow") {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (board[row][column] !== player) {
        continue;
      }

      for (const [rowStep, columnStep] of directions) {
        let count = 1;

        while (count < 4) {
          const nextRow = row + rowStep * count;
          const nextColumn = column + columnStep * count;

          if (
            nextRow < 0 ||
            nextRow >= rows ||
            nextColumn < 0 ||
            nextColumn >= columns ||
            board[nextRow][nextColumn] !== player
          ) {
            break;
          }

          count += 1;
        }

        if (count === 4) {
          return true;
        }
      }
    }
  }

  return false;
}

export function ConnectFourGame() {
  const [board, setBoard] = useState<CellValue[][]>(() => createBoard());
  const [turn, setTurn] = useState<"red" | "yellow">("red");
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [winner, setWinner] = useState<null | "red" | "yellow">(null);

  const openColumns = useMemo(
    () => board[0].map((cell, index) => ({ index, open: cell === null })),
    [board],
  );

  function startGame() {
    setBoard(createBoard());
    setTurn("red");
    setWinner(null);
    setPhase("playing");
  }

  function dropInColumn(columnIndex: number) {
    if (phase !== "playing") {
      return;
    }

    const nextBoard = board.map((line) => [...line]);

    for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex -= 1) {
      if (nextBoard[rowIndex][columnIndex] !== null) {
        continue;
      }

      nextBoard[rowIndex][columnIndex] = turn;
      setBoard(nextBoard);

      if (checkWinner(nextBoard, turn)) {
        setWinner(turn);
        setPhase("over");
      } else {
        setTurn((currentTurn) => (currentTurn === "red" ? "yellow" : "red"));
      }

      return;
    }
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-rose-200/70">
            Four in a row
          </p>
          <p className="text-xl font-semibold">
            {winner ? `Winner: ${winner === "red" ? "Red" : "Yellow"}` : `Turn: ${turn === "red" ? "Red" : "Yellow"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-rose-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          New match
        </button>
      </div>
      <div className="mb-3 grid grid-cols-7 gap-2">
        {openColumns.map((column) => (
          <button
            key={column.index}
            type="button"
            onClick={() => dropInColumn(column.index)}
            disabled={!column.open}
            className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs font-semibold text-slate-200 disabled:opacity-40"
          >
            Drop
          </button>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 rounded-[24px] border border-white/10 bg-blue-500/20 p-3">
        {board.flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={`aspect-square rounded-full border border-white/10 ${
                cell ? playerColors[cell] : "bg-slate-900/70"
              }`}
            />
          )),
        )}
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {phase === "idle" && "Drop four in a row before the other side does."}
        {phase === "playing" && "Tap a column to drop your chip and build horizontal, vertical, or diagonal fours."}
        {phase === "over" && "Match over. Start a new one and try a different column pattern."}
      </div>
    </div>
  );
}
