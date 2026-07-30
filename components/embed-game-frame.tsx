"use client";

type EmbedGameFrameProps = {
  title: string;
  gameUrl: string;
};

export function EmbedGameFrame({ title, gameUrl }: EmbedGameFrameProps) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/85 shadow-[0_30px_80px_rgba(8,15,35,0.38)]">
      <div className="hidden border-b border-white/10 px-5 py-4 sm:block">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
          Instant play
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Game opens in the frame below without leaving TurboArcade.
        </p>
      </div>
      <div
        aria-label={`${title} play area`}
        className="h-[min(82vh,780px)] min-h-[680px] bg-slate-950 max-sm:h-[calc(100svh-150px)] max-sm:min-h-[520px]"
      >
        <iframe
          title={`Play ${title}`}
          src={gameUrl}
          className="h-full w-full border-0"
          scrolling="no"
          loading="lazy"
          allow="fullscreen; autoplay"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
