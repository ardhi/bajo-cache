import buildKey from './_build-key.js'

async function set (opts = {}) {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoCache')
  if (cfg.collection.disabled.includes(opts.coll)) return
  const ttl = opts.ttl ?? cfg.collection.ttl[opts.coll] ?? cfg.collection.defTtl
  const key = buildKey.call(this, opts)
  const value = opts.id ? opts.record : opts.records
  await this.bajoCache.instance.set(key, value, ttl)
}

export default set
