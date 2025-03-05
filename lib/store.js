import EventEmitter from 'events'

const name = 'CacheStorage'

class Store extends EventEmitter {
  constructor (plugin) {
    super()
    this.plugin = plugin
  }

  get = async (key) => {
    const { recordGet } = this.plugin.app.dobo
    const result = await recordGet(name, key, { thrownNotFound: false, noHook: true, force: true }) ?? {}
    return result.content
  }

  getMany = async (keys = []) => {
    const { recordFind } = this.plugin.app.dobo
    const filter = {
      query: { id: { $in: keys } },
      limit: 1000
    }
    const results = await recordFind(name, filter, { noHook: true, force: true })
    const values = []
    for (const k of keys) {
      const item = results.find(r => r.key === k)
      values.push(item ? item.content : undefined)
    }
    return values
  }

  set = async (key, value, ttl) => {
    const { get, isPlainObject, isArray, map } = this.plugin.app.bajo.lib._
    let model
    let oids
    try {
      const dtokens = JSON.parse(key.slice(key.indexOf(':') + 1))
      model = dtokens.model
      const dvalues = get(JSON.parse(value), 'value.data')
      if (isArray(dvalues)) oids = map(dvalues, 'id')
      else if (isPlainObject(dvalues)) oids = [dvalues.id]
      if (oids) oids = `,${oids.join(',')},`
    } catch (err) {}
    const exp = ttl ? new Date(Date.now() + ttl) : null
    const { recordUpsert } = this.plugin.app.dobo
    const body = { id: key, content: value, exp, model, oids }
    await recordUpsert(name, body, { noHook: true, noValidation: true, force: true })
    return true
  }

  delete = async (key) => {
    const { recordRemove } = this.plugin.app.dobo
    await recordRemove(name, key, { noHook: true, force: true })
    return true
  }

  deleteMany = async (keys) => {
    const { recordRemove } = this.plugin.app.dobo
    for (const k of keys) {
      await recordRemove(name, k, { noHook: true, force: true })
    }
    return true
  }

  clear = async () => {
    const { modelClear } = this.plugin.app.dobo
    await modelClear(name)
    return true
  }

  clearExpired = async () => {
    const { recordRemove, recordFind } = this.plugin.app.dobo
    const filter = {
      query: { exp: { $lte: new Date(Date.now()) } }
    }
    const items = await recordFind(name, filter, { noHook: true, force: true })
    for (const id of items.map(i => i.id)) {
      await recordRemove(name, id, { noHook: true, force: true })
    }
    return true
  }

  has = async (key) => {
    const { statCount } = this.plugin.app.dobo
    const filter = {
      query: { id: key }
    }
    const result = await statCount(name, filter, { force: true })
    return result > 0
  }
}

export default Store
