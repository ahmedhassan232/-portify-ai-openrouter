import { PortfolioRoot } from "@/components/portfolio/root";
import { ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "rows", projects: "list", skills: "columns", education: "rows" };
const S = { section: "border-t border-pf-line py-8", h2: "mb-5 font-pfh text-sm font-semibold uppercase tracking-[0.2em] text-pf-muted" };
export function ExecutivePortfolio(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <main className={`mx-auto px-5 py-12 ${wrap(c.settings, "max-w-3xl", "max-w-5xl")}`}>
        <header className="border-b-2 border-pf-fg pb-6">
          <h1 dir="auto" className="font-pfh text-4xl font-semibold tracking-tight sm:text-5xl">{pi.fullName}</h1>
          <p dir="auto" className="mt-2 font-pfh text-xl text-pf-accent">{pi.jobTitle}</p>
          <ContactList c={c} className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-pf-muted" />
        </header>
        {visibleKeys(c.data, c.settings).map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="border-t border-pf-line py-8" />
      </main>
    </PortfolioRoot>
  );
}
