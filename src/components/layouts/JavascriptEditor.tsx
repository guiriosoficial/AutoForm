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
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  EDITOR_THEME_CREATED,
  createEditorKeymap,
  createEditorLinter,
  javascriptLinter,
} from "@/lib/editor";
import { debounce, getErrorMessage, removeSpaces } from "@/lib/utils";
import type { CatalogMethod } from "@/lib/catalog";
import {
  EDITOR_CONFIG,
  EDITOR_BASIC_SETUP,
  EDITOR_PRETTIER_OPTIONS,
} from "@/configs";
import { useCatalog } from "@/providers/CatalogProvider";
import { InlineInput } from "@/components/shared/InlineInput.tsx";

interface JavascriptEditorProps {
  value: CatalogMethod;
  className?: string;
  onChange: <K extends keyof CatalogMethod>(key: K, newValue: CatalogMethod[K]) => void;
  onErrorChange: (error: string | null) => void;
}

export interface JavascriptEditorRef {
  format: () => void;
}

function JavascriptEditorComponent(
  {
    value,
    className,
    onChange,
    onErrorChange,
  }: JavascriptEditorProps,
  ref: ForwardedRef<JavascriptEditorRef>,
) {
  const { t } = useTranslation();
  const { isDuplicatedMethodName } = useCatalog();

  const getMethodNameErrorMessage = (draftName: string) =>
    isDuplicatedMethodName(draftName, value.key)
      ? t("customMethodManager.messages.duplicatedName")
      : ""

  const parse = useCallback((code: string) => {
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
  }, [onErrorChange]);

  const format = useCallback(async () => {
    if (!value.code) return;

    try {
      const formattedCode = await prettierFormat(
        value.code,
        EDITOR_PRETTIER_OPTIONS,
      );
      onChange("code", formattedCode);
    } catch {
      // TODO: Handle this error
    }
  }, [value, onChange]);

  const debouncedParse = useRef(debounce(
    (code: string) => parse(code),
    EDITOR_CONFIG.LINT_DELAY_MS,
  )).current;

  const handleChangeMethod = (newMethod: string) => {
    onChange("code", newMethod);

    debouncedParse(newMethod);
  };

  const handleChangeName = (newName: string) => {
    if (newName === value.name) return;

    onChange("name", newName);
  };

  useEffect(() => {
    if (value.code) parse(value.code);

    return () => {
      debouncedParse.cancel();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    format,
  }), [format]);

  const editorExtension = useMemo(() => [
    javascript(),
    createEditorLinter(javascriptLinter),
    createEditorKeymap({ onFormat: format }),
  ], [format]);

  return (
    <div className="space-y-2">
      <InlineInput
        value={value.name}
        placeholder={t("customMethodsManager.form.nameInput.placeholder")}
        className="font-semibold px-3 py-2 border rounded-md"
        transform={removeSpaces}
        error={getMethodNameErrorMessage}
        onSave={handleChangeName}
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
