import Keyv from 'keyv'
import Store from '../lib/store.js'

async function start () {
  const { set, get } = this.bajoCache.helper
  const store = new Store(this)
  const keyv = new Keyv({ store })
  this.bajoCache.instance = keyv
  this.bajoDb.cache = { get, set }
}

export default start
