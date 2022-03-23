import { workspace } from 'vscode'
import type { Handler, HandlerContext } from '../types'
import { bracketPairHandler } from './bracket-pair'
import { dashHandler } from './dash'
import { htmlElementHandler } from './html-element'
import { htmlTagPairHandler } from './html-tag-pair'
import { jsArrowFnHandler } from './js-arrow-fn'
import { jsAssginHandler } from './js-assign'
import { jsBlockHandler } from './js-block'
import { jsxTagPairHandler } from './jsx-tag-pair'

export const handlers: Handler[] = [
  // html
  htmlTagPairHandler,
  htmlElementHandler,

  // js
  jsxTagPairHandler,
  jsArrowFnHandler,
  jsBlockHandler,
  jsAssginHandler,

  // general
  dashHandler,
  bracketPairHandler,
]

export function applyHandlers(context: HandlerContext) {
  const config = workspace.getConfiguration('smartClicks')
  const rulesOptions = config.get('rules', {}) as any

  for (const handler of handlers) {
    if (rulesOptions[handler.name] === false)
      continue
    const selection = handler.handle(context)
    if (selection)
      return selection
  }
}
