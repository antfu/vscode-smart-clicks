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
  chars: string[]
  withOffset: (p: Position, offset: number) => Position
  ast: AstMap
}

export interface Handler {
  name: string
  handle: (context: HandlerContext) => Selection | Range | undefined
}

export interface Parser {
  name: string
  handle: (context: HandlerContext) => Promise<void> | void
}

export interface AstRoot<T> {
  offset: number
  root: T
}

export interface AstMap {
  // TODO:
  html?: AstRoot<any>
  js?: AstRoot<any>
  css?: AstRoot<any>
}
