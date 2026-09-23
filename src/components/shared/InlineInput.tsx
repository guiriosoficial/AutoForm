import {
  type FocusEvent,
  type ForwardedRef,
  type KeyboardEvent,
  type MouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Check, PenLine, X } from "lucide-react";
import { InlineButton } from "@/components/shared/InlineButton";
import {
  cn,
  isFunction,
  deferPredicate,
  isPopulatedString,
  preventDefaultEscape,
} from "@/lib/utils";
import { toast } from "@/lib/toast.ts";
import { EDITOR_CONFIG, IconSize } from "@/configs";

interface InlineInputProps {
  value: string | undefined;
  placeholder?: string;
  className?: string;
  transform?: (value: string) => string;
  error?: string | ((draft: string) => string);
  onSave: (newValue: string) => void;
}

export interface InlineInputRef {
  startEditing: () => void;
}

function InlineInputComponent (
  {
    value = "",
    transform,
    placeholder,
    className,
    error,
    onSave,
  }: InlineInputProps,
  ref: ForwardedRef<InlineInputRef>,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const errorMessage = isFunction(error) ? error(draft) : error;
  const hasError = isPopulatedString(errorMessage);

  const errorMessageRef = useRef(errorMessage);
  const hasErrorRef = useRef(hasError);
  const inputRef = useRef<HTMLInputElement>(null);

  const deferPredicatedErrorNotification = useRef(
    deferPredicate(() => {
      if (!hasErrorRef.current || !errorMessageRef.current) return;
      toast.error(errorMessageRef.current);
    }, EDITOR_CONFIG.ERROR_DELAY_MS)
  ).current;

  useEffect(() => {
    hasErrorRef.current = hasError;
    errorMessageRef.current = errorMessage;

    if (!hasError || !errorMessage) return;

    deferPredicatedErrorNotification()
  }, [hasError, errorMessage]);

  useEffect(() => {
    if (!isEditing) return;

    const input = inputRef.current;

    const frame = requestAnimationFrame(() => {
      input?.focus();
      input?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setDraft(value);
    setIsEditing(true);
  }, [value]);

  const cancelEditing = (event?: MouseEvent) => {
    event?.preventDefault();

    setDraft(value);
    setIsEditing(false);
  };

  const confirmEditing = (event?: MouseEvent | FocusEvent) => {
    event?.preventDefault();

    const nextValue = hasError ? value : draft.trim();

    if (!nextValue || nextValue === value) {
      cancelEditing();
      return;
    }

    onSave(nextValue);
    setIsEditing(false);
  };

  const handleInputChange = (rawValue: string) => {
    const nextValue = transform
      ? transform(rawValue)
      : rawValue;

    setDraft(nextValue);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    preventDefaultEscape(event);
    event.stopPropagation()

    switch (event.key) {
      case "Enter":
        confirmEditing();
        break;
      case "Escape":
        cancelEditing();
        break;
      default:
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    startEditing,
  }), [startEditing])

  const previewContainerClasses = cn("group", className)
  const inputContainerClasses = cn("flex gap-1", className)
  const inputClasses = cn(
    "flex-1 pr-1 outline-none",
    hasError && "text-destructive"
  );

  if (isEditing) {
    return (
      <div className={inputContainerClasses}>
        <input
          ref={inputRef}
          value={draft}
          placeholder={placeholder}
          className={inputClasses}
          onBlur={confirmEditing}
          onKeyDown={handleInputKeyDown}
          onChange={(evt) => handleInputChange(evt.target.value)}
        />
        <InlineButton
          icon={Check}
          size={IconSize.SM}
          persistent
          onClick={confirmEditing}
        />
        <InlineButton
          icon={X}
          size={IconSize.SM}
          persistent
          destructive
          onClick={cancelEditing}
        />
      </div>
    );
  }

  const words = value.split(" ");
  const lastWord = words.pop();
  const restantWords = words.join(" ");

  return (
    <p
      className={previewContainerClasses}
      onClick={startEditing}
    >
      {restantWords}{" "}
      <span className="whitespace-nowrap">
      {lastWord}{" "}
        <InlineButton
          className="inline-flex translate-y-0.5 ml-1"
          icon={PenLine}
        />
      </span>
    </p>
  );
}

export const InlineInput = forwardRef(InlineInputComponent);

InlineInput.displayName = "InlineInput";
