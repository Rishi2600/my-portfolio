// Real case studies. `kind` is the small label in the card's top-left,
// `stack` renders as chips, and `live`/`code` become the two card links.
export const PROJECTS = [
  {
    id: "iceplease",
    kind: "Own product",
    title: "IcePlease",
    description:
      "A flavoured-ice brand built end to end: product catalogue, B2C cart and checkout, B2B enquiries and an admin dashboard. Prices are settled on the server, never the browser, and every order keeps a snapshot of what was bought so old orders stay correct when the catalogue moves.",
    stack: ["Next.js", "TypeScript", "Postgres", "Prisma", "NextAuth", "Tailwind"],
    live: "https://ice-please.vercel.app/",
    code: "https://github.com/Rishi2600/IcePlease",
  },
  {
    id: "crm",
    kind: "Production",
    title: "Sales CRM",
    description:
      "A sales CRM for Indian sales teams. Leads come in, agents work them through follow-up calls, and the ones that convert become deals on a drag-and-drop pipeline board. Role-based access keeps admins, managers and reps to their own slice, with analytics on win rates, deal sizes and cycle length.",
    stack: ["Next.js 14", "TypeScript", "Postgres", "Prisma", "JWT", "Tailwind"],
    live: "https://crm-two-lovat-75.vercel.app/",
    code: "https://github.com/Rishi2600/crm",
  },
  {
    id: "daddy-solutions",
    kind: "Service studio",
    title: "Daddy Solutions",
    description:
      "The site for my software studio — full-stack builds, backend APIs, cloud and Solana work. The hero is a real shell: server-rendered until you type, then a live xterm.js session with its own command set. Zero UI dependencies, one API route, rate-limited contact form.",
    stack: ["Next.js", "TypeScript", "xterm.js", "Tailwind"],
    live: "https://daddy-solutions-wine.vercel.app/",
    code: "https://github.com/Rishi2600/daddy-solutions",
  },
  {
    id: "valentine",
    kind: "For fun",
    title: "Will You Be My Valentine?",
    description:
      "A small, silly one. A Valentine's prompt where the No button refuses to be caught — no NOs allowed. Pure DOM and pure CSS, no framework and no build step, written to keep the fundamentals sharp.",
    stack: ["JavaScript", "HTML", "CSS"],
    live: "https://valentines-day-six-beta.vercel.app/",
    code: "https://github.com/Rishi2600/valentines-day",
  },
];
