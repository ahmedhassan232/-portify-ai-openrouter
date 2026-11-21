import { PortfolioRoot } from "@/components/portfolio/root";
import { ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "compact", projects: "list", skills: "inline", education: "list" };
const S = { section: "py-8", h2: "mb-4 font-pfm text-sm uppercase tracking-widest text-pf-accent before:content-['#_']" };
export function MinimalDeveloper(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <main className={`mx-auto px-5 py-14 ${wrap(c.settings, "max-w-2xl", "max-w-4xl")}`}>
        <header className="mb-8">
          <p dir="ltr" className="font-pfm text-sm text-pf-accent">~/portfolio $ whoami</p>
          <h1 dir="auto" className="mt-3 font-pfh text-4xl font-bold tracking-tight">{pi.fullName}</h1>
          <p dir="auto" className="mt-2 font-pfm text-pf-muted">{pi.jobTitle}</p>
          <ContactList c={c} className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-pfm text-sm text-pf-muted" />
        </header>
        {visibleKeys(c.data, c.settings).map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="py-8" />
      </main>
    </PortfolioRoot>
  );
}
