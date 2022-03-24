import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import type { Handler } from '../types'

const supportedNodeType = [
  'ArrowFunctionExpression',
]

/**
 * `=>` to arrow function.
 *
 * ```js
 *        ▽
 * (a, b) => a + b
 * └─────────────┘
 * ```
 *
 * @name js-arrow-fn
 * @category js
 */
export const jsArrowFnHandler: Handler = {
  name: 'js-arrow-fn',
  handle({ doc, getAst, anchorIndex, anchor, chars }) {
    if (!chars.includes('='))
      return

    const asts = getAst('js')
    if (!asts.length)
      return

    const range = doc.getWordRangeAtPosition(anchor, /\=\>/)
    if (!range || range.isEmpty)
      return

    for (const ast of getAst('js')) {
      const relativeIndex = anchorIndex - ast.start

      let result: Selection |undefined
      traverse(ast.root, {
        enter(path) {
          if (path.node.start == null || path.node.end == null)
            return
          if (relativeIndex > path.node.end || path.node.start > relativeIndex)
            return path.skip()
          if (!supportedNodeType.includes(path.node.type)) {
            // log.debug(`[js-arrow-fn] Unknown ${path.node.type}`)
            return
          }
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
