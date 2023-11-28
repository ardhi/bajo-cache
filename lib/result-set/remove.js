import buildKey from './_build-key.js'

async function remove (opts = {}) {
  const { getConfig, importPkg } = this.bajo.helper
  const { get } = await importPkg('lodash-es')
  const cfg = getConfig('bajoCache')
  if (cfg.collection.disabled.includes(opts.coll)) return
  const key = buildKey.call(this, opts)
  const instance = get(this, 'bajoCache.instance')
  if (!instance) return
  await instance.delete(key)
}

export default remove
