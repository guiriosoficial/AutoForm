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
  throttle,
  isFunction,
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
  onError?: (errorMessage: string) => void;
  onSave: (nextValue: string) => void;
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
    onError,
    onSave,
  }: InlineInputProps,
  ref: ForwardedRef<InlineInputRef>,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const errorMessage = isFunction(error) ? error(draft) : error;
  const hasError = isPopulatedString(errorMessage);

  const inputRef = useRef<HTMLInputElement>(null);

  const throttledErrorNotification = useRef(throttle(
    (notificationMessage: string) => toast.error(notificationMessage),
    EDITOR_CONFIG.ERROR_DELAY_MS)
  ).current;

  useEffect(() => {
    if (!isEditing) return;

    const input = inputRef.current;

    const frame = requestAnimationFrame(() => {
      input?.focus();
      input?.select();
    });

    return () => {
      cancelAnimationFrame(frame);
      throttledErrorNotification.cancel();
    };
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

    if (hasError) {
      throttledErrorNotification(errorMessage);
      return;
    }

    const nextValue = draft.trim();

    if (!nextValue || nextValue === value) {
      cancelEditing();
      return;
    }

    onSave(nextValue);
    setIsEditing(false);
  };

  const handleInputChange = (rawValue: string) => {
    if (onError && errorMessage) onError(errorMessage);

    const nextValue = transform
      ? transform(rawValue)
      : rawValue;

    setDraft(nextValue);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    preventDefaultEscape(event);
    event.stopPropagation();

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
  }), [startEditing]);

  const previewContainerClasses = cn("group", className);
  const inputContainerClasses = cn("flex gap-1", className);
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
  const remainingWords = words.join(" ");

  return (
    <p
      className={previewContainerClasses}
      onClick={startEditing}
    >
      {remainingWords}{" "}
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
