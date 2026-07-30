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
      className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${game.heroGradient} p-5 text-slate-950 sm:rounded-[36px] sm:p-8`}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900/70">
        <span>{`${categoryLabel} / ${game.estimatedSession}`}</span>
        <span className="rounded-full bg-slate-950/10 px-3 py-1 tracking-[0.18em] text-slate-900/80">
          {game.playersLabel}
        </span>
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:mt-4 sm:text-5xl">
        {game.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-900/80 sm:mt-4 sm:text-lg sm:leading-8">
        {game.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
        {quickSignals.map((signal) => (
          <span
            key={signal}
            className="rounded-full border border-slate-900/10 bg-white/30 px-3 py-1.5 text-xs font-semibold text-slate-950 sm:px-4 sm:py-2 sm:text-sm"
          >
            {signal}
          </span>
        ))}
        <span className="rounded-full border border-slate-900/10 bg-white/30 px-3 py-1.5 text-xs font-semibold text-slate-950 sm:px-4 sm:py-2 sm:text-sm">
          {game.playMode === "embed" ? "Embedded game room" : "Native browser game"}
        </span>
      </div>
    </div>
  );
}
