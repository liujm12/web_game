import type { CategoryRecord } from "@/lib/site-content";

type CategoryHeroProps = {
  category: CategoryRecord;
  gameCount: number;
};

export function CategoryHero({ category, gameCount }: CategoryHeroProps) {
  return (
    <section className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
        <span>Category spotlight</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 tracking-[0.18em] text-slate-300">
          {`${gameCount} quick games ready`}
        </span>
      </div>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
        {`${category.name} games for fast starts`}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
        {category.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-200">
          {category.highlight}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          Best when you want something simple and immediate
        </span>
      </div>
    </section>
  );
}
