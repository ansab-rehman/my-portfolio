import { useReveal } from "../hooks/useReveal";
import { openAskMessenger } from "../lib/askChatHistory";

export function AskPortfolio() {
  const { ref, visible } = useReveal<HTMLElement>();

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
          Chat with my work
        </h2>
        <p className="section__lede">
          Open the messenger in the corner to ask about services, Django,
          Python, AI apps, or anything you want to build. Your conversation is
          saved on this device.
        </p>
      </div>

      <button
        type="button"
        className="btn btn--primary ask__launch"
        onClick={() => openAskMessenger()}
      >
        Open chat
        <span className="btn__arrow" aria-hidden="true">
          ↗
        </span>
      </button>
    </section>
  );
}
