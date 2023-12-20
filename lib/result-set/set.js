import buildKey from './_build-key.js'

async function set (opts = {}) {
  const { getConfig, importPkg } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { get } = await importPkg('lodash-es')
  const cfg = getConfig('bajoCache')
  const { connection } = await getInfo(opts.coll)
  if (connection.memory) return false
  if (cfg.collection.disabled.includes(opts.coll)) return
  const ttl = opts.ttl ?? cfg.collection.ttl[opts.coll] ?? cfg.collection.defTtl
  const key = buildKey.call(this, opts)
  const value = opts.id ? opts.record : opts.records
  const instance = get(this, 'bajoCache.instance')
  if (!instance) return
  await instance.set(key, value, ttl)
}

export default set
