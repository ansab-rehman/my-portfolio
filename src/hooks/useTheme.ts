import { useEffect, useState } from "react";

export type Theme = "night" | "day";

const STORAGE_KEY = "ansab-theme";

function readStored(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "day" || stored === "night") return stored;
  } catch {
    /* ignore */
  }
  return "night";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme === "day" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "night";
    const initial = readStored();
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "night" ? "day" : "night"));

  return { theme, toggle, isDay: theme === "day" };
}
