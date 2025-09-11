import { defineConfig } from "tsup";

export default defineConfig({
  // entry: ["src/index.ts"],
  entry: [
    "src/index.ts",
    "src/components/atoms/Badge/index.ts",
    "src/components/atoms/Button/index.ts",
    "src/components/atoms/Input/index.ts",
    "src/components/atoms/Label/index.ts",
    "src/components/atoms/Typography/index.ts",
    "src/components/molecules/ComboBox/index.ts",
    "src/components/molecules/TextField/index.ts",
    "src/utils/index.ts",
  ],
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  bundle: false,
  treeshake: true,
  splitting: false,
  minify: false,
  target: "es2020",
  tsconfig: "tsconfig.build.json",
  // dts: {
  //   entry: "src/index.ts",
  // },
  dts: false,
  external: [
    "react",
    "react-dom",
    "@headlessui/react",
    "clsx",
    "class-variance-authority",
    "tailwind-merge",
  ],
});
