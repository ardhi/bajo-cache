export function buildKey ({ model, filter, id, options } = {}) {
  let key = id ? { model: model.name, id, action: options.action } : { model: model.name, filter, action: options.action }
  key = Buffer.from(JSON.stringify(key), 'utf8').toString('base64')
  return `dobo|${key}`
}

export async function clear (opts = {}) {
  if (!this.instance) return
  this.instance.clear()
}

export async function get (opts = {}) {
  if (!this.instance) return
  const { isEmpty } = this.app.lib._
  if (opts.model.cache.ttlDur === 0) return false
  const key = buildKey.call(this, opts)
  const result = await this.instance.get(key)
  return isEmpty(result) ? false : result
}

export async function remove (opts = {}) {
  if (!this.instance) return
  if (opts.model.cache.ttlDur === 0) return
  const key = buildKey.call(this, opts)
  await this.instance.delete(key)
}

export async function set (opts = {}) {
  if (!this.instance) return
  if (opts.model.cache.ttlDur === 0) return
  let ttl = opts.ttl ?? opts.model.cache.ttlDur
  if (ttl <= 0) ttl = 1
  const key = buildKey.call(this, opts)
  const value = opts.result
  await this.instance.set(key, value, ttl)
}
