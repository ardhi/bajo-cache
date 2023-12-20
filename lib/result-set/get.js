import buildKey from './_build-key.js'

async function get (opts = {}) {
  const { getConfig, importPkg } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { isEmpty, get } = await importPkg('lodash-es')
  const cfg = getConfig('bajoCache')
  const { connection } = await getInfo(opts.coll)
  if (connection.memory) return false
  if (cfg.collection.disabled.includes(opts.coll)) return false
  const key = buildKey.call(this, opts)
  const instance = get(this, 'bajoCache.instance')
  if (!instance) return false
  const result = await instance.get(key)
  return isEmpty(result) ? false : result
}

export default get
