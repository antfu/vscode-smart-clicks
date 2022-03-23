import { parse } from '@babel/parser'
import { channel } from '../log'
import type { Parser } from '../types'

export const jsParser: Parser = {
  name: 'js',
  handle: async({ ast, doc, langId }) => {
    if (ast.js)
      return

    if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(langId))
      return

    try {
      const root = parse(
        doc.getText(),
        {
          sourceType: 'unambiguous',
          plugins: [
            'jsx',
            'typescript',
          ],
        },
      )
      ast.js = {
        offset: 0,
        root,
      }
    }
    catch (e) {
      channel.appendLine(`Failed to parse ${doc.uri.fsPath}`)
      channel.appendLine(String(e))
    }
  },
}
