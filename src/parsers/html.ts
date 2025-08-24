import type { HTMLElement } from 'node-html-parser'
import type { Parser } from '../types'
import { parse } from 'node-html-parser'
import { workspace } from 'vscode'
import { parseJS } from './javascript'

export const htmlParser: Parser = {
  name: 'html',
  handle: async ({ ast, langId, doc }) => {
    const id = 'html-root'
    if (ast.find(i => i.id === id))
      return

    const config = workspace.getConfiguration('smartClicks')
    if (!config.get<string[]>('htmlLanguageIds', []).includes(langId))
      return

    const code = doc.getText()
    const root = parse(code, {
      comment: true,
    })

    ast.push({
      type: 'html',
      id,
      start: 0,
      end: code.length,
      root,
      raw: code,
    })

    let htmlScriptCount = 0
    for (const node of traverseHTML(root)) {
      if (node.rawTagName === 'script') {
        const script = node.childNodes[0]
        const raw = node.innerHTML
        const start = script.range[0]
        const id = `html-script-${htmlScriptCount++}`
        ast.push(parseJS(raw, id, start))
      }
    }
  },
}

export function* traverseHTML(node: HTMLElement): Generator<HTMLElement> {
  yield node
  for (const child of node.childNodes)
    yield* traverseHTML(child as HTMLElement)
}
