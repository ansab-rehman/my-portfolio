import knowledge from "../data/portfolio-knowledge.json";

export type KnowledgeSource =
  | "profile"
  | "work"
  | "tenure"
  | "craft"
  | "architecture";

export type KnowledgeChunk = {
  id: string;
  title: string;
  text: string;
  tags: string[];
  source: KnowledgeSource;
};

export type AskMatch = {
  chunk: KnowledgeChunk;
  score: number;
};

export type AskResult = {
  answer: string;
  matches: AskMatch[];
  empty: boolean;
  /** How the answer was produced. */
  mode?: "local" | "llm";
};

export type RetrieveResult = {
  matches: AskMatch[];
  empty: boolean;
  emptyAnswer: string;
};

const chunks = knowledge as KnowledgeChunk[];

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "what",
  "have",
  "you",
  "your",
  "built",
  "build",
  "how",
  "do",
  "does",
  "did",
  "is",
  "are",
  "was",
  "were",
  "me",
  "my",
  "about",
  "from",
  "that",
  "this",
  "any",
  "can",
  "tell",
]);

/** Expand query tokens so related vocabulary still scores. */
const SYNONYMS: Record<string, string[]> = {
  elasticsearch: ["search", "elastic", "indexing", "apm"],
  elastic: ["elasticsearch", "search", "apm"],
  search: ["elasticsearch", "indexing", "retrieval"],
  rag: ["retrieval", "lancedb", "embed", "chunks"],
  retrieval: ["rag", "search", "chatbot"],
  langgraph: ["orchestration", "pipeline", "graph", "memogent"],
  langchain: ["langgraph", "rag", "ai"],
  memogent: ["architecture", "langgraph", "rag", "fdd", "due", "memogentai"],
  memogentai: ["memogent", "architecture", "langgraph", "rag", "fdd"],
  architecture: ["memogent", "pipeline", "langgraph"],
  hitl: ["human", "review", "approve", "interrupt"],
  human: ["hitl", "review"],
  coverage: ["testing", "test", "pytest"],
  testing: ["coverage", "test"],
  chatbot: ["retrieval", "knowledge", "ai"],
  django: ["python", "backend"],
  fastapi: ["python", "api"],
  rbac: ["iam", "access", "role"],
  iam: ["rbac", "access"],
};

const SOURCE_HREF: Record<KnowledgeSource, string> = {
  profile: "#top",
  work: "#work",
  tenure: "#tenure",
  craft: "#craft",
  architecture: "#work",
};

const SOURCE_LABEL: Record<KnowledgeSource, string> = {
  profile: "Profile",
  work: "Selected work",
  tenure: "Tenure",
  craft: "Craft",
  architecture: "Architecture",
};

const SCORE_THRESHOLD = 2.5;
const TOP_K = 3;

export function sourceHref(source: KnowledgeSource): string {
  return SOURCE_HREF[source];
}

export function sourceLabel(source: KnowledgeSource): string {
  return SOURCE_LABEL[source];
}

export function normalizeQuery(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function expandTokens(tokens: string[]): Set<string> {
  const out = new Set<string>();
  for (const t of tokens) {
    out.add(t);
    const syns = SYNONYMS[t];
    if (syns) for (const s of syns) out.add(s);
  }
  return out;
}

function tagMatches(tag: string, token: string): boolean {
  if (tag === token) return true;
  // Avoid short-tag false positives (e.g. "ai" inside "blockchain")
  if (token.length >= 3 && tag.includes(token)) return true;
  if (tag.length >= 4 && token.includes(tag)) return true;
  return false;
}

function scoreChunk(chunk: KnowledgeChunk, tokens: string[], expanded: Set<string>): number {
  if (tokens.length === 0) return 0;

  const hay = `${chunk.title} ${chunk.text} ${chunk.tags.join(" ")}`.toLowerCase();
  let score = 0;
  let directHits = 0;

  for (const t of tokens) {
    const synonymHits = [...expanded].filter(
      (e) => e !== t && (hay.includes(e) || chunk.tags.some((tag) => tagMatches(tag, e))),
    );

    if (chunk.tags.some((tag) => tagMatches(tag, t))) {
      score += 2.4;
      directHits += 1;
    } else if (hay.includes(t)) {
      score += 1.4;
      directHits += 1;
    } else if (synonymHits.length > 0) {
      score += 0.85;
    }

    if (chunk.title.toLowerCase().includes(t)) score += 0.6;
  }

  // Require at least one direct (non-synonym-only) hit so unrelated queries stay empty
  if (directHits === 0) return 0;

  return score;
}

function composeAnswer(matches: AskMatch[]): string {
  const top = matches[0]?.chunk;
  if (!top) return "";

  const second = matches[1]?.chunk;
  const lead = top.text.length > 220 ? `${top.text.slice(0, 217).trim()}…` : top.text;

  if (!second || second.id === top.id) {
    return lead;
  }

  const bridge =
    second.source === top.source
      ? ` Related: ${second.title}. ${second.text.slice(0, 120).trim()}${second.text.length > 120 ? "…" : ""}`
      : ` Also see ${SOURCE_LABEL[second.source].toLowerCase()}: ${second.title}.`;

  return `${lead}${bridge}`;
}

export function retrievePortfolio(query: string): RetrieveResult {
  const tokens = normalizeQuery(query);
  if (tokens.length === 0) {
    return {
      empty: true,
      matches: [],
      emptyAnswer:
        "Ask something specific. Try Elasticsearch, MemogentAI architecture, test coverage, or RAG.",
    };
  }

  const expanded = expandTokens(tokens);
  const scored = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, tokens, expanded) }))
    .filter((m) => m.score >= SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);

  if (scored.length === 0) {
    return {
      empty: true,
      matches: [],
      emptyAnswer:
        "I don’t have that in this portfolio index. Try Elasticsearch, MemogentAI, Django, or RAG.",
    };
  }

  return { empty: false, matches: scored, emptyAnswer: "" };
}

export function askPortfolio(query: string): AskResult {
  const retrieved = retrievePortfolio(query);
  if (retrieved.empty) {
    return {
      empty: true,
      answer: retrieved.emptyAnswer,
      matches: [],
      mode: "local",
    };
  }

  return {
    empty: false,
    answer: composeAnswer(retrieved.matches),
    matches: retrieved.matches,
    mode: "local",
  };
}

export function buildLlmPrompt(query: string, matches: AskMatch[]): {
  system: string;
  user: string;
} {
  const passages = matches
    .map(
      (m, i) =>
        `[${i + 1}] (${m.chunk.source}) ${m.chunk.title}\n${m.chunk.text}`,
    )
    .join("\n\n");

  return {
    system:
      "You answer questions about Ansab Rehman for his portfolio site. Use only the provided passages. Write 2 to 4 short sentences in first person as Ansab. No em dashes. No bullet lists. If the passages are not enough, say you do not cover that in this portfolio and suggest Elasticsearch, MemogentAI, Django, or RAG.",
    user: `Question: ${query}\n\nPassages:\n${passages}`,
  };
}

export const ASK_SUGGESTIONS = [
  "What have you built with Elasticsearch?",
  "How does MemogentAI architecture work?",
  "Tell me about test coverage",
  "What RAG pipelines have you built?",
] as const;
