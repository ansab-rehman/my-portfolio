import type { ReactNode } from "react";

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
  "APIs",
  "API",
  "HTML5",
  "CSS",
  "JS",
  "Docker",
  "Git",
].sort((a, b) => b.length - a.length);

const ESCAPED = TECH_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");

/**
 * Wrap known tech / language terms in <strong class="tech-term">.
 */
export function emphasizeTech(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  const re = new RegExp(`(?<![A-Za-z0-9])(${ESCAPED})(?![A-Za-z0-9])`, "gi");
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    nodes.push(
      <strong key={`${match.index}-${match[0]}`} className="tech-term">
        {match[0]}
      </strong>,
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes.length > 0 ? nodes : [text];
}
