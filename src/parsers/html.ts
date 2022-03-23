import type { Parser } from '../types'

export const htmlParser: Parser = {
  name: 'html',
  handle: async(context) => {
    if (context.ast.html)
      return

    context.ast.html = {
      offset: 0,
      root: {},
    }
  },
}
