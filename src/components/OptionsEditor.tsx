import { json5 } from "codemirror-json5";
import {
  type ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  EDITOR_THEME_CREATED,
  createEditorKeymap,
  createEditorLinter,
  jsonLinter,
} from "@/lib/editor.ts";
import {
  type JsonValue,
  debounce,
  isPopulatedJson5,
  stringifyJson5,
  parseJson5,
  getErrorMessage,
} from "@/lib/utils";
import { EDITOR_CONFIG, EDITOR_BASIC_SETUP } from "@/configs";

interface OptionsEditorProps {
  options: string | undefined;
  hasOptions: boolean;
  className?: string;
  onOptionsChange: (nextOptions: string) => void;
  onErrorChange: (error: string | null) => void;
}

export interface OptionsEditorRef {
  format: () => void;
}

function OptionsEditorComponent (
  {
    options,
    className,
    hasOptions,
    onOptionsChange,
    onErrorChange,
  }: OptionsEditorProps,
  ref: ForwardedRef<OptionsEditorRef>,
) {
  const parse = useCallback((json: string) => {
    if (!isPopulatedJson5(json)) {
      onErrorChange(null);
      return;
    }

    try {
      const parsedValue = parseJson5<JsonValue>(json);
      onErrorChange(null);
      return parsedValue;
    } catch (error) {
      const message = getErrorMessage(error);
      onErrorChange(message);
    }
  }, [onErrorChange]);

  const format = useCallback(() => {
    if (!options) return;

    const parsedValue = parse(options);

    if (!parsedValue) return;

    const formattedValue = stringifyJson5(parsedValue);

    onOptionsChange(formattedValue);
  }, [options, onOptionsChange, parse]);

  const debouncedParse = useRef(debounce(
    (text: string) => parse(text),
    EDITOR_CONFIG.LINT_DELAY_MS,
  )).current;

  const handleEditorChange = (nextValue: string) => {
    onOptionsChange(nextValue);

    debouncedParse(nextValue);
  };

  useEffect(() => {
    if (options) parse(options);

    return () => {
      debouncedParse.cancel();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    format,
  }), [format])

  const editorExtensions = useMemo(() => [
    json5(),
    createEditorLinter(jsonLinter, hasOptions),
    createEditorKeymap({ onFormat: format }),
  ], [hasOptions, format]);

  return (
    <ReactCodeMirror
      value={options}
      className={className}
      extensions={editorExtensions}
      theme={EDITOR_THEME_CREATED}
      basicSetup={EDITOR_BASIC_SETUP}
      onChange={handleEditorChange}
    />
  );
}

export const OptionsEditor = forwardRef(OptionsEditorComponent);

OptionsEditor.displayName = "OptionsEditor";
