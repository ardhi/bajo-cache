import buildKey from './_build-key.js'

async function set (opts = {}) {
  const { getInfo } = this.app.dobo
  const { connection } = getInfo(opts.model)
  if (connection.memory) return false
  if (this.config.doboModel.disabled.includes(opts.model)) return
  const ttl = opts.ttl ?? this.config.doboModel.ttl[opts.model] ?? this.config.default.ttl
  const key = buildKey.call(this, opts)
  const value = opts.id ? opts.record : opts.records
  if (!this.instance) return
  await this.instance.set(key, value, ttl)
}

export default set
