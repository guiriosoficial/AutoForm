export function getErrorMessage(error: unknown, fallback?: string) {
  return error instanceof Error ? error.message : String(fallback ?? error);
}
