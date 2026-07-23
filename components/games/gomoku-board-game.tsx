"use client";

import { useState } from "react";

const boardSize = 15;

type Stone = null | "black" | "white";

function createBoard() {
  return Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => null as Stone),
  );
}

function hasFiveInRow(board: Stone[][], row: number, column: number, stone: "black" | "white") {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  return directions.some(([rowStep, columnStep]) => {
    let count = 1;

    for (const direction of [-1, 1]) {
      let nextRow = row + rowStep * direction;
      let nextColumn = column + columnStep * direction;

      while (
        nextRow >= 0 &&
        nextRow < boardSize &&
        nextColumn >= 0 &&
        nextColumn < boardSize &&
        board[nextRow][nextColumn] === stone
      ) {
        count += 1;
        nextRow += rowStep * direction;
        nextColumn += columnStep * direction;
      }
    }

    return count >= 5;
  });
}

export function GomokuBoardGame() {
  const [board, setBoard] = useState<Stone[][]>(() => createBoard());
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [turn, setTurn] = useState<"black" | "white">("black");
  const [winner, setWinner] = useState<null | "black" | "white">(null);

  function startBoard() {
    setBoard(createBoard());
    setPhase("playing");
    setTurn("black");
    setWinner(null);
  }

  function placeStone(row: number, column: number) {
    if (phase !== "playing" || board[row][column] !== null) {
      return;
    }

    const nextBoard = board.map((line) => [...line]);
    nextBoard[row][column] = turn;
    setBoard(nextBoard);

    if (hasFiveInRow(nextBoard, row, column, turn)) {
      setWinner(turn);
      setPhase("over");
      return;
    }

    setTurn((currentTurn) => (currentTurn === "black" ? "white" : "black"));
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-stone-200/70">
            Standard gomoku
          </p>
          <p className="text-xl font-semibold">
            {winner
              ? `Winner: ${winner === "black" ? "Black" : "White"}`
              : `Turn: ${turn === "black" ? "Black" : "White"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={startBoard}
          className="rounded-full bg-stone-200 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          New board
        </button>
      </div>
      <div className="mx-auto max-w-[760px] rounded-[24px] border border-amber-100/15 bg-[linear-gradient(180deg,rgba(251,191,36,0.18),rgba(120,53,15,0.22))] p-3">
        <div
          className="grid gap-px rounded-[18px] bg-amber-950/40"
          style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
        >
          {board.flatMap((row, rowIndex) =>
            row.map((cell, columnIndex) => (
              <button
                key={`${rowIndex}-${columnIndex}`}
                type="button"
                data-gomoku-cell="true"
                onClick={() => placeStone(rowIndex, columnIndex)}
                className="relative aspect-square bg-[rgba(245,158,11,0.07)] transition hover:bg-[rgba(245,158,11,0.14)]"
              >
                <span className="absolute inset-0 flex items-center justify-center">
                  {cell ? (
                    <span
                      className={`h-[68%] w-[68%] rounded-full ${
                        cell === "black"
                          ? "bg-slate-950 shadow-[0_4px_14px_rgba(15,23,42,0.45)]"
                          : "bg-stone-100 shadow-[0_4px_14px_rgba(255,255,255,0.3)]"
                      }`}
                    />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-100/30" />
                  )}
                </span>
              </button>
            )),
          )}
        </div>
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {phase === "idle" && "Place five stones in a row on a standard board."}
        {phase === "playing" &&
          "Take turns placing black and white stones. Connect five horizontally, vertically, or diagonally."}
        {phase === "over" && "Board decided. Start a fresh game and play another sequence."}
      </div>
    </div>
  );
}
