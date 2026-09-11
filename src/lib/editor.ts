import { createTheme } from "@uiw/codemirror-themes";
import { json5ParseLinter } from "codemirror-json5";
import { type Diagnostic, type LintSource, linter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { EditorView, keymap } from "@codemirror/view";
import { EDITOR_CONFIG, EDITOR_SHORTCUTS, EDITOR_THEME } from "@/configs";

export const createEditorTheme = () => [
  createTheme({
    theme: "light",
    settings: EDITOR_THEME.settings,
    styles: EDITOR_THEME.syntax,
  }),

  EditorView.theme(EDITOR_THEME.overrides),
];

export const createEditorKeymap = ({ onFormat }: { onFormat: () => void }) =>
  keymap.of([
    {
      key: EDITOR_SHORTCUTS.FORMAT,
      run: () => {
        onFormat();
        return true;
      },
    },
  ]);

export const createEditorLinter = (lintSource: LintSource, enabled = true) =>
  linter(
    (view) => (!enabled || !lintSource) ? [] : lintSource(view),
    {
      delay: EDITOR_CONFIG.LINT_DELAY_MS,
      tooltipFilter: () => []
    }
  );

export const jsonLinter: LintSource = json5ParseLinter()

export const javascriptLinter: LintSource = (view) => {
  const diagnostics: Diagnostic[] = [];
  const tree = syntaxTree(view.state);

  tree.iterate({
    enter: (node) => {
      if (!node.type.isError) return;

      diagnostics.push({
        from: node.from,
        to: Math.max(node.to, node.from + 1),
        severity: "error",
        message: "Invalid JavaScript syntax"
      });
    }
  });

  return diagnostics;
};

export const EDITOR_THEME_CREATED = createEditorTheme()