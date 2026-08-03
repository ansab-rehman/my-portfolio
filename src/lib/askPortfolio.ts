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
  "tell",
  "please",
  "we",
  "us",
  "our",
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
  memogent: ["architecture", "langgraph", "rag", "fdd", "due", "memogentai", "fiscalflow"],
  memogentai: ["memogent", "architecture", "langgraph", "rag", "fdd", "fiscalflow"],
  github: ["git", "repos", "repository", "code", "profile", "ansab"],
  linkedin: ["contact", "profile", "network", "hire"],
  fiscalflow: ["memogent", "fdd", "tauri", "excel", "rag", "langgraph", "due", "demo", "video"],
  demo: ["video", "walkthrough", "fiscalflow", "memogent"],
  video: ["demo", "walkthrough", "fiscalflow"],
  fdd: ["fiscalflow", "memogent", "due", "excel"],
  architecture: ["memogent", "pipeline", "langgraph"],
  hitl: ["human", "review", "approve", "interrupt"],
  human: ["hitl", "review"],
  coverage: ["testing", "test", "pytest"],
  testing: ["coverage", "test"],
  chatbot: ["retrieval", "knowledge", "ai"],
  django: ["python", "backend", "drf", "build", "app", "web"],
  fastapi: ["python", "api", "build"],
  python: ["django", "fastapi", "backend", "build", "app", "script"],
  app: ["application", "product", "build", "django", "python", "ai"],
  application: ["app", "product", "build"],
  build: ["make", "develop", "create", "ship", "hire"],
  make: ["build", "develop", "create"],
  develop: ["build", "make", "create"],
  ai: ["llm", "rag", "langchain", "langgraph", "agents", "app", "ml"],
  rbac: ["iam", "access", "role"],
  iam: ["rbac", "access"],
  ansab: ["rehman", "who", "about", "profile", "engineer", "fullstack", "services"],
  rehman: ["ansab", "who", "about", "profile"],
  who: ["ansab", "about", "profile", "introduction", "identity"],
  about: ["ansab", "who", "profile"],
  services: ["does", "do", "work", "offer", "provide", "ansab", "profile"],
  service: ["services", "does", "provide", "offer"],
  provide: ["services", "does", "offer", "work"],
  hire: ["contact", "email", "build", "available"],
  contact: ["email", "hire", "linkedin"],
  email: ["contact", "hire"],
  best: ["strengths", "strongest", "specialize", "skills", "expertise", "good"],
  strengths: ["best", "skills", "specialize"],
  skills: ["best", "craft", "stack", "specialize", "build"],
  specialize: ["best", "skills", "expertise"],
  laam: ["analytics", "dashboard", "buyer", "sqlite", "django", "fbt"],
  analytics: ["laam", "dashboard", "sql", "sqlite", "buyer"],
  dashboard: ["laam", "analytics", "react", "recharts"],
  fbt: ["laam", "lift", "confidence", "bought", "basket"],
  lift: ["fbt", "confidence", "basket", "laam"],
  sqlite: ["sql", "laam", "analytics"],
  vite: ["react", "typescript", "laam"],
  recharts: ["charts", "react", "laam", "analytics"],
  tanstack: ["query", "react", "laam"],
  docker: ["compose", "ops", "laam"],
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
  work: "Products",
  tenure: "Work experience",
  craft: "Skills",
  architecture: "Architecture",
};

const SCORE_THRESHOLD = 2.5;
const TOP_K = 3;
const CONTACT_EMAIL = "ansabrehman@hotmail.com";
const OPEN_TO_BUILD_ID = "craft-open-to-build";

/** Tokens that signal intent, not a specific technology. */
const CAPABILITY_GENERIC = new Set([
  "can",
  "could",
  "able",
  "build",
  "make",
  "develop",
  "create",
  "ship",
  "help",
  "hire",
  "work",
  "integrate",
  "implement",
  "app",
  "application",
  "product",
  "software",
  "project",
  "system",
  "api",
  "website",
  "web",
  "something",
  "anything",
  "together",
  "available",
  "new",
  "technology",
  "technologies",
  "tech",
  "stack",
  "framework",
  "library",
  "platform",
  "language",
  "tool",
  "contact",
  "email",
  "details",
  "please",
  "need",
  "want",
  "looking",
  "we",
  "us",
  "our",
]);

export function sourceHref(source: KnowledgeSource): string {
  return SOURCE_HREF[source];
}

export function sourceLabel(source: KnowledgeSource): string {
  return SOURCE_LABEL[source];
}

function isCapabilityQuery(raw: string): boolean {
  const q = raw.toLowerCase();
  const intent =
    /\b(can you|could you|can we|could we|are you able|do you|would you)\b/.test(
      q,
    );
  const action =
    /\b(build|make|develop|create|ship|help|hire|work on|integrate|implement)\b/.test(
      q,
    );
  return intent && action;
}

function shouldOfferBuildContact(raw: string): boolean {
  const q = raw.toLowerCase();
  if (isCapabilityQuery(q)) return true;
  if (
    /\b(what about|how about|do you (know|use|work with)|experience with|familiar with)\b/.test(
      q,
    )
  ) {
    return true;
  }
  if (
    /\b(technology|technologies|tech stack|framework|library|platform|language|tool|stack)\b/.test(
      q,
    )
  ) {
    return true;
  }
  if (
    /\b(build|make|develop|create|ship)\b.+\b(in|with|using|on)\b/.test(q) ||
    /\b(in|with|using)\s+[a-z0-9+#.]{2,}\b/.test(q)
  ) {
    return /\b(build|app|application|project|system|api|website|product|software)\b/.test(
      q,
    );
  }
  return false;
}

function capabilityContactAnswer(): string {
  return `Yes. I can help build that. For scope, timeline, and next steps, email me at ${CONTACT_EMAIL} and I will follow up with details.`;
}

function techSpecificTokens(tokens: string[]): string[] {
  return tokens.filter((t) => !CAPABILITY_GENERIC.has(t));
}

function chunkHasDirectTechHit(chunk: KnowledgeChunk, techTokens: string[]): boolean {
  if (techTokens.length === 0) return true;
  const hay = `${chunk.title} ${chunk.text} ${chunk.tags.join(" ")}`.toLowerCase();
  return techTokens.some(
    (t) => chunk.tags.some((tag) => tag === t) || hayHasToken(hay, t),
  );
}

function openToBuildMatch(): AskMatch | null {
  const fallback = chunks.find((c) => c.id === OPEN_TO_BUILD_ID);
  return fallback ? { chunk: fallback, score: 3 } : null;
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

/** Whole-token match in free text (avoids "rust" inside "trust"). */
function hayHasToken(hay: string, token: string): boolean {
  if (!token) return false;
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9+#.])${escaped}(?=[^a-z0-9+#.]|$)`).test(hay);
}

function tagMatches(tag: string, token: string): boolean {
  if (tag === token) return true;
  // Avoid short-tag false positives (e.g. "ai" inside "blockchain")
  if (token.length >= 4 && tag.includes(token)) return true;
  if (tag.length >= 4 && token.length >= 4 && token.includes(tag)) return true;
  return false;
}

function scoreChunk(chunk: KnowledgeChunk, tokens: string[], expanded: Set<string>): number {
  if (tokens.length === 0) return 0;

  const hay = `${chunk.title} ${chunk.text} ${chunk.tags.join(" ")}`.toLowerCase();
  let score = 0;
  let directHits = 0;

  for (const t of tokens) {
    const synonymHits = [...expanded].filter(
      (e) =>
        e !== t &&
        (hayHasToken(hay, e) || chunk.tags.some((tag) => tagMatches(tag, e))),
    );

    if (chunk.tags.some((tag) => tagMatches(tag, t))) {
      score += 2.4;
      directHits += 1;
    } else if (hayHasToken(hay, t)) {
      score += 1.4;
      directHits += 1;
    } else if (synonymHits.length > 0) {
      score += 0.85;
    }

    if (hayHasToken(chunk.title.toLowerCase(), t)) score += 0.6;
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
        "Ask something specific. Try what services I provide, or whether I can build a Django, Python, or AI app.",
    };
  }

  const expanded = expandTokens(tokens);
  let scored = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, tokens, expanded) }))
    .filter((m) => m.score >= SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  // Capability / "can we make X" questions must hit the named tech, not just
  // shared words like "build" or "app". Unknown tech → yes + email passage.
  if (shouldOfferBuildContact(query)) {
    const techTokens = techSpecificTokens(tokens);
    const techHits = scored.filter((m) =>
      chunkHasDirectTechHit(m.chunk, techTokens),
    );
    if (techHits.length > 0) {
      scored = techHits;
    } else {
      const fallback = openToBuildMatch();
      if (fallback) {
        return { empty: false, matches: [fallback], emptyAnswer: "" };
      }
      return {
        empty: true,
        matches: [],
        emptyAnswer: capabilityContactAnswer(),
      };
    }
  }

  scored = scored.slice(0, TOP_K);

  if (scored.length === 0) {
    if (shouldOfferBuildContact(query)) {
      const fallback = openToBuildMatch();
      if (fallback) {
        return { empty: false, matches: [fallback], emptyAnswer: "" };
      }
      return {
        empty: true,
        matches: [],
        emptyAnswer: capabilityContactAnswer(),
      };
    }

    return {
      empty: true,
      matches: [],
      emptyAnswer: `I do not have that detail indexed here yet. If you want to build something together, email me at ${CONTACT_EMAIL}.`,
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
      `You answer questions about Ansab Rehman for his portfolio site. Use only the provided passages. Write 2 to 4 short sentences in first person as Ansab. No em dashes. No bullet lists. If someone asks whether you can build something (including a new technology not fully covered), say yes and invite them to email ${CONTACT_EMAIL} for details. If the passages are not enough for a factual question, say you do not cover that here and suggest they ask about services, Django, Python, AI apps, or email ${CONTACT_EMAIL}.`,
    user: `Question: ${query}\n\nPassages:\n${passages}`,
  };
}

export const ASK_SUGGESTIONS = [
  "What services does Ansab provide?",
  "Can you build in Django?",
  "Can you build an AI app?",
  "Can you build a Python app?",
] as const;
