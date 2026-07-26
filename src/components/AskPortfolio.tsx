import { useId, useState, type FormEvent } from "react";
import {
  ASK_SUGGESTIONS,
  askPortfolio,
  sourceHref,
  sourceLabel,
  type AskResult,
} from "../lib/askPortfolio";
import { useReveal } from "../hooks/useReveal";

export function AskPortfolio() {
  const { ref, visible } = useReveal<HTMLElement>();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [passagesOpen, setPassagesOpen] = useState(false);

  const runAsk = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setResult(askPortfolio(trimmed));
    setPassagesOpen(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runAsk(query);
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
          Client-side retrieval over a local resume index — no backend, no API
          keys. Token overlap + tag boost, then a short answer from the top
          passages.
        </p>
      </div>

      <form className="ask__form" onSubmit={onSubmit}>
        <label className="ask__label" htmlFor={inputId}>
          Ask a question
        </label>
        <div className="ask__row">
          <input
            id={inputId}
            className="ask__input"
            type="search"
            name="q"
            autoComplete="off"
            placeholder="What have you built with Elasticsearch?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn--primary ask__submit">
            Ask
          </button>
        </div>
      </form>

      <ul className="ask__suggestions" aria-label="Suggested questions">
        {ASK_SUGGESTIONS.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              className="ask__chip"
              onClick={() => runAsk(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>

      {result ? (
        <div
          className={`ask__result ${result.empty ? "ask__result--empty" : ""}`}
          role="status"
        >
          <p className="ask__answer">{result.answer}</p>

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
