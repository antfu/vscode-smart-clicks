import type { Selection, TextDocument } from 'vscode'
import { toArray } from '@antfu/utils'
import { applyHandlers } from './rules'
import { applyParser } from './parsers'
import { toSelection } from './utils'
import { log } from './log'
import { createContext } from './context'

export async function trigger(
  doc: TextDocument,
  prevSelection: Selection,
  selection: Selection,
) {
  const context = createContext(doc, prevSelection, selection)

  log.debug(context)

  await applyParser(context)

  const newSelection = applyHandlers(context)
  if (newSelection)
    return toArray(newSelection).map(toSelection)
  return undefined
}
