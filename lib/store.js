import EventEmitter from 'events'

class Store extends EventEmitter {
  constructor (plugin) {
    super()
    this.plugin = plugin
    this.app = plugin.app
    this.storage = this.app.dobo.getModel('CacheStorage')
  }

  buildOpts = (items = {}) => {
    const { defaultsDeep } = this.app.lib.aneka
    const def = { silent: true, noHook: true, noModelHook: true, noValidation: true, noResult: true }
    return defaultsDeep(items, def)
  }

  get = async (key) => {
    const result = await this.storage.getRecord(key, this.buildOpts())
    return result.content
  }

  getMany = async (keys = []) => {
    const filter = {
      query: { id: { $in: keys } },
      limit: 1000
    }
    const results = await this.storage.findRecord(filter, this.buildOpts())
    const values = []
    for (const k of keys) {
      const item = results.find(r => r.key === k)
      values.push(item ? item.content : undefined)
    }
    return values
  }

  set = async (key, value, ttl) => {
    const { get, isPlainObject, isArray, map } = this.app.lib._
    let model
    let siteId
    let userId
    let oids
    try {
      const dtokens = JSON.parse(key.slice(key.indexOf(':') + 1))
      model = dtokens.model
      siteId = dtokens.siteId
      userId = dtokens.userId
      const dvalues = get(JSON.parse(value), 'value.data')
      if (isArray(dvalues)) oids = map(dvalues, 'id')
      else if (isPlainObject(dvalues)) oids = [dvalues.id]
      if (oids) oids = `,${oids.join(',')},`
    } catch (err) {}
    const exp = ttl ? new Date(Date.now() + ttl) : null
    const body = { id: key, content: value, exp, model, oids }
    if (siteId) body.siteId = siteId
    if (userId) body.userId = userId
    await this.storage.upsertRecord(body, this.buildOpts())
    return true
  }

  delete = async (key) => {
    await this.storage.removeRecord(key, this.buildOpts())
    return true
  }

  deleteMany = async (keys) => {
    for (const k of keys) {
      await this.storage.removeRecord(k, this.buildOpts())
    }
    return true
  }

  clear = async () => {
    await this.storage.clear()
    return true
  }

  clearExpired = async () => {
    const filter = {
      query: { exp: { $lte: new Date(Date.now()) } }
    }
    const items = await this.model.findRecord(filter, this.buildOpts())
    for (const id of items.map(i => i.id)) {
      await this.model.removeRecord(id, this.buildOpts())
    }
    return true
  }

  has = async (key) => {
    const filter = {
      query: { id: key }
    }
    const result = await this.model.countRecord(filter, this.buildOpts())
    return result > 0
  }
}

export default Store
