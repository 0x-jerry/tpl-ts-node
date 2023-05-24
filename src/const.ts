import pkg from '../package.json'

export const version = pkg.version

export const name = Object.keys(pkg.bin || {}).at(0) || 'x-cli'

export const confFileName = name
