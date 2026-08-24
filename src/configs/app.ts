import pkg from '../../package.json'

export const APP_NAME = pkg.name.replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase());
export const APP_VERSION = pkg.version
export const APP_ID = pkg.name
