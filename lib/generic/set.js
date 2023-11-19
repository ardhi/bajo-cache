async function set (opts = {}) {
  const { getConfig } = this.bajo.helper
  const cfg = getConfig('bajoCache')
  const ttl = opts.ttl ?? cfg.collection.defTtl
  await this.bajoCache.instance.set(opts.key, opts.value, ttl)
}

export default set
