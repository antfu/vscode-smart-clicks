import type { ParseResult as AstRootJS } from '@babel/parser'
import type { Position, Range, Selection, TextDocument, TextEditor } from 'vscode'
import type { HTMLElement as AstRootHTML } from 'node-html-parser'

export interface HandlerContext {
  doc: TextDocument
  editor: TextEditor
  langId: string
  anchor: Position
  anchorIndex: number
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
  handle: (context: HandlerContext) => Selection | Range | Selection[] | Range [] | void
}

export interface Parser {
  name: string
  handle: (context: HandlerContext) => Promise<void> | void
}

export interface AstRoot<T> {
  offset: number
  root?: T
}

export interface AstMap {
  // TODO:
  html?: AstRoot<AstRootHTML>
  js?: AstRoot<AstRootJS<any>>
  css?: AstRoot<any>
}
