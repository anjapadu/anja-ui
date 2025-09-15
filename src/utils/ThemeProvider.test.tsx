import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./useTheme";
import { DEFAULT_STORAGE_KEY } from "./themeHelpers";

function makeMatchMediaStub(initialMatches: boolean) {
  const listeners = new Set<
    (this: MediaQueryList, ev: MediaQueryListEvent) => unknown
  >();

  const mql: MediaQueryList & {
    flip: (next: boolean) => void;
    _setMedia: (q: string) => void;
  } = {
    media: "(prefers-color-scheme: dark)",
    matches: initialMatches,
    onchange: null,
    addEventListener: ((type, listener) => {
      if (type !== "change") return;
      const fn =
        typeof listener === "function"
          ? listener
          : (listener as EventListenerObject).handleEvent;
      if (typeof fn === "function") {
        listeners.add(
          fn as (this: MediaQueryList, ev: MediaQueryListEvent) => unknown
        );
      }
    }) as EventTarget["addEventListener"],
    removeEventListener: ((type, listener) => {
      if (type !== "change") return;
      const fn =
        typeof listener === "function"
          ? listener
          : (listener as EventListenerObject).handleEvent;
      if (typeof fn === "function") {
        listeners.delete(
          fn as (this: MediaQueryList, ev: MediaQueryListEvent) => unknown
        );
      }
    }) as EventTarget["removeEventListener"],
    // legacy no-ops
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
    // test helpers
    flip: (next: boolean) => {
      (mql as { matches: boolean }).matches = next;
      const ev = new Event("change") as MediaQueryListEvent;
      Object.defineProperty(ev, "matches", { value: next });
      Object.defineProperty(ev, "media", { value: mql.media });
      listeners.forEach((l) => l.call(mql, ev));
      mql.onchange?.call(mql, ev);
    },
    _setMedia: (q: string) => {
      (mql as { media: string }).media = q;
    },
  };

  const matchMediaImpl: (query: string) => MediaQueryList = (query) => {
    mql._setMedia(query);
    return mql;
  };

  return { matchMediaImpl, mql };
}

function Consumer() {
  const { theme, resolvedMode, setTheme, toggle } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="resolved">{resolvedMode}</div>
      <button onClick={() => setTheme("dark")}>to-dark</button>
      <button onClick={() => setTheme("light")}>to-light</button>
      <button onClick={() => setTheme("system")}>to-system</button>
      <button onClick={toggle}>toggle</button>
      <button onClick={() => (setTheme as (t: unknown) => void)("nope")}>
        to-invalid
      </button>
    </div>
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ThemeProvider (integration)", () => {
  it("breaks without provider", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrowError(
      "useTheme must be used within <ThemeProvider>"
    );

    errSpy.mockRestore();
  });
  it("initial state, explicit changes, OS flip, toggle cycle, invalid coercion", async () => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.style.colorScheme = "";

    const { matchMediaImpl, mql } = makeMatchMediaStub(false); // system = light
    Object.defineProperty(window, "matchMedia", {
      value: matchMediaImpl,
      configurable: true,
    });

    const { unmount } = render(
      <ThemeProvider defaultTheme="system" storageKey={DEFAULT_STORAGE_KEY}>
        <Consumer />
      </ThemeProvider>
    );

    // Initial: system (light)
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("resolved").textContent).toBe("light");
    expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");

    // Explicit dark
    fireEvent.click(screen.getByText("to-dark"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Back to system (uses current system = light), storage removed
    fireEvent.click(screen.getByText("to-system"));
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("resolved").textContent).toBe("light");
    expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();

    // Simulate OS flips to dark
    await act(async () => {
      mql.flip(true);
    });
    await waitFor(() =>
      expect(screen.getByTestId("resolved").textContent).toBe("dark")
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    // Toggle cycles: system → light
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("resolved").textContent).toBe("light");
    expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBe("light");

    // Toggle cycles: light → dark
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBe("dark");

    // Toggle cycles: dark → system (storage removed, resolves with system=dark)
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();

    // Invalid input coerces to "system" (still resolves to dark)
    fireEvent.click(screen.getByText("to-invalid"));
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");

    // Unmount to execute cleanup (removeEventListener path)
    unmount();
  });

  it("reads stored theme on mount (overrides default system)", () => {
    localStorage.clear();
    localStorage.setItem(DEFAULT_STORAGE_KEY, "dark");

    // system could be anything; shouldn't matter because stored wins
    const { matchMediaImpl } = makeMatchMediaStub(false);
    Object.defineProperty(window, "matchMedia", {
      value: matchMediaImpl,
      configurable: true,
    });

    render(
      <ThemeProvider defaultTheme="system" storageKey={DEFAULT_STORAGE_KEY}>
        <Consumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("gracefully handles localStorage errors (catch branch)", () => {
    localStorage.clear();
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("nope");
      });
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem");
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { matchMediaImpl } = makeMatchMediaStub(false);
    Object.defineProperty(window, "matchMedia", {
      value: matchMediaImpl,
      configurable: true,
    });

    render(
      <ThemeProvider defaultTheme="system" storageKey={DEFAULT_STORAGE_KEY}>
        <Consumer />
      </ThemeProvider>
    );

    // Switch to dark → setItem throws → catch path logs error
    fireEvent.click(screen.getByText("to-dark"));
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(setItemSpy).toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalled();

    // Back to system → removeItem should be attempted even with previous error
    fireEvent.click(screen.getByText("to-system"));
    expect(removeSpy).toHaveBeenCalled();
  });

  it("works when matchMedia is missing (early return branch)", () => {
    localStorage.clear();
    // remove matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
    });

    render(
      <ThemeProvider defaultTheme="system" storageKey={DEFAULT_STORAGE_KEY}>
        <Consumer />
      </ThemeProvider>
    );

    // Without matchMedia, it still resolves from default systemDark=false → light
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("resolved").textContent).toBe("light");

    // Explicit set still applies/persists
    fireEvent.click(screen.getByText("to-dark"));
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBe("dark");
  });

  it('handles change callback without "matches" (fallback branch)', () => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.style.colorScheme = "not valid value";

    // Stub matchMedia so that addEventListener immediately invokes the listener
    // with an object that lacks "matches" → exercises the else branch:
    // setSystemDark("matches" in e ? e.matches : (e as MediaQueryList).matches)
    const mql = {
      media: "(prefers-color-scheme: dark)",
      addEventListener: (
        type: string,
        listener: (this: MediaQueryList, ev: unknown) => unknown
      ) => {
        if (type !== "change") return;
        listener.call(mql as unknown as MediaQueryList, {} as unknown);
      },
    } as unknown as MediaQueryList;

    Object.defineProperty(window, "matchMedia", {
      value: () => mql,
      configurable: true,
    });

    render(
      <ThemeProvider defaultTheme="system" storageKey={DEFAULT_STORAGE_KEY}>
        <Consumer />
      </ThemeProvider>
    );

    // Still resolves to light; the important bit is that the branch ran
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("resolved").textContent).toBe("light");
  });
});
