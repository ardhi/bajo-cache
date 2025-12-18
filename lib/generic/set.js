async function set (opts = {}) {
  let ttl = opts.ttl ?? this.config.default.ttl
  if (ttl <= 0) ttl = 1
  await this.instance.set(opts.key, opts.value, ttl)
}

export default set
