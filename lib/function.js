export async function clear (opts) {
  if (!this.instance) return
  this.instance.clear()
}

export async function get (opts = {}) {
  if (!this.instance) return
  const { find } = this.app.lib._
  const result = find(this.fnCache, { key: opts.key })
  if (result && Date.now() > result.exp) {
    await remove.call(this, opts)
    return undefined
  }
  return result ? result.value : undefined
}

export async function remove (opts = {}) {
  if (!this.instance) return
  const { findIndex, pullAt } = this.app.lib._
  const idx = findIndex(this.fnCache, { key: opts.key })
  if (idx > -1) pullAt(this.fnCache, idx)
}

export async function set (opts = {}) {
  if (!this.instance) return
  const { merge } = this.app.lib._
  opts.ttl = opts.ttl ?? this.config.default.ttlDur
  const item = merge({}, opts, { exp: Date.now() + opts.ttl })
  this.fnCache.push(item)
  return true
}
