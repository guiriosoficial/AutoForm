export const MessageAction = {
  FILL_INPUT_IN_CONTENT: "fill-input-in-content",
  EXECUTE_IN_SANDBOX: "execute-in-sandbox",
  UPDATE_LOCALE_IN_SANDBOX: "update-locale-in-sandbox",
} as const;

export type MessageAction = (typeof MessageAction)[keyof typeof MessageAction];
