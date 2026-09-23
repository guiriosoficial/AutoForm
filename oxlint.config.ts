// oxlint-disable no-inline-comments

import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "error",
    pedantic: "error",
    perf: "error",
    style: "error",
    restriction: "error",
    nursery: "error",
  },

  plugins: [
    "typescript",
    "unicorn",
    "oxc",
    "eslint",
    // "react",
    "react-perf",
    "import",
  ],
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ["src/components/ui/**"],

  rules: {
    "max-params": ["error", { max: 4 }],
    "max-classes-per-file": "off",
    "max-lines-per-function": "off",
    "max-statements": "off",
    "sort-keys": "off",
    "sort-imports": "off",
    "id-length": ["error", { checkGeneric: false, exceptions: ["t"], exceptionPatterns: ["^_"] }],
    "func-style": ["error", "declaration", { allowArrowFunctions: true }], // Use Declaration for top-level functions, expression for the rest
    "curly": ["error", "multi-line", "consistent"],
    "one-var": ["error", "never"],
    "no-ternary": "allow",
    "no-continue": "allow",
    "no-warning-comments": "allow",
    "no-undefined": "allow", // Resolved in "unicorn/no-useless-undefined"
    "no-redeclare": "allow", // TODO: Review config
    "no-shadow": ["error", { allow: ["error"]}],
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-implicit-coercion": ["error", { boolean: false }],
    "no-magic-numbers": ["error", { ignore: [-1, 0, 1], ignoreDefaultValues: true }],
    "no-empty-function": ["error", { allow: ["arrowFunctions"] }],

    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": ["error", { extensions: ["tsx"] }],
    "react/jsx-max-depth": ["error", { max: 8 }],
    "react/forbid-component-props": "allow",
    "react-perf/jsx-no-new-function-as-prop": "allow",
    "react-perf/jsx-no-new-array-as-prop": "allow",
    "react-perf/jsx-no-jsx-as-prop": "allow", // Needs to allow only in "render" prop

    "typescript/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
    "typescript/parameter-properties": ["error", { prefer: "parameter-property" }],
    "typescript/explicit-function-return-type": "off", // TODO: Review config
    "typescript/explicit-module-boundary-types": "off", // TODO: Review config

    "unicorn/switch-case-braces": ["error", "avoid"],
    "unicorn/prefer-export-from": ["error", { checkUsedVariables: false }],
    "unicorn/filename-case": ["error", { cases: { kebabCase: true, pascalCase: true } }],
    "unicorn/no-useless-undefined": ["error", { checkArguments: false }],
    "unicorn/no-null": "allow",

    "oxc/no-async-await": "allow",
    "oxc/no-optional-chaining": "allow",
    "oxc/no-rest-spread-properties": "allow",

    "import/max-dependencies": "off",
    "import/no-named-export": "off",
    "import/group-exports": "off",
    "import/exports-last": "off",
    "import/prefer-default-export": "off",
    "import/no-default-export": "off",
    "import/no-nodejs-modules": ["error", { allow: ["node:path"] }],
    "import/no-unassigned-import": ["error", { allow: ["**/*.css", "**/i18n"] }],
    "import/consistent-type-specifier-style": ["error", "prefer-top-level-if-only-type-imports"],
  },
});
