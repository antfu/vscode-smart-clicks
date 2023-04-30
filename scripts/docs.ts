import { promises as fs } from 'node:fs'
import fg from 'fast-glob'
import pkg from '../package.json'

interface Parsed {
  name: string
  category?: string
  content: string
  file: string
}

const GITHUB_URL = 'https://github.com/antfu/vscode-smart-clicks/blob/main/'

async function run() {
  let readme = await fs.readFile('README.md', 'utf-8')
  const files = await fg('src/rules/*.ts', {
    ignore: ['index.ts'],
  })

  files.sort()

  const parsed: Parsed[] = []

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    const match = content.match(/\/\*[\s\S]+?\*\//)?.[0]
    if (!match)
      continue
    const info = {
      file,
    } as Parsed
    const lines = match.split('\n')
      .map(i => i.replace(/^\s*[\/*]+\s?/, '').trimEnd())
      .filter((i) => {
        if (i.startsWith('@name ')) {
          info.name = i.slice(6)
          return false
        }
        if (i.startsWith('@category ')) {
          info.category = i.slice('@category '.length)
          return false
        }
        return true
      })
    info.content = lines.join('\n').trim()
    parsed.push(info)
  }

  const content = parsed.map((i) => {
    return `#### [\`${i.name}\`](${GITHUB_URL + i.file})\n\n${i.content}`
  }).join('\n\n')

  readme = readme.replace(/<!--rules-->[\s\S]*<!--rules-->/, `<!--rules-->\n${content}\n<!--rules-->`)
  await fs.writeFile('README.md', readme, 'utf-8')

  const props: any = {}
  parsed.forEach((i) => {
    props[i.name] = {
      type: 'boolean',
      default: true,
      description: i.content,
    }
  })

  pkg.contributes.configuration.properties['smartClicks.rules'].properties = props as any
  await fs.writeFile('package.json', JSON.stringify(pkg, null, 2), 'utf-8')
}

run()
