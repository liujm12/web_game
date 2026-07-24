"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";

import type { GameRecord, SiteContent } from "@/lib/site-content";

type AdminDashboardProps = {
  initialContent: SiteContent;
};

export function AdminDashboard({ initialContent }: AdminDashboardProps) {
  const [content, setContent] = useState(initialContent);
  const [search, setSearch] = useState("");
  const [statusMessage, setStatusMessage] = useState("Local JSON storage ready.");
  const deferredSearch = useDeferredValue(search);

  const filteredGames = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    if (!term) return content.games;

    return content.games.filter((game) =>
      `${game.title} ${game.category} ${game.tags.join(" ")}`
        .toLowerCase()
        .includes(term),
    );
  }, [content.games, deferredSearch]);

  function patchGame(slug: string, patch: Partial<GameRecord>) {
    setContent((current) => ({
      ...current,
      games: current.games.map((game) =>
        game.slug === slug ? { ...game, ...patch } : game,
      ),
    }));
  }

  async function saveGame(game: GameRecord) {
    setStatusMessage(`Saving ${game.title}...`);

    startTransition(async () => {
      const response = await fetch("/api/site-content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: game.slug,
          patch: {
            summary: game.summary,
            trendingScore: game.trendingScore,
            featured: game.featured,
            status: game.status,
          },
        }),
      });

      setStatusMessage(
        response.ok
          ? `${game.title} saved to data/site-content.json`
          : `Could not save ${game.title}.`,
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-900/75 p-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">
            Basic backend
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">TurboArcade Admin</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            This dashboard edits the local JSON content store, so you can change
            featured status, ranking score, live state, and summary copy without
            touching React files.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            For phase one, keep every game in `data/site-content.json`, decide
            whether it is `internal` or `embed`, and add AdSense slot IDs only
            after your account is approved.
          </p>
        </div>
        <div className="flex items-end">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-0 lg:w-64"
          />
        </div>
      </div>

      <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm text-cyan-100">
        {statusMessage}
      </div>

      <div className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-900/70 p-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-orange-200/70">
            Publish flow
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>1. Duplicate a game entry in `data/site-content.json`.</li>
            <li>2. Set `playMode` to `internal` or `embed`.</li>
            <li>3. If embedded, add a hosted `gameUrl`.</li>
            <li>4. Switch the game to `live` and optionally `featured`.</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">
            AdSense checklist
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>Set `NEXT_PUBLIC_ADSENSE_CLIENT` in production.</li>
            <li>Fill `site.adSlots` with the real slot IDs.</li>
            <li>Check `/ads.txt` after deployment.</li>
            <li>Keep each game page descriptive before review.</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredGames.map((game) => (
          <section
            key={game.slug}
            className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-900/70 p-6 xl:grid-cols-[1.2fr_0.7fr]"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  {game.slug}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {game.title}
                </h2>
              </div>
              <textarea
                value={game.summary}
                onChange={(event) =>
                  patchGame(game.slug, { summary: event.target.value })
                }
                className="min-h-28 w-full rounded-[24px] border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-7 text-slate-100"
              />
            </div>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-slate-300">
                Trending score
                <input
                  type="number"
                  value={game.trendingScore}
                  onChange={(event) =>
                    patchGame(game.slug, {
                      trendingScore: Number(event.target.value) || 0,
                    })
                  }
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                Featured game
                <input
                  type="checkbox"
                  checked={game.featured}
                  onChange={(event) =>
                    patchGame(game.slug, { featured: event.target.checked })
                  }
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                Status
                <select
                  value={game.status}
                  onChange={(event) =>
                    patchGame(game.slug, {
                      status: event.target.value as GameRecord["status"],
                    })
                  }
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
                >
                  <option value="live">Live</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => saveGame(game)}
                className="rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950"
              >
                Save game
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
