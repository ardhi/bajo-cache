import Keyv from 'keyv'
import Store from '../lib/store.js'

async function start () {
  const store = new Store(this)
  const keyv = new Keyv({ store })
  this.bajoCache.instance = keyv
}

export default start
