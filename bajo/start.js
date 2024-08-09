import Keyv from 'keyv'
import Store from '../lib/store.js'

async function start () {
  const { set, get } = this
  let keyv
  if (this.app.dobo && this.app.dobo.getConnection('memory')) {
    const store = new Store(this)
    keyv = new Keyv({ store })
  } else keyv = new Keyv()
  this.instance = keyv
  if (this.app.dobo) this.app.dobo.cache = { get, set }
}

export default start
