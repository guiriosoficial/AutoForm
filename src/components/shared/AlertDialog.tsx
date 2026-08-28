import {useCallback, type KeyboardEvent, useMemo} from "react";
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
import { preventDefaultEscape } from "@/lib/events";

interface AlertDialogProps {
  open: boolean;
  title?: string;
  description?: string;
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
  onCancel
}: AlertDialogProps) {
  const { t } = useTranslation();

  const translatedTitle = useMemo(() =>
    title ?? t("defaults.alert.title"),
    [title, t]
  );
  const translatedDescription = useMemo(() =>
    description ?? t("defaults.alert.description"),
    [description, t]
  );
  const translatedConfirmButtonText = useMemo(() =>
    confirmButtonText ?? t("defaults.alert.confirmButton"),
    [confirmButtonText, t]
  );
  const translatedCancelButtonText = useMemo(() =>
    cancelButtonText ?? t("defaults.alert.cancelButton"),
    [cancelButtonText, t]
  );

  const variant = useMemo(() =>
    destructive ? 'destructive' : 'default',
    [destructive]
  );

  const handleKeyPress = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    preventDefaultEscape(event);
    event.stopPropagation();

    switch (event.key) {
      case 'Enter':
        onConfirm?.();
        break;
      case 'Escape':
        onCancel?.();
        break;
    }
  }, []);

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
    </AlertDialogPrimitive>
  )
}
