import {
  KeyboardEvent, MouseEventHandler, useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PenLine, X, Check } from "lucide-react";
import { InlineButton } from "@/components/InlineButton.tsx";

interface InlineEditableInputProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
}

export function InlineEditableInput({
  value,
  onSave,
  placeholder,
}: InlineEditableInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancelEditing = useCallback((e: MouseEvent) => {
    e.preventDefault();
    cancelEditing();
  }, [])

  const handleConfirmEditing = useCallback((e: MouseEvent) => {
    e.preventDefault();
    confirmEditing();
  }, [])

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!isEditing) return;

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const confirmEditing = () => {
    const nextValue = draft.trim();

    setIsEditing(false);

    if (!nextValue || nextValue === value) {
      setDraft(value);
      return;
    }

    onSave(nextValue);
  }

  const cancelEditing = () => {
    setDraft(value);
    setIsEditing(false);
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        confirmEditing();
        break;
      case "Escape":
        cancelEditing();
        break;
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setDraft(nextValue);
  }

  if (isEditing) {
    return (
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={draft}
          className="flex-1 bg-transparent outline-none"
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={confirmEditing}
          onKeyDown={handleKeyDown}
        />
        <InlineButton
          icon={Check}
          size={14}
          persistent
          onClick={handleConfirmEditing}
        />
        <InlineButton
          icon={X}
          size={14}
          persistent
          className="hover:text-destructive"
          onClick={handleCancelEditing}
        />
      </div>
    );
  }

  const words = value?.split(" ");
  const lastWord = words?.pop();

  return (
    <p
      className="group"
      onClick={() => setIsEditing(true)}
    >
      {words?.join(" ")}{" "}
      <span className="whitespace-nowrap">
      {lastWord}{" "}
        <InlineButton
          className="inline-flex translate-y-0.5 ml-1"
          icon={PenLine}
          size={14}
        />
    </span>
    </p>
  );
}