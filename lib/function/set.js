async function set (opts = {}) {
  const { merge } = this.app.bajo.lib._
  opts.ttl = opts.ttl ?? this.config.default.ttl
  const item = merge({}, opts, { ts: Date.now() })
  this.fnCache.push(item)
  return true
}

export default set
