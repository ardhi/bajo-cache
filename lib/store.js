import EventEmitter from 'events'

const name = 'CacheStorage'

class Store extends EventEmitter {
  constructor (plugin) {
    super()
    this.plugin = plugin
    this.app = plugin.app
  }

  get = async (key) => {
    const model = this.app.dobo.getModel(name)
    const result = await model.getRecord(key, { throwNotFound: false, noHook: true, force: true }) ?? {}
    return result.content
  }

  getMany = async (keys = []) => {
    const model = this.app.dobo.getModel(name)
    const filter = {
      query: { id: { $in: keys } },
      limit: 1000
    }
    const results = await model.findRecord(filter, { noHook: true, force: true })
    const values = []
    for (const k of keys) {
      const item = results.find(r => r.key === k)
      values.push(item ? item.content : undefined)
    }
    return values
  }

  set = async (key, value, ttl) => {
    const model = this.app.dobo.getModel(name)
    const { get, isPlainObject, isArray, map } = this.app.lib._
    let item
    let oids
    try {
      const dtokens = JSON.parse(key.slice(key.indexOf(':') + 1))
      item = dtokens.model
      const dvalues = get(JSON.parse(value), 'value.data')
      if (isArray(dvalues)) oids = map(dvalues, 'id')
      else if (isPlainObject(dvalues)) oids = [dvalues.id]
      if (oids) oids = `,${oids.join(',')},`
    } catch (err) {}
    const exp = ttl ? new Date(Date.now() + ttl) : null
    const body = { id: key, content: value, exp, model: item, oids }
    await model.upsertRecord(body, { noHook: true, noValidation: true, force: true, noResult: true })
    return true
  }

  delete = async (key) => {
    const model = this.app.dobo.getModel(name)
    await model.removeRecord(key, { noHook: true, force: true, noResult: true })
    return true
  }

  deleteMany = async (keys) => {
    const model = this.app.dobo.getModel(name)
    for (const k of keys) {
      await model.removeRecord(k, { noHook: true, force: true, noResult: true })
    }
    return true
  }

  clear = async () => {
    const model = this.app.dobo.getModel(name)
    await model.clear()
    return true
  }

  clearExpired = async () => {
    const model = this.app.dobo.getModel(name)
    const filter = {
      query: { exp: { $lte: new Date(Date.now()) } }
    }
    const items = await model.findRecord(filter, { noHook: true, force: true })
    for (const id of items.map(i => i.id)) {
      await model.removeRecord(id, { noHook: true, force: true, noResult: true })
    }
    return true
  }

  has = async (key) => {
    const model = this.app.dobo.getModel(name)
    const filter = {
      query: { id: key }
    }
    const result = await model.countRecord(filter, { force: true })
    return result > 0
  }
}

export default Store
