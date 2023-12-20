async function clearColl (name) {
  const { getConfig } = this.bajo.helper
  const { getInfo, recordFind, recordRemove } = this.bajoDb.helper
  const cfg = getConfig('bajoCache')
  const { connection } = await getInfo(name)
  if (connection.memory) return false
  if (cfg.collection.disabled.includes(name)) return
  const query = { coll: name }
  const recs = await recordFind('CacheStorage', { query, limit: 1000 }, { skipHook: true, skipCache: true })
  for (const r of recs) {
    await recordRemove('CacheStorage', r.id, { skipHook: true })
  }
}

export default clearColl
