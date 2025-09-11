import { ThemeProvider } from "./utils/ThemeProvider";
import { ThemeScript } from "./utils/ThemeScript";

function App() {
  return (
    <>
      <ThemeScript />
      <ThemeProvider defaultTheme="system">
        <h1 className="text-6xl text-font-primary">Hello</h1>
      </ThemeProvider>
    </>
  );
}

export default App;
