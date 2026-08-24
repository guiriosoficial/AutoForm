import JSON5 from 'json5'

interface StringifyOptions {
  replacer?: ((this: any, key: string, value: any) => any) | (string | number)[] | null
  space?: string | number | null
  quote?: string | null
}

export function parseJson5<T = any>(text: string): T {
  return JSON5.parse(text)
}

export function stringifyJson5(json: object, options: StringifyOptions) {
  return JSON5.stringify(json, options)
}

