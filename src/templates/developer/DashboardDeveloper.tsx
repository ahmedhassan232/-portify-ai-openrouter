/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  User,
  Code2,
  Sliders,
  Briefcase,
  FileText,
  Award,
  Clock,
  Mail,
  Search,
  Printer,
  ExternalLink,
  Github,
  GraduationCap,
  Database,
  Layers,
  MapPin,
  Phone,
  Linkedin,
  Globe,
  Menu,
  Sparkles,
} from "lucide-react";
import { PortfolioRoot } from "@/components/portfolio/root";
import {
  Avatar,
  makeCtx,
  contactItems,
  wrap,
  type TemplateProps,
  type Ctx,
} from "@/components/portfolio/blocks";
import { safeUrl, displayUrl, safeImg } from "@/lib/utils/url";
import type { PortfolioData } from "@/schemas/portfolio";

const getInitials = (n: string) =>
  (n || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => Array.from(w)[0] ?? "")
    .join("")
    .toUpperCase() || "•";

const GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-indigo-600 to-purple-600",
  "from-teal-600 to-emerald-600",
  "from-purple-600 to-pink-600",
  "from-amber-600 to-orange-600",
  "from-cyan-600 to-blue-600",
];

export function DashboardDeveloper(p: TemplateProps) {
  const c = makeCtx(p);
  const pi = c.data.personalInfo;
  const isAr = c.lang === "ar";
  const contacts = contactItems(c);

  const techSkills = c.data.skills?.technical ?? [];
  const softSkills = c.data.skills?.soft ?? [];
  const toolSkills = c.data.skills?.tools ?? [];
  const projects = c.data.projects ?? [];
  const experience = c.data.experience ?? [];
  const education = c.data.education ?? [];
  const certifications = c.data.certifications ?? [];
  const languages = c.data.languages ?? [];

  // Top highlight cards values
  const metric1 = {
    title: techSkills[0] || (isAr ? "الأنظمة الخلفية" : "Backend"),
    subtitle: isAr ? "تطوير الأنظمة والـ APIs" : "Backend Development",
    icon: <Layers className="size-5 text-blue-600" />,
    badgeBg: "bg-blue-500/10 text-blue-600",
    topBorder: "border-t-2 border-t-blue-500",
  };
  const metric2 = {
    title: techSkills[1] || (isAr ? "قواعد البيانات" : "PostgreSQL"),
    subtitle: isAr ? "إدارة وتصميم البيانات" : "Database & Storage",
    icon: <Database className="size-5 text-emerald-600" />,
    badgeBg: "bg-emerald-500/10 text-emerald-600",
    topBorder: "border-t-2 border-t-emerald-500",
  };
  const metric3 = {
    title: techSkills[2] || (isAr ? "تطوير الواجهات" : "React"),
    subtitle: isAr ? "واجهات الويب الحديثة" : "Frontend Development",
    icon: <Code2 className="size-5 text-purple-600" />,
    badgeBg: "bg-purple-500/10 text-purple-600",
    topBorder: "border-t-2 border-t-purple-500",
  };
  const metric4 = {
    title: education[0]?.startDate
      ? `${education[0].startDate}–${education[0].endDate || (isAr ? "الآن" : "Present")}`
      : "2023–2027",
    subtitle: education[0]?.degree || (isAr ? "الدرجة الأكاديمية" : "Computer Science & AI"),
    icon: <GraduationCap className="size-5 text-amber-600" />,
    badgeBg: "bg-amber-500/10 text-amber-600",
    topBorder: "border-t-2 border-t-amber-500",
  };

  // Focus areas ("What I Build")
  const focusAreas = [
    {
      title: isAr ? "واجهات برمجة التطبيقات (Backend APIs)" : "Backend APIs",
      desc: isAr
        ? "بناء خدمات ويب سريعة وآمنة وقابلة للتوسع باستخدام أحدث الأطر البرمجية."
        : "Building scalable, high-performance RESTful APIs and microservices.",
      icon: "bg-blue-500/10 text-blue-600",
    },
    {
      title: isAr ? "تطبيقات تعتمد على البيانات" : "Database-Driven Apps",
      desc: isAr
        ? "تصميم قواعد بيانات علائقية ونظم تخزين متقدمة مع تحسين كفاءة الاستعلامات."
        : "Designing structured schemas, relational databases, and query optimizations.",
      icon: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: isAr ? "تكامل الأنظمة الشامل" : "Full-Stack Integration",
      desc: isAr
        ? "ربط الواجهات الأمامية التفاعلية مع الخوادم لتقديم تجربة مستخدم متكاملة."
        : "Seamless end-to-end integration between modern frontends and robust backends.",
      icon: "bg-purple-500/10 text-purple-600",
    },
    {
      title: isAr ? "حلول مدعومة بالذكاء الاصطناعي" : "AI-Enabled Projects",
      desc: isAr
        ? "دمج نماذج الذكاء الاصطناعي ومعالجة البيانات الذكية في التطبيقات اليومية."
        : "Integrating intelligent models, LLM agents, and smart automation workflows.",
      icon: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <PortfolioRoot lang={c.lang} settings={c.settings} mode={c.mode}>
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 border-b border-pf-line bg-pf-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo & Initials Badge */}
          <div className="flex items-center gap-3">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-pf-accent font-pfh text-xs font-bold text-pf-on shadow-sm">
                {getInitials(pi.fullName)}
              </span>
              <span dir="auto" className="font-pfh text-base font-bold text-pf-fg">
                {pi.fullName || "Developer"}
              </span>
            </a>
          </div>

          {/* Search Bar Input (Mock / Accessible) */}
          <div className="hidden max-w-md flex-1 items-center md:flex">
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-pf-muted" />
              <input
                type="text"
                readOnly
                placeholder={isAr ? "بحث... أو اضغط Ctrl+K" : "Search... or press Ctrl+K"}
                className="w-full rounded-xl border border-pf-line bg-pf-card/70 py-1.5 pe-16 ps-9 text-xs text-pf-fg placeholder:text-pf-muted focus:border-pf-accent focus:outline-none"
              />
              <kbd className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded border border-pf-line bg-pf-bg px-1.5 py-0.5 text-[10px] font-mono text-pf-muted">
                Ctrl+K
              </kbd>
            </div>
          </div>

          {/* Right Actions: Location Pill + Lang Switcher + Theme icon + Avatar */}
          <div className="flex items-center gap-2.5">
            {pi.location && (
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span dir="auto">{pi.location}</span>
              </div>
            )}

            {c.alt && (
              <a
                href={c.alt.href}
                lang={c.alt.lang}
                className="rounded-lg border border-pf-line bg-pf-card px-2.5 py-1 text-xs font-medium text-pf-muted hover:border-pf-accent hover:text-pf-fg"
              >
                {c.t("portfolio.switchLabel")}
              </a>
            )}

            {/* Mobile Nav Toggle */}
            <details className="relative lg:hidden" data-pf-menu>
              <summary
                aria-label={c.t("portfolio.menu")}
                className="grid size-9 cursor-pointer place-items-center rounded-xl border border-pf-line bg-pf-card text-pf-fg"
              >
                <Menu className="size-4" />
              </summary>
              <div className="absolute end-0 mt-2 w-64 rounded-2xl border border-pf-line bg-pf-bg p-3 shadow-xl">
                <nav className="space-y-1 text-sm">
                  <a href="#dashboard" className="block rounded-lg px-3 py-2 text-pf-fg hover:bg-pf-card">
                    {isAr ? "لوحة التحكم" : "Dashboard"}
                  </a>
                  <a href="#about" className="block rounded-lg px-3 py-2 text-pf-fg hover:bg-pf-card">
                    {isAr ? "نبذة عني" : "About Me"}
                  </a>
                  <a href="#projects" className="block rounded-lg px-3 py-2 text-pf-fg hover:bg-pf-card">
                    {c.t("portfolio.projects")}
                  </a>
                  <a href="#cv" className="block rounded-lg px-3 py-2 text-pf-fg hover:bg-pf-card">
                    {isAr ? "السيرة الذاتية" : "CV / Resume"}
                  </a>
                  <a href="#skills" className="block rounded-lg px-3 py-2 text-pf-fg hover:bg-pf-card">
                    {c.t("portfolio.skills")}
                  </a>
                  <a href="#contact" className="block rounded-lg px-3 py-2 text-pf-fg hover:bg-pf-card">
                    {c.t("portfolio.contact")}
                  </a>
                </nav>
              </div>
            </details>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout: Sidebar + Content */}
      <div className={`mx-auto flex min-h-[calc(100vh-61px)] gap-8 px-4 py-6 sm:px-6 sm:py-8 ${wrap(c.settings, "max-w-6xl", "max-w-7xl")}`}>
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden w-60 shrink-0 lg:flex lg:flex-col lg:justify-between lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-120px)]">
          <nav aria-label="Sidebar Navigation" className="space-y-6 text-sm">
            {/* Overview Group */}
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-pf-muted/80">
                {isAr ? "نظرة عامة" : "Overview"}
              </p>
              <div className="space-y-1">
                <a
                  href="#dashboard"
                  aria-current="true"
                  className="flex items-center gap-3 rounded-xl bg-pf-accent/10 px-3 py-2 font-medium text-pf-accent transition aria-[current=true]:bg-pf-accent/10 aria-[current=true]:text-pf-accent"
                >
                  <LayoutDashboard className="size-4 shrink-0" />
                  <span>{isAr ? "لوحة التحكم" : "Dashboard"}</span>
                </a>
                <a
                  href="#about"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-pf-muted transition hover:bg-pf-card hover:text-pf-fg"
                >
                  <User className="size-4 shrink-0" />
                  <span>{isAr ? "نبذة عني" : "About Me"}</span>
                </a>
              </div>
            </div>

            {/* Development Group */}
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-pf-muted/80">
                {isAr ? "التطوير" : "Development"}
              </p>
              <div className="space-y-1">
                <a
                  href="#projects"
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-pf-muted transition hover:bg-pf-card hover:text-pf-fg"
                >
                  <div className="flex items-center gap-3">
                    <Code2 className="size-4 shrink-0" />
                    <span>{c.t("portfolio.projects")}</span>
                  </div>
                  {projects.length > 0 && (
                    <span className="rounded-full bg-pf-accent px-2 py-0.5 text-[11px] font-bold text-pf-on">
                      {projects.length}
                    </span>
                  )}
                </a>
                <a
                  href="#skills"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-pf-muted transition hover:bg-pf-card hover:text-pf-fg"
                >
                  <Sliders className="size-4 shrink-0" />
                  <span>{c.t("portfolio.skills")}</span>
                </a>
              </div>
            </div>

            {/* Career Group */}
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-pf-muted/80">
                {isAr ? "المسيرة المهنية" : "Career"}
              </p>
              <div className="space-y-1">
                <a
                  href="#cv"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-pf-muted transition hover:bg-pf-card hover:text-pf-fg"
                >
                  <FileText className="size-4 shrink-0" />
                  <span>{isAr ? "السيرة الذاتية" : "CV / Resume"}</span>
                </a>
                {certifications.length > 0 && (
                  <a
                    href="#cv"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-pf-muted transition hover:bg-pf-card hover:text-pf-fg"
                  >
                    <Award className="size-4 shrink-0" />
                    <span>{isAr ? "الشهادات" : "Certificates"}</span>
                  </a>
                )}
                {experience.length > 0 && (
                  <a
                    href="#cv"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-pf-muted transition hover:bg-pf-card hover:text-pf-fg"
                  >
                    <Clock className="size-4 shrink-0" />
                    <span>{isAr ? "الخط الزمني" : "Timeline"}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Connect Group */}
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-pf-muted/80">
                {isAr ? "التواصل" : "Connect"}
              </p>
              <div className="space-y-1">
                <a
                  href="#contact"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-pf-muted transition hover:bg-pf-card hover:text-pf-fg"
                >
                  <Mail className="size-4 shrink-0" />
                  <span>{c.t("portfolio.contact")}</span>
                </a>
              </div>
            </div>
          </nav>

          {/* Bottom Sidebar User Profile Card */}
          <div className="mt-8 rounded-2xl border border-pf-line bg-pf-card p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar c={c} className="size-9 rounded-xl text-xs font-bold" />
              <div className="min-w-0 flex-1">
                <p dir="auto" className="truncate text-xs font-bold text-pf-fg">
                  {pi.fullName}
                </p>
                <p dir="auto" className="truncate text-[11px] text-pf-muted">
                  {pi.jobTitle || (isAr ? "مطوّر برمجيات" : "Developer")}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Body */}
        <main className="min-w-0 flex-1 space-y-12">
          {/* SECTION 1: DASHBOARD HERO (Screenshot 1) */}
          <section id="dashboard" className="scroll-mt-24 space-y-6">
            {/* Hero Card Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-pf-line bg-pf-card p-6 sm:p-10 shadow-sm">
              <div className="relative z-10 max-w-3xl space-y-4">
                {pi.jobTitle && (
                  <p dir="auto" className="text-xs font-semibold uppercase tracking-widest text-pf-muted">
                    {pi.jobTitle}
                  </p>
                )}
                <h1 dir="auto" className="font-pfh text-3xl font-bold tracking-tight text-pf-fg sm:text-5xl">
                  {isAr ? `أهلاً، أنا ${pi.fullName} 👋` : `Hi, I'm ${pi.fullName} 👋`}
                </h1>
                {c.data.professionalSummary && (
                  <p dir="auto" className="text-base leading-relaxed text-pf-muted sm:text-lg">
                    {c.data.professionalSummary}
                  </p>
                )}

                {/* Sub-badge */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span dir="auto">{pi.location ? `${pi.location} • ` : ""}{pi.jobTitle || (isAr ? "طالب ذكاء اصطناعي ومطور" : "AI Student & Developer")}</span>
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 rounded-xl bg-pf-accent px-5 py-2.5 text-sm font-semibold text-pf-on shadow-sm transition hover:opacity-95"
                  >
                    <span>{isAr ? "استعراض مشاريعي" : "View My Projects"}</span>
                    <span className="text-xs">↗</span>
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-pf-line bg-pf-bg px-5 py-2.5 text-sm font-semibold text-pf-fg transition hover:border-pf-accent"
                  >
                    <Mail className="size-4" />
                    <span>{c.t("portfolio.contact")}</span>
                  </a>
                  <a
                    href="#cv"
                    className="inline-flex items-center gap-2 rounded-xl border border-pf-line bg-pf-card px-5 py-2.5 text-sm font-semibold text-pf-fg transition hover:border-pf-accent"
                  >
                    <FileText className="size-4" />
                    <span>{isAr ? "عرض السيرة الذاتية" : "View CV"}</span>
                  </a>
                </div>
              </div>

              {/* Decorative Subtle Radar Rings in Background */}
              <div
                aria-hidden
                className="pointer-events-none absolute -end-16 top-1/2 hidden -translate-y-1/2 sm:block opacity-25"
              >
                <div className="grid size-72 place-items-center rounded-full border border-pf-accent">
                  <div className="grid size-48 place-items-center rounded-full border border-pf-accent/60">
                    <div className="size-24 rounded-full border border-pf-accent/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Metric / Key Skill Cards (Screenshot 1) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[metric1, metric2, metric3, metric4].map((m, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border border-pf-line bg-pf-card p-5 shadow-sm transition hover:shadow-md ${m.topBorder}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="grid size-10 place-items-center rounded-xl bg-pf-bg shadow-inner">
                      {m.icon}
                    </div>
                  </div>
                  <h2 dir="auto" className="mt-4 font-pfh text-xl font-bold text-pf-fg">
                    {m.title}
                  </h2>
                  <p dir="auto" className="mt-1 text-xs text-pf-muted">
                    {m.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* "What I Build" Focus Areas (Screenshot 1) */}
            <div className="space-y-4 pt-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-pfh text-xl font-bold text-pf-fg">
                  {isAr ? "مجالات تخصصي وما أبنيه" : "What I Build"}
                </h2>
                <span className="text-xs text-pf-muted">
                  {isAr ? "مجالات التركيز" : "Focus areas"}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {focusAreas.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-2xl border border-pf-line bg-pf-card p-5 shadow-sm transition hover:border-pf-accent/50"
                  >
                    <div>
                      <div className={`mb-3 inline-grid size-8 place-items-center rounded-lg ${f.icon} text-xs font-mono font-bold`}>
                        &lt;/&gt;
                      </div>
                      <h3 dir="auto" className="font-pfh text-base font-bold text-pf-fg">
                        {f.title}
                      </h3>
                      <p dir="auto" className="mt-1.5 text-xs leading-relaxed text-pf-muted">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2: ABOUT ME (ANCHOR) */}
          <section id="about" className="scroll-mt-24 space-y-4">
            <div className="rounded-3xl border border-pf-line bg-pf-card p-6 sm:p-8 shadow-sm">
              <h2 className="font-pfh text-xl font-bold text-pf-fg">
                {isAr ? "نبذة عني" : "About Me"}
              </h2>
              {c.data.professionalSummary && (
                <p dir="auto" className="mt-3 text-base leading-relaxed text-pf-muted">
                  {c.data.professionalSummary}
                </p>
              )}
              {contacts.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-pf-line text-sm text-pf-muted">
                  {contacts.map((ct) => (
                    <div key={ct.key} className="flex items-center gap-2">
                      {ct.href ? (
                        <a
                          href={ct.href}
                          target={ct.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="hover:text-pf-accent hover:underline flex items-center gap-1.5"
                        >
                          {ct.text}
                        </a>
                      ) : (
                        <span>{ct.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 3: PROJECTS (Screenshot 3) */}
          <section id="projects" className="scroll-mt-24 space-y-6">
            <div className="space-y-1">
              <p className="font-mono text-xs text-pf-muted">
                {isAr ? "٠٢ — معرض الأعمال" : "02 — Portfolio"}
              </p>
              <h2 className="font-pfh text-3xl font-bold tracking-tight text-pf-fg">
                {isAr ? "المشاريع المختارة" : "Selected Projects"}
              </h2>
              <p dir="auto" className="text-sm text-pf-muted">
                {isAr
                  ? "أعمال ومشاريع برمجية وتطبيقية مع الروابط والشفرة المصدرية المتاحة."
                  : "Personal and academic work with verified project links where available."}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-pfh text-lg font-bold text-pf-fg">
                {isAr ? "أبرز الأعمال" : "Featured Work"}
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((p, idx) => {
                  const initials = getInitials(p.name);
                  const gradient = GRADIENTS[idx % GRADIENTS.length];
                  const live = safeUrl(p.projectUrl);
                  const src = safeUrl(p.githubUrl);

                  return (
                    <article
                      key={p.id}
                      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-pf-line bg-pf-card p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="space-y-4">
                        {/* Project Header Avatar & Badges */}
                        <div className="flex items-center justify-between gap-3">
                          {p.image ? (
                            <img
                              src={safeImg(p.image)}
                              alt={p.name}
                              className="size-12 rounded-xl object-cover shadow-sm"
                            />
                          ) : (
                            <div
                              className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-base font-bold text-white shadow-sm`}
                            >
                              {initials}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1.5">
                            {p.technologies.slice(0, 2).map((t, i) => (
                              <span
                                key={i}
                                className="rounded-md border border-pf-line bg-pf-bg px-2.5 py-0.5 text-xs text-pf-muted"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 dir="auto" className="font-pfh text-xl font-bold text-pf-fg">
                            {p.name}
                          </h4>
                          <p dir="auto" className="mt-2 text-sm leading-relaxed text-pf-muted">
                            {p.description}
                          </p>
                        </div>

                        {/* Technologies Tags */}
                        {p.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {p.technologies.map((t) => (
                              <span
                                key={t}
                                className="rounded-md border border-pf-line bg-pf-bg/80 px-2 py-0.5 font-mono text-[11px] text-pf-fg"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-pf-line pt-4">
                        {live ? (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-pf-line bg-pf-bg px-3.5 py-1.5 text-xs font-semibold text-pf-fg transition hover:border-pf-accent hover:text-pf-accent"
                          >
                            <span>{c.t("portfolio.live")}</span>
                            <span className="text-xs">↗</span>
                          </a>
                        ) : null}

                        {src ? (
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-pf-line bg-pf-bg px-3.5 py-1.5 text-xs font-semibold text-pf-fg transition hover:border-pf-accent hover:text-pf-accent"
                          >
                            <Github className="size-3.5" />
                            <span>{c.t("portfolio.source")}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-pf-muted">
                            {isAr ? "مستودع خاص" : "Private repository"}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 4: CV / RESUME (Screenshot 2) */}
          <section id="cv" className="scroll-mt-24 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-pf-muted">
                  {isAr ? "المسيرة المهنية" : "Career"}
                </p>
                <h2 className="font-pfh text-3xl font-bold tracking-tight text-pf-fg">
                  {isAr ? "السيرة الذاتية" : "CV / Resume"}
                </h2>
              </div>
              <button
                type="button"
                data-print="true"
                className="inline-flex items-center gap-2 rounded-xl bg-pf-accent px-4 py-2 text-sm font-semibold text-pf-on shadow-sm transition hover:opacity-95"
              >
                <Printer className="size-4" />
                <span>{isAr ? "طباعة / حفظ PDF" : "Print / Save PDF"}</span>
              </button>
            </div>

            {/* Resume Sheet Container */}
            <div className="rounded-3xl border border-pf-line bg-pf-card p-6 sm:p-10 shadow-sm space-y-8">
              {/* Header with Name & Contacts */}
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start border-b border-pf-line pb-6">
                <div>
                  <h3 dir="auto" className="font-pfh text-2xl font-bold text-pf-fg sm:text-3xl">
                    {pi.fullName}
                  </h3>
                  <p dir="auto" className="mt-1 font-medium text-pf-accent">
                    {pi.jobTitle}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-pf-muted">
                  {pi.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-pf-accent shrink-0" />
                      <a href={`mailto:${pi.email}`} className="hover:text-pf-accent hover:underline">
                        <bdi dir="ltr">{pi.email}</bdi>
                      </a>
                    </div>
                  )}
                  {pi.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-pf-accent shrink-0" />
                      <a href={`tel:${pi.phone}`} className="hover:text-pf-accent hover:underline">
                        <bdi dir="ltr">{pi.phone}</bdi>
                      </a>
                    </div>
                  )}
                  {pi.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-pf-accent shrink-0" />
                      <span dir="auto">{pi.location}</span>
                    </div>
                  )}
                  {pi.github && (
                    <div className="flex items-center gap-2">
                      <Github className="size-3.5 text-pf-accent shrink-0" />
                      <a href={safeUrl(pi.github) || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-pf-accent hover:underline">
                        <bdi dir="ltr">{displayUrl(pi.github)}</bdi>
                      </a>
                    </div>
                  )}
                  {pi.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="size-3.5 text-pf-accent shrink-0" />
                      <a href={safeUrl(pi.linkedin) || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-pf-accent hover:underline">
                        <bdi dir="ltr">{displayUrl(pi.linkedin)}</bdi>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              {c.data.professionalSummary && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pf-accent">
                    {isAr ? "الملخص المهني" : "PROFESSIONAL SUMMARY"}
                  </h4>
                  <p dir="auto" className="text-sm leading-relaxed text-pf-fg/90">
                    {c.data.professionalSummary}
                  </p>
                </div>
              )}

              {/* Experience (Uses c.t("portfolio.experience") for Vitest assertion) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pf-accent">
                  {c.t("portfolio.experience")}
                </h4>
                {experience.length > 0 ? (
                  <div className="space-y-6">
                    {experience.map((e) => (
                      <div key={e.id} className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h5 dir="auto" className="font-pfh text-base font-bold text-pf-fg">
                            {e.position} {e.company && <span className="text-pf-muted font-normal">| {e.company}</span>}
                          </h5>
                          <span className="text-xs text-pf-muted">
                            <bdi>{e.startDate}</bdi>
                            {e.startDate && " – "}
                            <bdi>{e.endDate || c.t("portfolio.present")}</bdi>
                          </span>
                        </div>
                        {e.location && (
                          <p dir="auto" className="text-xs text-pf-muted">
                            {e.location}
                          </p>
                        )}
                        {e.description.length > 0 && (
                          <ul className="list-disc ps-5 text-xs text-pf-muted space-y-1 pt-1">
                            {e.description.map((d, i) => (
                              <li key={i} dir="auto">
                                {d}
                              </li>
                            ))}
                          </ul>
                        )}
                        {e.achievements.length > 0 && (
                          <div className="mt-2 rounded-lg bg-pf-accent/10 p-3">
                            <p className="text-[11px] font-semibold uppercase text-pf-accent mb-1">
                              {c.t("portfolio.highlights")}
                            </p>
                            <ul className="list-disc ps-5 text-xs text-pf-fg space-y-0.5">
                              {e.achievements.map((a, i) => (
                                <li key={i} dir="auto">
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-pf-muted">{isAr ? "لا توجد خبرات مضافة بعد." : "No experience listed yet."}</p>
                )}
              </div>

              {/* Education (Uses c.t("portfolio.education")) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pf-accent">
                  {c.t("portfolio.education")}
                </h4>
                {education.length > 0 ? (
                  <div className="space-y-4">
                    {education.map((ed) => (
                      <div key={ed.id} className="space-y-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h5 dir="auto" className="font-pfh text-base font-bold text-pf-fg">
                            {ed.degree}
                          </h5>
                          <span className="text-xs text-pf-muted">
                            <bdi>{ed.startDate}</bdi>
                            {ed.startDate && " – "}
                            <bdi>{ed.endDate || c.t("portfolio.present")}</bdi>
                          </span>
                        </div>
                        <p dir="auto" className="text-xs text-pf-accent">
                          {ed.institution}
                        </p>
                        {ed.description && (
                          <p dir="auto" className="text-xs text-pf-muted">
                            {ed.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-pf-muted">{isAr ? "لا توجد بيانات تعليمية بعد." : "No education listed yet."}</p>
                )}
              </div>

              {/* Technical Skills (Uses c.t("portfolio.skills")) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pf-accent">
                  {c.t("portfolio.skills")}
                </h4>
                <div className="space-y-2">
                  {techSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-pf-muted pe-2">
                        {isAr ? "التقنية:" : "Technical:"}
                      </span>
                      {techSkills.map((s, i) => (
                        <span key={i} className="rounded-md border border-pf-line bg-pf-bg px-2.5 py-0.5 text-xs font-medium text-pf-fg">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {toolSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-pf-muted pe-2">
                        {isAr ? "الأدوات:" : "Tools:"}
                      </span>
                      {toolSkills.map((s, i) => (
                        <span key={i} className="rounded-md border border-pf-line bg-pf-bg px-2.5 py-0.5 text-xs font-medium text-pf-fg">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {softSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-pf-muted pe-2">
                        {isAr ? "الشخصية:" : "Soft Skills:"}
                      </span>
                      {softSkills.map((s, i) => (
                        <span key={i} className="rounded-md border border-pf-line bg-pf-bg px-2.5 py-0.5 text-xs font-medium text-pf-fg">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications & Languages */}
              {(certifications.length > 0 || languages.length > 0) && (
                <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-pf-line">
                  {certifications.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-pf-accent mb-2">
                        {c.t("portfolio.certifications")}
                      </h4>
                      <ul className="list-disc ps-5 text-xs text-pf-muted space-y-1">
                        {certifications.map((ct, i) => (
                          <li key={i} dir="auto">
                            {ct}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-pf-accent mb-2">
                        {c.t("portfolio.languages")}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {languages.map((l, i) => (
                          <span key={i} className="rounded-full bg-pf-accent/10 px-2.5 py-0.5 text-xs font-medium text-pf-accent">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5: DETAILED SKILLS */}
          <section id="skills" className="scroll-mt-24 space-y-6">
            <h2 className="font-pfh text-3xl font-bold tracking-tight text-pf-fg">
              {c.t("portfolio.skills")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-pf-line bg-pf-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="size-4 text-blue-600" />
                  <h3 className="font-pfh text-sm font-bold uppercase tracking-wider text-pf-fg">
                    {isAr ? "المهارات التقنية" : "Technical Skills"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techSkills.map((s, i) => (
                    <span key={i} className="rounded-lg border border-pf-line bg-pf-bg px-2.5 py-1 text-xs font-medium text-pf-fg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-pf-line bg-pf-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="size-4 text-emerald-600" />
                  <h3 className="font-pfh text-sm font-bold uppercase tracking-wider text-pf-fg">
                    {isAr ? "الأدوات والتقنيات" : "Tools & Platforms"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {toolSkills.map((s, i) => (
                    <span key={i} className="rounded-lg border border-pf-line bg-pf-bg px-2.5 py-1 text-xs font-medium text-pf-fg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-pf-line bg-pf-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-4 text-purple-600" />
                  <h3 className="font-pfh text-sm font-bold uppercase tracking-wider text-pf-fg">
                    {isAr ? "المهارات الشخصية" : "Soft Skills"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {softSkills.map((s, i) => (
                    <span key={i} className="rounded-lg border border-pf-line bg-pf-bg px-2.5 py-1 text-xs font-medium text-pf-fg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: CONTACT */}
          <section id="contact" className="scroll-mt-24 space-y-6">
            <div className="rounded-3xl border border-pf-line bg-pf-card p-6 sm:p-10 shadow-sm">
              <h2 className="font-pfh text-3xl font-bold tracking-tight text-pf-fg">
                {c.t("portfolio.getInTouch")}
              </h2>
              <p dir="auto" className="mt-2 text-sm text-pf-muted max-w-xl">
                {isAr
                  ? "يسعدني دائماً التواصل لبحث فرص التعاون، العمل على مشاريع جديدة، أو مناقشة الأفكار التقنية."
                  : "Feel free to reach out for collaboration opportunities, new projects, or tech discussions."}
              </p>

              {pi.email && (
                <div className="mt-6">
                  <a
                    href={`mailto:${pi.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-pf-accent px-6 py-3 font-semibold text-pf-on shadow-sm transition hover:opacity-95"
                  >
                    <Mail className="size-4" />
                    <span>{c.t("portfolio.contact")}</span>
                  </a>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-6 border-t border-pf-line pt-6 text-sm text-pf-muted">
                {contacts.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="hover:text-pf-accent hover:underline flex items-center gap-1.5"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-pf-line pt-4 text-xs text-pf-muted">
                <bdi>© {new Date().getFullYear()}</bdi> <bdi dir="auto">{pi.fullName}</bdi> • Built with Portify AI
              </div>
            </div>
          </section>
        </main>
      </div>
    </PortfolioRoot>
  );
}
