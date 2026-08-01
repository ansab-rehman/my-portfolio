import { useEffect, useId, useState, type FormEvent } from "react";
import { ASK_SUGGESTIONS, type AskResult } from "../lib/askPortfolio";
import { askPortfolioSmart, sourceHref, sourceLabel } from "../lib/askClient";
import { useReveal } from "../hooks/useReveal";
import { ASK_INPUT_ID } from "./AskFab";

export function AskPortfolio() {
  const { ref, visible } = useReveal<HTMLElement>();
  const labelId = useId();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [passagesOpen, setPassagesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.hash !== "#ask") return;
    const input = document.getElementById(ASK_INPUT_ID) as HTMLInputElement | null;
    window.setTimeout(() => input?.focus({ preventScroll: true }), 300);
  }, []);

  const runAsk = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || loading) return;
    setQuery(trimmed);
    setPassagesOpen(false);
    setLoading(true);
    try {
      const next = await askPortfolioSmart(trimmed);
      setResult(next);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runAsk(query);
  };

  const sources = result
    ? [...new Set(result.matches.map((m) => m.chunk.source))]
    : [];

  return (
    <section
      className={`section ask reveal ${visible ? "is-visible" : ""}`}
      id="ask"
      aria-labelledby="ask-heading"
      ref={ref}
    >
      <div className="section__header">
        <p className="section__eyebrow">Ask the portfolio</p>
        <h2 className="section__title" id="ask-heading">
          Query my work
        </h2>
        <p className="section__lede">
          Retrieves from a local resume index, then drafts a short answer with a
          free LLM when available. Falls back to passage matching offline or
          without an API key.
        </p>
      </div>

      <form className="ask__form" onSubmit={onSubmit}>
        <label className="ask__label" htmlFor={ASK_INPUT_ID} id={labelId}>
          Ask a question
        </label>
        <div className="ask__row">
          <input
            id={ASK_INPUT_ID}
            className="ask__input"
            type="search"
            name="q"
            autoComplete="off"
            placeholder="Who is Ansab? What about LAAM Analytics?"
            value={query}
            disabled={loading}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn--primary ask__submit"
            disabled={loading}
          >
            {loading ? "Asking…" : "Ask"}
          </button>
        </div>
      </form>

      <ul className="ask__suggestions" aria-label="Suggested questions">
        {ASK_SUGGESTIONS.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              className="ask__chip"
              disabled={loading}
              onClick={() => void runAsk(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>

      {loading && !result ? (
        <p className="ask__pending" role="status">
          Retrieving passages and drafting an answer…
        </p>
      ) : null}

      {result ? (
        <div
          className={`ask__result ${result.empty ? "ask__result--empty" : ""} ${loading ? "ask__result--pending" : ""}`}
          role="status"
          aria-busy={loading}
        >
          <p className="ask__answer">{result.answer}</p>

          {!result.empty && result.mode ? (
            <p className="ask__mode">
              {result.mode === "llm"
                ? "Answer drafted with LLM over retrieved passages"
                : "Local retrieval answer (LLM unavailable)"}
            </p>
          ) : null}

          {sources.length > 0 ? (
            <p className="ask__sources">
              <span className="ask__sources-label">Sources</span>
              {sources.map((source) => (
                <a
                  key={source}
                  className="ask__source-chip"
                  href={
                    source === "architecture" ? "#memogent" : sourceHref(source)
                  }
                >
                  {sourceLabel(source)}
                </a>
              ))}
            </p>
          ) : null}

          {result.matches.length > 0 ? (
            <div className="ask__passages">
              <button
                type="button"
                className="ask__passages-toggle"
                aria-expanded={passagesOpen}
                onClick={() => setPassagesOpen((v) => !v)}
              >
                {passagesOpen ? "Hide matched passages" : "Show matched passages"}
              </button>
              {passagesOpen ? (
                <ol className="ask__passage-list">
                  {result.matches.map(({ chunk, score }) => (
                    <li key={chunk.id} className="ask__passage">
                      <div className="ask__passage-meta">
                        <span className="ask__passage-title">{chunk.title}</span>
                        <span className="ask__passage-score">
                          score {score.toFixed(1)}
                        </span>
                      </div>
                      <p className="ask__passage-text">{chunk.text}</p>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
