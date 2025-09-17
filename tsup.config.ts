import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@opendatalabs/vana-sdk", "wagmi"],
  treeshake: true,
  minify: false,
  splitting: false,
  target: "es2022",
});
