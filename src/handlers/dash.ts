import type { Handler } from '../types'

/**
 * Match identifier with dashes
 *
 * ```css
 *    v
 * foo-bar
 * ^     ^
 * ```
 *
 * @name dash
 */
export const dashHandler: Handler = {
  name: 'dash',
  handle({ charLeft, charRight, doc, anchor }) {
    if (charLeft === '-' || charRight === '-')
      return doc.getWordRangeAtPosition(anchor, /[\w_-]+/)
  },
}
