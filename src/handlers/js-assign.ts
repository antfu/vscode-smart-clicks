import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import { log } from '../log'
import type { Handler } from '../types'

const supportedNodeType = [
  'ClassDeclaration',
  'DoWhileStatement',
  'ExportAllDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'ForStatement',
  'FunctionDeclaration',
  'IfStatement',
  'ImportDeclaration',
  'SwitchStatement',
  'TryStatement',
  'TSInterfaceDeclaration',
  // TODO: support declartions on equal sign
  // 'TSTypeAliasDeclaration',
  // 'VariableDeclaration',
  'WhileStatement',
]

/**
 * Matches JavaScript blocks like if, for, while, etc.
 *
 * @name js-blocks
 * @category js
 */
export const jsBlocksHandler: Handler = {
  name: 'js-blocks',
  handle({ ast, selection, doc, anchorIndex }) {
    const asts = ast.filter(i => i.type === 'js' && i.start <= anchorIndex && i.end >= anchorIndex)
    if (!asts.length)
      return

    for (const ast of asts) {
      const index = doc.offsetAt(selection.start)

      let result: Selection |undefined
      traverse(ast.root, {
        enter(path) {
          if (result)
            return
          if (path.node.start == null || path.node.end == null)
            return
          if (path.node.start + ast.start !== index)
            return

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
