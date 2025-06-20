import Keyv from 'keyv'
import Store from './lib/store.js'
import removeExpired from './lib/remove-expired.js'

async function factory (pkgName) {
  const me = this

  return class BajoCache extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'cache'
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
      const models = this.app.dobo.schemas.filter(s => s.connection === 'memory').map(m => m.name)
      this.config.doboModel.disabled.push('CacheStorage', ...models)
    }

    start = async () => {
      const { set, get } = this
      let keyv
      if (this.app.dobo && this.app.dobo.getConnection('memory')) {
        const store = new Store(this)
        keyv = new Keyv({ store })
      } else keyv = new Keyv()
      this.instance = keyv
      if (this.app.dobo) this.app.dobo.cache = { get, set }
      const fn = removeExpired.bind(this)
      setInterval(fn, 1000)
    }
  }
}

export default factory
