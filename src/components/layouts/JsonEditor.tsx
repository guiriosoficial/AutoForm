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
} from "@/lib/editor";
import {
  type JsonValue,
  debounce,
  isPopulatedJson5,
  stringifyJson5,
  parseJson5,
  getErrorMessage,
} from "@/lib/utils";
import { EDITOR_CONFIG, EDITOR_BASIC_SETUP } from "@/configs";

interface JsonEditorProps {
  value: string | undefined;
  hasValue: boolean;
  className?: string;
  onChange: (nextValue: string) => void;
  onErrorChange: (error: string | null) => void;
}

export interface JsonEditorRef {
  format: () => void;
}

function JsonEditorComponent (
  {
    value,
    className,
    hasValue,
    onChange,
    onErrorChange,
  }: JsonEditorProps,
  ref: ForwardedRef<JsonEditorRef>,
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
    if (!value) return;

    const parsedValue = parse(value);

    if (!parsedValue) return;

    const formattedValue = stringifyJson5(parsedValue);

    onChange(formattedValue);
  }, [value, onChange, parse]);

  const debouncedParse = useRef(debounce(
    (text: string) => parse(text),
    EDITOR_CONFIG.LINT_DELAY_MS,
  )).current;

  const handleEditorChange = (nextValue: string) => {
    onChange(nextValue);

    debouncedParse(nextValue);
  };

  useEffect(() => {
    if (value) parse(value);

    return () => {
      debouncedParse.cancel();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    format,
  }), [format])

  const editorExtension = useMemo(() => [
    json5(),
    createEditorLinter(jsonLinter, hasValue),
    createEditorKeymap({ onFormat: format }),
  ], [hasValue, format]);

  return (
    <ReactCodeMirror
      value={value}
      className={className}
      extensions={editorExtension}
      theme={EDITOR_THEME_CREATED}
      basicSetup={EDITOR_BASIC_SETUP}
      onChange={handleEditorChange}
    />
  );
}

export const JsonEditor = forwardRef(JsonEditorComponent);

JsonEditor.displayName = "JsonEditor";
