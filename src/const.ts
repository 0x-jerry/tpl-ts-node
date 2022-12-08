export { version } from '../package.json'

import { bin } from '../package.json'

export const name = Object.keys(bin || {}).at(0) || 'x-cli'

export const confFileName = name
