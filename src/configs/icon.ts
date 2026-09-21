export const IconSize = {
  SM: 14,
  MD: 16
} as const;

export type IconSize = (typeof IconSize)[keyof typeof IconSize];

export const ICON_CONFIG = {
  DEFAULT_SIZE: IconSize.SM
};