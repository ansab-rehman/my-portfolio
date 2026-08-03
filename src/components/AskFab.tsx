import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ASK_SUGGESTIONS, type AskResult } from "../lib/askPortfolio";
import { askPortfolioSmart, sourceHref, sourceLabel } from "../lib/askClient";
import {
  ASK_OPEN_EVENT,
  clearAskChatHistory,
  loadAskChatHistory,
  openAskMessenger,
  saveAskChatHistory,
  type ChatMessage,
} from "../lib/askChatHistory";

export const ASK_INPUT_ID = "ask-query";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function streamText(
  full: string,
  onUpdate: (partial: string) => void,
  signal: { cancelled: boolean },
): Promise<void> {
  return new Promise((resolve) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onUpdate(full);
      resolve();
      return;
    }

    let index = 0;
    const step = () => {
      if (signal.cancelled) {
        onUpdate(full);
        resolve();
        return;
      }

      const remaining = full.length - index;
      const burst =
        remaining > 80 ? 4 : remaining > 24 ? 2 + Math.floor(Math.random() * 2) : 1;
      index = Math.min(full.length, index + burst);
      onUpdate(full.slice(0, index));

      if (index >= full.length) {
        resolve();
        return;
      }

      const ch = full[index - 1] ?? "";
      const delay =
        ch === "\n"
          ? 42
          : ch === "." || ch === "!" || ch === "?"
            ? 55 + Math.random() * 40
            : ch === "," || ch === ";"
              ? 28
              : ch === " "
                ? 14 + Math.random() * 10
                : 10 + Math.random() * 16;

      window.setTimeout(step, delay);
    };

    step();
  });
}

function AssistantExtras({
  result,
  open,
  onToggle,
}: {
  result: AskResult;
  open: boolean;
  onToggle: () => void;
}) {
  const sources = [...new Set(result.matches.map((m) => m.chunk.source))];

  return (
    <div className="ask-chat__extras">
      {!result.empty && result.mode ? (
        <p className="ask-chat__mode">
          {result.mode === "llm"
            ? "Drafted with LLM over retrieved passages"
            : "Local retrieval (LLM unavailable)"}
        </p>
      ) : null}

      {sources.length > 0 ? (
        <p className="ask-chat__sources">
          <span className="ask-chat__sources-label">Sources</span>
          {sources.map((source) => (
            <a
              key={source}
              className="ask__source-chip"
              href={
                source === "architecture" ? "#memogent" : sourceHref(source)
              }
              onClick={() => {
                /* keep messenger open while jumping to a section */
              }}
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
            aria-expanded={open}
            onClick={onToggle}
          >
            {open ? "Hide matched passages" : "Show matched passages"}
          </button>
          {open ? (
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
  );
}

export function openAskPortfolio() {
  openAskMessenger();
}

export function AskFab() {
  const labelId = useId();
  const panelId = useId();
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    typeof window === "undefined" ? [] : loadAskChatHistory(),
  );
  const [openPassagesId, setOpenPassagesId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const streamCancelRef = useRef({ cancelled: false });

  const busy = loading || Boolean(streamingId);

  const focusInput = () => {
    window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 80);
  };

  const setOpenAndFocus = (next: boolean) => {
    setOpen(next);
    if (next) focusInput();
  };

  useEffect(() => {
    const openFromEvent = () => setOpenAndFocus(true);
    window.addEventListener(ASK_OPEN_EVENT, openFromEvent);
    return () => window.removeEventListener(ASK_OPEN_EVENT, openFromEvent);
  }, []);

  useEffect(() => {
    const onAskLink = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.('a[href="#ask"]');
      if (!link) return;
      event.preventDefault();
      openAskMessenger();
      document.getElementById("ask")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    document.addEventListener("click", onAskLink);
    return () => document.removeEventListener("click", onAskLink);
  }, []);

  useEffect(() => {
    if (streamingId) return;
    saveAskChatHistory(messages);
  }, [messages, streamingId]);

  useEffect(() => {
    if (!open) return;
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, streamingId, open]);

  useEffect(() => {
    return () => {
      streamCancelRef.current.cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const runAsk = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || busy) return;

    const userMessage: ChatMessage = {
      id: newId(),
      role: "user",
      text: trimmed,
    };

    setDraft("");
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    streamCancelRef.current = { cancelled: false };

    try {
      const next = await askPortfolioSmart(trimmed);
      const assistantId = newId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          text: "",
        },
      ]);
      setLoading(false);
      setStreamingId(assistantId);

      await streamText(
        next.answer,
        (partial) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, text: partial } : m,
            ),
          );
        },
        streamCancelRef.current,
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, text: next.answer, result: next }
            : m,
        ),
      );
    } catch {
      const fallback =
        "Something went wrong while answering. Try again in a moment.";
      const assistantId = newId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          text: "",
        },
      ]);
      setLoading(false);
      setStreamingId(assistantId);
      await streamText(
        fallback,
        (partial) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, text: partial } : m,
            ),
          );
        },
        streamCancelRef.current,
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: fallback,
                result: {
                  answer: fallback,
                  empty: true,
                  matches: [],
                  mode: "local",
                },
              }
            : m,
        ),
      );
    } finally {
      setLoading(false);
      setStreamingId(null);
      focusInput();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runAsk(draft);
  };

  const clearHistory = () => {
    streamCancelRef.current.cancelled = true;
    clearAskChatHistory();
    setMessages([]);
    setOpenPassagesId(null);
    setStreamingId(null);
    setLoading(false);
    focusInput();
  };

  const empty = messages.length === 0 && !busy;

  return (
    <div className={`ask-messenger${open ? " is-open" : ""}`}>
      {open ? (
        <section
          className="ask-messenger__panel"
          id={panelId}
          aria-label="Ask Ansab chat"
          role="dialog"
          aria-modal="false"
        >
          <header className="ask-messenger__header">
            <div className="ask-messenger__identity">
              <span className="ask-messenger__avatar" aria-hidden="true">
                A
              </span>
              <div>
                <p className="ask-messenger__title">Ask Ansab</p>
                <p className="ask-messenger__status">
                  {busy ? "Generating…" : "Usually replies instantly"}
                </p>
              </div>
            </div>
            <div className="ask-messenger__header-actions">
              {messages.length > 0 ? (
                <button
                  type="button"
                  className="ask-messenger__icon-btn"
                  onClick={clearHistory}
                  aria-label="Clear chat history"
                  title="Clear chat"
                >
                  Clear
                </button>
              ) : null}
              <button
                type="button"
                className="ask-messenger__icon-btn ask-messenger__icon-btn--close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </header>

          <div
            className="ask-messenger__thread"
            ref={threadRef}
            role="log"
            aria-live="polite"
          >
            {empty ? (
              <div className="ask-chat__empty">
                <p className="ask-chat__empty-title">Hi — ask me anything</p>
                <p className="ask-chat__empty-copy">
                  Projects, roles, stack, or how I build. History stays on this
                  device.
                </p>
                <ul
                  className="ask__suggestions ask-chat__starters"
                  aria-label="Suggested questions"
                >
                  {ASK_SUGGESTIONS.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        className="ask__chip"
                        disabled={busy}
                        onClick={() => void runAsk(suggestion)}
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`ask-chat__row ask-chat__row--${message.role}`}
              >
                <div
                  className={`ask-chat__bubble ask-chat__bubble--${message.role}${
                    message.result?.empty ? " ask-chat__bubble--muted" : ""
                  }${streamingId === message.id ? " is-streaming" : ""}`}
                >
                  <p className="ask-chat__text">
                    {message.text}
                    {streamingId === message.id ? (
                      <span className="ask-chat__caret" aria-hidden="true" />
                    ) : null}
                  </p>
                  {message.role === "assistant" && message.result ? (
                    <AssistantExtras
                      result={message.result}
                      open={openPassagesId === message.id}
                      onToggle={() =>
                        setOpenPassagesId((id) =>
                          id === message.id ? null : message.id,
                        )
                      }
                    />
                  ) : null}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="ask-chat__row ask-chat__row--assistant">
                <div
                  className="ask-chat__bubble ask-chat__bubble--assistant ask-chat__bubble--typing"
                  role="status"
                >
                  <span className="ask-chat__dot" />
                  <span className="ask-chat__dot" />
                  <span className="ask-chat__dot" />
                  <span className="ask-chat__typing-label">Thinking…</span>
                </div>
              </div>
            ) : null}
          </div>

          {!empty ? (
            <ul
              className="ask__suggestions ask-messenger__quick"
              aria-label="Suggested follow-ups"
            >
              {ASK_SUGGESTIONS.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    className="ask__chip"
                    disabled={busy}
                    onClick={() => void runAsk(suggestion)}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <form className="ask-messenger__composer" onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor={ASK_INPUT_ID} id={labelId}>
              Message
            </label>
            <div className="ask__row">
              <input
                ref={inputRef}
                id={ASK_INPUT_ID}
                className="ask__input"
                type="text"
                name="q"
                autoComplete="off"
                placeholder="Ask about Django, Python, AI apps, or services…"
                value={draft}
                disabled={busy}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn--primary ask__submit"
                disabled={busy || !draft.trim()}
              >
                {busy ? "…" : "Send"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className={`ask-fab${open ? " is-open" : ""}`}
        onClick={() => setOpenAndFocus(!open)}
        aria-label={open ? "Close Ask AI chat" : "Ask AI about my work"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        title={open ? "Close chat" : "Ask AI"}
      >
        {open ? (
          <span className="ask-fab__label" aria-hidden="true">
            ×
          </span>
        ) : (
          <>
            <span className="ask-fab__pulse" aria-hidden="true" />
            <span className="ask-fab__label">Ask AI</span>
          </>
        )}
      </button>
    </div>
  );
}
