import type { ExtensionContext, Selection, TextEditor } from 'vscode'
import { TextEditorSelectionChangeKind, window, workspace } from 'vscode'
import { toArray } from '@antfu/utils'
import { applyHandlers } from './handlers'
import { applyParser } from './parsers'
import type { AstRoot } from './types'
import { toSelection } from './utils'
import { log } from './log'
import { createContext } from './context'

export const astCache = new Map<string, AstRoot[]>()

export function activate(ext: ExtensionContext) {
  let last = Date.now()
  let prevEditor: TextEditor | undefined
  let prevSelection: Selection | undefined

  ext.subscriptions.push(
    workspace.onDidChangeTextDocument((e) => {
      astCache.delete(e.document.uri.fsPath)
    }),

    window.onDidChangeTextEditorSelection(async(e) => {
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
        false
        || e.selections.length !== 1
        || !prevSelection?.isEmpty
        || selection.start.line !== prevSelection.start.line
        || selection.end.line !== prevSelection.end.line
      )
        return update()

      if (Date.now() - last > 1000)
        return update()

      const context = createContext(e, prevSelection, selection)

      log.debug('trigger', context)

      update()

      await applyParser(context)

      const newSelection = applyHandlers(context)
      if (newSelection)
        e.textEditor.selections = toArray(newSelection).map(toSelection)
    }),
  )
}

export function deactivate() {

}
