import remove from './remove.js'

async function get (opts = {}) {
  const { find } = this.app.bajo.lib._
  const result = find(this.fnCache, { key: opts.key })
  if (result && Date.now() > (result.ts + (opts.ttl * 1000))) {
    await remove.call(this, opts)
    return undefined
  }
  return result ? result.value : undefined
}

export default get
