import EventEmitter from 'events'

const name = 'CacheStorage'

class Store extends EventEmitter {
  constructor (scope) {
    super()
    this.scope = scope
    const { getConfig } = this.scope.bajo.helper
    this.cfg = getConfig('bajoCache', { full: true })
  }

  async get (key) {
    const { recordGet } = this.scope.bajoDb.helper
    const result = await recordGet(name, key, { thrownNotFound: false }) ?? {}
    return result.content
  }

  async getMany (keys = []) {
    const { recordFind } = this.scope.bajoDb.helper
    const filter = {
      query: { id: { $in: keys } },
      limit: 1000
    }
    const results = await recordFind(name, filter, { count: false })
    const values = []
    for (const k of keys) {
      const item = results.find(r => r.key === k)
      values.push(item ? item.content : undefined)
    }
    return values
  }

  async set (key, value, ttl) {
    const { get, isPlainObject, isArray, map } = this.bajo.helper._
    let coll
    let oids
    try {
      const dtokens = JSON.parse(key.slice(key.indexOf(':') + 1))
      coll = dtokens.coll
      const dvalues = get(JSON.parse(value), 'value.data')
      if (isArray(dvalues)) oids = map(dvalues, 'id')
      else if (isPlainObject(dvalues)) oids = [dvalues.id]
      if (oids) oids = `,${oids.join(',')},`
    } catch (err) {}
    const exp = ttl ? new Date(Date.now() + ttl) : null
    const { recordUpsert } = this.scope.bajoDb.helper
    const body = { id: key, content: value, exp, coll, oids }
    await recordUpsert(name, body)
    return true
  }

  async delete (key) {
    const { recordRemove } = this.scope.bajoDb.helper
    await recordRemove(name, key)
    return true
  }

  async deleteMany (keys) {
    const { recordRemove } = this.scope.bajoDb.helper
    for (const k of keys) {
      await recordRemove(name, k)
    }
    return true
  }

  async clear () {
    const { collClear } = this.scope.bajoDb.helper
    await collClear(name)
    return true
  }

  async clearExpired () {
    const { recordRemove, recordFind } = this.scope.bajoDb.helper
    const filter = {
      query: { exp: { $lte: new Date(Date.now()) } }
    }
    const items = await recordFind(name, filter, { count: false })
    for (const id of items.map(i => i.id)) {
      await recordRemove(name, id)
    }
    return true
  }

  async has (key) {
    const { statCount } = this.scope.bajoDb.helper
    const filter = {
      query: { id: key }
    }
    const result = await statCount(name, filter)
    return result > 0
  }
}

export default Store
