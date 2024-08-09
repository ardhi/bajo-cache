import EventEmitter from 'events'

const name = 'CacheStorage'

class Store extends EventEmitter {
  constructor (plugin) {
    super()
    this.plugin = plugin
  }

  async get (key) {
    const { recordGet } = this.plugin.app.dobo
    const result = await recordGet(name, key, { thrownNotFound: false, noHook: true }) ?? {}
    return result.content
  }

  async getMany (keys = []) {
    const { recordFind } = this.plugin.app.dobo
    const filter = {
      query: { id: { $in: keys } },
      limit: 1000
    }
    const results = await recordFind(name, filter, { noHook: true })
    const values = []
    for (const k of keys) {
      const item = results.find(r => r.key === k)
      values.push(item ? item.content : undefined)
    }
    return values
  }

  async set (key, value, ttl) {
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
    await recordUpsert(name, body)
    return true
  }

  async delete (key) {
    const { recordRemove } = this.plugin.app.dobo
    await recordRemove(name, key)
    return true
  }

  async deleteMany (keys) {
    const { recordRemove } = this.plugin.app.dobo
    for (const k of keys) {
      await recordRemove(name, k)
    }
    return true
  }

  async clear () {
    const { modelClear } = this.plugin.app.dobo
    await modelClear(name)
    return true
  }

  async clearExpired () {
    const { recordRemove, recordFind } = this.plugin.app.dobo
    const filter = {
      query: { exp: { $lte: new Date(Date.now()) } }
    }
    const items = await recordFind(name, filter, { noHook: true })
    for (const id of items.map(i => i.id)) {
      await recordRemove(name, id)
    }
    return true
  }

  async has (key) {
    const { statCount } = this.plugin.app.dobo
    const filter = {
      query: { id: key }
    }
    const result = await statCount(name, filter)
    return result > 0
  }
}

export default Store
