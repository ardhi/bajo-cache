async function set (opts = {}) {
  const ttl = opts.ttl ?? this.config.default.ttl
  await this.instance.set(opts.key, opts.value, ttl)
}

export default set
