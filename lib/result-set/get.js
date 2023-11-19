import buildKey from './_build-key.js'

async function get (opts = {}) {
  const { getConfig, importPkg } = this.bajo.helper
  const { isEmpty } = await importPkg('lodash-es')
  const cfg = getConfig('bajoCache')
  if (cfg.collection.disabled.includes(opts.coll)) return false
  const key = buildKey.call(this, opts)
  const result = await this.bajoCache.instance.get(key)
  return isEmpty(result) ? false : result
}

export default get
