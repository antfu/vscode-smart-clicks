import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import { log } from '../log'
import type { Handler } from '../types'

const supportedNodeType = [
  'TSTypeAliasDeclaration',
  'VariableDeclaration',
  'AssignmentExpression',
]

/**
 * Matches JavaScript assignment with equal sign
 *
 * ```js
 *         ▽
 * const a = []
 * └──────────┘
 * ```
 *
 * @name js-assign
 * @category js
 */
export const jsAssginHandler: Handler = {
  name: 'js-assign',
  handle({ doc, getAst, chars, anchorIndex }) {
    if (!chars.includes('='))
      return

    const asts = getAst('js')
    if (!asts.length)
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
            log.debug('[js-assign] Unknown type:', path.node.type)
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
