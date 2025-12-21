function buildKey (opts = {}) {
  const key = opts.id ? { model: opts.model.name, id: opts.id } : { model: opts.model.name, filter: opts.filter }
  return JSON.stringify(key)
}

export default buildKey
