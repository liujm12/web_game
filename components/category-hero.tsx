import type { CategoryRecord } from "@/lib/site-content";

type CategoryHeroProps = {
  category: CategoryRecord;
  gameCount: number;
};

export function CategoryHero({ category, gameCount }: CategoryHeroProps) {
  return (
    <section className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
        <span>Category spotlight</span>
        <span aria-hidden="true" className="text-orange-200/50">/</span>
        <span className="tracking-[0.18em] text-slate-300">{`${gameCount} quick games ready`}</span>
      </div>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
        {`${category.name} games for fast starts`}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
        {category.description}
      </p>
      <ul aria-label="Category details" className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
        <li className="flex items-start gap-3 text-cyan-100">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-cyan-300" />
          <span className="font-semibold">{category.highlight}</span>
        </li>
        <li className="flex items-start gap-3 text-slate-300">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-orange-300" />
          <span>Best when you want something simple and immediate</span>
        </li>
      </ul>
    </section>
  );
}
