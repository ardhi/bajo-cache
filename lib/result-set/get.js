import buildKey from './_build-key.js'

async function get (opts = {}) {
  if (!this.instance) return
  const { isEmpty } = this.app.lib._
  if (this.config.doboModel.disabled.includes(opts.model.name)) return false
  const key = buildKey.call(this, opts)
  const result = await this.instance.get(key)
  return isEmpty(result) ? false : result
}

export default get
