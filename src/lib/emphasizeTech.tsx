import type { ReactNode } from "react";

/** Lead-in labels bolded with their trailing colon (e.g. tenure impact lines). */
const LEAD_LABELS = [
  "System Architecture",
  "AI & Automations",
  "Client Delivery",
].sort((a, b) => b.length - a.length);

/** Longer phrases first so "LangGraph" wins over shorter tokens. */
const TECH_TERMS = [
  "human-in-the-loop",
  "role-based access control",
  "knowledge-base",
  "Elastic APM",
  "Bank Alfalah",
  "LLM integrations",
  "AI agent workflows",
  "AI agents",
  "AI agent",
  "AI-powered",
  "TypeScript",
  "JavaScript",
  "Elasticsearch",
  "LangChain",
  "LangGraph",
  "OpenPyXL",
  "DataDog",
  "LanceDB",
  "FastAPI",
  "Django",
  "Angular",
  "Python",
  "React",
  "Tauri",
  "Redis",
  "Celery",
  "Sentry",
  "Pytest",
  "Jinja",
  "AJAX",
  "Excel",
  "PowerPoint",
  "Markdown",
  "PPTX",
  "PDF",
  "SSE",
  "REST",
  "OCR",
  "NLP",
  "RAG",
  "LLM",
  "AWS IAM",
  "AWS",
  "IAM",
  "RBAC",
  "BM25",
  "SQLite",
  "SQL",
  "ERP",
  "CMS",
  "FDD",
  "HITL",
  "HTML5",
  "CSS",
  "JS",
  "Docker",
  "Git",
].sort((a, b) => b.length - a.length);

const LABEL_ESCAPED = LEAD_LABELS.map((t) =>
  t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");

const TECH_ESCAPED = TECH_TERMS.map((t) =>
  t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");

/**
 * Wrap known lead labels and tech / language terms in <strong>.
 */
export function emphasizeTech(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  const re = new RegExp(
    `(?<![A-Za-z0-9])(?:(${LABEL_ESCAPED}):|(${TECH_ESCAPED}))(?![A-Za-z0-9])`,
    "gi",
  );
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const isLabel = Boolean(match[1]);
    const value = isLabel ? `${match[1]}:` : match[2];
    nodes.push(
      <strong
        key={`${match.index}-${value}`}
        className={isLabel ? "lead-label" : "tech-term"}
      >
        {value}
      </strong>,
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes.length > 0 ? nodes : [text];
}
