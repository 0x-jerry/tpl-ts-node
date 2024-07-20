import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { logger } from './utils/dev'
import { version } from '../package.json'

sliver`
v${version} @autocompletion

cli [@type:name], A tiny example. ${defaultFn}
`

function defaultFn(params: string[], arg: ActionParsedArgs) {
  //
  logger.log('params %s, arg %o', params, arg)
}
