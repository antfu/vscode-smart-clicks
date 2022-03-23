import type { HandlerContext, Parser } from '../types'
import { htmlParser } from './html'
import { jsParser } from './javascript'

export const parsers: Parser[] = [
  jsParser,
  htmlParser,
]

export async function applyParser(context: HandlerContext) {
  for (const parser of parsers)
    await parser.handle(context)
}
