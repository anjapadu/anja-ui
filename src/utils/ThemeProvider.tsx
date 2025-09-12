import React, { useEffect, useMemo, useState } from "react";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";
import {
  DEFAULT_STORAGE_KEY,
  SYSTEM_QUERY,
  readStoredTheme,
  getSystemDark,
  applyMode,
  isTheme,
  type Theme,
} from "./theme-core";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = DEFAULT_STORAGE_KEY,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [systemDark, setSystemDark] = useState(() => getSystemDark());

  useEffect(() => {
    const stored = readStoredTheme(storageKey);
    if (stored && stored !== theme) setTheme(stored);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    const mq = window.matchMedia?.(SYSTEM_QUERY);
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setSystemDark("matches" in e ? e.matches : (e as MediaQueryList).matches);
    mq.addEventListener?.("change", onChange);
    return () => {
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  useEffect(() => {
    const mode = theme === "system" ? (systemDark ? "dark" : "light") : theme;
    applyMode(mode);
    try {
      if (theme === "system") localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, theme);
    } catch {
      console.error("Was NOT able to setup localStorage item");
    }
  }, [theme, systemDark, storageKey]);

  const value = useMemo<ThemeContextValue>(() => {
    const resolved =
      theme === "system" ? (systemDark ? "dark" : "light") : theme;
    return {
      theme,
      resolvedMode: resolved,
      setTheme: (next) => setTheme(isTheme(next) ? next : "system"),
      toggle: () =>
        setTheme((p) =>
          p === "light" ? "dark" : p === "dark" ? "system" : "light"
        ),
    };
  }, [theme, systemDark]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
