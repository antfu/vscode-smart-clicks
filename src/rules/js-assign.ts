import traverse from '@babel/traverse'
import { Range, Selection } from 'vscode'

// import { log } from '../log'
import type { Handler } from '../types'

const supportedNodeType = [
  'TSTypeAliasDeclaration',
  'VariableDeclaration',
  'AssignmentExpression',
  'ClassProperty',
]

/**
 * `=` to assignment.
 *
 * ```js
 *         ▽
 * const a = []
 * └──────────┘
 *
 * class B {
 *     ▽
 *   b = 1;
 *   └─────┘
 *     ▽
 *   ba = () => {};
 *   └────────────┘
 * }
 * ```
 *
 * @name js-assign
 * @category js
 */
export const jsAssignHandler: Handler = {
  name: 'js-assign',
  handle({ doc, getAst, chars, anchorIndex, withOffset, anchor }) {
    if (!chars.includes('='))
      return

    const asts = getAst('js')
    if (!asts.length)
      return

    if (doc.getText(new Range(anchor, withOffset(anchor, 2))).includes('=>'))
      return

    for (const ast of getAst('js')) {
      const relativeIndex = anchorIndex - ast.start

      let result: Selection | undefined
      traverse(ast.root, {
        enter(path) {
          if (path.node.start == null || path.node.end == null)
            return
          if (relativeIndex > path.node.end || path.node.start > relativeIndex)
            return path.skip()
          if (!supportedNodeType.includes(path.node.type)) {
            // log.debug('[js-assign] Unknown type:', path.node.type)
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
