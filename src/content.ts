export const profile = {
  name: "Ansab Rehman",
  role: "Full Stack Engineer · AI-powered products",
  summary:
    "Full Stack Engineer with 5+ years building scalable web applications and AI-enabled systems. Python/Django, React, Angular, distributed task processing, search infrastructure, and production-grade integrations, with proven impact in reliability, test coverage, and performance.",
  email: "ansabrehman@hotmail.com",
  linkedin: "https://linkedin.com/in/ansabrehman/",
  location: "Lahore, Pakistan",
  education: {
    degree: "Bachelor of Computer Science",
    school: "FAST NUCES, Lahore",
    years: "2018 to 2022",
  },
} as const;

export type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
};

export type CaseArchitecture = {
  summary: string;
  flow: string;
  nodes: ArchitectureNode[];
};

export type WorkCase = {
  id: string;
  title: string;
  context: string;
  status?: string;
  outcomes: string[];
  tech: string;
  architecture?: CaseArchitecture;
};

export const selectedWork: WorkCase[] = [
  {
    id: "memogent",
    title: "MemogentAI",
    context: "AI-powered financial due diligence from Excel databooks",
    outcomes: [
      "Built an Excel-first ingest and RAG pipeline that audits spreadsheets, extracts tables, and indexes evidence for grounded generation.",
      "Orchestrated multi-section FDD report generation with LangChain and LangGraph: plan, draft, persona review, and quality gates before assembly.",
      "Designed human-in-the-loop approve / edit / reject interrupts so analysts stay in control of every critical step.",
    ],
    tech: "Python · FastAPI · LangChain · LangGraph · LanceDB · RAG · React · Tauri",
    architecture: {
      summary:
        "Local-first desktop app plus FastAPI engine: upload a databook, retrieve evidence, generate sections with gated review, then export the report.",
      flow: "Workspace → API → Ingest & RAG → Document orchestrator → Section engine ↔ Human-in-the-loop → Assemble & export",
      nodes: [
        {
          id: "desktop",
          label: "Desktop Workspace",
          detail:
            "Tauri + React run UI: upload databooks, watch SSE progress on a pipeline rail, review drafts and evidence, then export Markdown / PPTX / PDF.",
        },
        {
          id: "api",
          label: "API Gateway",
          detail:
            "FastAPI sessions and documents over REST, plus SSE streams. Pure transport: the graph owns generation; the API validates, streams, and resumes HITL.",
        },
        {
          id: "ingest",
          label: "Ingest & RAG",
          detail:
            "Audit Excel for reference errors, extract tables into a structured catalog, then embed chunks into a local LanceDB hybrid store (dense + BM25).",
        },
        {
          id: "orchestrator",
          label: "Document Orchestrator",
          detail:
            "Outer LangGraph on LangChain: global plan, sequential section loop, cross-section review, and final document assembly with durable state keyed by thread.",
        },
        {
          id: "section",
          label: "Section Engine",
          detail:
            "Inner chain per section: retrieve → compress evidence → outline → draft → multi-persona critique → polish → claims → quality gate.",
        },
        {
          id: "hitl",
          label: "Human-in-the-Loop",
          detail:
            "Gated plan and review interrupts at global, section, and step tiers. One resume contract: approve, edit, or reject, then the stream continues.",
        },
      ],
    },
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
    range: "Dec 2023 to Present",
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
    range: "Mar 2021 to Dec 2023",
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
    "I work across the stack when the product needs it: APIs that stay maintainable, frontends that stay clear, and AI pipelines that earn trust in production.",
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
