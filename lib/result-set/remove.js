import buildKey from './_build-key.js'

async function remove (opts = {}) {
  const { getConfig } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { get } = this.bajo.helper._
  const cfg = getConfig('bajoCache')
  const { connection } = getInfo(opts.coll)
  if (connection.memory) return false
  if (cfg.collection.disabled.includes(opts.coll)) return
  const key = buildKey.call(this, opts)
  const instance = get(this, 'bajoCache.instance')
  if (!instance) return
  await instance.delete(key)
}

export default remove
