import { PortfolioRoot } from "@/components/portfolio/root";
import { Avatar, ContactBlock, ContactList, TopNav, makeCtx, renderSection, visibleKeys, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "rows", projects: "feature", skills: "chips", education: "rows" };
const S = { section: "py-10", h2: "mb-6 text-center font-pfh text-3xl font-semibold" };
export function PersonalBranding(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <header className="text-center">
          <Avatar c={c} className="mx-auto size-36 rounded-full border-4 border-pf-accent/30 text-4xl" />
          <h1 dir="auto" className="mt-6 font-pfh text-4xl font-semibold sm:text-6xl">{pi.fullName}</h1>
          <p dir="auto" className="mt-2 text-lg text-pf-accent">{pi.jobTitle}</p>
          {c.data.professionalSummary && <blockquote dir="auto" className="mx-auto mt-8 max-w-2xl border-pf-accent text-xl italic text-pf-muted [border-inline-start-width:4px] ps-5 text-start">{c.data.professionalSummary}</blockquote>}
          <ContactList c={c} className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-pf-muted" />
        </header>
        {visibleKeys(c.data, c.settings).filter((k) => k !== "summary").map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="py-10 text-center" />
      </main>
    </PortfolioRoot>
  );
}
