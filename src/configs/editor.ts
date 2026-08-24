import { tags as t } from "@lezer/highlight";
import { keymap, EditorView } from "@codemirror/view";
import { linter } from '@codemirror/lint';
import { createTheme } from "@uiw/codemirror-themes"
import { json5ParseLinter } from "codemirror-json5";

const json5Linter = json5ParseLinter();

const BASIC_SETUP = {
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
} as const

export const EDITOR_CONFIG = {
  INDENT_SPACES: 2,
  LINT_DELAY_MS: 1400,
  BASIC_SETUP: BASIC_SETUP
} as const

export const EDITOR_THEME = [
  createTheme({
    theme: "light",
    settings: {
      background: 'var(--card)',
      foreground: 'var(--card-foreground)',
      caret: 'var(--foreground)',
      selection: 'var(--editor-selection)',
      lineHighlight: 'var(--editor-line-highlight)',
    },
    styles: [
      {
        tag: t.comment,
        color: 'var(--muted-foreground)',
      },
      {
        tag: t.propertyName,
        color: 'var(--syntax-property)',
      },
      {
        tag: t.keyword,
        color: "var(--syntax-keyword)",
      },
      {
        tag: t.string,
        color: 'var(--syntax-string)',
      },
      {
        tag: t.number,
        color: 'var(--syntax-number)',
      },
      {
        tag: [t.bool, t.null],
        color: 'var(--syntax-literal)',
      },
      {
        tag: [t.paren, t.brace, t.bracket, t.punctuation],
        color: "var(--foreground)",
      },
    ],
  }),

  EditorView.theme({
    ".cm-scroller:has(.cm-selectionBackground) .cm-activeLine": {
      background: "transparent"
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
  })
]

export const EDITOR_KEYMAP = (onFormat: () => void) => keymap.of([
  {
    key: "Mod-Shift-f",
    run: () => {
      onFormat()
      return true;
    },
  },
]);

export const EDITOR_LINT = (enabled: boolean) => linter((view) => {
    if (!enabled) return [];

    return json5Linter(view);
  }, {
    tooltipFilter: () => [],
  }
);
