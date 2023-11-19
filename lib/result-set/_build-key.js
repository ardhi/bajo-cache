function buildKey (opts = {}) {
  const key = opts.id ? { coll: opts.coll, id: opts.id } : { coll: opts.coll, filter: opts.filter }
  return JSON.stringify(key)
}

export default buildKey
