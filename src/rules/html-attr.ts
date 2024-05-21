import type { Handler } from '../types'

/**
 * `=` to HTML attribute.
 *
 * ```html
 *           ▽
 * <div class="btn"></div>
 *      └─────────┘
 * ```
 *
 * @name html-attr
 * @category html
 */
export const htmlAttrHandler: Handler = {
  name: 'html-attr',
  handle({ getAst, doc, anchor }) {
    const asts = getAst('html')
    if (!asts.length)
      return

    const range = doc.getWordRangeAtPosition(anchor, /=/)
    if (!range)
      return

    return doc.getWordRangeAtPosition(anchor, /[\w.:@-]+=(["']).*?\1|[\w.:@-]+=\{.*?\}/)
  },
}
