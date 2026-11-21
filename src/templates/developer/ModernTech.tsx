import { PortfolioRoot } from "@/components/portfolio/root";
import { Avatar, ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "timeline", projects: "grid", skills: "grouped", education: "cards" };
const SIDE = ["skills", "languages", "certifications"];
const S = { section: "py-6", h2: "mb-5 font-pfh text-2xl font-semibold" };
const SS = { section: "rounded-2xl border border-pf-line bg-pf-card p-5", h2: "mb-3 font-pfh text-sm font-semibold uppercase tracking-wide text-pf-muted" };
export function ModernTech(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo, keys = visibleKeys(c.data, c.settings);
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <div className={`mx-auto grid gap-8 px-5 py-10 lg:grid-cols-[300px_1fr] ${wrap(c.settings, "max-w-5xl", "max-w-6xl")}`}>
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-pf-line bg-pf-card p-6 text-center">
            <Avatar c={c} className="mx-auto size-28 rounded-full text-3xl" />
            <h1 dir="auto" className="mt-4 font-pfh text-2xl font-bold">{pi.fullName}</h1>
            <p dir="auto" className="mt-1 text-pf-accent">{pi.jobTitle}</p>
            <ContactList c={c} className="mt-4 space-y-1.5 text-sm text-pf-muted" />
          </div>
          {keys.filter((k) => SIDE.includes(k)).map((k) => renderSection(k, c, V, SS))}
        </aside>
        <main>{keys.filter((k) => !SIDE.includes(k)).map((k) => renderSection(k, c, V, S))}<ContactBlock c={c} className="py-8" /></main>
      </div>
    </PortfolioRoot>
  );
}
