export const profile = {
  name: "Ansab Rehman",
  role: "Full Stack Engineer · AI-powered products",
  summary:
    "Full Stack Engineer with 5+ years building scalable web applications and AI-enabled systems. Python/Django, React, Angular, distributed task processing, search infrastructure, and production-grade integrations — with proven impact in reliability, test coverage, and performance.",
  email: "ansabrehman@hotmail.com",
  linkedin: "https://linkedin.com/in/ansabrehman/",
  location: "Lahore, Pakistan",
  education: {
    degree: "Bachelor of Computer Science",
    school: "FAST NUCES, Lahore",
    years: "2018 — 2022",
  },
} as const;

export type WorkCase = {
  id: string;
  title: string;
  context: string;
  status?: string;
  outcomes: string[];
  tech: string;
};

export const selectedWork: WorkCase[] = [
  {
    id: "memogent",
    title: "MemogentAI",
    context: "AI-powered financial document analysis for due diligence",
    outcomes: [
      "Built an OCR and RAG-based pipeline that extracts precision data from Excel, PowerPoint, and scanned documents.",
      "Integrated fine-tuned agents and validation workflows to generate structured financial due diligence reports.",
      "Designed retrieval and LangGraph-style orchestration for multi-step analysis with human review gates.",
    ],
    tech: "Python · FastAPI · RAG · LangChain / LangGraph · OCR · React",
  },
  {
    id: "cheetay-admin",
    title: "Cheetay Admin App",
    context: "Internal operations platform · Cheetay Logistics",
    outcomes: [
      "Built a centralized admin for products, inventory, deals, CMS content, and operational workflows.",
      "Gave marketing and operations teams a single surface for day-to-day control instead of fragmented tools.",
    ],
    tech: "Django · Jinja · AJAX · Python",
  },
  {
    id: "sentiment",
    title: "Sentiment Analysis System",
    context: "Social media sentiment classification tool",
    outcomes: [
      "Retrieved and classified tweets and social posts as positive, negative, or neutral with NLP techniques.",
      "Surfaced trend insights so teams could read public sentiment without manual review.",
    ],
    tech: "Python · Django · NLP",
  },
];

export type TenureEntry = {
  id: string;
  range: string;
  company: string;
  title: string;
  lines: string[];
};

export const tenure: TenureEntry[] = [
  {
    id: "xref-tenure",
    range: "Dec 2023 — Present",
    company: "Xref",
    title: "Full Stack Engineer",
    lines: [
      "Raised automated test coverage from 45% to 80% across Django backend and Angular frontend.",
      "Shipped AI-powered summaries in reference-check workflows and a knowledge-base chatbot for internal retrieval.",
      "Migrated referee-check workflows to the enterprise platform; added filtering, report downloads, and scheduled email delivery.",
      "Designed role-based access control inspired by AWS IAM for enterprise clients.",
    ],
  },
  {
    id: "cheetay-tenure",
    range: "Mar 2021 — Dec 2023",
    company: "Cheetay Logistics",
    title: "Software Engineer",
    lines: [
      "Delivered Elasticsearch indexing/search APIs, Redis caching, and Celery automation that cut latency in critical paths.",
      "Integrated Bank Alfalah payment gateway and production monitoring with Sentry and Elastic APM.",
      "Maintained backward-compatible APIs across logistics and ERP workflows.",
      "Built internal dashboards with Django templates and AJAX for operational management.",
    ],
  },
];

export const craft = {
  intro:
    "I work across the stack when the product needs it — APIs that stay maintainable, frontends that stay clear, and AI pipelines that earn trust in production.",
  groups: [
    {
      label: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "SQL"],
    },
    {
      label: "Frameworks",
      items: ["Django", "FastAPI", "React", "Angular"],
    },
    {
      label: "AI & data",
      items: ["RAG", "LangChain", "LangGraph", "NLP", "OCR", "Elasticsearch", "Redis", "OpenPyXL"],
    },
    {
      label: "Cloud & ops",
      items: ["Docker", "AWS", "Celery", "Git", "Pytest", "Sentry", "DataDog"],
    },
  ],
} as const;
