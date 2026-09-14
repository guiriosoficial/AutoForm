export const MessageAction = {
  FILL_INPUT: "fill-input",
} as const;

export type MessageAction = (typeof MessageAction)[keyof typeof MessageAction];
