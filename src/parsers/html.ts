import type { HTMLElement } from 'node-html-parser'
import { parse } from 'node-html-parser'
import type { Parser } from '../types'

export const htmlParser: Parser = {
  name: 'html',
  handle: async({ ast, langId, doc }) => {
    if (ast.html)
      return

    if (!['html', 'vue', 'svelte'].includes(langId))
      return

    const root = parse(doc.getText(), {
      comment: true,
    })

    ast.html = {
      offset: 0,
      root,
    }
  },
}

export function *traverseHTML(node: HTMLElement): Generator<HTMLElement> {
  yield node
  for (const child of node.childNodes)
    yield * traverseHTML(child as HTMLElement)
}
