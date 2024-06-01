import { Selection } from 'vscode'
import { traverseHTML } from '../parsers/html'
import type { Handler } from '../types'

/**
 * `<` to the entire element.
 *
 * ```html
 * ▽
 * <div><div></div></div>
 * └────────────────────┘
 * ```
 *
 * @name html-element
 * @category html
 */
export const htmlElementHandler: Handler = {
  name: 'html-element',
  handle({ getAst, doc, anchor }) {
    const asts = getAst('html')
    if (!asts.length)
      return

    const range = doc.getWordRangeAtPosition(anchor, /\s{0,2}</)
    if (!range)
      return
    const targetIndex = doc.offsetAt(range.end) - 1

    for (const ast of asts) {
      for (const node of traverseHTML(ast.root)) {
        if (node.range[0] + ast.start === targetIndex) {
          return new Selection(
            doc.positionAt(node.range[0] + ast.start),
            doc.positionAt(node.range[1] + ast.start),
          )
        }
      }
    }
  },
}
