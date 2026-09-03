import { json5 } from "codemirror-json5";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  type ForwardedRef
} from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { jsonLinter } from "@/lib/editor";
import {
  createEditorKeymap,
  createEditorLinter
} from "@/lib/editor"
import { getErrorMessage } from "@/lib/errors";
import { debounce } from "@/lib/async";
import {
  parseJson5,
  stringifyJson5,
  isPopulatedJson5
} from "@/lib/json5";
import {
  EDITOR_CONFIG,
  EDITOR_BASIC_SETUP,
  EDITOR_THEME_CREATED
} from "@/configs";

interface JsonEditorProps {
  value: string | undefined;
  className?: string;
  hasConfig: boolean;
  onChange: (value: string) => void;
  onErrorChange: (error: string) => void;
}

export interface JsonEditorRef {
  format: () => void;
}

export const JsonEditor = forwardRef((
  {
    value,
    className,
    hasConfig,
    onChange,
    onErrorChange
  }: JsonEditorProps,
  ref: ForwardedRef<JsonEditorRef>
) => {
  const parse = useCallback((val: string) => {
    if (!isPopulatedJson5(val)) {
      onErrorChange("");
      return;
    }

    try {
      const parsedValue = parseJson5(val);
      onErrorChange("");
      return parsedValue;
    } catch (err) {
      const message = getErrorMessage(err)
      onErrorChange(message);
    }
  }, []);

  const format = useCallback(async () => {
    if (!value) return;

    const parsedValue = await parse(value);

    const formattedValue = stringifyJson5(parsedValue);

    onChange(formattedValue)
  }, [value, onChange, parse]);

  const debouncedParse = useRef(debounce(
    (text: string) => parse(text),
    EDITOR_CONFIG.LINT_DELAY_MS
  )).current;

  const handleConfigChange = (newValue: string) => {
    onChange(newValue);

    debouncedParse(newValue);
  };

  useEffect(() => {
    if (value) parse(value);

    return () => {
      debouncedParse.cancel();
    }
  }, []);

  const editorExtension = useMemo(() => [
    json5(),
    createEditorLinter(jsonLinter, hasConfig),
    createEditorKeymap({ onFormat: format })
  ], [hasConfig, format]);

  useImperativeHandle(ref, () => ({
    format
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
})