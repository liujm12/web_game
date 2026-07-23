type AdSlotProps = {
  label: string;
  className?: string;
};

export function AdSlot({ label, className = "" }: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (adsenseClient) {
    return (
      <div
        className={`rounded-3xl border border-white/10 bg-slate-950/60 p-4 ${className}`}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
          Sponsored
        </p>
        <ins
          className="adsbygoogle block min-h-32 rounded-2xl bg-slate-900/60"
          data-ad-client={adsenseClient}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-ad-slot="1234567890"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-32 flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-300/40 bg-cyan-400/10 p-4 text-center ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/70">
        Ad Placeholder
      </p>
      <p className="mt-3 text-sm text-slate-200">{label}</p>
      <p className="mt-2 max-w-sm text-xs text-slate-400">
        Connect Google AdSense by setting `NEXT_PUBLIC_ADSENSE_CLIENT` before
        production launch.
      </p>
    </div>
  );
}
