import type { Config } from '@jest/types'

const conf: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['src/__tests__/**/*.spec.ts']
}

export default conf
