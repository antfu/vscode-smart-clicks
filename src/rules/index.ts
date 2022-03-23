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
  for (const handler of handlers) {
    const selection = handler.handle(context)
    if (selection)
      return selection
  }
}
