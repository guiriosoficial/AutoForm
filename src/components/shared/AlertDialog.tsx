import { useTranslation } from "react-i18next";
import { AlertOctagon } from "lucide-react";
import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isArray, preventDefaultEscape } from "@/lib/utils";
import type { KeyboardEvent } from "react";

interface AlertDialogProps {
  open: boolean;
  title?: string;
  description?: string | (string | null)[];
  confirmButtonText?: string;
  cancelButtonText?: string;
  destructive?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function AlertDialog({
  open,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  destructive,
  onOpenChange,
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  const { t } = useTranslation();

  const descriptionArray = isArray(description) ? description : [description];

  const translatedTitle = title ?? t("defaults.alert.title");
  const translatedDescription = description ? descriptionArray : [t("defaults.alert.description")];
  const translatedConfirmButtonText = confirmButtonText ?? t("defaults.alert.confirmButton");
  const translatedCancelButtonText = cancelButtonText ?? t("defaults.alert.cancelButton");

  const variant = destructive ? "destructive" : "default";

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    preventDefaultEscape(event);
    event.stopPropagation();

    switch (event.key) {
      case "Enter":
        onConfirm?.();
        break;
      case "Escape":
        onCancel?.();
        break;
      default:
        break;
    }
  };

  return (
    <AlertDialogPrimitive
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent
        size="sm"
        onKeyDown={handleKeyPress}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertOctagon />
            {translatedTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {translatedDescription.map((text, index) => (
              <p key={index}>
                {text}
              </p>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onCancel && (
            <AlertDialogCancel onClick={onCancel}>
              {translatedCancelButtonText}
            </AlertDialogCancel>
          )}
          {onConfirm && (
            <AlertDialogAction
              variant={variant}
              onClick={onConfirm}
            >
              {translatedConfirmButtonText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}
