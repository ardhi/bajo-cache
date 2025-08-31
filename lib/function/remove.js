async function remove (opts = {}) {
  const { findIndex, pullAt } = this.app.lib._
  const idx = findIndex(this.fnCache, { key: opts.key })
  if (idx > -1) pullAt(this.fnCache, idx)
}

export default remove
