import buildKey from './_build-key.js'

async function get (opts = {}) {
  const { getInfo } = this.app.dobo
  const { isEmpty } = this.lib._
  const { connection } = getInfo(opts.model)
  if (connection.memory) return false
  if (this.config.doboModel.disabled.includes(opts.model)) return false
  const key = buildKey.call(this, opts)
  if (!this.instance) return false
  const result = await this.instance.get(key)
  return isEmpty(result) ? false : result
}

export default get
