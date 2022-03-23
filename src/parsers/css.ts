import type { Parser } from '../types'

export const cssParser: Parser = {
  name: 'css',
  handle: async(context) => {
    if (context.ast.css)
      return

    if (!['css'].includes(context.langId))
      return

    // TODO
    context.ast.css = {
      offset: 0,
      root: {},
    }
  },
}
