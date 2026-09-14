import { parse as babelParse } from "@babel/parser";
import { format as prettierFormat } from "prettier/standalone";
import {
  type ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Input } from "@/components/ui/input";
import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  EDITOR_THEME_CREATED,
  createEditorKeymap,
  createEditorLinter,
  javascriptLinter,
} from "@/lib/editor";
import { debounce } from "@/lib/async";
import { getErrorMessage } from "@/lib/errors";
import type { CatalogMethod } from "@/lib/catalog";
import { EDITOR_CONFIG, EDITOR_BASIC_SETUP, EDITOR_PRETTIER_FORMAT_OPTIONS } from "@/configs";

interface JavascriptEditorProps {
  value: CatalogMethod;
  className?: string;
  onChange: <K extends keyof CatalogMethod>(key: K, newValue: CatalogMethod[K]) => void;
  onErrorChange: (error: string | null) => void;
}

export interface JavascriptEditorRef {
  format: () => void;
}

function JavascriptEditorComponent (
  {
    value,
    className,
    onChange,
    onErrorChange
  }: JavascriptEditorProps,
  ref: ForwardedRef<JavascriptEditorRef>
) {
  const parse = useCallback((code: string) => {
    if (!code) return;

    const trimmed = code.trim();

    if (!trimmed) {
      onErrorChange(null);
      return;
    }

    try {
      const ast = babelParse(trimmed, {
        sourceType: "script",
        allowReturnOutsideFunction: false,
      });

      if (ast.program.body.length !== 1) {
        onErrorChange("O código deve conter apenas uma declaração de função.");
        return;
      }

      const [statement] = ast.program.body;

      if (
        statement.type !== "ExpressionStatement" ||
        statement.expression.type !== "ArrowFunctionExpression"
      ) {
        onErrorChange("O código deve ser uma arrow function (ex: (x) => { return x; }).");
        return;
      }

      const arrowFunction = statement.expression;

      if (arrowFunction.body.type === "BlockStatement") {
        const hasValidReturn = arrowFunction.body.body.some((node) =>
          node.type === "ReturnStatement" && node.argument !== null
        );

        if (!hasValidReturn) {
          onErrorChange("A função precisa conter uma instrução 'return'.");
          return;
        }
      }

      onErrorChange(null);
    } catch (error) {
      const message = getErrorMessage(error);
      onErrorChange(message);
    }
  }, []);

  const format = useCallback(async () => {
    if (!value.code) return;

    try {
      const formattedCode = await prettierFormat(
        value.code,
        EDITOR_PRETTIER_FORMAT_OPTIONS
      );
      onChange("code", formattedCode);
    } catch {
      // TODO: Handle this error
    }
  }, [value, onChange]);

  const debouncedParse = useRef(debounce(
    (code: string) => parse(code),
    EDITOR_CONFIG.LINT_DELAY_MS
  )).current;

  const handleChangeMethod = (newValue: string) => {
    onChange("code", newValue);

    debouncedParse(newValue);
  };

  const handleChangeName = (newValue: string) => {
    if (newValue === value.label) return;

    onChange("label", newValue);
  };

  useEffect(() => {
    if (value.code) parse(value.code);

    return () => {
      debouncedParse.cancel();
    };
  }, []);

  const editorExtension = useMemo(() => [
    javascript(),
    createEditorLinter(javascriptLinter),
    createEditorKeymap({ onFormat: format })
  ], [format]);

  useImperativeHandle(ref, () => ({
    format
  }), [format])

  return (
    <div className="space-y-2">
      <Input
        value={value.label}
        className="bg-card dark:bg-card"
        placeholder="Method Name"
        onChange={(e) => handleChangeName(e.target.value)}
      />
      <ReactCodeMirror
        value={value.code}
        className={className}
        extensions={editorExtension}
        theme={EDITOR_THEME_CREATED}
        basicSetup={EDITOR_BASIC_SETUP}
        onChange={handleChangeMethod}
      />
    </div>
  );
}

export const JavascriptEditor = forwardRef(JavascriptEditorComponent);

JavascriptEditor.displayName = "JavascriptEditor";
