import type { Handler } from '../types'

/**
 * `-` to identifier.
 *
 * ```css
 *    ▽
 * foo-bar
 * └─────┘
 * ```
 *
 * @name dash
 */
export const dashHandler: Handler = {
  name: 'dash',
  handle({ charLeft, charRight, doc, anchor }) {
    if (charLeft === '-' || charRight === '-')
      return doc.getWordRangeAtPosition(anchor, /[\w-]+/)
  },
}
