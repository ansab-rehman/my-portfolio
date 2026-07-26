import {
  askPortfolio,
  sourceHref,
  sourceLabel,
  type AskResult,
  type KnowledgeSource,
} from "./askPortfolio";

type ApiAskResponse = {
  answer: string;
  empty: boolean;
  mode: "llm" | "local";
  matches: {
    id: string;
    title: string;
    text: string;
    tags: string[];
    source: KnowledgeSource;
    score: number;
  }[];
  error?: string;
};

/**
 * Prefer the Vercel /api/ask LLM route; fall back to local retrieval compose.
 */
export async function askPortfolioSmart(query: string): Promise<AskResult> {
  const local = askPortfolio(query);

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      return local;
    }

    const data = (await res.json()) as ApiAskResponse;
    if (!data?.answer || typeof data.answer !== "string") {
      return local;
    }

    return {
      answer: data.answer,
      empty: Boolean(data.empty),
      mode: data.mode === "llm" ? "llm" : "local",
      matches:
        data.matches?.map((m) => ({
          chunk: {
            id: m.id,
            title: m.title,
            text: m.text,
            tags: m.tags,
            source: m.source,
          },
          score: m.score,
        })) ?? local.matches,
    };
  } catch {
    return local;
  }
}

export { sourceHref, sourceLabel };
