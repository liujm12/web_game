import { patrolEscapeLevels } from "@/data/patrol-escape-levels";
import type { PatrolEscapeVehicle } from "@/lib/patrol-escape";

const vehicleColors: Record<PatrolEscapeVehicle["color"], string> = {
  police: "border-sky-100 bg-gradient-to-br from-sky-200 via-white to-sky-400 text-slate-950",
  blue: "border-cyan-100/60 bg-gradient-to-br from-cyan-300 to-blue-600 text-white",
  amber: "border-amber-100/60 bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950",
  green: "border-lime-100/60 bg-gradient-to-br from-lime-300 to-emerald-600 text-slate-950",
  rose: "border-rose-100/60 bg-gradient-to-br from-rose-300 to-red-600 text-white",
  violet: "border-violet-100/60 bg-gradient-to-br from-violet-300 to-purple-700 text-white",
  slate: "border-slate-100/60 bg-gradient-to-br from-slate-300 to-slate-600 text-slate-950",
};

export function PatrolEscapeBoardDiagram({ levelId }: { levelId: number }) {
  const level = patrolEscapeLevels.find((candidate) => candidate.id === levelId);
  if (!level) return null;

  return (
    <figure className="rounded-[24px] border border-cyan-200/12 bg-slate-950/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-black text-white">Level {level.id}: {level.title}</h3>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">{level.difficulty} · Par {level.par}</p>
      </div>
      <div
        role="img"
        aria-label={`Initial layout for Patrol Escape level ${level.id}, ${level.title}`}
        data-patrol-level={level.id}
        className="relative mt-4 aspect-square overflow-hidden rounded-[20px] border-4 border-slate-600 bg-[#182434] shadow-inner"
      >
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6" aria-hidden="true">
          {Array.from({ length: 36 }, (_, index) => <span key={index} className="border border-white/[0.055]" />)}
        </div>
        <div className="pointer-events-none absolute -right-px top-[33.333%] h-[16.667%] w-[8%] bg-cyan-300/75 shadow-[0_0_20px_rgba(103,232,249,0.65)]" aria-hidden="true" />
        <span className="pointer-events-none absolute right-2 top-[29%] text-[8px] font-black uppercase tracking-widest text-cyan-100 sm:text-[10px]">Exit</span>
        {level.vehicles.map((vehicle) => {
          const width = vehicle.orientation === "horizontal" ? vehicle.length * (100 / 6) : 100 / 6;
          const height = vehicle.orientation === "vertical" ? vehicle.length * (100 / 6) : 100 / 6;
          const label = vehicle.color === "police" ? "POLICE" : vehicle.length === 3 ? "TRUCK" : "CAR";

          return (
            <div
              key={vehicle.id}
              title={vehicle.label}
              className={`absolute z-10 flex items-center justify-center rounded-[12px] border-2 text-[7px] font-black tracking-[0.08em] shadow-[0_5px_12px_rgba(2,6,23,0.45)] sm:rounded-[16px] sm:text-[10px] ${vehicleColors[vehicle.color]}`}
              style={{
                left: `${vehicle.col * (100 / 6)}%`,
                top: `${vehicle.row * (100 / 6)}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >
              <span className="absolute inset-[10%] rounded-[28%] border border-white/35 bg-black/10" />
              <span className="relative z-10">{label}</span>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-3 text-xs leading-6 text-slate-400">
        Initial board generated from the same level data used by the playable game. Vehicle positions are not reconstructed from memory.
      </figcaption>
    </figure>
  );
}
