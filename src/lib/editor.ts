// src/lib/editor/extensions.ts
import { tags as t } from "@lezer/highlight";
import { keymap, EditorView } from "@codemirror/view";
import { linter } from "@codemirror/lint";
import { createTheme } from "@uiw/codemirror-themes";
import { json5ParseLinter } from "codemirror-json5";

const json5Linter = json5ParseLinter();

// Tema do CodeMirror isolado como uma extensão
export const createEditorTheme = () => [
  createTheme({
    theme: "light",
    settings: {
      background: "var(--card)",
      foreground: "var(--card-foreground)",
      caret: "var(--foreground)",
      selection: "var(--editor-selection)",
      lineHighlight: "var(--editor-line-highlight)",
    },
    styles: [
      { tag: t.comment, color: "var(--muted-foreground)" },
      { tag: t.propertyName, color: "var(--syntax-property)" },
      { tag: t.keyword, color: "var(--syntax-keyword)" },
      { tag: t.string, color: "var(--syntax-string)" },
      { tag: t.number, color: "var(--syntax-number)" },
      { tag: [t.bool, t.null], color: "var(--syntax-literal)" },
      { tag: [t.paren, t.brace, t.bracket, t.punctuation], color: "var(--foreground)" },
    ],
  }),

  EditorView.theme({
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
  }),
];

// Keymap builder
export const createEditorKeymap = ({
 onFormat
}: {
  onFormat: () => void;
}) =>
  keymap.of([
    {
      key: "Mod-Shift-f",
      run: () => {
        onFormat();
        return true;
      },
    },
  ]);

// Linter builder
export const createEditorLinter = (enabled: boolean) =>
  linter(
    (view) => (enabled ? json5Linter(view) : []),
    { tooltipFilter: () => [] }
  );