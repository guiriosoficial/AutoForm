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
  isPopulatedString,
  preventDefaultEscape,
} from "@/lib/utils";
import { toast } from "@/lib/toast.ts";
import { EDITOR_CONFIG } from "@/configs";

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

  const inputRef = useRef<HTMLInputElement>(null);
  const errorMessage = isFunction(error) ? error(draft) : error;
  const hasError = isPopulatedString(errorMessage);

  const hasErrorRef = useRef(hasError);
  const errorMessageRef = useRef(errorMessage);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TODO: Move to async lib
  useEffect(() => {
    hasErrorRef.current = hasError;
    errorMessageRef.current = errorMessage;

    if (!hasError || timerRef.current !== null) return;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;

      if (hasErrorRef.current && errorMessageRef.current) {
        toast.error(errorMessageRef.current);
      }
    }, EDITOR_CONFIG.ERROR_DELAY_MS);
  }, [hasError, errorMessage]);

  useEffect(() => {
    if (!isEditing) return;

    const input = inputRef.current;

    input?.focus();

    const frame = requestAnimationFrame(() => {
      input?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [isEditing]);

  const handleInputChange = (rawValue: string) => {
    const nextValue = transform ? transform(rawValue) : rawValue;
    setDraft(nextValue);
  };

  const confirmEditing = (event?: MouseEvent | FocusEvent) => {
    event?.preventDefault();

    const nextValue = hasError ? value : draft.trim();

    setIsEditing(false);

    if (!nextValue || nextValue === value) {
      setDraft(value);
      return;
    }

    onSave(nextValue);
  };

  const cancelEditing = (event?: MouseEvent) => {
    event?.preventDefault();

    setDraft(value);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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

  const startEditing = useCallback(() => {
    setDraft(value);
    setIsEditing(true);
  }, [value]);

  useImperativeHandle(ref, () => ({
    startEditing,
  }), [startEditing])

  const inputClasses = cn("flex-1 pr-1 outline-none", hasError && "text-destructive");



  if (isEditing) {
    return (
      <div className={cn("flex gap-1", className)}>
        <input
          ref={inputRef}
          value={draft}
          placeholder={placeholder}
          className={inputClasses}
          onKeyDown={handleKeyDown}
          onBlur={confirmEditing}
          onChange={(evt) => handleInputChange(evt.target.value)}
        />
        <InlineButton
          icon={Check}
          size={14}
          persistent
          onClick={confirmEditing}
        />
        <InlineButton
          icon={X}
          size={14}
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
      className={cn("group", className)}
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
