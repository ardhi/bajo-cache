async function clearModel ({ model, id, body, record, options } = {}) {
  const { getInfo, recordFind, recordRemove } = this.app.dobo
  const clear = this.config.doboModel.clearOnTrigger[model] ?? this.config.default.clearOnTrigger
  if (!clear) return
  try {
    const { connection } = getInfo(model)
    if (connection.memory) return false
    if (this.config.doboModel.disabled.includes(model)) return
    /*
    let action = 'create'
    if (id) action = body ? 'update' : 'remove'
    */
    const query = { model }
    const recs = await recordFind('CacheStorage', { query, limit: 1000 }, { noHook: true, noCache: true })
    for (const r of recs) {
      await recordRemove('CacheStorage', r.id, { noHook: true })
    }
  } catch (err) {}
}

export default clearModel
