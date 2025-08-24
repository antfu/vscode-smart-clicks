import type { Handler } from '../types'
import traverse from '@babel/traverse'
import { Selection } from 'vscode'

/**
 * `:` to the value.
 *
 * ```js
 *      ▽
 * { foo: { bar } }
 *        └─────┘
 * ```
 *
 * @name js-colon
 * @category js
 */
export const jsColonHandler: Handler = {
  name: 'js-colon',
  handle({ doc, getAst, anchor }) {
    const asts = getAst('js')
    if (!asts.length)
      return

    const range = doc.getWordRangeAtPosition(anchor, /\s*:\s*/)
    if (!range)
      return

    for (const ast of getAst('js')) {
      const relativeIndex = doc.offsetAt(range.end) - ast.start

      let result: Selection | undefined
      traverse(ast.root, {
        enter(path) {
          if (result)
            return path.skip()
          if (path.node.start == null || path.node.end == null)
            return
          if (relativeIndex > path.node.end || path.node.start > relativeIndex)
            return path.skip()
          if (path.node.start !== relativeIndex)
            return
          result = new Selection(
            doc.positionAt(ast.start + path.node.start),
            doc.positionAt(ast.start + path.node.end),
          )
        },
      })

      if (result)
        return result
    }
  },
}
