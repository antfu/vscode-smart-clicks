import { toArray } from '@antfu/utils'
import type { Range, Selection } from 'vscode'
import { workspace } from 'vscode'
import { log } from '../log'
import type { Handler, HandlerContext } from '../types'
import { bracketPairHandler } from './bracket-pair'
import { dashHandler } from './dash'
import { htmlAttrHandler } from './html-attr'
import { htmlElementHandler } from './html-element'
import { htmlTagPairHandler } from './html-tag-pair'
import { jsArrowFnHandler } from './js-arrow-fn'
import { jsAssginHandler } from './js-assign'
import { jsBlockHandler } from './js-block'
import { jsColonHandler } from './js-colon'
import { jsxTagPairHandler } from './jsx-tag-pair'

export const handlers: Handler[] = [
  // html
  htmlTagPairHandler,
  htmlElementHandler,
  htmlAttrHandler,

  // js
  jsxTagPairHandler,
  jsArrowFnHandler,
  jsBlockHandler,
  jsAssginHandler,
  jsColonHandler,

  // general
  dashHandler,
  bracketPairHandler,
]

function stringify(range: Range | Selection) {
  return `${range.start.line}:${range.start.character}->${range.end.line}:${range.end.character}`
}

export function applyHandlers(context: HandlerContext) {
  const config = workspace.getConfiguration('smartClicks')
  const rulesOptions = config.get('rules', {}) as any

  for (const handler of handlers) {
    if (rulesOptions[handler.name] === false)
      continue
    let selection = handler.handle(context)
    if (selection) {
      selection = toArray(selection)
      log.log(`[${handler.name}] ${selection.map(stringify).join(', ')}`)
      return selection
    }
  }
}
