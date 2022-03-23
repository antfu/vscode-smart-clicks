import { Selection } from 'vscode'
import { traverseHTML } from '../parsers/html'
import type { Handler } from '../types'

/**
 * Matches the entire element by clicking the leading `<`.
 *
 * ```html
 * ▽
 * <div><div></div></div>
 * └────────────────────┘
 * ```
 *
 * @name html-blocks
 * @category html
 */
export const htmlBlocksHandler: Handler = {
  name: 'html-blocks',
  handle({ getAst, doc, char, anchorIndex }) {
    const asts = getAst('html')
    if (!asts.length)
      return
    if (char !== '<')
      return

    for (const ast of asts) {
      for (const node of traverseHTML(ast.root)) {
        if (node.range[0] + ast.start === anchorIndex) {
          return new Selection(
            doc.positionAt(node.range[0] + ast.start),
            doc.positionAt(node.range[1] + ast.start),
          )
        }
      }
    }
  },
}
