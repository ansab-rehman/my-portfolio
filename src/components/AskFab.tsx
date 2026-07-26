const ASK_INPUT_ID = "ask-query";

export function openAskPortfolio() {
  const section = document.getElementById("ask");
  const input = document.getElementById(ASK_INPUT_ID) as HTMLInputElement | null;

  if (window.location.hash !== "#ask") {
    history.replaceState(null, "", "#ask");
  }

  section?.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    input?.focus({ preventScroll: true });
  }, 450);
}

export function AskFab() {
  return (
    <button
      type="button"
      className="ask-fab"
      onClick={openAskPortfolio}
      aria-label="Ask AI about my work"
      title="Ask AI"
    >
      <span className="ask-fab__pulse" aria-hidden="true" />
      <span className="ask-fab__label">Ask AI</span>
    </button>
  );
}

export { ASK_INPUT_ID };
