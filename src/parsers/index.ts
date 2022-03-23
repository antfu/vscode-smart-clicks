import type { HandlerContext, Parser } from '../types'
import { cssParser } from './css'
import { htmlParser } from './html'
import { jsParser } from './javascript'

export const parsers: Parser[] = [
  jsParser,
  htmlParser,
  cssParser,
]

export async function applyParser(context: HandlerContext) {
  for (const parser of parsers)
    await parser.handle(context)
}
