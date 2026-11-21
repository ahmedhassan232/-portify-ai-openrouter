import { PortfolioRoot } from "@/components/portfolio/root";
import { Avatar, ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "cards", projects: "grid", skills: "columns", education: "cards" };
const S = { section: "my-5 rounded-3xl bg-pf-card p-6 sm:p-8", h2: "mb-5 font-pfh text-2xl font-semibold" };
export function ModernBusiness(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <main className={`mx-auto px-5 py-10 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
        <header className="grid items-center gap-8 py-6 md:grid-cols-2">
          <div>
            <p dir="auto" className="font-medium text-pf-accent">{pi.jobTitle}</p>
            <h1 dir="auto" className="mt-2 font-pfh text-4xl font-bold leading-tight sm:text-6xl">{pi.fullName}</h1>
            {c.data.professionalSummary && <p dir="auto" className="mt-5 text-lg text-pf-muted">{c.data.professionalSummary}</p>}
            <ContactList c={c} className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-pf-muted" />
          </div>
          <Avatar c={c} className="aspect-square w-full max-w-sm justify-self-center rounded-[2.5rem] text-7xl md:justify-self-end" />
        </header>
        {visibleKeys(c.data, c.settings).filter((k) => k !== "summary").map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="py-8" />
      </main>
    </PortfolioRoot>
  );
}
