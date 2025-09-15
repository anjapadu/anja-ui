export type Theme = "light" | "dark" | "system";
export const DEFAULT_STORAGE_KEY = "anja-ui-theme";
export const SYSTEM_QUERY = "(prefers-color-scheme: dark)";

export const isTheme = (x: unknown): x is Theme =>
  x === "light" || x === "dark" || x === "system";

export const readStoredTheme = (key: string): Theme | null => {
  try {
    const raw = localStorage.getItem(key);
    return isTheme(raw) ? raw : null;
  } catch {
    return null;
  }
};

export const getSystemDark = (): boolean => {
  try {
    return !!window.matchMedia && window.matchMedia(SYSTEM_QUERY).matches;
  } catch {
    return false;
  }
};

export const applyMode = (mode: "light" | "dark") => {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
};
