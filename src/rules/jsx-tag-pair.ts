import type { Handler } from '../types'
import traverse from '@babel/traverse'
import { Selection } from 'vscode'

/**
 * Matches JSX elements' start and end tags.
 *
 * ```jsx
 *   ▽
 * (<Flex.Item>Hi</Flex.Item>)
 *   └───────┘     └───────┘
 * ```
 *
 * @name jsx-tag-pair
 * @category js
 */
export const jsxTagPairHandler: Handler = {
  name: 'jsx-tag-pair',
  handle({ selection, doc, getAst }) {
    for (const ast of getAst('js')) {
      const index = doc.offsetAt(selection.start)

      let result: Selection[] | undefined
      traverse(ast.root, {
        JSXElement(path) {
          if (result)
            return path.skip()
          if (path.node.start == null || path.node.end == null)
            return

          const elements = [
            path.node.openingElement!,
            path.node.closingElement!,
          ].filter(Boolean)

          if (!elements.length)
            return

          if (elements.some(e => e.name.start != null && e.name.start + ast.start === index)) {
            result = elements.map(e => new Selection(
              doc.positionAt(ast.start + e.name.start!),
              doc.positionAt(ast.start + e.name.end!),
            ))
          }
        },
      })

      if (result)
        return result
    }
  },
}
