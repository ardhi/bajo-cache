function buildKey (opts = {}) {
  const key = opts.id ? { model: opts.model, id: opts.id } : { model: opts.model, filter: opts.filter }
  if (opts.siteId) key.siteId = opts.siteId
  if (opts.userId) key.userId = opts.userId
  return JSON.stringify(key)
}

export default buildKey
