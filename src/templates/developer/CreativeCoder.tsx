import { PortfolioRoot } from "@/components/portfolio/root";
import { ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, front, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "cards", projects: "bento", skills: "grouped", education: "cards" };
const S = { section: "py-8", h2: "mb-5 flex items-center gap-3 font-pfm text-xl font-semibold before:h-px before:w-8 before:bg-pf-accent before:content-['']" };
export function CreativeCoder(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  const keys = front(visibleKeys(c.data, c.settings).filter((k) => k !== "summary"), ["projects"]);
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <main className={`mx-auto px-5 py-10 ${wrap(c.settings, "max-w-4xl", "max-w-6xl")}`}>
        <section className="overflow-hidden rounded-2xl border border-pf-line bg-pf-card shadow-lg">
          <div dir="ltr" className="flex items-center gap-1.5 border-b border-pf-line px-4 py-3">
            <span className="size-3 rounded-full bg-red-400" /><span className="size-3 rounded-full bg-yellow-400" /><span className="size-3 rounded-full bg-green-400" />
            <span className="ms-3 font-pfm text-xs text-pf-muted">portfolio.sh</span>
          </div>
          <div className="p-6 sm:p-10">
            <p dir="ltr" className="font-pfm text-sm text-pf-accent">$ whoami</p>
            <h1 dir="auto" className="mt-3 font-pfh text-4xl font-bold sm:text-6xl">{pi.fullName}</h1>
            <p dir="auto" className="mt-2 font-pfm text-lg text-pf-accent">{pi.jobTitle}</p>
            {c.data.professionalSummary && <p dir="auto" className="mt-5 max-w-2xl text-pf-muted">{c.data.professionalSummary}</p>}
            <ContactList c={c} className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-pfm text-sm" />
          </div>
        </section>
        {keys.map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="py-8" />
      </main>
    </PortfolioRoot>
  );
}
