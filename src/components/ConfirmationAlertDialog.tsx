import type { KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"
import { AlertOctagon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { preventDefaultEscape } from "@/lib/utils";

interface ConfirmationAlertDialogProps {
  open: boolean,
  title?: string,
  description?: string,
  confirmButtonText?: string,
  cancelButtonText?: string,
  destructive?: boolean,
  onOpenChange?: (open: boolean) => void,
  onConfirm?: () => void,
  onCancel?: () => void,
}

export function ConfirmationAlertDialog({
  open,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  destructive,
  onOpenChange,
  onConfirm,
  onCancel,
}: ConfirmationAlertDialogProps) {
  const { t } = useTranslation();

  const translatedTitle = title ?? t("defaults.alert.title");
  const translatedDescription = description ?? t("defaults.alert.description");
  const translatedConfirmButtonText = confirmButtonText ?? t("defaults.alert.confirmButton");
  const translatedCancelButtonText = cancelButtonText ?? t("defaults.alert.cancelButton");

  const variant = destructive ? 'destructive' : 'default';

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    preventDefaultEscape(event)
    event.stopPropagation()

    switch (event.key) {
      case 'Enter':
        onConfirm?.();
        break;
      case 'Escape':
        onCancel?.();
        break;
    }
  }

  return (
    <AlertDialog
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
            {translatedDescription}
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
    </AlertDialog>
  )
}
