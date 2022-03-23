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
  'WhileStatement',
]

/**
 * Blocks like `if`, `for`, `while`, etc. in JavaScript.
 *
 * ```js
 * ▽
 * function () {     }
 * └─────────────────┘
 * ```
 *
 * ```js
 * ▽
 * import { ref } from 'vue'
 * └───────────────────────┘
 * ```
 *
 * @name js-block
 * @category js
 */
export const jsBlockHandler: Handler = {
  name: 'js-block',
  handle({ selection, doc, getAst }) {
    for (const ast of getAst('js')) {
      const index = doc.offsetAt(selection.start)

      let result: Selection |undefined
      traverse(ast.root, {
        enter(path) {
          if (result)
            return path.skip()
          if (path.node.start == null || path.node.end == null)
            return
          if (path.node.start + ast.start !== index)
            return

          if (!supportedNodeType.includes(path.node.type)) {
            log.debug('[js-block] Unknown type:', path.node.type)
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
