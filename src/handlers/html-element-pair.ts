import { Range, Selection } from 'vscode'
import { traverseHTML } from '../parsers/html'
import type { Handler } from '../types'

/**
 * Matches open and close tag name of a HTMl element.
 *
 * @name html-element-pair
 * @category html
 */
export const htmlElementPairHandler: Handler = {
  name: 'html-element-pair',
  handle({ ast, selection, doc, withOffset }) {
    if (!ast.html?.root)
      return

    const selectionText = doc.getText(selection)
    const preCharPos = withOffset(selection.start, -1)
    const preChar = doc.getText(new Range(preCharPos, selection.start))
    const postCharPos = withOffset(selection.end, 1)
    const postChar = doc.getText(new Range(selection.end, postCharPos))

    const preIndex = preChar === '<' ? doc.offsetAt(preCharPos) : -1
    const postIndex = postChar === '>' ? doc.offsetAt(postCharPos) : -1

    if (postIndex < 0 && preIndex < 0)
      return

    for (const node of traverseHTML(ast.html.root)) {
      if (node.rawTagName !== selectionText || !('isVoidElement' in node) || node.isVoidElement)
        continue

      // from start tag to end tag
      if (node.range[0] === preIndex) {
        const body = doc.getText(new Range(
          preCharPos,
          doc.positionAt(node.range[1]),
        ))

        if (body.trimEnd().endsWith('/>'))
          return selection

        const endIndex = body.lastIndexOf(`</${node.rawTagName}>`)
        if (endIndex) {
          return [
            selection,
            new Selection(
              doc.positionAt(preIndex + endIndex + 2),
              doc.positionAt(preIndex + endIndex + 2 + node.rawTagName.length),
            ),
          ]
        }
      }

      // from end tag to start tag
      if (node.range[1] === postIndex) {
        return [
          new Selection(
            doc.positionAt(node.range[0] + 1),
            doc.positionAt(node.range[0] + 1 + node.rawTagName.length),
          ),
          selection,
        ]
      }
    }
  },
}
