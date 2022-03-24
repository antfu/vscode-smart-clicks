import type { ExtensionContext, Selection, TextEditor } from 'vscode'
import { TextEditorSelectionChangeKind, window, workspace } from 'vscode'
import type { AstRoot } from './types'
import { trigger } from './trigger'

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
      if (e.kind !== TextEditorSelectionChangeKind.Mouse) {
        last = 0
        return
      }

      const selection = e.selections[0]

      try {
        if (
          prevEditor !== e.textEditor
        || !prevSelection
        || !prevSelection.isEmpty
        || e.selections.length !== 1
        || selection.start.line !== prevSelection.start.line
        || Date.now() - last > 1000
        )
          return
      }
      finally {
        prevEditor = e.textEditor
        prevSelection = selection
        last = Date.now()
      }

      timer = setTimeout(async() => {
        const newSelection = await trigger(e.textEditor.document, prevSelection!, selection)
        if (newSelection) {
          last = 0
          e.textEditor.selections = newSelection
        }
      }, 100)
    }),
  )
}

export function deactivate() {

}
