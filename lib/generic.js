export async function clear (opts) {
  if (!this.instance) return
  const { outmatch } = this.app.lib
  if (opts.key) {
    const isMatch = outmatch(opts.key + '*')
    // TODO: store needs to support iterator() method
    const { storage } = this.instance._store
    const items = await storage.findAllRecord(undefined, { noHook: true, noModelHook: true, noDynHook: true, dataOnly: true })
    for (const item of items) {
      const idx = item.id.indexOf(':')
      const key = item.id.substring(idx + 1)
      if (isMatch(key)) await this.instance.delete(key)
    }
    return
  }
  this.instance.clear()
}

export async function get (opts = {}) {
  if (!this.instance) return
  const { isEmpty } = this.app.lib._
  const result = await this.instance.get(opts.key)
  return isEmpty(result) ? false : result
}

export async function remove (opts = {}) {
  if (!this.instance) return
  await this.instance.delete(opts.key)
}

export async function set (opts = {}) {
  if (!this.instance) return
  let ttl = opts.ttl ?? this.config.default.ttlDur
  if (ttl <= 0) ttl = 1
  await this.instance.set(opts.key, opts.value, ttl)
}
