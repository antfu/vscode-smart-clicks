import type { Handler, HandlerContext } from '../types'
import { bracketsPairHandler } from './brackets-pair'
import { dashHandler } from './dash'
import { htmlElementPairHandler } from './html-element-pair'

export const handlers: Handler[] = [
  htmlElementPairHandler,

  // general
  dashHandler,
  bracketsPairHandler,
]

export function applyHandlers(context: HandlerContext) {
  for (const handler of handlers) {
    const selection = handler.handle(context)
    if (selection)
      return selection
  }
}
