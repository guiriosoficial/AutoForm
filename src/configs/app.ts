import pkg from '../../package.json'

export const APP_NAME = pkg.name.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("")
export const APP_VERSION = pkg.version
export const APP_ID = pkg.name
