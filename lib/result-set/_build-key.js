function buildKey (opts = {}) {
  const key = opts.id ? { model: opts.model, id: opts.id } : { model: opts.model, filter: opts.filter }
  return JSON.stringify(key)
}

export default buildKey
