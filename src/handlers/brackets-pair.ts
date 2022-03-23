import { Position, Range, Selection } from 'vscode'
import type { Handler } from '../types'

const bracketPairs: [left: string, right: string, inset: boolean][] = [
  ['(', ')', true],
  ['[', ']', true],
  ['{', '}', true],
  ['<', '>', false],
  ['"', '"', true],
  ['`', '`', true],
  ['\'', '\'', true],
]

/**
 * Matches the content of bracket pairs
 *
 * @name brackets-pair
 */
export const bracketsPairHandler: Handler = {
  name: 'brackets-pair',
  handle({ charLeft, charRight, doc, anchor: _anchor, withOffset }) {
    const bracketLeft = bracketPairs.find(i => i[0] === charLeft)
    const bracketRight = bracketPairs.find(i => i[0] === charRight)
    const bracket = bracketLeft || bracketRight
    const anchor = bracketLeft ? withOffset(_anchor, -1) : _anchor

    if (!bracket)
      return

    const start = withOffset(anchor, 1)
    const rest = doc.getText(new Range(start, new Position(Infinity, Infinity)))
    const index = rest.indexOf(bracket[1])

    if (index < 0)
      return

    // inset
    if (bracket[2]) {
      return new Selection(
        start,
        withOffset(start, index),
      )
    }
    // not inset
    else {
      return new Selection(
        anchor,
        withOffset(start, index + 1),
      )
    }
  },
}
