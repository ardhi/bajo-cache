import buildKey from './_build-key.js'

async function remove (opts = {}) {
  if (this.app.dobo.getModel(opts.model).driver.name === 'memory') return false
  if (this.config.doboModel.disabled.includes(opts.model)) return
  const key = buildKey.call(this, opts)
  if (!this.instance) return
  await this.instance.delete(key)
}

export default remove
