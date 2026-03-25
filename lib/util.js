export function removeExpired () {
  const { pullAt } = this.app.lib._
  const { getModel } = this.app.dobo

  function removeFn () {
    const deleted = []
    for (const idx in this.fnCache) {
      const item = this.fnCache[idx]
      if (Date.now() > item.exp) deleted.push(idx)
    }
    pullAt(this.fnCache, deleted)
  }

  async function removeRs () {
    const model = getModel('CacheStorage')
    const query = { exp: { $lt: Date.now() } }
    const rows = await model.findAllRecord({ query }, { noHook: true })
    for (const row of rows) {
      await model.removeRecord(row.id, { noReturn: true, noHook: true })
    }
  }

  removeFn.call(this)
  removeRs.call(this)
}
