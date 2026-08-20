import { toast as baseToast } from "@/components/ui/toast";

export const ToastPriority = {
  LOW: "low",
  HIGH: "high",
} as const;

export type ToastPriority = typeof ToastPriority[keyof typeof ToastPriority];

export const ToastTypes = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
  LOADING: "loading"
} as const

export type ToastTypes = typeof ToastTypes[keyof typeof ToastTypes];

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  priority?: ToastPriority
}

function createToast(type: ToastTypes) {
  return (options: ToastOptions | string) => {
    const data =
      typeof options === "string"
        ? { title: options }
        : options;

    return baseToast.add({
      priority: ToastPriority.HIGH,
      type,
      ...data,
    });
  };
}

export const toast = {
  success: createToast(ToastTypes.SUCCESS),
  error: createToast(ToastTypes.ERROR),
  info: createToast(ToastTypes.INFO),
  warning: createToast(ToastTypes.WARNING),
  loading: createToast(ToastTypes.LOADING),
};
