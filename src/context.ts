import type { Position, Selection, TextDocument } from 'vscode'
import type { AstIdMap, AstLang, HandlerContext } from './types'
import { Range } from 'vscode'
import { astCache } from './index'

export function createContext(
  doc: TextDocument,
  prevSelection: Selection,
  selection: Selection,
) {
  const anchor = prevSelection.start
  const anchorIndex = doc.offsetAt(anchor)

  const charLeft = doc.getText(new Range(anchor, withOffset(anchor, -1)))
  const charRight = doc.getText(new Range(anchor, withOffset(anchor, 1)))
  const char = doc.offsetAt(selection.end) >= doc.offsetAt(anchor)
    ? charRight
    : charLeft

  if (!astCache.has(doc.uri.fsPath))
    astCache.set(doc.uri.fsPath, [])
  const ast = astCache.get(doc.uri.fsPath)!

  function withOffset(p: Position, offset: number) {
    if (offset === 0)
      return p
    return doc.positionAt(doc.offsetAt(p) + offset)
  }

  function getAst<T extends AstLang>(lang: T): AstIdMap[T][] {
    return ast.filter(i => i.type === lang && i.start <= anchorIndex && i.end >= anchorIndex && i.root) as AstIdMap[T][]
  }

  const context: HandlerContext = {
    doc,
    langId: doc.languageId,
    anchor,
    anchorIndex,
    selection,
    withOffset,
    char,
    charLeft,
    charRight,
    chars: [charLeft, charRight],
    ast,
    getAst,
  }

  return context
}
