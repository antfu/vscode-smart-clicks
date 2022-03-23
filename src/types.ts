import type { Position, Range, Selection, TextDocument, TextEditor } from 'vscode'

export interface HandlerContext {
  doc: TextDocument
  editor: TextEditor
  langId: string
  anchor: Position
  selection: Selection
  char: string
  charLeft: string
  charRight: string
  withOffset: (p: Position, offset: number) => Position
}

export interface Handler {
  name: string
  handle: (context: HandlerContext) => Selection | Range | undefined
}
