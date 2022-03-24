import { window } from 'vscode'

export const isDebug = process.env.NODE_ENV === 'development'

export const channel = window.createOutputChannel('Smart Click')

export const log = {
  debug(...args: any[]) {
    if (!isDebug)
      return
    // eslint-disable-next-line no-console
    console.debug(...args)
    this.log(args)
  },

  log(...args: any[]) {
    if (!isDebug)
      return
    channel.appendLine(args.map(i => String(i)).join(' '))
  },
}
