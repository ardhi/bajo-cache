import buildKey from './_build-key.js'

async function set (opts = {}) {
  if (this.app.dobo.getModel(opts.model).driver.name === 'memory') return false
  if (this.config.doboModel.disabled.includes(opts.model)) return
  let ttl = opts.ttl ?? this.config.doboModel.ttl[opts.model] ?? this.config.default.ttl
  if (ttl <= 0) ttl = 1
  const key = buildKey.call(this, opts)
  const value = opts.id ? opts.record : opts.records
  if (!this.instance) return
  await this.instance.set(key, value, ttl)
}

export default set
