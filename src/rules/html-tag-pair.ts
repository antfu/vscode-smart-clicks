import { Range, Selection } from 'vscode'
import { traverseHTML } from '../parsers/html'
import type { Handler } from '../types'

/**
 * Open and close tags of a HTML element.
 *
 * ```html
 *  ▽
 * <div><div></div></div>
 *  └─┘              └─┘
 * ```
 *
 * @name html-tag-pair
 * @category html
 */
export const htmlTagPairHandler: Handler = {
  name: 'html-tag-pair',
  handle({ getAst, selection, doc, withOffset }) {
    const asts = getAst('html')
    if (!asts.length)
      return

    const range = doc.getWordRangeAtPosition(selection.start, /[\w.\-]+/) || selection
    const rangeText = doc.getText(range)
    const preCharPos = withOffset(range.start, -1)
    const preChar = doc.getText(new Range(preCharPos, range.start))
    const postCharPos = withOffset(range.end, 1)
    const postChar = doc.getText(new Range(range.end, postCharPos))

    const preIndex = preChar === '<' ? doc.offsetAt(preCharPos) : -1
    const postIndex = postChar === '>' ? doc.offsetAt(postCharPos) : -1

    if (postIndex < 0 && preIndex < 0)
      return

    for (const ast of asts) {
      for (const node of traverseHTML(ast.root)) {
        if (node.rawTagName !== rangeText || !('isVoidElement' in node) || node.isVoidElement)
          continue

        // from start tag to end tag
        if (node.range[0] + ast.start === preIndex) {
          const body = doc.getText(new Range(
            preCharPos,
            doc.positionAt(node.range[1] + ast.start),
          ))

          if (body.trimEnd().endsWith('/>'))
            return range

          const endIndex = body.lastIndexOf(`</${node.rawTagName}>`)
          if (endIndex) {
            return [
              range,
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
            range,
          ]
        }
      }
    }
  },
}
