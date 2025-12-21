import buildKey from './_build-key.js'

async function remove (opts = {}) {
  if (!this.instance) return
  if (this.config.doboModel.disabled.includes(opts.model)) return
  const key = buildKey.call(this, opts)
  await this.instance.delete(key)
}

export default remove
