import { parse } from '@babel/parser'
import { channel } from '../log'
import type { AstRoot, Parser } from '../types'

export const jsParser: Parser = {
  name: 'js',
  handle: async ({ ast, doc, langId }) => {
    const id = 'js-root'
    if (ast.find(i => i.id === id))
      return

    if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(langId))
      return

    try {
      ast.push(parseJS(doc.getText(), id, 0))
    }
    catch (e) {
      channel.appendLine(`Failed to parse ${doc.uri.fsPath}`)
      channel.appendLine(String(e))
    }
  },
}

export function parseJS(code: string, id: string, start = 0): AstRoot {
  const root = parse(
    code,
    {
      sourceType: 'unambiguous',
      plugins: [
        'jsx',
        'typescript',
      ],
    },
  )
  return {
    type: 'js',
    id,
    start,
    end: start + code.length,
    root,
    raw: code,
  }
}
