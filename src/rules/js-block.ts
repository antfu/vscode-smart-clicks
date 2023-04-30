import traverse from '@babel/traverse'
import type { TextDocument } from 'vscode'
import { Range, Selection } from 'vscode'
import type { Node } from '@babel/types'
// import { log } from '../log'
import type { Handler } from '../types'

const supportedNodeType = [
  'BlockStatement',
  'CatchClause',
  'ClassDeclaration',
  'DoWhileStatement',
  'ExportAllDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
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
    if (isAsyncKeyword(doc, selection))
      return

    for (const ast of getAst('js')) {
      const index = doc.offsetAt(selection.start)
      const relativeIndex = index - ast.start

      let node: Node | undefined
      traverse(ast.root, {
        enter(path) {
          if (path.node.start == null || path.node.end == null)
            return
          if (relativeIndex > path.node.end || path.node.start > relativeIndex)
            return path.skip()

          if (!supportedNodeType.includes(path.node.type)) {
            // log.debug('[js-block] Unknown type:', path.node.type)
            return
          }
          node = path.node
        },
      })

      if (!node)
        continue

      let start = node.start
      let end = node.end

      // if ... else
      if (
        node.type === 'IfStatement'
        && node.alternate
        && node.consequent.end! <= relativeIndex
        && node.alternate.start! > relativeIndex
      ) {
        start = node.consequent.end
        end = node.alternate.end
      }
      // try ... finally
      else if (
        node.type === 'TryStatement'
        && node.finalizer
        && (node.handler?.end ?? node.block.end!) <= relativeIndex
        && node.finalizer.start! - relativeIndex > 4
      ) {
        start = (node.handler?.end || node.block.end!)
        end = node.finalizer.end
      }
      else if (node.start !== relativeIndex) {
        continue
      }

      return new Selection(
        doc.positionAt(ast.start + start!),
        doc.positionAt(ast.start + end!),
      )
    }
  },
}

function isAsyncKeyword(doc: TextDocument, selection: Selection) {
  return doc.getText(new Range(selection.start, selection.end)) === 'async'
}
