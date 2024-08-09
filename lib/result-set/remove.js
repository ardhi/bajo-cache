import buildKey from './_build-key.js'

async function remove (opts = {}) {
  const { getInfo } = this.app.dobo
  const { connection } = getInfo(opts.model)
  if (connection.memory) return false
  if (this.config.doboModel.disabled.includes(opts.model)) return
  const key = buildKey.call(this, opts)
  if (!this.instance) return
  await this.instance.delete(key)
}

export default remove
