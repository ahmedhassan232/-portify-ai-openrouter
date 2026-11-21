import type { Lang } from "@/i18n/config";
import { toPortfolioData } from "@/lib/portfolio";
import type { PortfolioData } from "@/schemas/portfolio";

/** Clearly fictional sample content: used for template previews and the "AI not configured" development mode. */
export function demoData(lang: Lang): PortfolioData {
  const ar = lang === "ar";
  return toPortfolioData({
    personalInfo: {
      fullName: ar ? "سارة الأحمد" : "Alex Morgan", jobTitle: ar ? "مصممة منتجات ومطورة واجهات" : "Product Designer & Front-end Engineer",
      email: "hello@example.com", phone: "+1 555 010 2030", location: ar ? "القاهرة، مصر" : "Lisbon, Portugal",
      website: "https://example.com", linkedin: "https://linkedin.com/in/example", github: "https://github.com/example",
    },
    professionalSummary: ar
      ? "أصمم وأبني منتجات رقمية واضحة وسهلة الاستخدام، وأحب العمل حيث يلتقي التصميم بالهندسة. أركز على التفاصيل وعلى أثر العمل في المستخدمين."
      : "I design and build clear, usable digital products, and I like working where design meets engineering. I care about the details and about the impact on the people using the product.",
    skills: { technical: ["React", "TypeScript", "Next.js", "CSS", "Node.js"], soft: ar ? ["التواصل", "العمل الجماعي", "حل المشكلات"] : ["Communication", "Teamwork", "Problem solving"], tools: ["Figma", "Git", "Notion"] },
    experience: [
      { position: ar ? "مصممة منتجات أولى" : "Senior Product Designer", company: "Northwind Studio", location: ar ? "عن بُعد" : "Remote", startDate: "2022", endDate: "",
        description: ar ? ["قيادة تصميم تطبيق جوال من الفكرة حتى الإطلاق", "بناء نظام تصميم مشترك بين فريقين"] : ["Led design of a mobile app from concept to launch", "Built a shared design system across two teams"],
        achievements: ar ? ["خفض زمن تسليم الشاشات عبر مكتبة مكونات موحدة"] : ["Shortened handoff time with a unified component library"] },
      { position: ar ? "مطورة واجهات" : "Front-end Developer", company: "Bright Labs", location: ar ? "القاهرة" : "Cairo", startDate: "2019", endDate: "2022",
        description: ar ? ["تطوير لوحات تحكم تفاعلية باستخدام React", "تحسين إمكانية الوصول في المنتج"] : ["Built interactive dashboards with React", "Improved product accessibility"], achievements: [] },
    ],
    projects: [
      { name: "Fieldnotes", description: ar ? "تطبيق لتدوين الملاحظات الميدانية يعمل دون اتصال." : "An offline-first app for capturing field notes.", technologies: ["React", "IndexedDB"], projectUrl: "https://example.com/fieldnotes", githubUrl: "https://github.com/example/fieldnotes" },
      { name: "Paletta", description: ar ? "أداة لتوليد لوحات ألوان متوافقة مع معايير التباين." : "A palette generator that checks contrast as you design.", technologies: ["TypeScript", "Canvas"], projectUrl: "", githubUrl: "https://github.com/example/paletta" },
      { name: "Tidepool", description: ar ? "لوحة تحليلات خفيفة لمشاريع جانبية." : "A lightweight analytics board for side projects.", technologies: ["Next.js", "SQL"], projectUrl: "https://example.com/tidepool", githubUrl: "" },
    ],
    education: [{ degree: ar ? "بكالوريوس تصميم التفاعل" : "BA in Interaction Design", institution: "Example University", startDate: "2015", endDate: "2019", description: "" }],
    certifications: ["Google UX Design Certificate", "Web Accessibility Specialist"],
    languages: ar ? ["العربية (الأم)", "الإنجليزية (طلاقة)"] : ["English (native)", "Portuguese (fluent)"],
    socialLinks: [{ label: "Dribbble", url: "https://dribbble.com/example" }],
    additionalInformation: [], customSections: [],
  });
}
