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
  className?: string;
  hasConfig: boolean;
  onChange: (value: string) => void;
  onErrorChange: (error: string | null) => void;
}

export interface JsonEditorRef {
  format: () => void;
}

function JsonEditorComponent (
  {
    value,
    className,
    hasConfig,
    onChange,
    onErrorChange,
  }: JsonEditorProps,
  ref: ForwardedRef<JsonEditorRef>,
) {
  const parse = useCallback((val: string) => {
    if (!isPopulatedJson5(val)) {
      onErrorChange(null);
      return;
    }

    try {
      const parsedValue = parseJson5<JsonValue>(val);
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

  const handleConfigChange = (newValue: string) => {
    onChange(newValue);

    debouncedParse(newValue);
  };

  useEffect(() => {
    if (value) parse(value);

    return () => {
      debouncedParse.cancel();
    };
  }, []);

  const editorExtension = useMemo(() => [
    json5(),
    createEditorLinter(jsonLinter, hasConfig),
    createEditorKeymap({ onFormat: format }),
  ], [hasConfig, format]);

  useImperativeHandle(ref, () => ({
    format,
  }), [format])

  return (
    <ReactCodeMirror
      value={value}
      className={className}
      extensions={editorExtension}
      theme={EDITOR_THEME_CREATED}
      basicSetup={EDITOR_BASIC_SETUP}
      onChange={handleConfigChange}
    />
  );
}

export const JsonEditor = forwardRef(JsonEditorComponent);

JsonEditor.displayName = "JsonEditor";
