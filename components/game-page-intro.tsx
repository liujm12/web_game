import type { GameRecord } from "@/lib/site-content";

type GamePageIntroProps = {
  game: GameRecord;
};

const quickSignals = [
  "Easy to learn",
  "Short rounds",
  "Original play page",
];

export function GamePageIntro({ game }: GamePageIntroProps) {
  const categoryLabel =
    game.category.charAt(0).toUpperCase() + game.category.slice(1);

  return (
    <div
      className={`rounded-[36px] border border-white/10 bg-gradient-to-br ${game.heroGradient} p-8 text-slate-950`}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900/70">
        <span>{`${categoryLabel} / ${game.estimatedSession}`}</span>
        <span className="rounded-full bg-slate-950/10 px-3 py-1 tracking-[0.18em] text-slate-900/80">
          {game.playersLabel}
        </span>
      </div>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">{game.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-900/80">
        {game.description}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        {quickSignals.map((signal) => (
          <span
            key={signal}
            className="rounded-full border border-slate-900/10 bg-white/30 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {signal}
          </span>
        ))}
        <span className="rounded-full border border-slate-900/10 bg-white/30 px-4 py-2 text-sm font-semibold text-slate-950">
          {game.playMode === "embed" ? "Embedded game room" : "Native browser game"}
        </span>
      </div>
    </div>
  );
}
