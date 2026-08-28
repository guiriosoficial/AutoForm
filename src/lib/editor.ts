import { json5ParseLinter } from "codemirror-json5";
import { createTheme } from "@uiw/codemirror-themes";
import { linter } from "@codemirror/lint";
import { keymap, EditorView } from "@codemirror/view";
import { EDITOR_SHORTCUTS, EDITOR_THEME } from "@/configs";

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

export const createEditorLinter = (enabled: boolean) =>
  linter(
    (view) => (enabled ? json5ParseLinter()(view) : []),
    { tooltipFilter: () => [] }
  );
