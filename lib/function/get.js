import remove from './remove.js'

async function get (opts = {}) {
  if (!this.instance) return
  const { find } = this.app.lib._
  const result = find(this.fnCache, { key: opts.key })
  if (result && Date.now() > result.exp) {
    await remove.call(this, opts)
    return undefined
  }
  return result ? result.value : undefined
}

export default get
