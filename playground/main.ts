import { extname, isAbsolute, resolve } from 'pathe'
import { isNodeBuiltin } from 'mlly'
import { normalizeModuleId, normalizeRequestId, slash, toFilePath } from './utils'
import type { ModuleCache, ViteNodeRunnerOptions } from './types'

export const DEFAULT_REQUEST_STUBS = {
  '/@vite/client': {
    injectQuery: (id: string) => id,
    createHotContext() {
      return {
        accept: () => {},
        prune: () => {},
        dispose: () => {},
        decline: () => {},
        invalidate: () => {},
        on: () => {},
      }
    },
    updateStyle() {},
  },
}

export class ModuleCacheMap extends Map<string, ModuleCache> {
  normalizePath(fsPath: string) {
    return normalizeModuleId(fsPath)
  }

  set(fsPath: string, mod: Partial<ModuleCache>) {
    fsPath = this.normalizePath(fsPath)
    if (!super.has(fsPath))
      super.set(fsPath, mod)
    else
      Object.assign(super.get(fsPath), mod)
    return this
  }
}

export class ViteNodeRunner {
  root: string

  /**
   * Holds the cache of modules
   * Keys of the map are filepaths, or plain package names
   */
  moduleCache: ModuleCacheMap

  constructor(public options: ViteNodeRunnerOptions) {
    this.root = options.root || process.cwd()
    this.moduleCache = options.moduleCache || new ModuleCacheMap()
  }

  async executeFile(file: string) {
    return await this.cachedRequest(`/@fs/${slash(resolve(file))}`, [])
  }

  async executeId(id: string) {
    return await this.cachedRequest(id, [])
  }

  /** @internal */
  async cachedRequest(rawId: string, callstack: string[]) {
    const id = normalizeRequestId(rawId, this.options.base)
    const fsPath = toFilePath(id, this.root)

    if (this.moduleCache.get(fsPath)?.promise)
      return this.moduleCache.get(fsPath)?.promise

    const promise = this.directRequest(id, fsPath, callstack)
    this.moduleCache.set(fsPath, { promise })

    return await promise
  }

  shouldResolveId(dep: string) {
    if (isNodeBuiltin(dep) || dep in (this.options.requestStubs || DEFAULT_REQUEST_STUBS))
      return false

    return !isAbsolute(dep) || !extname(dep)
  }

  /**
   * Define if a module should be interop-ed
   * This function mostly for the ability to override by subclass
   */
  shouldInterop(path: string, mod: any) {
    if (this.options.interopDefault === false)
      return false
    // never interop ESM modules
    // TODO: should also skip for `.js` with `type="module"`
    return !path.endsWith('.mjs') && 'default' in mod
  }

  /**
   * Import a module and interop it
   */
  async interopedImport(path: string) {
    const mod = await import(path)

    if (this.shouldInterop(path, mod)) {
      const tryDefault = this.hasNestedDefault(mod)
      return new Proxy(mod, {
        get: proxyMethod('get', tryDefault),
        set: proxyMethod('set', tryDefault),
        has: proxyMethod('has', tryDefault),
        deleteProperty: proxyMethod('deleteProperty', tryDefault),
      })
    }

    return mod
  }

  hasNestedDefault(target: any) {
    return '__esModule' in target && target.__esModule && 'default' in target.default
  }
}

function exportAll(exports: any, sourceModule: any) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in sourceModule) {
    if (key !== 'default') {
      try {
        Object.defineProperty(exports, key, {
          enumerable: true,
          configurable: true,
          get() { return sourceModule[key] },
        })
      }
      catch (_err) { }
    }
  }
}
