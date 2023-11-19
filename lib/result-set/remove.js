import buildKey from './_build-key.js'

async function remove (opts = {}) {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoCache')
  if (cfg.collection.disabled.includes(opts.coll)) return
  const key = buildKey.call(this, opts)
  await this.bajoCache.instance.delete(key)
}

export default remove
