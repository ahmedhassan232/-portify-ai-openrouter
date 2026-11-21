import { PortfolioRoot } from "@/components/portfolio/root";
import { Avatar, ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";
import { skillCount } from "@/lib/portfolio";

const V: Variants = { experience: "timeline", projects: "grid", skills: "grouped", education: "list" };
const MAIN = ["summary", "experience", "projects"];
const S = { section: "py-6", h2: "mb-4 border-s-4 border-pf-accent ps-3 font-pfh text-xl font-semibold" };
export function CorporateMarketer(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo, keys = visibleKeys(c.data, c.settings);
  const stats = [[c.data.experience.length, "portfolio.statRoles"], [c.data.projects.length, "portfolio.statProjects"], [skillCount(c.data), "portfolio.statSkills"]] as const;
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <header className="bg-pf-accent text-pf-on">
        <div className={`mx-auto flex flex-col items-center gap-6 px-5 pb-16 pt-12 sm:flex-row ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
          <Avatar c={c} className="size-28 shrink-0 rounded-2xl border-4 border-white/30 text-3xl" />
          <div className="text-center sm:text-start">
            <h1 dir="auto" className="font-pfh text-3xl font-bold sm:text-5xl">{pi.fullName}</h1>
            <p dir="auto" className="mt-1 text-lg opacity-90">{pi.jobTitle}</p>
            <ContactList c={c} className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm opacity-90 sm:justify-start" />
          </div>
        </div>
      </header>
      <div className={`mx-auto -mt-8 px-5 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-pf-line bg-pf-card p-4 shadow-lg">
          {stats.map(([n, k]) => <div key={k} className="text-center"><p className="font-pfh text-3xl font-bold tabular-nums text-pf-accent">{n}</p><p className="text-xs text-pf-muted">{c.t(k)}</p></div>)}
        </div>
        <div className="grid gap-8 py-8 lg:grid-cols-[1.6fr_1fr]">
          <main>{keys.filter((k) => MAIN.includes(k)).map((k) => renderSection(k, c, V, S))}</main>
          <aside>{keys.filter((k) => !MAIN.includes(k)).map((k) => renderSection(k, c, V, S))}</aside>
        </div>
        <ContactBlock c={c} className="pb-10" />
      </div>
    </PortfolioRoot>
  );
}
