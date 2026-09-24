import { useTranslation } from "react-i18next";
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
import { javascript } from "@codemirror/lang-javascript";
import { InlineInput } from "@/components/shared/InlineInput";
import ReactCodeMirror from "@uiw/react-codemirror";
import { debounce, getErrorMessage, removeSpaces } from "@/lib/utils";
import { EDITOR_THEME_CREATED, createEditorKeymap, createEditorLinter, javascriptLinter } from "@/lib/editor";
import { EDITOR_CONFIG, EDITOR_BASIC_SETUP, EDITOR_PRETTIER_OPTIONS } from "@/configs";
import type { CatalogMethod } from "@/lib/catalog";

interface MethodEditorProps {
  method: CatalogMethod;
  error?: string | ((draft: string) => string);
  className?: string;
  onMethodChange: <K extends keyof CatalogMethod>(propertyKey: K, nextValue: CatalogMethod[K]) => void;
  onErrorChange: (error: string | null) => void;
}

export interface MethodEditorRef {
  format: () => void;
}

function MethodEditorComponent(
  {
    method,
    error,
    className,
    onMethodChange,
    onErrorChange,
  }: MethodEditorProps,
  ref: ForwardedRef<MethodEditorRef>,
) {
  const { t } = useTranslation();

  const validate = useCallback((code: string) => {
    if (!code) return;

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      onErrorChange(null);
      return;
    }

    try {
      const ast = babelParse(trimmedCode, {
        sourceType: "script",
        allowReturnOutsideFunction: false,
      });

      if (ast.program.body.length !== 1) {
        onErrorChange(t("customMethodsManager.messages.notSingleExpression"));
        return;
      }

      const [statement] = ast.program.body;

      if (
        statement.type !== "ExpressionStatement" ||
        statement.expression.type !== "ArrowFunctionExpression"
      ) {
        onErrorChange(t("customMethodsManager.messages.notArrowFunction"));
        return;
      }

      const arrowFunction = statement.expression;

      if (arrowFunction.body.type === "BlockStatement") {
        const hasValidReturn = arrowFunction.body.body.some((node) =>
          node.type === "ReturnStatement" && node.argument !== null
        );

        if (!hasValidReturn) {
          onErrorChange(t("customMethodsManager.messages.missingReturnStatement"));
          return;
        }
      }

      onErrorChange(null);
    } catch (error) {
      const message = getErrorMessage(error);
      onErrorChange(message);
    }
  }, [onErrorChange, t]);

  const format = useCallback(async () => {
    if (!method.code) return;

    try {
      const formattedCode = await prettierFormat(
        method.code,
        EDITOR_PRETTIER_OPTIONS,
      );
      onMethodChange("code", formattedCode);
    } catch {
      // TODO: Handle this error
    }
  }, [method.code, onMethodChange]);

  const debouncedValidate = useRef(debounce(
    (code: string) => validate(code),
    EDITOR_CONFIG.LINT_DELAY_MS,
  )).current;

  const handleMethodCodeChange = (nextCode: string) => {
    onMethodChange("code", nextCode);

    debouncedValidate(nextCode);
  };

  const handleMethodNameChange = (nextName: string) => {
    if (nextName === method.name) return;

    onMethodChange("name", nextName);
  };

  useEffect(() => {
    if (method.code) validate(method.code);

    return () => {
      debouncedValidate.cancel();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    format,
  }), [format]);

  const editorExtensions = useMemo(() => [
    javascript(),
    createEditorLinter(javascriptLinter),
    createEditorKeymap({ onFormat: format }),
  ], [format]);

  return (
    <div className="space-y-2">
      <InlineInput
        value={method.name}
        error={error}
        placeholder={t("customMethodsManager.form.nameInput.placeholder")}
        className="font-semibold px-3 py-2 border rounded-md"
        transform={removeSpaces}
        onSave={handleMethodNameChange}
        onError={onErrorChange}
      />
      <ReactCodeMirror
        value={method.code}
        className={className}
        extensions={editorExtensions}
        theme={EDITOR_THEME_CREATED}
        basicSetup={EDITOR_BASIC_SETUP}
        onChange={handleMethodCodeChange}
      />
    </div>
  );
}

export const MethodEditor = forwardRef(MethodEditorComponent);

MethodEditor.displayName = "MethodEditor";
