import type { ExtensionContext, Position, TextEditor } from 'vscode'
import { Range, Selection, TextEditorSelectionChangeKind, window, workspace } from 'vscode'
import { applyHandlers } from './handlers'
import { applyParser } from './parsers'
import type { AstMap, HandlerContext } from './types'

export function activate(ext: ExtensionContext) {
  let last = Date.now()
  let prevEditor: TextEditor | undefined
  let prevSelection: Selection | undefined

  const astCache = new Map<string, AstMap>()

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

      if (!astCache.has(doc.uri.fsPath))
        astCache.set(doc.uri.fsPath, {})

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
        chars: [charLeft, charRight],
        ast: astCache.get(doc.uri.fsPath)!,
      }

      update()

      await applyParser(context)

      const newSelection = applyHandlers(context)
      if (newSelection) {
        if (newSelection instanceof Range)
          editor.selection = new Selection(newSelection.start, newSelection.end)
        else
          editor.selection = newSelection
      }
    }),
  )
}

export function deactivate() {

}
