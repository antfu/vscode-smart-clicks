import type { Position, TextEditor } from 'vscode'
import { Range, Selection, TextEditorSelectionChangeKind, window } from 'vscode'
import { applyHandlers } from './handlers'
import type { HandlerContext } from './types'

export function activate() {
  let last = Date.now()
  let prevEditor: TextEditor | undefined
  let prevSelection: Selection | undefined

  window.onDidChangeTextEditorSelection((e) => {
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
    if (e.selections.length !== 1 || !prevSelection?.isEmpty)
      return update()

    if (
      selection.start.line !== prevSelection.start.line
      || selection.end.line !== prevSelection.end.line
    )
      return update()

    const now = Date.now()
    const delta = now - last
    if (delta > 1000)
      return update()

    const doc = e.textEditor.document
    const editor = e.textEditor
    const anchor = prevSelection.start

    function withOffset(p: Position, offset: number) {
      if (delta === 0)
        return p
      return doc.positionAt(doc.offsetAt(p) + offset)
    }

    const charLeft = doc.getText(new Range(anchor, withOffset(anchor, -1)))
    const charRight = doc.getText(new Range(anchor, withOffset(anchor, 1)))
    const char = doc.offsetAt(selection.end) >= doc.offsetAt(anchor)
      ? charRight
      : charLeft

    const context: HandlerContext = {
      editor,
      doc,
      langId: doc.languageId,
      anchor,
      selection,
      withOffset,
      char,
      charLeft,
      charRight,
    }

    console.log(context)

    const newSelection = applyHandlers(context)
    if (newSelection) {
      if (newSelection instanceof Range)
        editor.selection = new Selection(newSelection.start, newSelection.end)
      else
        editor.selection = newSelection
    }

    update()
  })
}

export function deactivate() {

}
