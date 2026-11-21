import { PortfolioRoot } from "@/components/portfolio/root";
import { Avatar, ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "timeline", projects: "grid", skills: "grouped", education: "list" };
const SIDE = ["skills", "languages", "certifications", "additional"];
const S = { section: "py-6", h2: "mb-4 font-pfh text-xl font-semibold text-pf-accent" };
const SS = { section: "py-4", h2: "mb-3 text-xs font-semibold uppercase tracking-widest text-pf-muted" };
export function ProfessionalCorporate(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo, keys = visibleKeys(c.data, c.settings);
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <header className="bg-pf-fg text-pf-bg">
        <div className={`mx-auto flex items-center justify-between gap-6 px-5 py-10 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
          <div>
            <h1 dir="auto" className="font-pfh text-3xl font-bold sm:text-5xl">{pi.fullName}</h1>
            <p dir="auto" className="mt-2 text-lg opacity-80">{pi.jobTitle}</p>
          </div>
          <Avatar c={c} className="size-24 shrink-0 rounded-full border-2 border-pf-bg/40 text-2xl sm:size-32" />
        </div>
      </header>
      <div className={`mx-auto grid gap-10 px-5 py-8 lg:grid-cols-[1fr_280px] ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
        <main>{keys.filter((k) => !SIDE.includes(k)).map((k) => renderSection(k, c, V, S))}</main>
        <aside className="divide-y divide-pf-line rounded-2xl bg-pf-card p-5 lg:self-start">
          <ContactList c={c} className="space-y-1.5 pb-4 text-sm text-pf-muted" />
          {keys.filter((k) => SIDE.includes(k)).map((k) => renderSection(k, c, V, SS))}
        </aside>
      </div>
      <div className={`mx-auto px-5 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}><ContactBlock c={c} className="pb-10" /></div>
    </PortfolioRoot>
  );
}
