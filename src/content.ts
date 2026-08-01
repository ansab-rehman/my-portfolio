import laamDashboard from "./assets/work/laam-dashboard/dashboard.png";
import laamFiltered from "./assets/work/laam-dashboard/filtered.png";
import laamInsights from "./assets/work/laam-dashboard/product-insights.png";
import fiscalflowHome from "./assets/work/fiscalflow/home.png";
import fiscalflowWorkspace from "./assets/work/fiscalflow/workspace.png";
import fiscalflowSettings from "./assets/work/fiscalflow/settings.png";
import fiscalflowAudit from "./assets/work/fiscalflow/audit-review.png";
import fiscalflowDemo from "./assets/work/fiscalflow/demo.mp4";
import xrefRequests from "./assets/work/xref/requests.png";
import xrefCandidate from "./assets/work/xref/candidate.png";
import xrefCandidateSurveys from "./assets/work/xref/candidate-surveys.png";
import xrefCreateSend from "./assets/work/xref/create-send.png";
import xrefMobileCollect from "./assets/work/xref/mobile-collect.png";
import xrefReviewReport from "./assets/work/xref/review-report.png";
import xrefInsights from "./assets/work/xref/insights-enps.png";

export const profile = {
  name: "Ansab Rehman",
  role: "Full Stack Engineer · AI-powered products",
  summary:
    "I'm a Full Stack Engineer with 5+ years of experience building scalable web applications and AI-powered solutions. I specialize in Python, Django, FastAPI, React, and Angular, with hands-on experience in RAG, LangChain, LangGraph, LLM integrations, OCR, NLP, and AI agent workflows. From enterprise platforms and payment integrations to distributed systems and AI-powered applications, I enjoy solving complex engineering problems and building products that are reliable, scalable, and genuinely useful.",
  email: "ansabrehman@hotmail.com",
  linkedin: "https://linkedin.com/in/ansabrehman/",
  github: "https://github.com/ansab-rehman",
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

export type CaseScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type CaseVideo = {
  src: string;
  caption: string;
};

export type WorkCase = {
  id: string;
  title: string;
  context: string;
  status?: string;
  outcomes: string[];
  tech: string;
  href?: string;
  video?: CaseVideo;
  screenshots?: CaseScreenshot[];
  architecture?: CaseArchitecture;
};

export const selectedWork: WorkCase[] = [
  {
    id: "memogent",
    title: "MemogentAI (FiscalFlow)",
    context: "AI-powered financial due diligence from Excel databooks",
    outcomes: [
      "Built an Excel-first ingest and RAG pipeline that audits spreadsheets, extracts tables, and indexes evidence for grounded generation.",
      "Orchestrated multi-section FDD report generation with LangChain and LangGraph: plan, draft, persona review, and quality gates before assembly.",
      "Designed human-in-the-loop approve / edit / reject interrupts so analysts stay in control of every critical step.",
    ],
    tech: "Python · FastAPI · LangChain · LangGraph · LanceDB · RAG · React · Tauri",
    href: "https://github.com/FiscalFlowHQ/fiscalflow-ui",
    video: {
      src: fiscalflowDemo,
      caption: "Desktop walkthrough — FiscalFlow FDD workspace",
    },
    screenshots: [
      {
        src: fiscalflowHome,
        alt: "FiscalFlow desktop home with New FDD run and sessions list",
        caption: "Home — start a new FDD run",
      },
      {
        src: fiscalflowWorkspace,
        alt: "FiscalFlow run workspace with pipeline, chat, databook upload, and composer",
        caption: "Workspace — pipeline, chat, and composer",
      },
      {
        src: fiscalflowSettings,
        alt: "FiscalFlow settings for API connection and LLM providers",
        caption: "Settings — API connection and providers",
      },
      {
        src: fiscalflowAudit,
        alt: "FiscalFlow Excel Auditor review mode for spreadsheet errors",
        caption: "Excel Auditor — review and fix errors",
      },
    ],
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
    id: "laam-analytics",
    title: "LAAM Analytics",
    context:
      "Buyer-behaviour analytics for a fashion marketplace — server-side SQL aggregates with a React dashboard",
    outcomes: [
      "Built a Django API that computes every aggregate in SQLite (sales over time, top products/brands, market-basket co-occurrence with confidence and lift) — the browser never receives raw order rows.",
      "Shipped a filterable React dashboard with half-open date ranges, brand drill-down, paginated products, and a product-insights drawer for frequently-bought-together analysis.",
      "Documented measured query performance (EXPLAIN + timings), caching, Docker Compose, and 122 backend tests pinned to independently verified seed numbers.",
    ],
    tech: "Django · DRF · SQLite · React · Vite · TypeScript · TanStack Query · Recharts · Docker",
    href: "https://github.com/ansab-rehman/buyer-analytics",
    screenshots: [
      {
        src: laamDashboard,
        alt: "LAAM Analytics overview with KPIs, sales chart, top brands and products",
        caption: "Overview — KPIs, sales over time, brands, and products",
      },
      {
        src: laamFiltered,
        alt: "LAAM Analytics filtered to Junaid Jamshed for Oct 2025–Mar 2026",
        caption: "Brand drill-down with a date range",
      },
      {
        src: laamInsights,
        alt: "Product insights drawer showing frequently bought together with lift",
        caption: "Product insights — co-purchases, confidence, and lift",
      },
    ],
  },
  {
    id: "cheetay-admin",
    title: "Cheetay Admin App",
    context: "Internal operations platform · Cheetay Logistics",
    outcomes: [
      "Built a centralized admin for products, inventory, deals, CMS content, and operational workflows.",
      "Gave marketing and operations teams a single surface for day-to-day control instead of fragmented tools.",
    ],
    tech: "Django · Jinja · AJAX · Python · CSS · JS · HTML5",
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
  summary?: string;
  linesHeading?: string;
  lines: string[];
  website?: string;
  screenshots?: CaseScreenshot[];
};

export const tenure: TenureEntry[] = [
  {
    id: "xref-tenure",
    range: "Dec 2023 to Present",
    company: "Xref",
    title: "Full Stack Engineer",
    website: "https://www.xref.com/",
    summary:
      "Xref is a SaaS HR technology company that helps organizations make better hiring decisions through automated reference checks, background screening, and recruitment workflow solutions. Its platform streamlines candidate verification, improves hiring efficiency, and helps employers reduce hiring risk.",
    linesHeading: "What I shipped:",
    lines: [
      "Raised automated test coverage from 45% to 80% across Django backend and Angular frontend.",
      "Shipped AI-powered summaries in reference-check workflows and a knowledge-base chatbot for internal retrieval.",
      "Migrated referee-check workflows to the enterprise platform; added filtering, report downloads, and scheduled email delivery.",
      "Designed role-based access control inspired by AWS IAM for enterprise clients.",
    ],
    screenshots: [
      {
        src: xrefRequests,
        alt: "Xref Requests page listing reference checks with status badges",
        caption: "Requests — reference checks at a glance",
      },
      {
        src: xrefCandidate,
        alt: "Xref candidate profile for Catherine Horne with survey activity",
        caption: "People — candidate profile and survey history",
      },
      {
        src: xrefCandidateSurveys,
        alt: "Xref candidate detail with expanded reference survey coverage",
        caption: "Candidate detail — reference coverage and referees",
      },
      {
        src: xrefCreateSend,
        alt: "Xref how it works create and send reference request flow",
        caption: "Create and send — recipients, survey, and settings",
      },
      {
        src: xrefMobileCollect,
        alt: "Xref mobile screens for adding references and answering questions",
        caption: "Collect — candidate and referee mobile flow",
      },
      {
        src: xrefReviewReport,
        alt: "Xref reference report with coverage, sentiment, and turnaround metrics",
        caption: "Review — reference report and sentiment",
      },
      {
        src: xrefInsights,
        alt: "Xref Insights dashboard showing Employee Net Promoter Score",
        caption: "Insights — Employee Net Promoter Score",
      },
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
