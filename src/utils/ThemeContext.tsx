import { createContext } from "react";
import type { Theme } from "./themeHelpers";

export interface ThemeContextValue {
  theme: Theme;
  resolvedMode: "light" | "dark";
  setTheme: (next: Theme) => void;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
