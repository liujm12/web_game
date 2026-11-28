"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { EmbedGameFrame } from "@/components/embed-game-frame";
import { GamePlayer } from "@/components/game-player";
import {
  parseSoundEnabled,
  playGameSound,
  readSoundSnapshot,
  SOUND_PREFERENCE_EVENT,
  toggleSoundEnabled,
} from "@/lib/game-sound";
import type { GameRecord } from "@/lib/site-content";

type GameSurfaceProps = {
  game: GameRecord;
};

function subscribeSound(callback: () => void) {
  window.addEventListener(SOUND_PREFERENCE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SOUND_PREFERENCE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function GameSurface({ game }: GameSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);

  const soundSnapshot = useSyncExternalStore(
    subscribeSound,
    readSoundSnapshot,
    () => "on",
  );
  const soundEnabled = parseSoundEnabled(soundSnapshot);
  const isFullscreen = nativeFullscreen || fallbackFullscreen;
  const isEmbed = game.playMode === "embed" && Boolean(game.gameUrl);

  useEffect(() => {
    function handleFullscreenChange() {
      setNativeFullscreen(document.fullscreenElement === containerRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!fallbackFullscreen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFallbackFullscreen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fallbackFullscreen]);

  const handleToggleFullscreen = useCallback(async () => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    if (document.fullscreenElement === element) {
      try {
        await document.exitFullscreen?.();
      } catch {
        setNativeFullscreen(false);
      }
      return;
    }

    if (fallbackFullscreen) {
      setFallbackFullscreen(false);
      return;
    }

    if (typeof element.requestFullscreen === "function") {
      try {
        await element.requestFullscreen();
        return;
      } catch {
        setFallbackFullscreen(true);
        return;
      }
    }

    setFallbackFullscreen(true);
  }, [fallbackFullscreen]);

  function handleToggleSound() {
    const nextEnabled = toggleSoundEnabled();
    if (nextEnabled) {
      playGameSound("start");
    }
  }

  return (
    <div
      ref={containerRef}
      data-game-surface-root="true"
      data-fullscreen={isFullscreen ? "true" : "false"}
      className={
        fallbackFullscreen
          ? "fixed inset-0 z-50 flex flex-col justify-between gap-3 overflow-y-auto bg-slate-950 p-3 sm:p-6"
          : nativeFullscreen
            ? "flex min-h-screen flex-col justify-between gap-3 overflow-y-auto bg-slate-950 p-4 sm:p-6"
            : "space-y-3"
      }
    >
      <div className={isFullscreen ? "mx-auto w-full max-w-5xl" : undefined}>
        {isEmbed && game.gameUrl ? (
          <EmbedGameFrame title={game.title} gameUrl={game.gameUrl} />
        ) : (
          <GamePlayer componentKey={game.componentKey} />
        )}
      </div>
      <div
        role="toolbar"
        aria-label={`${game.title} display and audio controls`}
        className={`flex flex-wrap items-center justify-between gap-2 rounded-[20px] border border-cyan-100/12 bg-[#0a0d18]/90 px-4 py-2.5 text-xs ${
          isFullscreen ? "mx-auto w-full max-w-5xl" : ""
        }`}
      >
        <p className="font-semibold text-slate-400">
          {isFullscreen
            ? `Fullscreen mode · Press Esc or click Exit fullscreen to return`
            : `Display & sound controls`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {!isEmbed ? (
            <button
              type="button"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`rounded-full px-3.5 py-1.5 font-black transition ${
                soundEnabled
                  ? "border border-cyan-300/30 bg-cyan-300/15 text-cyan-100 hover:bg-cyan-300/25"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {soundEnabled ? "Sound: On" : "Sound: Off"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-pressed={isFullscreen}
            className={`rounded-full px-3.5 py-1.5 font-black transition ${
              isFullscreen
                ? "bg-orange-300 text-orange-950 hover:bg-orange-200"
                : "border border-white/10 bg-white/5 text-white hover:border-cyan-200/30 hover:bg-cyan-300/10"
            }`}
          >
            {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>
    </div>
  );
}
