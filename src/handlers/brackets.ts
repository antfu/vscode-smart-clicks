import { Position, Range, Selection } from 'vscode'
import type { Handler } from '../types'

const bracketPairs = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
  ['"', '"'],
  ['`', '`'],
  ['\'', '\''],
]

export const bracketHandler: Handler = {
  name: 'bracket',
  handle({ char, doc, anchor, withOffset }) {
    const bracket = bracketPairs.find(i => i[0] === char)
    if (bracket) {
      const start = withOffset(anchor, 1)
      const rest = doc.getText(new Range(start, new Position(Infinity, Infinity)))
      const match = rest.match(bracket[1])
      if (match?.index) {
        return new Selection(
          anchor,
          withOffset(start, match.index + 1),
        )
      }
    }
  },
}
