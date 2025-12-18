import Keyv from 'keyv'
import Store from './lib/store.js'
import removeExpired from './lib/remove-expired.js'
import getRs from './lib/result-set/get.js'
import getGeneric from './lib/generic/get.js'
import getFn from './lib/function/get.js'
import removeRs from './lib/result-set/remove.js'
import removeGeneric from './lib/generic/remove.js'
import removeFn from './lib/function/remove.js'
import setRs from './lib/result-set/set.js'
import setGeneric from './lib/generic/set.js'
import setFn from './lib/function/set.js'

/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * BajoCache class
   *
   * @class
   */
  class BajoCache extends this.app.pluginClass.base {
    static alias = 'cache'

    constructor () {
      super(pkgName, me.app)
      this.config = {
        connection: 'memory',
        default: {
          ttl: 1000,
          clearOnTrigger: false
        },
        doboModel: {
          disabled: [],
          ttl: {},
          clearOnTrigger: {}
        },
        externalPrefix: 'ext'
      }
    }

    init = async () => {
      this.fnCache = []
      if (!this.app.dobo) return
      const models = this.app.dobo.models.filter(model => !model.cacheable).map(m => m.name)
      this.config.doboModel.disabled.push('CacheStorage', ...models)
    }

    start = async () => {
      const { set, get } = this
      let keyv
      if (this.app.dobo) {
        const store = new Store(this)
        keyv = new Keyv({ store })
      } else keyv = new Keyv()
      this.instance = keyv
      if (this.app.dobo) this.app.dobo.cache = { get, set }
      const fn = removeExpired.bind(this)
      setInterval(fn, 1000)
    }

    clearModel = async ({ model, id, body, record, options } = {}) => {
      if (this.config.doboModel.disabled.includes(model)) return
      const clear = this.config.doboModel.clearOnTrigger[model] ?? this.config.default.clearOnTrigger
      if (!clear) return
      try {
        const storage = this.app.dobo.getModel('CacheStorage')
        const query = { model }
        const recs = await storage.findAllRecord({ query }, { noHook: true, noCache: true })
        for (const r of recs) {
          await storage.removeRecord(r.id, { noHook: true })
        }
      } catch (err) {}
    }

    get = async (opts = {}) => {
      if (opts.model && (opts.filter || opts.id)) return await getRs.call(this, opts)
      if (opts.key.startsWith('fn:')) return await getFn.call(this, opts)
      return await getGeneric.call(this, opts)
    }

    remove = async (opts = {}) => {
      if (opts.model && (opts.filter || opts.id)) return await removeRs.call(this, opts)
      if (opts.key.startsWith('fn:')) return await removeFn.call(this, opts)
      return await removeGeneric.call(this, opts)
    }

    set = async (opts = {}) => {
      if (opts.model && (opts.filter || opts.id)) return await setRs.call(this, opts)
      if (opts.key.startsWith('fn:')) return await setFn.call(this, opts)
      return await setGeneric.call(this, opts)
    }

    sync = async (opts) => {
      const item = await this.get(opts)
      if (item) return item
      await this.set(opts)
      return opts.value
    }
  }

  return BajoCache
}

export default factory
