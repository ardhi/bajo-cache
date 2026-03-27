import Keyv from 'keyv'
import Store from './lib/store.js'
import { removeExpired } from './lib/util.js'
import { get as getRs, set as setRs, clear as clearRs, remove as removeRs } from './lib/result-set.js'
import { get as getGeneric, set as setGeneric, clear as clearGeneric, remove as removeGeneric } from './lib/generic.js'
import { get as getFn, set as setFn, clear as clearFn, remove as removeFn } from './lib/function.js'

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
  class BajoCache extends this.app.baseClass.Base {
    constructor () {
      super(pkgName, me.app)
      this.config = {
        connection: 'memory',
        default: {
          ttlDur: '1s'
        },
        removeExpiredDur: '1s',
        dobo: {},
        exportPrefix: '~',
        waibuAdmin: {
          menuHandler: false,
          modelDisabled: '*'
        }
      }
      this.fnCache = []
    }

    start = async () => {
      const store = this.app.dobo ? new Store(this) : undefined
      this.instance = new Keyv({ store })
      const fn = removeExpired.bind(this)
      setInterval(fn, this.config.removeExpiredDur)
    }

    clear = async (opts = {}) => {
      if (opts.model) return await clearRs.call(this, opts)
      if (opts.key.startsWith('fn:')) return await clearFn.call(this, opts)
      return await clearGeneric.call(this, opts)
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
