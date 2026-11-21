import { PortfolioRoot } from "@/components/portfolio/root";
import { ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, front, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "cards", projects: "feature", skills: "chips", education: "rows" };
const S = { section: "py-10", h2: "mb-6 font-pfh text-3xl font-extrabold tracking-tight" };
export function GrowthSpecialist(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  const keys = front(visibleKeys(c.data, c.settings).filter((k) => k !== "summary"), ["experience", "skills"]);
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <header className={`mx-auto px-5 pb-10 pt-16 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
        <p dir="auto" className="inline-block rounded-full bg-pf-accent/10 px-4 py-1 text-sm font-semibold text-pf-accent">{pi.jobTitle}</p>
        <h1 dir="auto" className="mt-5 font-pfh text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          {c.t("portfolio.hello")} <span className="rounded-lg bg-pf-accent px-3 text-pf-on">{pi.fullName}</span>
        </h1>
        {c.data.professionalSummary && <p dir="auto" className="mt-6 max-w-3xl text-xl text-pf-muted">{c.data.professionalSummary}</p>}
        <ContactList c={c} className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium" />
      </header>
      <main className={`mx-auto px-5 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
        {keys.map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="py-10" />
      </main>
    </PortfolioRoot>
  );
}
