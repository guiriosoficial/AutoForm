import { tags as t } from "@lezer/highlight";

export const EDITOR_CONFIG = {
  INDENT_SPACES: 2,
  LINT_DELAY_MS: 1400,
} as const;

export const EDITOR_SHORTCUTS = {
  FORMAT: "Mod-Shift-f",
} as const;

export const EDITOR_BASIC_SETUP = {
  lineNumbers: false,
  foldGutter: false,
  highlightActiveLine: true,
  highlightActiveLineGutter: false,
  highlightSelectionMatches: false,
  allowMultipleSelections: false,
  dropCursor: false,
  drawSelection: true,
  indentOnInput: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: false,
  searchKeymap: false,
  lintKeymap: false,
};


export const EDITOR_THEME = {
  settings: {
    background: "var(--card)",
    foreground: "var(--card-foreground)",
    caret: "var(--foreground)",
    selection: "var(--editor-selection)",
    lineHighlight: "var(--editor-line-highlight)",
  },
  syntax: [
    { tag: t.comment, color: "var(--muted-foreground)" },
    { tag: t.propertyName, color: "var(--syntax-property)" },
    { tag: t.keyword, color: "var(--syntax-keyword)" },
    { tag: t.string, color: "var(--syntax-string)" },
    { tag: t.number, color: "var(--syntax-number)" },
    { tag: [t.bool, t.null], color: "var(--syntax-literal)" },
    { tag: [t.paren, t.brace, t.bracket, t.punctuation], color: "var(--foreground)" },
  ],
  overrides: {
    ".cm-scroller:has(.cm-selectionBackground) .cm-activeLine": {
      background: "transparent",
    },
    ".cm-matchingBracket": {
      backgroundColor: "var(--editor-bracket-highlight) !important",
    },
    ".cm-nonmatchingBracket": {
      backgroundColor: "var(--destructive)",
    },
    ".cm-lintRange-error": {
      textDecoration: "underline wavy var(--destructive) !important",
    },
  },
};