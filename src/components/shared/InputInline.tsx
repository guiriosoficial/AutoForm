import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type FocusEvent,
  type ForwardedRef
} from "react";
import { X, Check, PenLine } from "lucide-react";
import { ButtonInline } from "@/components/shared/ButtonInline.tsx";
import { preventDefaultEscape } from "@/lib/events"

interface InputInlineProps {
  value: string;
  placeholder?: string;
  onSave: (value: string) => void;
}

export interface InputInlineRef {
  startEditing: () => void;
}

export const InputInline = forwardRef((
  {
    value,
    placeholder,
    onSave,
  }: InputInlineProps,
  ref: ForwardedRef<InputInlineRef>
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!isEditing) return;

    const input = inputRef.current;

    input?.focus();

    const frame = requestAnimationFrame(() => {
      input?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [isEditing]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    preventDefaultEscape(event)

    switch (event.key) {
      case "Enter":
        confirmEditing();
        break;
      case "Escape":
        cancelEditing();
        break;
    }
  }

  const confirmEditing = (event?: MouseEvent | FocusEvent) => {
    event?.preventDefault();

    const nextValue = draft.trim();

    setIsEditing(false);

    if (!nextValue || nextValue === value) {
      setDraft(value);
      return;
    }

    onSave(nextValue);
  }

  const cancelEditing = (event?: MouseEvent) => {
    event?.preventDefault();

    setDraft(value);
    setIsEditing(false);
  }

  const startEditing = () => {
    setIsEditing(true);
  };

  useImperativeHandle(ref, () => ({
    startEditing
  }))

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
        <ButtonInline
          icon={Check}
          size={14}
          persistent
          onClick={confirmEditing}
        />
        <ButtonInline
          icon={X}
          size={14}
          persistent
          destructive
          onClick={cancelEditing}
        />
      </div>
    );
  }

  const words = value?.split(" ");
  const lastWord = words?.pop();
  const restantWords = words?.join(" ");

  return (
    <p
      className="group"
      onClick={startEditing}
    >
      {restantWords}{" "}
      <span className="whitespace-nowrap">
      {lastWord}{" "}
        <ButtonInline
          className="inline-flex translate-y-0.5 ml-1"
          icon={PenLine}
        />
      </span>
    </p>
  );
});