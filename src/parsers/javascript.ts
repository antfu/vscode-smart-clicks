import type { Parser } from '../types'

export const jsParser: Parser = {
  name: 'js',
  handle: async(context) => {
    if (context.ast.js)
      return

    if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(context.langId))
      return

    // TODO
    context.ast.js = {
      offset: 0,
      root: {},
    }
  },
}
