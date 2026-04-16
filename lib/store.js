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
    const def = { throwNotFound: false, noHook: true, noModelHook: true, noValidation: true, noResult: true, noDynHook: true }
    return defaultsDeep(items, def)
  }

  _getContent = async (key, result) => {
    const { get } = this.app.lib._
    let content = get(result, 'content')
    if (!content) return undefined
    content = JSON.parse(content)
    if (content.expires && Date.now() > content.expires) {
      await this.delete(key)
      return undefined
    }
    return JSON.stringify(content)
  }

  get = async (key) => {
    const result = await this.storage.getRecord(key, this.buildOpts())
    return await this._getContent(key, result)
  }

  getMany = async (keys = []) => {
    const filter = {
      query: { id: { $in: keys } }
    }
    const results = await this.storage.findAllRecord(filter, this.buildOpts())
    const values = []
    for (const k of keys) {
      const result = results.find(r => r.key === k)
      if (!result) {
        values.push(undefined)
        continue
      }
      const value = await this._getContent(k, result)
      values.push(value)
    }
    return values
  }

  set = async (key, value, ttl = 0) => {
    const exp = Date.now() + ttl
    let content = value
    try {
      content = JSON.parse(value)
      content.expires = exp
      content = JSON.stringify(content)
    } catch (err) {}
    const body = { id: key, content, exp }
    try {
      const [, model, action] = key.split('|')
      body.model = model
      body.action = action
    } catch (err) {}
    await this.storage.upsertRecord(body, this.buildOpts())
    return true
  }

  delete = async (key) => {
    try {
      await this.storage.removeRecord(key, this.buildOpts())
    } catch (err) {
      this.plugin.log.error('errDelCache%s', err.message)
    }
    return true
  }

  deleteMany = async (keys) => {
    for (const k of keys) {
      await this.delete(k)
    }
    return true
  }

  clear = async () => {
    try {
      await this.storage.clear()
    } catch (err) {
      this.plugin.log.error('errClearCache%s', err.message)
    }
    return true
  }

  clearExpired = async () => {
    const filter = {
      query: { exp: { $lte: Date.now() } }
    }
    const items = await this.model.findAllRecord(filter, this.buildOpts())
    for (const id of items.map(i => i.id)) {
      try {
        await this.model.removeRecord(id, this.buildOpts())
      } catch (err) {
        this.plugin.log.error('errClearExpCache%s', err.message)
      }
    }
    return true
  }

  has = async (key) => {
    const filter = {
      query: { id: key }
    }
    const result = await this.model.findOneRecord(filter, this.buildOpts())
    return await this._getContent(key, result)
  }

  /*
  async * iterator () {
    let page = 0
    for (;;) {
      const data = await this.storage.findRecord({ page, limit: 20 }, { noHook: true, noModelHook: true, noDynHook: true, dataOnly: true })
      if (data.length === 0) break
      page++
      for (const d of data) {
        yield [d.id, d.content]
      }
    }
  }
  */
}

export default Store
