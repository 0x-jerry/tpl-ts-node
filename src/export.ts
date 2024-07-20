// Export variable should be defined here, for example export a `defineConfig` function.

import type { UserConfig } from './types'

export type { UserConfig }

export function defineConfig(conf: UserConfig) {
  return conf
}
