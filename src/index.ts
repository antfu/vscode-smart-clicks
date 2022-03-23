import type { ExtensionContext, Selection, TextEditor } from 'vscode'
import { TextEditorSelectionChangeKind, window, workspace } from 'vscode'
import { toArray } from '@antfu/utils'
import { applyHandlers } from './rules'
import { applyParser } from './parsers'
import type { AstRoot } from './types'
import { toSelection } from './utils'
import { log } from './log'
import { createContext } from './context'

export const astCache = new Map<string, AstRoot[]>()

export function activate(ext: ExtensionContext) {
  let last = 0
  let prevEditor: TextEditor | undefined
  let prevSelection: Selection | undefined
  let timer: any

  ext.subscriptions.push(
    workspace.onDidChangeTextDocument((e) => {
      astCache.delete(e.document.uri.fsPath)
    }),

    window.onDidChangeTextEditorSelection(async(e) => {
      clearTimeout(timer)
      if (e.kind !== TextEditorSelectionChangeKind.Mouse)
        return

      const selection = e.selections[0]

      function update() {
        prevEditor = e.textEditor
        prevSelection = selection
        last = Date.now()
      }

      // editor
      if (prevEditor !== e.textEditor)
        return update()

      // selection
      if (
        e.selections.length !== 1
        || !prevSelection
        || !prevSelection.isEmpty
        || selection.start.line !== prevSelection.start.line
      )
        return update()

      if (Date.now() - last > 1000)
        return update()

      timer = setTimeout(async() => {
        const context = createContext(e, prevSelection!, selection)

        log.debug('trigger')
        log.debug(context)

        update()

        await applyParser(context)

        const newSelection = applyHandlers(context)
        if (newSelection) {
          last = 0
          e.textEditor.selections = toArray(newSelection).map(toSelection)
        }
      }, 100)
    }),
  )
}

export function deactivate() {

}
