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
  useState
} from "react";
import { Check, PenLine, X } from "lucide-react";
import { InlineButton } from "@/components/shared/InlineButton";
import { preventDefaultEscape } from "@/lib/dom";

interface InlineInputProps {
  value: string;
  placeholder?: string;
  onSave: (newValue: string) => void;
}

export interface InlineInputRef {
  startEditing: () => void;
}

function InlineInputComponent (
  {
    value,
    placeholder,
    onSave
  }: InlineInputProps,
  ref: ForwardedRef<InlineInputRef>
) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;

    const input = inputRef.current;

    input?.focus();

    const frame = requestAnimationFrame(() => {
      input?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [isEditing]);

  const confirmEditing = (event?: MouseEvent | FocusEvent) => {
    event?.preventDefault();

    const nextValue = draft.trim();

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
    setDraft(value)
    setIsEditing(true);
  }, [value]);

  useImperativeHandle(ref, () => ({
    startEditing
  }), [startEditing])

  if (isEditing) {
    return (
      <div className="flex gap-1">
        <input
          ref={inputRef}
          value={draft}
          placeholder={placeholder}
          className="flex-1 pr-1 outline-none"
          onKeyDown={handleKeyDown}
          onBlur={confirmEditing}
          onChange={(e) => setDraft(e.target.value)}
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

  const safeValue = value ?? "";
  const words = safeValue.split(" ");
  const lastWord = words.pop();
  const restantWords = words.join(" ");

  return (
    <p
      className="group"
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

export const InlineInput = forwardRef(InlineInputComponent)

InlineInput.displayName = "InlineInput";