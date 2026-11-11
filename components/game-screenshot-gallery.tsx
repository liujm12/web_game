import Image from "next/image";

import { getGameScreenshots } from "@/data/game-screenshots";

type GameScreenshotGalleryProps = {
  gameSlug: string;
  gameTitle: string;
};

const stateLabels = {
  start: "Start state",
  progress: "In progress",
  success: "Successful run",
  failure: "Recovery / failure",
  master: "Master layout",
} as const;

export function GameScreenshotGallery({ gameSlug, gameTitle }: GameScreenshotGalleryProps) {
  const screenshots = getGameScreenshots(gameSlug);
  if (!screenshots.length) return null;

  return (
    <section
      data-game-screenshot-gallery={gameSlug}
      className="rounded-[28px] border border-cyan-100/12 bg-[#0a0d18]/88 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.38)] sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
        Real play evidence
      </p>
      <h2 className="mt-3 text-2xl font-black text-white">
        {gameTitle} gameplay evidence
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
        Captured from the playable game in this page, these images document real start,
        progress, success, and recovery states across desktop and mobile layouts.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {screenshots.map((screenshot, index) => (
          <figure
            key={screenshot.src}
            className="overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/70"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100/75">
              <span>{screenshot.device}</span>
              <span>{stateLabels[screenshot.state]}</span>
            </div>
            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              width={screenshot.width}
              height={screenshot.height}
              sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 50vw, 520px"
              className="h-auto w-full bg-[#07101c] object-contain"
              loading={index === 0 ? "eager" : "lazy"}
              unoptimized
            />
            <figcaption className="border-t border-white/10 px-4 py-4 text-sm leading-6 text-slate-300">
              {screenshot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
