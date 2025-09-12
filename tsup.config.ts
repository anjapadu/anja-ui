import { defineConfig } from "tsup";

export default defineConfig({
  // entry: ["src/index.ts"],
  entry: [
    "src/index.ts",
    "src/components/**/index.ts",
    "src/components/**/!(*.stories|*.test).tsx",
    "src/components/**/!(*.stories|*.test).ts",
    "src/utils/**/!(*.stories|*.test).ts",
    "src/utils/**/!(*.stories|*.test).tsx",
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
