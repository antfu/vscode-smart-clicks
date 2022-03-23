import type { Handler, HandlerContext } from '../types'
import { bracketHandler } from './brackets'
import { dashHandler } from './dash'

export const handlers: Handler[] = [
  dashHandler,
  bracketHandler,
]

export function applyHandlers(context: HandlerContext) {
  for (const handler of handlers) {
    const selection = handler.handle(context)
    if (selection)
      return selection
  }
}
