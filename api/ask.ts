import {
  buildLlmPrompt,
  retrievePortfolio,
  type AskMatch,
} from "../src/lib/askPortfolio";

export const config = {
  runtime: "edge",
};

type Body = {
  query?: string;
};

const MAX_QUERY = 280;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function serializeMatches(matches: AskMatch[]) {
  return matches.map((m) => ({
    id: m.chunk.id,
    title: m.chunk.title,
    text: m.chunk.text,
    tags: m.chunk.tags,
    source: m.chunk.source,
    score: m.score,
  }));
}

async function generateWithGroq(
  system: string,
  user: string,
  apiKey: string,
): Promise<string | null> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.25,
      max_tokens: 220,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || null;
}

async function generateWithGemini(
  system: string,
  user: string,
  apiKey: string,
): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 220,
      },
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();
  return text || null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query || query.length > MAX_QUERY) {
    return json({ error: "Query must be 1 to 280 characters" }, 400);
  }

  const retrieved = retrievePortfolio(query);
  if (retrieved.empty) {
    return json({
      answer: retrieved.emptyAnswer,
      empty: true,
      mode: "local",
      matches: [],
    });
  }

  const { system, user } = buildLlmPrompt(query, retrieved.matches);
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  let answer: string | null = null;
  if (groqKey) {
    answer = await generateWithGroq(system, user, groqKey);
  }
  if (!answer && geminiKey) {
    answer = await generateWithGemini(system, user, geminiKey);
  }

  if (!answer) {
    // No key configured or provider error: tell the client to use local compose
    return json(
      {
        error: "LLM unavailable",
        empty: false,
        mode: "local",
        matches: serializeMatches(retrieved.matches),
      },
      503,
    );
  }

  return json({
    answer,
    empty: false,
    mode: "llm",
    matches: serializeMatches(retrieved.matches),
  });
}
