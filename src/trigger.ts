import type { Selection, TextDocument } from 'vscode'
import { toArray } from '@antfu/utils'
import { createContext } from './context'
import { log } from './log'
import { applyParser } from './parsers'
import { applyHandlers } from './rules'
import { toSelection } from './utils'

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
