import prettier from "prettier/standalone";
import { parse as babelParse } from "@babel/parser";
import { javascript } from "@codemirror/lang-javascript";
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
import { Input } from "@/components/ui/input";
import { createEditorKeymap, createEditorLinter } from "@/lib/editor"
import { debounce } from "@/lib/async";
import { javascriptLinter } from "@/lib/editor";
import { getErrorMessage } from "@/lib/errors";
import {
  EDITOR_CONFIG,
  EDITOR_BASIC_SETUP,
  EDITOR_THEME_CREATED,
  EDITOR_PRETTIER_FORMAT_OPTIONS
} from "@/configs";
import type { CatalogMethod } from "@/lib/catalog";

interface JavascriptEditorProps {
  value: CatalogMethod;
  className?: string;
  onChange: <K extends keyof CatalogMethod>(key: K, newValue: CatalogMethod[K]) => void;
  onErrorChange: (error: string) => void;
}

export interface JavascriptEditorRef {
  format: () => void;
}

export const JavascriptEditor = forwardRef((
  {
    value,
    className,
    onChange,
    onErrorChange
  }: JavascriptEditorProps,
  ref: ForwardedRef<JavascriptEditorRef>
) => {
  const parse = useCallback((code: string) => {
    if (!code) return

    const trimmed = code.trim();

    if (!trimmed) {
      onErrorChange("");
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
        onErrorChange(
          "O código deve ser uma arrow function (ex: (x) => { return x; }).",
        );
        return;
      }

      const arrowFunction = statement.expression;

      if (arrowFunction.body.type === "BlockStatement") {
        const hasValidReturn = arrowFunction.body.body.some((node) => {
          return node.type === "ReturnStatement" && node.argument !== null;
        });

        if (!hasValidReturn) {
          onErrorChange("A função precisa conter uma instrução 'return'.");
          return;
        }
      }

      onErrorChange("");
    } catch (err) {
      const message = getErrorMessage(err);
      onErrorChange(message);
    }
  }, []);

  const format = useCallback(async () => {
    if (!value.code) return;

    try {
      const formattedCode = await prettier.format(
        value.code,
        EDITOR_PRETTIER_FORMAT_OPTIONS
      );
      onChange("code", formattedCode);
    } catch (err) {
      console.log(err)
    }
  }, [value, onChange]);

  const debouncedParse = useRef(debounce(
    (code: string) => parse(code),
    EDITOR_CONFIG.LINT_DELAY_MS
  )).current;

  const handleChangeMethod = (newValue: string) => {
    onChange("code", newValue)

    debouncedParse(newValue)
  };

  const handleChangeName = (newValue: string) => {
    if (newValue === value.label) return;

    onChange("label", newValue);
  };

  useEffect(() => {
    if (value.code) parse(value.code);

    return () => {
      debouncedParse.cancel();
    }
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
})