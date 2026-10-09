"use client";

import { useCallback, useEffect, useSyncExternalStore, type ButtonHTMLAttributes, type ReactNode } from "react";

export function GameShell({ title, eyebrow, stats, children }: { title: string; eyebrow?: string; stats: string; children: ReactNode }) {
  return <section aria-label={title + " game"} className="min-w-0 rounded-[24px] border border-white/10 bg-slate-950 p-3 text-white sm:p-5">
    <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>{eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/70">{eyebrow}</p>}<h2 className="text-xl font-black sm:text-2xl">{title}</h2></div>
      <p className="text-xs font-semibold tabular-nums text-slate-300 sm:text-sm">{stats}</p>
    </header>
    {children}
  </section>;
}

export function ActionButton({ children, primary, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return <button type="button" {...props} className={["min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40", primary ? "border-cyan-200 bg-cyan-200 text-slate-950 hover:bg-cyan-100" : "border-white/15 bg-white/5 text-slate-100 hover:bg-white/10", className].join(" ")}>{children}</button>;
}

export function GameMessage({ children }: { children: ReactNode }) {
  return <p role="status" className="mt-3 text-sm leading-relaxed text-slate-300">{children}</p>;
}

function subscribeScore(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("turbo-best-score", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("turbo-best-score", callback);
  };
}

export function useBestScore(key: string): [number, (score: number) => void] {
  const read = useCallback(() => {
    try {
      const value = Number(window.localStorage.getItem("turbo-best:" + key));
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch { return 0; }
  }, [key]);
  const best = useSyncExternalStore(subscribeScore, read, () => 0);
  const record = useCallback((score: number) => {
    if (!Number.isFinite(score) || score <= read()) return;
    try {
      window.localStorage.setItem("turbo-best:" + key, String(score));
      window.dispatchEvent(new Event("turbo-best-score"));
    } catch {}
  }, [key, read]);
  return [best, record];
}

export function useGameKeys(handler: (key: string) => boolean, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.altKey || event.ctrlKey || event.metaKey || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || (target instanceof HTMLElement && target.isContentEditable)) return;
      if (handler(event.key)) event.preventDefault();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handler, enabled]);
}

export function formatGameTime(seconds: number) {
  return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
}
