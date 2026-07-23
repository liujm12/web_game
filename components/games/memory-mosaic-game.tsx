"use client";

import { useMemo, useState } from "react";

const icons = ["🎯", "🕹", "⚡", "🛸", "🎲", "🎵"];

type CardRecord = {
  id: number;
  icon: string;
};

function shuffleCards() {
  return [...icons, ...icons]
    .map((icon, index) => ({ id: index + 1, icon }))
    .sort(() => Math.random() - 0.5);
}

export function MemoryMosaicGame() {
  const [cards, setCards] = useState<CardRecord[]>(() => shuffleCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const isComplete = matched.length === icons.length;
  const flippedSet = useMemo(() => new Set(flipped), [flipped]);

  function resetGame() {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }

  function handleFlip(card: CardRecord) {
    if (flippedSet.has(card.id) || matched.includes(card.icon) || flipped.length === 2) {
      return;
    }

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((current) => current + 1);
      const [firstId, secondId] = nextFlipped;
      const first = cards.find((entry) => entry.id === firstId);
      const second = cards.find((entry) => entry.id === secondId);

      if (first?.icon === second?.icon) {
        window.setTimeout(() => {
          setMatched((current) => [...current, card.icon]);
          setFlipped([]);
        }, 250);
      } else {
        window.setTimeout(() => setFlipped([]), 600);
      }
    }
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/70">
            Memory game
          </p>
          <p className="text-xl font-semibold">Moves: {moves}</p>
        </div>
        <button
          type="button"
          onClick={resetGame}
          className="rounded-full bg-fuchsia-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Shuffle board
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((card) => {
          const isOpen = flippedSet.has(card.id) || matched.includes(card.icon);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card)}
              className={`aspect-square rounded-[24px] border text-3xl transition ${
                isOpen
                  ? "border-fuchsia-300/30 bg-fuchsia-300/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              {isOpen ? card.icon : "?"}
            </button>
          );
        })}
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {isComplete
          ? `Board clear in ${moves} moves. Hit shuffle and try to beat your best.`
          : "Flip two tiles at a time and remember where each icon appeared."}
      </div>
    </div>
  );
}
