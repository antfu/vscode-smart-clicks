import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import { log } from '../log'
import type { Handler } from '../types'

/**
 * Matches JavaScript blocks like if, for, while, etc.
 *
 * @name js-blocks
 * @category js
 */
export const jsBlocksHandler: Handler = {
  name: 'js-blocks',
  handle({ ast, selection, doc }) {
    if (!ast.js?.root)
      return

    const index = doc.offsetAt(selection.start)

    const supported = [
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
      'TSTypeAliasDeclaration',
      'VariableDeclaration',
      'WhileStatement',
    ]

    let result: Selection |undefined
    traverse(ast.js.root, {
      enter(path) {
        if (result)
          return
        if (path.node.end == null)
          return
        if (path.node.start !== index)
          return

        if (!supported.includes(path.node.type)) {
          log.debug('Unsupported node type:', path.node.type)
          return
        }

        result = new Selection(
          doc.positionAt(path.node.start),
          doc.positionAt(path.node.end),
        )
      },
    })

    return result
  },
}
