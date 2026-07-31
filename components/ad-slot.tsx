"use client";

import { useEffect, useId, useRef } from "react";

import { getAdsenseClient } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  label: string;
  className?: string;
  slot?: string;
};

export function AdSlot({ label, className = "", slot = "" }: AdSlotProps) {
  const adsenseClient = getAdsenseClient();
  const adElementId = useId().replace(/:/g, "");
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!adsenseClient || !slot || requestedRef.current) {
      return;
    }

    const adElement = document.getElementById(adElementId);

    if (!adElement) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      requestedRef.current = true;
      adElement.setAttribute("data-ad-status", "filled");
    } catch {
      adElement.setAttribute("data-ad-status", "pending");
    }
  }, [adElementId, adsenseClient, slot]);

  if (adsenseClient && slot) {
    return (
      <div
        className={`rounded-3xl border border-white/10 bg-slate-950/60 p-4 ${className}`}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
          Sponsored
        </p>
        <ins
          id={adElementId}
          className="adsbygoogle block min-h-32 rounded-2xl bg-slate-900/60"
          data-ad-client={adsenseClient}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-ad-slot={slot}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-32 flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-300/40 bg-cyan-400/10 p-4 text-center ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/70">
        Sponsored
      </p>
      <p className="mt-3 text-sm text-slate-200">{label}</p>
      <p className="mt-2 max-w-sm text-xs text-slate-400">
        Advertising space reserved for future display ads.
      </p>
    </div>
  );
}
