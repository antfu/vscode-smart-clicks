import { parse } from '@babel/core'
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
          plugins: [
            'typescript',
            'jsx',
          ],
        },
      )
      ast.js = {
        offset: 0,
        root: root?.program,
      }
    }
    catch (e) {
      channel.appendLine(`Failed to parse ${doc.uri.fsPath}`)
      channel.appendLine(String(e))
    }
  },
}
