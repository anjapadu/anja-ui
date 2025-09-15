// src/utils/theme-core.test.ts
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isTheme,
  readStoredTheme,
  getSystemDark,
  applyMode,
  DEFAULT_STORAGE_KEY,
  SYSTEM_QUERY,
} from "./themeHelpers";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("theme-core", () => {
  it("isTheme works for valid/invalid values", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(true);
    expect(isTheme("nope")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });

  it("readStoredTheme returns a valid stored theme", () => {
    localStorage.setItem(DEFAULT_STORAGE_KEY, "dark");
    expect(readStoredTheme(DEFAULT_STORAGE_KEY)).toBe("dark");

    localStorage.setItem(DEFAULT_STORAGE_KEY, "weird");
    expect(readStoredTheme(DEFAULT_STORAGE_KEY)).toBeNull();
  });

  it("readStoredTheme returns null if localStorage.getItem throws (catch path)", () => {
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("boom");
      });
    expect(readStoredTheme(DEFAULT_STORAGE_KEY)).toBeNull();
    spy.mockRestore();
  });

  it("getSystemDark returns true/false based on matchMedia", () => {
    // stub: matches = true
    const mmTrue = vi
      .spyOn(window, "matchMedia")
      .mockImplementation((q: string) => {
        expect(q).toBe(SYSTEM_QUERY);
        return { matches: true } as unknown as MediaQueryList;
      });
    expect(getSystemDark()).toBe(true);
    mmTrue.mockRestore();

    // stub: matches = false
    const mmFalse = vi
      .spyOn(window, "matchMedia")
      .mockImplementation((q: string) => {
        expect(q).toBe(SYSTEM_QUERY);
        return { matches: false } as unknown as MediaQueryList;
      });
    expect(getSystemDark()).toBe(false);
    mmFalse.mockRestore();
  });

  it("getSystemDark returns false if matchMedia is missing or throws (catch path)", () => {
    // missing
    const orig = Object.getOwnPropertyDescriptor(window, "matchMedia");
    Object.defineProperty(window, "matchMedia", { value: undefined });
    expect(getSystemDark()).toBe(false);
    if (orig) Object.defineProperty(window, "matchMedia", orig);

    // throws
    const mmThrow = vi.spyOn(window, "matchMedia").mockImplementation(() => {
      throw new Error("nope");
    });
    expect(getSystemDark()).toBe(false);
    mmThrow.mockRestore();
  });

  it("applyMode toggles root classes and color-scheme", () => {
    document.documentElement.className = "";
    document.documentElement.style.colorScheme = "";

    applyMode("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    applyMode("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");
  });
});
