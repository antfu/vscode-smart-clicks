import { Range, Selection } from 'vscode'

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function toSelection(range: Range | Selection) {
  if (range instanceof Range)
    return new Selection(range.start, range.end)
  return range
}
