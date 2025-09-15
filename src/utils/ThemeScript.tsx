import { DEFAULT_STORAGE_KEY, SYSTEM_QUERY, type Theme } from "./themeHelpers";

export function ThemeScript({
  storageKey = DEFAULT_STORAGE_KEY,
  defaultTheme = "system",
}: {
  storageKey?: string;
  defaultTheme?: Theme;
}) {
  const code = `
try {
  var d = document.documentElement;
  var ls = localStorage.getItem(${JSON.stringify(storageKey)});
  var pref = ${JSON.stringify(defaultTheme)};
  var sysDark = window.matchMedia && window.matchMedia('${SYSTEM_QUERY}').matches;
  var t = (ls === 'light' || ls === 'dark') ? ls
        : (pref === 'light' || pref === 'dark') ? pref
        : (sysDark ? 'dark' : 'light');
  if (t === 'dark') d.classList.add('dark'); else d.classList.remove('dark');
  d.style.colorScheme = t;
} catch (e) {}
  `.trim();

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
