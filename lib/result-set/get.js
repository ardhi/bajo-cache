import buildKey from './_build-key.js'

async function get (opts = {}) {
  const { isEmpty } = this.app.lib._
  if (this.app.dobo.getModel(opts.model).driver.name === 'memory') return false
  if (this.config.doboModel.disabled.includes(opts.model)) return false
  const key = buildKey.call(this, opts)
  if (!this.instance) return false
  const result = await this.instance.get(key)
  return isEmpty(result) ? false : result
}

export default get
