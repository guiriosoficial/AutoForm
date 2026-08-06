import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { PenLine } from "lucide-react";
import { InlineButton } from "@/components/InlineButton.tsx";

interface InlineEditableInputProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
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
      <input
        ref={inputRef}
        value={draft}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={confirmEditing}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <span
      className="group flex items-center gap-2"
      onClick={() => setIsEditing(true)}
    >
      {value || placeholder}
      <InlineButton
        icon={PenLine}
        size={14}
      />
    </span>
  );
}