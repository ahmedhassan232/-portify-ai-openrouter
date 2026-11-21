import { PortfolioRoot } from "@/components/portfolio/root";
import { ContactBlock, TopNav, anchor, makeCtx, renderSection, titleOf, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "compact", projects: "list", skills: "inline", education: "list" };
const S = { section: "", h2: "" };
export function MinimalistDesigner(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo;
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <main className={`mx-auto px-5 py-16 ${wrap(c.settings, "max-w-3xl", "max-w-5xl")}`}>
        <header className="pb-16">
          <h1 dir="auto" className="font-pfh text-5xl font-medium leading-tight tracking-tight sm:text-7xl">{pi.fullName}</h1>
          <p dir="auto" className="mt-4 text-xl text-pf-muted">{pi.jobTitle}</p>
        </header>
        {visibleKeys(c.data, c.settings).map((k) => (
          <section key={k} id={anchor(k)} className="grid scroll-mt-20 gap-4 border-t border-pf-line py-10 md:grid-cols-[12rem_1fr] md:gap-10">
            <h2 className="font-pfh text-sm uppercase tracking-widest text-pf-muted">{titleOf(k, c)}</h2>
            <div>{renderSection(k, c, V, S, true)}</div>
          </section>
        ))}
        <ContactBlock c={c} className="border-t border-pf-line py-10" />
      </main>
    </PortfolioRoot>
  );
}
