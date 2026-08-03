import type { AskResult } from "./askPortfolio";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  result?: AskResult;
};

const STORAGE_KEY = "ansab-portfolio-ask-chat.v1";
const MAX_MESSAGES = 60;

type StoredPayload = {
  version: 1;
  messages: ChatMessage[];
};

export function loadAskChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredPayload;
    if (parsed?.version !== 1 || !Array.isArray(parsed.messages)) return [];
    return parsed.messages
      .filter(
        (m) =>
          m &&
          typeof m.id === "string" &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.text === "string",
      )
      .slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

export function saveAskChatHistory(messages: ChatMessage[]) {
  try {
    const payload: StoredPayload = {
      version: 1,
      messages: messages.slice(-MAX_MESSAGES),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function clearAskChatHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const ASK_OPEN_EVENT = "portfolio-ask-open";

export function openAskMessenger() {
  if (window.location.hash !== "#ask") {
    history.replaceState(null, "", "#ask");
  }
  window.dispatchEvent(new CustomEvent(ASK_OPEN_EVENT));
}
