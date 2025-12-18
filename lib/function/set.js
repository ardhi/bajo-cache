async function set (opts = {}) {
  const { merge } = this.app.lib._
  opts.ttl = opts.ttl ?? this.config.default.ttl
  const item = merge({}, opts, { exp: Date.now() + (opts.ttl * 1000) })
  this.fnCache.push(item)
  return true
}

export default set
