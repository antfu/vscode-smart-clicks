import { promises as fs } from 'fs'
import fg from 'fast-glob'

interface Parsed {
  name: string
  category?: string
  content: string
}

async function run() {
  let readme = await fs.readFile('README.md', 'utf-8')
  const files = await fg('src/handlers/*.ts', {
    ignore: ['index.ts'],
  })

  const parsed: Parsed[] = []

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    const match = content.match(/\/\*[\s\S]+?\*\//)?.[0]
    if (!match)
      continue
    const info = {} as Parsed
    const lines = match.split('\n')
      .map(i => i.replace(/^\s*[\/*]*\s*/, '').trim())
      .filter((i) => {
        if (i.startsWith('@name ')) {
          info.name = i.slice(6)
          return false
        }
        if (i.startsWith('@category ')) {
          info.category = i.slice('@category '.length)
          return false
        }
        return Boolean(i)
      })
    info.content = lines.join('\n')
    parsed.push(info)
  }

  const content = parsed.map((i) => {
    return `#### \`${i.name}\`\n\n${i.content}`
  }).join('\n\n')

  readme = readme.replace(/<!--rules-->[\s\S]*<!--rules-->/, `<!--rules-->\n${content}\n<!--rules-->`)
  await fs.writeFile('README.md', readme, 'utf-8')
}

run()
