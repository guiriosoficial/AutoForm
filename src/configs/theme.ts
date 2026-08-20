export const Theme = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
}

export type Theme = typeof Theme[keyof typeof Theme]