const CUSTOM_MODULE_NAME = "custom";
const CUSTOM_NEW_METHOD_NAME = "__new-catalog-custom-method__";

export const CATALOG_CONFIG = {
  CUSTOM_MODULE_NAME,
  CUSTOM_NEW_METHOD_NAME,
  CUSTOM_NEW_METHOD_KEY: `${CUSTOM_MODULE_NAME}.${CUSTOM_NEW_METHOD_NAME}`,
  DEFAULT_HIDDEN: [],
};

export const Catalogs = {
  FAKER: "faker",
  BOX_4_DEV: "box4dev",
  CUSTOM: "custom",
} as const;

export type Catalogs = (typeof Catalogs)[keyof typeof Catalogs];