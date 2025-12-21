import buildKey from './_build-key.js'

async function set (opts = {}) {
  if (!this.instance) return
  if (this.config.doboModel.disabled.includes(opts.model.name)) return
  let ttl = opts.ttl ?? this.config.doboModel.ttl[opts.model.name] ?? this.config.default.ttl
  if (ttl <= 0) ttl = 1
  const key = buildKey.call(this, opts)
  const value = opts.record
  await this.instance.set(key, value, ttl)
}

export default set
