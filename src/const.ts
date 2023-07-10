import { version, bin } from '../package.json'

export { version }

export const name = Object.keys(bin || {}).at(0) || 'x-cli'

export const confFileName = name
