import { defineConfig } from "oxfmt";

export default defineConfig({
  singleAttributePerLine: true,
  ignorePatterns: ["src/components/ui/**"],
  quoteProps: "consistent",
});
