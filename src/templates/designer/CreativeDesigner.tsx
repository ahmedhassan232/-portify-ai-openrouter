import { PortfolioRoot } from "@/components/portfolio/root";
import { ContactBlock, TopNav, makeCtx, renderSection, visibleKeys, wrap, front, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "rows", projects: "gallery", skills: "chips", education: "list" };
const S = { section: "py-12", h2: "mb-8 font-pfh text-3xl font-black tracking-tight sm:text-5xl" };
export function CreativeDesigner(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  const keys = front(visibleKeys(c.data, c.settings).filter((k) => k !== "summary"), ["projects"]);
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <header className="relative overflow-hidden px-5 pb-16 pt-20 text-center">
        <div aria-hidden className="absolute start-1/2 top-0 -z-0 size-96 -translate-x-1/2 rounded-full bg-pf-accent/20 blur-3xl rtl:translate-x-1/2" />
        <div className="relative">
          <p dir="auto" className="text-sm font-medium uppercase tracking-[0.3em] text-pf-accent">{pi.jobTitle}</p>
          <h1 dir="auto" className="mx-auto mt-4 max-w-5xl font-pfh text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">{pi.fullName}</h1>
          {c.data.professionalSummary && <p dir="auto" className="mx-auto mt-6 max-w-2xl text-lg text-pf-muted">{c.data.professionalSummary}</p>}
        </div>
      </header>
      <main className={`mx-auto px-5 pb-10 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
        {keys.map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="py-10" />
      </main>
    </PortfolioRoot>
  );
}
