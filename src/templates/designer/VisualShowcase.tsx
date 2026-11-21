import { PortfolioRoot } from "@/components/portfolio/root";
import { ContactBlock, TopNav, makeCtx, renderSection, visibleKeys, wrap, type TemplateProps, type Variants } from "@/components/portfolio/blocks";

const V: Variants = { experience: "compact", projects: "gallery", skills: "chips", education: "list" };
const S = { section: "py-10", h2: "mb-6 font-pfh text-2xl font-semibold" };
export function VisualShowcase(p: TemplateProps) {
  const c = makeCtx(p), pi = c.data.personalInfo, keys = visibleKeys(c.data, c.settings);
  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      <TopNav c={c} />
      <header className="px-5 pb-8 pt-12 sm:px-8">
        <h1 dir="auto" className="font-pfh text-4xl font-bold sm:text-6xl">{pi.fullName}</h1>
        <p dir="auto" className="mt-2 text-lg text-pf-accent">{pi.jobTitle}</p>
      </header>
      {keys.includes("projects") && <div className="px-3 sm:px-8">{renderSection("projects", c, V, { section: "scroll-mt-20", h2: "sr-only" })}</div>}
      <main className={`mx-auto px-5 pb-10 ${wrap(c.settings, "max-w-3xl", "max-w-5xl")}`}>
        {keys.filter((k) => k !== "projects").map((k) => renderSection(k, c, V, S))}
        <ContactBlock c={c} className="py-10" />
      </main>
    </PortfolioRoot>
  );
}
