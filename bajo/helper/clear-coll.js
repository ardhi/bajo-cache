async function clearColl ({ coll, id, body, record, options } = {}) {
  const { getConfig } = this.bajo.helper
  const { getInfo, recordFind, recordRemove } = this.bajoDb.helper
  const cfg = getConfig('bajoCache')
  const clear = cfg.collection.clearOnTrigger[coll] ?? cfg.collection.defClearOnTrigger
  if (!clear) return
  try {
    const { connection } = await getInfo(coll)
    if (connection.memory) return false
    if (cfg.collection.disabled.includes(coll)) return
    /*
    let action = 'create'
    if (id) action = body ? 'update' : 'remove'
    */
    const query = { coll }
    const recs = await recordFind('CacheStorage', { query, limit: 1000 }, { skipHook: true, skipCache: true })
    for (const r of recs) {
      await recordRemove('CacheStorage', r.id, { skipHook: true })
    }
  } catch (err) {}
}

export default clearColl
